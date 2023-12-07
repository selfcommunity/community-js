import React, {useEffect, useMemo, useReducer, useState} from 'react';
import {styled} from '@mui/material/styles';
import List from '@mui/material/List';
import {Button, CardContent, ListItem, Typography, useMediaQuery, useTheme} from '@mui/material';
import Widget, {WidgetProps} from '../Widget';
import {SCUserConnectionRequestType} from '@selfcommunity/types';
import {http, Endpoints, UserService, SCPaginatedResponse} from '@selfcommunity/api-services';
import {CacheStrategies, isInteger, Logger} from '@selfcommunity/utils';
import {
  SCCache,
  SCPreferences,
  SCPreferencesContextType,
  SCThemeType,
  SCUserContextType,
  useSCPreferences,
  useSCUser
} from '@selfcommunity/react-core';
import {actionWidgetTypes, dataWidgetReducer, stateWidgetInitializer} from '../../utils/widget';
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

export interface UserConnectionsRequestsSentWidgetProps extends VirtualScrollerItemProps, WidgetProps {
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
 * > API documentation for the Community-JS User Connections Requests Widget component. Learn about the available props and the CSS API.
 *
 *
 * This component renders the list of connections requests sent of the authenticated user.

 #### Import

 ```jsx
 import {UserConnectionsRequestsSentWidget} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCUserConnectionsRequestsSentWidget` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCUserConnectionsRequestsSentWidget-root|Styles applied to the root element.|
 |title|.SCUserConnectionsRequestsSentWidget-title|Styles applied to the title element.|
 |noResults|.SCUserConnectionsRequestsSentWidget-no-results|Styles applied to no results section.|
 |connectionsItem|.SCUserConnectionsRequestsSentWidget-connections-item|Styles applied to connection item element.|
 |showMore|.SCUserConnectionsRequestsSentWidget-show-more|Styles applied to show more button element.|

 * @param inProps
 */
export default function UserConnectionsRequestsSentWidget(inProps: UserConnectionsRequestsSentWidgetProps): JSX.Element {
  // PROPS
  const props: UserConnectionsRequestsSentWidgetProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {
    autoHide = false,
    limit = 3,
    className,
    UserProps = {},
    cacheStrategy = CacheStrategies.NETWORK_ONLY,
    onHeightChange,
    onStateChange,
    DialogProps = {},
    userId,
    ...rest
  } = props;

  // STATE
  const [state, dispatch] = useReducer(
    dataWidgetReducer,
    {
      isLoadingNext: false,
      next: null,
      cacheKey: SCCache.getWidgetStateCacheKey(SCCache.USER_CONNECTIONS_REQUESTS_SENT_TOOLS_STATE_CACHE_PREFIX_KEY, userId),
      cacheStrategy,
      visibleItems: limit
    },
    stateWidgetInitializer
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

  /**
   * Initialize component
   * Fetch data only if the component is not initialized and it is not loading data
   */
  const _initComponent = useMemo(
    () => (): void => {
      if (!state.initialized && !state.isLoadingNext) {
        dispatch({type: actionWidgetTypes.LOADING_NEXT});
        UserService.getUserRequestConnectionsSent({limit})
          .then((payload: SCPaginatedResponse<SCUserConnectionRequestType>) => {
            dispatch({type: actionWidgetTypes.LOAD_NEXT_SUCCESS, payload: {...payload, initialized: true}});
          })
          .catch((error) => {
            dispatch({type: actionWidgetTypes.LOAD_NEXT_FAILURE, payload: {errorLoadNext: error}});
            Logger.error(SCOPE_SC_UI, error);
          });
      }
    },
    [state.isLoadingNext, state.initialized, userId, limit, dispatch]
  );

  // EFFECTS
  useEffect(() => {
    let _t;
    if (!followEnabled && scUserContext.user) {
      _t = setTimeout(_initComponent);
      return (): void => {
        _t && clearTimeout(_t);
      };
    }
  }, [scUserContext.user, contentAvailability, userId]);

  useEffect(() => {
    if (openDialog && state.next && state.results.length === limit && state.initialized) {
      dispatch({type: actionWidgetTypes.LOADING_NEXT});
      UserService.getUserRequestConnectionsSent({offset: limit, limit: 10})
        .then((payload: SCPaginatedResponse<SCUserConnectionRequestType>) => {
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
    if (!isInteger(userId) || followEnabled || (!contentAvailability && !scUserContext.user)) {
      return;
    } else if (cacheStrategy === CacheStrategies.NETWORK_ONLY) {
      onStateChange && onStateChange({cacheStrategy: CacheStrategies.CACHE_FIRST});
    }
  }, [scUserContext.user, userId, contentAvailability]);

  // HANDLERS
  const handleNext = useMemo(
    () => (): void => {
      dispatch({type: actionWidgetTypes.LOADING_NEXT});
      http
        .request({
          url: state.next,
          method: Endpoints.UserRequestConnectionsSent.method
        })
        .then((res: AxiosResponse<SCPaginatedResponse<SCUserConnectionRequestType>>) => {
          dispatch({type: actionWidgetTypes.LOAD_NEXT_SUCCESS, payload: res.data});
        });
    },
    [dispatch, state.next, state.isLoadingNext, state.initialized]
  );

  /**
   * Handle refresh counters (authenticated user)
   */
  const handleChangeConnectionStatus = useMemo(
    () => (): void => {
      scUserContext.refreshCounters();
    },
    [scUserContext.refreshCounters]
  );

  const handleToggleDialogOpen = (): void => {
    setOpenDialog((prev) => !prev);
  };

  // RENDER
  if (followEnabled || (autoHide && !state.count && state.initialized) || (!contentAvailability && !scUserContext.user) || !userId) {
    return <HiddenPlaceholder />;
  }
  if (!state.initialized) {
    return <Skeleton />;
  }
  const content = (
    <CardContent>
      <Typography className={classes.title} variant="h5">
        <FormattedMessage
          id="ui.userConnectionsRequestsSentWidget.title"
          defaultMessage="ui.userConnectionsRequestsSentWidget.title"
          values={{total: scUserContext.user.connection_requests_sent_counter}}
        />
      </Typography>
      {!state.count ? (
        <Typography className={classes.noResults} variant="body2">
          <FormattedMessage id="ui.userConnectionsRequestsSentWidget.subtitle.noResults" defaultMessage="" />
        </Typography>
      ) : (
        <React.Fragment>
          <List>
            {state.results.slice(0, state.visibleItems).map((conReq: SCUserConnectionRequestType) => (
              <ListItem key={conReq.to_user.id}>
                <User
                  elevation={0}
                  user={conReq.to_user}
                  followConnectUserButtonProps={{followConnectUserButtonProps: {onChangeConnectionStatus: handleChangeConnectionStatus}}}
                  {...UserProps}
                />
              </ListItem>
            ))}
          </List>
          {state.count > state.visibleItems && (
            <Button className={classes.showMore} onClick={handleToggleDialogOpen}>
              <FormattedMessage
                id="ui.userConnectionsRequestsSentWidget.button.showAll"
                defaultMessage="ui.userConnectionsRequestsSentWidget.button.showAll"
              />
            </Button>
          )}
        </React.Fragment>
      )}
      {openDialog && (
        <DialogRoot
          className={classes.dialogRoot}
          title={
            <FormattedMessage
              defaultMessage="ui.userConnectionsRequestsSentWidget.title"
              id="ui.userConnectionsRequestsSentWidget.title"
              values={{total: scUserContext.user.connection_requests_sent_counter}}
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
                <FormattedMessage
                  id="ui.userConnectionsRequestsSentWidget.noMoreResults"
                  defaultMessage="ui.userConnectionsRequestsSentWidget.noMoreResults"
                />
              </Typography>
            }>
            <List>
              {state.results.map((conReq: SCUserConnectionRequestType) => (
                <ListItem key={conReq.to_user.id}>
                  <User
                    elevation={0}
                    user={conReq.to_user}
                    followConnectUserButtonProps={{followConnectUserButtonProps: {onChangeConnectionStatus: handleChangeConnectionStatus}}}
                    {...UserProps}
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
