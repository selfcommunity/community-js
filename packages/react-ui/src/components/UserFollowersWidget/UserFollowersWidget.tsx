import React, {useContext, useEffect, useMemo, useReducer, useState} from 'react';
import {styled} from '@mui/material/styles';
import List from '@mui/material/List';
import {Button, CardContent, ListItem, Typography, useMediaQuery, useTheme} from '@mui/material';
import Widget, {WidgetProps} from '../Widget';
import {SCUserType} from '@selfcommunity/types';
import {http, Endpoints, HttpResponse, UserService, SCPaginatedResponse} from '@selfcommunity/api-services';
import {CacheStrategies, Logger} from '@selfcommunity/utils';
import {
  SCCache,
  SCPreferences,
  SCPreferencesContext,
  SCPreferencesContextType,
  SCThemeType,
  SCUserContext,
  SCUserContextType,
  useIsComponentMountedRef,
  useSCPreferences,
  useSCUser
} from '@selfcommunity/react-core';
import {actionToolsTypes, dataToolsReducer, stateToolsInitializer} from '../../utils/tools';
import Skeleton from './Skeleton';
import User, {UserProps, UserSkeleton} from '../User';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import classNames from 'classnames';
import {SCOPE_SC_UI} from '../../constants/Errors';
import BaseDialog, {BaseDialogProps} from '../../shared/BaseDialog';
import CentralProgress from '../../shared/CentralProgress';
import InfiniteScroll from '../../shared/InfiniteScroll';
import {useThemeProps} from '@mui/system';
import HiddenPlaceholder from '../../shared/HiddenPlaceholder';
import {VirtualScrollerItemProps} from '../../types/virtualScroller';
import {AxiosResponse} from 'axios';

const PREFIX = 'SCUserFollowersWidget';

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
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));

const DialogRoot = styled(BaseDialog, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.dialogRoot
})(({theme}) => ({}));

export interface UserFollowersWidgetProps extends VirtualScrollerItemProps, WidgetProps {
  /**
   * The user id
   * @default null
   */
  userId: number;
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
   * Props to spread to followers users dialog
   * @default {}
   */
  DialogProps?: BaseDialogProps;

  /**
   * Other props
   */
  [p: string]: any;
}

/**
 > API documentation for the Community-JS User Followers Widget component. Learn about the available props and the CSS API.
 > This component renders the list of the followes of the given user

 #### Import

 ```jsx
 import {UserFollowersWidget} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCUserFollowersWidget` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCUserFollowersWidget-root|Styles applied to the root element.|
 |title|.SCUserFollowersWidget-title|Styles applied to the title element.|
 |noResults|.SCUserFollowersWidget-no-results|Styles applied to no results section.|
 |followersItem|.SCUserFollowersWidget-followers-item|Styles applied to follower item element.|
 |showMore|.SCUserFollowersWidget-show-more|Styles applied to show more button element.|

 * @param inProps
 */
export default function UserFollowersWidget(inProps: UserFollowersWidgetProps): JSX.Element {
  // PROPS
  const props: UserFollowersWidgetProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {
    userId,
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
    dataToolsReducer,
    {
      isLoadingNext: false,
      next: null,
      cacheKey: SCCache.getWidgetStateCacheKey(SCCache.USER_FOLLOWERS_TOOLS_STATE_CACHE_PREFIX_KEY, userId),
      cacheStrategy,
      visibleItems: limit
    },
    stateToolsInitializer
  );
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  // CONTEXT
  const scUserContext: SCUserContextType = useSCUser();
  const scPreferencesContext: SCPreferencesContextType = useSCPreferences();

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

  // EFFECTS
  useEffect(() => {
    if (!userId) {
      return;
    } else if (!contentAvailability && !scUserContext.user) {
      return;
    } else if (cacheStrategy === CacheStrategies.NETWORK_ONLY) {
      onStateChange && onStateChange({cacheStrategy: CacheStrategies.CACHE_FIRST});
    }
  }, [scUserContext.user]);

  /**
   * On mount, fetches the list of users followers
   */
  useEffect(() => {
    if (!followEnabled || (!contentAvailability && !scUserContext.user) || !userId || state.initialized || state.isLoadingNext) {
      return;
    }
    dispatch({
      type: actionToolsTypes.LOADING_NEXT
    });
    const controller = new AbortController();
    UserService.getUserFollowers(userId, {limit}, {signal: controller.signal})
      .then((payload: SCPaginatedResponse<SCUserType>) => {
        dispatch({
          type: actionToolsTypes.LOAD_NEXT_SUCCESS,
          payload: {...payload, initialized: true}
        });
      })
      .catch((error) => {
        dispatch({type: actionToolsTypes.LOAD_NEXT_FAILURE, payload: {errorLoadNext: error}});
        Logger.error(SCOPE_SC_UI, error);
      });
    return () => controller.abort();
  }, [followEnabled, contentAvailability, scUserContext.user, userId]);

  useEffect(() => {
    if (openDialog && state.next && state.results.length === limit && state.initialized) {
      dispatch({
        type: actionToolsTypes.LOADING_NEXT
      });
      UserService.getUserFollowers(userId, {offset: limit, limit: 10})
        .then((payload: SCPaginatedResponse<SCUserType>) => {
          dispatch({
            type: actionToolsTypes.LOAD_NEXT_SUCCESS,
            payload: payload
          });
        })
        .catch((error) => {
          dispatch({type: actionToolsTypes.LOAD_NEXT_FAILURE, payload: {errorLoadNext: error}});
          Logger.error(SCOPE_SC_UI, error);
        });
    }
  }, [openDialog, state.next, state.results]);

  /**
   * Virtual feed update
   */
  useEffect(() => {
    onHeightChange && onHeightChange();
  }, [state.results]);

  // HANDLERS
  const handleNext = useMemo(
    () => () => {
      if (!state.initialized || state.isLoadingNext) {
        return;
      }
      dispatch({
        type: actionToolsTypes.LOADING_NEXT
      });
      return http
        .request({
          url: state.next,
          method: Endpoints.UserFollowers.method
        })
        .then((res: AxiosResponse<SCPaginatedResponse<SCUserType>>) => {
          dispatch({
            type: actionToolsTypes.LOAD_NEXT_SUCCESS,
            payload: res.data
          });
        });
    },
    [dispatch, state.next, state.isLoadingNext, state.initialized]
  );

  const handleToggleDialogOpen = () => {
    setOpenDialog((prev) => !prev);
  };

  // RENDER
  if (!followEnabled || (autoHide && !state.count && state.initialized) || (!contentAvailability && !scUserContext.user) || !userId) {
    return <HiddenPlaceholder />;
  }
  if (!state.initialized) {
    return <Skeleton />;
  }
  const content = (
    <CardContent>
      <Typography className={classes.title} variant="h5">
        <FormattedMessage id="ui.userFollowersWidget.title" defaultMessage="ui.userFollowersWidget.title" values={{total: state.count}} />
      </Typography>
      {!state.count ? (
        <Typography className={classes.noResults} variant="body2">
          <FormattedMessage id="ui.userFollowersWidget.subtitle.noResults" defaultMessage="" />
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
              <FormattedMessage id="ui.userFollowersWidget.button.showAll" defaultMessage="ui.userFollowersWidget.button.showAll" />
            </Button>
          )}
        </React.Fragment>
      )}
      {openDialog && (
        <DialogRoot
          className={classes.dialogRoot}
          title={<FormattedMessage defaultMessage="ui.userFollowersWidget.title" id="ui.userFollowersWidget.title" values={{total: state.count}} />}
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
                <FormattedMessage id="ui.userFollowersWidget.noMoreResults" defaultMessage="ui.userFollowersWidget.noMoreResults" />
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
