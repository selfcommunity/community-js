import React, {useEffect, useMemo, useReducer, useState} from 'react';
import {styled} from '@mui/material/styles';
import List from '@mui/material/List';
import {Button, CardContent, ListItem, Typography, useMediaQuery, useTheme} from '@mui/material';
import Widget, {WidgetProps} from '../Widget';
import {SCUserType} from '@selfcommunity/types';
import {http, Endpoints, UserService, SCPaginatedResponse} from '@selfcommunity/api-services';
import {CacheStrategies, isInteger, Logger} from '@selfcommunity/utils';
import {
  SCCache,
  SCPreferences,
  SCPreferencesContextType,
  SCThemeType,
  SCUserContextType,
  useSCFetchUser,
  useSCPreferences,
  useSCUser
} from '@selfcommunity/react-core';
import Skeleton from './Skeleton';
import User, {UserProps, UserSkeleton} from '../User';
import {FormattedMessage} from 'react-intl';
import classNames from 'classnames';
import {SCOPE_SC_UI} from '../../constants/Errors';
import BaseDialog, {BaseDialogProps} from '../../shared/BaseDialog';
import InfiniteScroll from '../../shared/InfiniteScroll';
import {useThemeProps} from '@mui/system';
import HiddenPlaceholder from '../../shared/HiddenPlaceholder';
import {VirtualScrollerItemProps} from '../../types/virtualScroller';
import {actionWidgetTypes, dataWidgetReducer, stateWidgetInitializer} from '../../utils/widget';
import {AxiosResponse} from 'axios';
import {PREFIX} from './constants';

const classes = {
  root: `${PREFIX}-root`,
  title: `${PREFIX}-title`,
  noResults: `${PREFIX}-no-results`,
  showMore: `${PREFIX}-show-more`,
  dialogRoot: `${PREFIX}-dialog-root`,
  endMessage: `${PREFIX}-end-message`
};

const Root = styled(Widget, {
  name: PREFIX,
  slot: 'Root'
})(() => ({}));

const DialogRoot = styled(BaseDialog, {
  name: PREFIX,
  slot: 'DialogRoot'
})(() => ({}));

export interface UserFollowedUsersWidgetProps extends VirtualScrollerItemProps, WidgetProps {
  /**
   * The user id
   * @default null
   */
  userId: number;
  /**
   * User Object
   * @default null
   */
  user?: SCUserType;
  /**
   * Hides this component
   * @default false
   */
  autoHide?: boolean;
  /**
   * Limit the number of categories to show
   * @default false
   */
  limit?: number;
  /**
   * Props to spread to single user object
   * @default empty object
   */
  UserProps?: UserProps;
  /**
   * Caching strategies
   * @default CacheStrategies.CACHE_FIRST
   */
  cacheStrategy?: CacheStrategies;

  /**
   * Props to spread to followed users dialog
   * @default {}
   */
  DialogProps?: BaseDialogProps;

  /**
   * Other props
   */
  [p: string]: any;
}

/**
 * > API documentation for the Community-JS User Followed Users Widget component. Learn about the available props and the CSS API.
 *
 *
 * This component renders the list of the users that the given user follows.
 * Take a look at our <strong>demo</strong> component [here](/docs/sdk/community-js/react-ui/Components/UsersFollowed)

 #### Import

 ```jsx
 import {UserFollowedUsersWidget} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCUserFollowedUsersWidget` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCUserFollowedUsersWidget-root|Styles applied to the root element.|
 |title|.SCUserFollowedUsersWidget-title|Styles applied to the title element.|
 |noResults|.SCUserFollowedUsersWidget-no-results|Styles applied to no results section.|
 |showMore|.SCUserFollowedUsersWidget-show-more|Styles applied to show more button element.|
 |dialogRoot|.SCUserFollowedUsersWidget-dialog-root|Styles applied to the dialog root element.|
 |endMessage|.SCUserFollowedUsersWidget-end-message|Styles applied to the end message element.|

 * @param inProps
 */
export default function UserFollowedUsersWidget(inProps: UserFollowedUsersWidgetProps): JSX.Element {
  // PROPS
  const props: UserFollowedUsersWidgetProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {
    userId,
    user,
    autoHide = false,
    limit = 3,
    className,
    UserProps = {},
    cacheStrategy = CacheStrategies.NETWORK_ONLY,
    onHeightChange,
    onStateChange,
    DialogProps = {},
    ...rest
  } = props;

  // STATE
  const [state, dispatch] = useReducer(
    dataWidgetReducer,
    {
      isLoadingNext: false,
      next: null,
      cacheKey: SCCache.getWidgetStateCacheKey(SCCache.USER_FOLLOWED_TOOLS_STATE_CACHE_PREFIX_KEY, isInteger(userId) ? userId : user.id),
      cacheStrategy,
      visibleItems: limit
    },
    stateWidgetInitializer
  );
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  // CONTEXT
  const scUserContext: SCUserContextType = useSCUser();
  const scPreferencesContext: SCPreferencesContextType = useSCPreferences();
  const {scUser, refresh: refreshScUser} = useSCFetchUser({id: userId, user});
  const isMe = useMemo(() => scUserContext.user && scUser?.id === scUserContext.user.id, [scUserContext.user, scUser]);

  // MEMO
  const contentAvailability = useMemo(
    () =>
      SCPreferences.CONFIGURATIONS_CONTENT_AVAILABILITY in scPreferencesContext.preferences &&
      scPreferencesContext.preferences[SCPreferences.CONFIGURATIONS_CONTENT_AVAILABILITY].value,
    [scPreferencesContext.preferences]
  );
  const followEnabled = useMemo(
    () =>
      SCPreferences.CONFIGURATIONS_FOLLOW_ENABLED in scPreferencesContext.preferences &&
      scPreferencesContext.preferences[SCPreferences.CONFIGURATIONS_FOLLOW_ENABLED].value,
    [scPreferencesContext.preferences]
  );

  // HOOKS
  const theme = useTheme<SCThemeType>();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  /**
   * Initialize component
   * Fetch data only if the component is not initialized and it is not loading data
   */
  const _initComponent = useMemo(
    () => (): void => {
      if (!state.initialized && !state.isLoadingNext) {
        dispatch({type: actionWidgetTypes.LOADING_NEXT});
        UserService.getUserFollowings(scUser.id, {limit})
          .then((payload: SCPaginatedResponse<SCUserType>) => {
            dispatch({type: actionWidgetTypes.LOAD_NEXT_SUCCESS, payload: {...payload, initialized: true}});
          })
          .catch((error) => {
            dispatch({type: actionWidgetTypes.LOAD_NEXT_FAILURE, payload: {errorLoadNext: error}});
            Logger.error(SCOPE_SC_UI, error);
          });
      }
    },
    [state.isLoadingNext, state.initialized, scUser, limit, dispatch]
  );

  // EFFECTS
  useEffect(() => {
    let _t;
    if ((contentAvailability || (!contentAvailability && scUserContext.user?.id)) && followEnabled && scUser && scUserContext.user !== undefined) {
      _t = setTimeout(_initComponent);
      return (): void => {
        _t && clearTimeout(_t);
      };
    }
  }, [scUserContext.user, contentAvailability, scUser]);

  useEffect(() => {
    if (openDialog && state.next && state.results.length === limit && state.initialized) {
      dispatch({type: actionWidgetTypes.LOADING_NEXT});
      UserService.getUserFollowings(scUser.id, {offset: limit, limit: 10})
        .then((payload: SCPaginatedResponse<SCUserType>) => {
          dispatch({type: actionWidgetTypes.LOAD_NEXT_SUCCESS, payload: payload});
        })
        .catch((error) => {
          dispatch({type: actionWidgetTypes.LOAD_NEXT_FAILURE, payload: {errorLoadNext: error}});
          Logger.error(SCOPE_SC_UI, error);
        });
    }
  }, [openDialog, state.next, state.results.length, state.initialized, limit]);

  /**
   * Virtual feed update
   */
  useEffect(() => {
    onHeightChange && onHeightChange();
  }, [state.results]);

  useEffect(() => {
    if (!scUser || !followEnabled || (!contentAvailability && !scUserContext.user)) {
      return;
    } else if (cacheStrategy === CacheStrategies.NETWORK_ONLY) {
      onStateChange && onStateChange({cacheStrategy: CacheStrategies.CACHE_FIRST});
    }
  }, [scUserContext.user, scUser, contentAvailability]);

  useEffect(() => {
    if (!scUser || !followEnabled || !scUserContext.user || !state.initialized || !isMe) {
      return;
    }
    // Refresh only if the profile is mine - followed users can only change if I'm watching my own user
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    refreshScUser().catch(() => {});
  }, [isMe, scUserContext.managers.followed.followed.length]);

  // HANDLERS
  const handleNext = useMemo(
    () => (): void => {
      dispatch({type: actionWidgetTypes.LOADING_NEXT});
      http
        .request({
          url: state.next,
          method: Endpoints.UserFollowings.method
        })
        .then((res: AxiosResponse<SCPaginatedResponse<SCUserType>>) => {
          dispatch({
            type: actionWidgetTypes.LOAD_NEXT_SUCCESS,
            payload: res.data
          });
        });
    },
    [dispatch, state.next, state.isLoadingNext, state.initialized]
  );

  const handleToggleDialogOpen = (): void => {
    setOpenDialog((prev) => !prev);
  };

  // RENDER
  if (!followEnabled || (autoHide && !state.count && state.initialized) || (!contentAvailability && !scUserContext.user) || !scUser) {
    return <HiddenPlaceholder />;
  }
  if (!state.initialized) {
    return <Skeleton />;
  }
  const content = (
    <CardContent>
      <Typography className={classes.title} variant="h5">
        <FormattedMessage
          id="ui.userFollowedUsersWidget.title"
          defaultMessage="ui.userFollowedUsersWidget.title"
          values={{total: scUser.followings_counter}}
        />
      </Typography>
      {!state.count ? (
        <Typography className={classes.noResults} variant="body2">
          <FormattedMessage id="ui.userFollowedUsersWidget.subtitle.noResults" defaultMessage="" />
        </Typography>
      ) : (
        <React.Fragment>
          <List>
            {state.results.slice(0, state.visibleItems).map((user: SCUserType) => (
              <ListItem key={user.id}>
                <User elevation={0} user={user} {...UserProps} />
              </ListItem>
            ))}
          </List>
          {state.count > state.visibleItems && (
            <Button className={classes.showMore} onClick={handleToggleDialogOpen}>
              <FormattedMessage id="ui.userFollowedUsersWidget.button.showAll" defaultMessage="ui.userFollowedUsersWidget.button.showAll" />
            </Button>
          )}
        </React.Fragment>
      )}
      {openDialog && (
        <DialogRoot
          className={classes.dialogRoot}
          title={
            <FormattedMessage
              defaultMessage="ui.userFollowedUsersWidget.title"
              id="ui.userFollowedUsersWidget.title"
              values={{total: scUser.followings_counter}}
            />
          }
          onClose={handleToggleDialogOpen}
          open={openDialog}
          {...DialogProps}>
          <InfiniteScroll
            dataLength={state.results.length}
            next={handleNext}
            hasMoreNext={Boolean(state.next)}
            loaderNext={<UserSkeleton elevation={0} {...UserProps} />}
            height={isMobile ? '100%' : 400}
            endMessage={
              <Typography className={classes.endMessage}>
                <FormattedMessage id="ui.userFollowedUsersWidget.noMoreResults" defaultMessage="ui.userFollowedUsersWidget.noMoreResults" />
              </Typography>
            }>
            <List>
              {state.results.map((user: SCUserType) => (
                <ListItem key={user.id}>
                  <User elevation={0} user={user} {...UserProps} />
                </ListItem>
              ))}
            </List>
          </InfiniteScroll>
        </DialogRoot>
      )}
    </CardContent>
  );
  return (
    <Root className={classNames(classes.root, className)} {...rest}>
      {content}
    </Root>
  );
}
