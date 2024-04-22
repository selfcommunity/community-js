import React, {useCallback, useEffect, useMemo, useReducer, useRef, useState} from 'react';
import {styled} from '@mui/material/styles';
import List from '@mui/material/List';
import {Button, CardContent, ListItem, Typography, useMediaQuery, useTheme} from '@mui/material';
import Widget, {WidgetProps} from '../Widget';
import {SCGroupType, SCUserType} from '@selfcommunity/types';
import {http, Endpoints, SCPaginatedResponse, GroupService} from '@selfcommunity/api-services';
import {CacheStrategies, isInteger, Logger} from '@selfcommunity/utils';
import {
  SCCache,
  SCPreferences,
  SCPreferencesContextType,
  SCThemeType,
  SCUserContextType,
  useSCFetchGroup,
  useSCPreferences,
  useSCUser
} from '@selfcommunity/react-core';
import {actionWidgetTypes, dataWidgetReducer, stateWidgetInitializer} from '../../utils/widget';
import Skeleton from './Skeleton';
import {FormattedMessage} from 'react-intl';
import classNames from 'classnames';
import {SCOPE_SC_UI} from '../../constants/Errors';
import BaseDialog, {BaseDialogProps} from '../../shared/BaseDialog';
import InfiniteScroll from '../../shared/InfiniteScroll';
import {useThemeProps} from '@mui/system';
import HiddenPlaceholder from '../../shared/HiddenPlaceholder';
import {VirtualScrollerItemProps} from '../../types/virtualScroller';
import {AxiosResponse} from 'axios';
import {PREFIX} from './constants';
import User, {UserProps, UserSkeleton} from '../User';
import PubSub from 'pubsub-js';
import {SCEventType, SCTopicType} from '../../constants/PubSub';

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

export interface GroupInvitedWidgetProps extends VirtualScrollerItemProps, WidgetProps {
  /**
   * Group Object
   * @default null
   */
  group?: SCGroupType;

  /**
   * Id of the group
   * @default null
   */
  groupId?: number | string;
  /**
   * Limit the number of users to show
   * @default false
   */
  limit?: number;
  /**
   * Caching strategies
   * @default CacheStrategies.CACHE_FIRST
   */
  cacheStrategy?: CacheStrategies;

  /**
   * Props to spread to single user object
   * @default empty object
   */
  UserProps?: UserProps;

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
 * > API documentation for the Community-JS Group Invited Widget component. Learn about the available props and the CSS API.
 *
 *
 * This component renders the list of the follows of the given group.
 * Take a look at our <strong>demo</strong> component [here](/docs/sdk/community-js/react-ui/Components/GroupRequests)

 #### Import

 ```jsx
 import {GroupInvitedWidget} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCGroupInvitedWidget` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCGroupInvitedWidget-root|Styles applied to the root element.|
 |title|.SCGroupInvitedWidget-title|Styles applied to the title element.|
 |noResults|.SCGroupInvitedWidget-no-results|Styles applied to no results section.|
 |showMore|.SCGroupInvitedWidget-show-more|Styles applied to show more button element.|
 |dialogRoot|.SCGroupInvitedWidget-dialog-root|Styles applied to the dialog root element.|
 |endMessage|.SCGroupInvitedWidget-end-message|Styles applied to the end message element.|

 * @param inProps
 */
export default function GroupInvitedWidget(inProps: GroupInvitedWidgetProps): JSX.Element {
  // PROPS
  const props: GroupInvitedWidgetProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {
    groupId,
    group,
    limit = 5,
    className,
    cacheStrategy = CacheStrategies.NETWORK_ONLY,
    onHeightChange,
    onStateChange,
    UserProps = {},
    DialogProps = {},
    ...rest
  } = props;

  // STATE
  const [state, dispatch] = useReducer(
    dataWidgetReducer,
    {
      isLoadingNext: false,
      next: null,
      cacheKey: SCCache.getWidgetStateCacheKey(SCCache.GROUP_REQUESTS_TOOLS_STATE_CACHE_PREFIX_KEY, isInteger(groupId) ? groupId : group.id),
      cacheStrategy,
      visibleItems: limit
    },
    stateWidgetInitializer
  );
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  // CONTEXT
  const scUserContext: SCUserContextType = useSCUser();
  const scPreferencesContext: SCPreferencesContextType = useSCPreferences();
  const {scGroup} = useSCFetchGroup({id: groupId, group});

  // MEMO
  const contentAvailability = useMemo(
    () =>
      SCPreferences.CONFIGURATIONS_CONTENT_AVAILABILITY in scPreferencesContext.preferences &&
      scPreferencesContext.preferences[SCPreferences.CONFIGURATIONS_CONTENT_AVAILABILITY].value,
    [scPreferencesContext.preferences]
  );

  // HOOKS
  const theme = useTheme<SCThemeType>();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const isGroupAdmin = useMemo(
    () => scUserContext.user && scGroup?.managed_by?.id === scUserContext.user.id,
    [scUserContext.user, scGroup?.managed_by?.id]
  );

  // REFS
  const updatesSubscription = useRef(null);

  /**
   * Initialize component
   * Fetch data only if the component is not initialized and it is not loading data
   */
  const _initComponent = useMemo(
    () => (): void => {
      if (!state.initialized && !state.isLoadingNext) {
        dispatch({type: actionWidgetTypes.LOADING_NEXT});
        GroupService.getGroupInvitedUsers(scGroup.id, {limit})
          .then((payload: SCPaginatedResponse<SCUserType>) => {
            dispatch({type: actionWidgetTypes.LOAD_NEXT_SUCCESS, payload: {...payload, initialized: true}});
          })
          .catch((error) => {
            dispatch({type: actionWidgetTypes.LOAD_NEXT_FAILURE, payload: {errorLoadNext: error}});
            Logger.error(SCOPE_SC_UI, error);
          });
      }
    },
    [state.isLoadingNext, state.initialized, scGroup, limit, dispatch]
  );

  // EFFECTS
  useEffect(() => {
    let _t;
    if ((contentAvailability || (!contentAvailability && scUserContext.user?.id)) && scGroup && scUserContext.user !== undefined) {
      _t = setTimeout(_initComponent);
      return (): void => {
        _t && clearTimeout(_t);
      };
    }
  }, [scUserContext.user, contentAvailability, scGroup]);

  useEffect(() => {
    if (openDialog && state.next && state.results.length === limit && state.initialized) {
      dispatch({type: actionWidgetTypes.LOADING_NEXT});
      GroupService.getGroupInvitedUsers(scGroup.id, {offset: limit, limit: 10})
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
    if (!scGroup || (!contentAvailability && !scUserContext.user)) {
      return;
    } else if (cacheStrategy === CacheStrategies.NETWORK_ONLY) {
      onStateChange && onStateChange({cacheStrategy: CacheStrategies.CACHE_FIRST});
    }
  }, [scUserContext.user, scGroup, contentAvailability]);

  useEffect(() => {
    if (!scGroup || !scUserContext.user || !state.initialized) {
      return;
    }
  }, []);

  /**
   * Subscriber for pubsub callback
   */
  const onChangeGroupHandler = useCallback(
    (_msg: string, newInvited: SCGroupType[]) => {
      dispatch({
        type: actionWidgetTypes.SET_RESULTS,
        payload: {results: [...state.results, ...newInvited]}
      });
    },
    [scGroup, dispatch, state.results]
  );

  /**
   * On mount, subscribe to receive groups updates (only edit)
   */
  useEffect(() => {
    if (scGroup && state.results) {
      updatesSubscription.current = PubSub.subscribe(`${SCTopicType.GROUP}.${SCEventType.INVITE_MEMBER}`, onChangeGroupHandler);
    }
    return () => {
      updatesSubscription.current && PubSub.unsubscribe(updatesSubscription.current);
    };
  }, [scGroup, state.results]);

  // HANDLERS
  const handleNext = useMemo(
    () => (): void => {
      dispatch({type: actionWidgetTypes.LOADING_NEXT});
      http
        .request({
          url: state.next,
          method: Endpoints.getGroupInvitedUsers.method
        })
        .then((res: AxiosResponse<SCPaginatedResponse<SCUserType>>) => {
          dispatch({type: actionWidgetTypes.LOAD_NEXT_SUCCESS, payload: res.data});
        });
    },
    [dispatch, state.next, state.isLoadingNext, state.initialized]
  );

  const handleToggleDialogOpen = (): void => {
    setOpenDialog((prev) => !prev);
  };

  // RENDER
  if ((!state.count && state.initialized) || !contentAvailability || !scGroup || !state.count || !state.results.length || !isGroupAdmin) {
    return <HiddenPlaceholder />;
  }
  if (!state.initialized) {
    return <Skeleton />;
  }

  const content = (
    <CardContent>
      <Typography className={classes.title} variant="h5">
        <FormattedMessage id="ui.groupInvitedWidget.title" defaultMessage="ui.groupInvitedWidget.title" />
      </Typography>
      <React.Fragment>
        <List>
          {state.results.slice(0, state.visibleItems).map((user: SCUserType) => (
            <ListItem key={user.id}>
              <User
                elevation={0}
                actions={
                  <Button disabled={true} variant="outlined" size="small">
                    <FormattedMessage id="ui.groupInvitedWidget.status" defaultMessage="ui.groupInvitedWidget.status" />
                  </Button>
                }
                user={user}
                userId={user.id}
              />
            </ListItem>
          ))}
        </List>
        {state.count > state.visibleItems && (
          <Button className={classes.showMore} onClick={handleToggleDialogOpen}>
            <FormattedMessage id="ui.groupInvitedWidget.button.showMore" defaultMessage="ui.groupInvitedWidget.button.showMore" />
          </Button>
        )}
      </React.Fragment>
      {openDialog && (
        <DialogRoot
          className={classes.dialogRoot}
          title={
            <FormattedMessage
              defaultMessage="ui.groupInvitedWidget.dialogTitle"
              id="ui.groupInvitedWidget.dialogTitle"
              values={{total: scGroup.subscribers_counter}}
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
                <FormattedMessage id="ui.groupInvitedWidget.noMoreResults" defaultMessage="ui.groupInvitedWidget.noMoreResults" />
              </Typography>
            }>
            <List>
              {state.results.map((user: SCUserType) => (
                <ListItem key={user.id}>
                  <User
                    elevation={0}
                    actions={
                      <Button disabled={true} variant="outlined" size="small">
                        <FormattedMessage id="ui.groupInvitedWidget.status" defaultMessage="ui.groupInvitedWidget.status" />
                      </Button>
                    }
                    user={user}
                    userId={user.id}
                  />
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
