import React, {useEffect, useMemo, useReducer, useState} from 'react';
import {styled} from '@mui/material/styles';
import {Button, CardContent, List, ListItem, Typography, useMediaQuery, useTheme} from '@mui/material';
import {SCUserType} from '@selfcommunity/types';
import {http, Endpoints, SuggestionService, SCPaginatedResponse} from '@selfcommunity/api-services';
import {
  SCCache,
  SCPreferences,
  SCPreferencesContextType,
  SCThemeType,
  SCUserContextType,
  useSCPreferences,
  useSCUser
} from '@selfcommunity/react-core';
import Skeleton from './Skeleton';
import User, {UserProps, UserSkeleton} from '../User';
import {FormattedMessage} from 'react-intl';
import classNames from 'classnames';
import Widget, {WidgetProps} from '../Widget';
import {useThemeProps} from '@mui/system';
import HiddenPlaceholder from '../../shared/HiddenPlaceholder';
import {VirtualScrollerItemProps} from '../../types/virtualScroller';
import {CacheStrategies, Logger} from '@selfcommunity/utils';
import {actionWidgetTypes, dataWidgetReducer, stateWidgetInitializer} from '../../utils/widget';
import BaseDialog, {BaseDialogProps} from '../../shared/BaseDialog';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {AxiosResponse} from 'axios';
import InfiniteScroll from '../../shared/InfiniteScroll';

const PREFIX = 'SCUserSuggestionWidget';

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
})(() => ({}));

const DialogRoot = styled(BaseDialog, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.dialogRoot
})(() => ({}));

export interface UserSuggestionWidgetProps extends VirtualScrollerItemProps, WidgetProps {
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
   * Props to spread to users suggestion dialog
   * @default {}
   */
  DialogProps?: BaseDialogProps;

  /**
   * Other props
   */
  [p: string]: any;
}

/**
 *
 > API documentation for the Community-JS User Suggestion Widget component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {UserSuggestionWidget} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCUserSuggestionWidget` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCUserSuggestionWidget-root|Styles applied to the root element.|
 |title|.SCUserSuggestionWidget-title|Styles applied to the title element.|
 |noResults|.SCUserSuggestionWidget-no-results|Styles applied to no results section.|
 |showMore|.SCUserSuggestionWidget-show-more|Styles applied to show more button element.|
 |dialogRoot|.SCUserSuggestionWidget-dialog-root|Styles applied to the root dialog element.|
 |endMessage|.SCUserSuggestionWidget-end-message|Styles applied to the end message element.|

 * @param inProps
 */
export default function UserSuggestionWidget(inProps: UserSuggestionWidgetProps): JSX.Element {
  // PROPS
  const props: UserSuggestionWidgetProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });

  const {
    autoHide = true,
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
      cacheKey: SCCache.getWidgetStateCacheKey(SCCache.PEOPLE_SUGGESTION_TOOLS_STATE_CACHE_PREFIX_KEY),
      cacheStrategy,
      visibleItems: limit
    },
    stateWidgetInitializer
  );
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  // CONTEXT
  const scUserContext: SCUserContextType = useSCUser();
  const scPreferencesContext: SCPreferencesContextType = useSCPreferences();
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
   * Fetch data only if the component is not initialized, and it is not loading data
   */
  const _initComponent = useMemo(
    () => (): void => {
      if (!state.initialized && !state.isLoadingNext) {
        dispatch({type: actionWidgetTypes.LOADING_NEXT});
        SuggestionService.getUserSuggestion({limit})
          .then((payload: SCPaginatedResponse<SCUserType>) => {
            dispatch({type: actionWidgetTypes.LOAD_NEXT_SUCCESS, payload: {...payload, initialized: true}});
          })
          .catch((error) => {
            dispatch({type: actionWidgetTypes.LOAD_NEXT_FAILURE, payload: {errorLoadNext: error}});
            Logger.error(SCOPE_SC_UI, error);
          });
      }
    },
    [state.isLoadingNext, state.initialized, limit, dispatch]
  );

  // EFFECTS
  useEffect(() => {
    let _t;
    if (scUserContext.user) {
      _t = setTimeout(_initComponent);
      return (): void => {
        _t && clearTimeout(_t);
      };
    }
  }, [scUserContext.user]);

  useEffect(() => {
    if (openDialog && state.next && state.results.length === limit && state.initialized) {
      dispatch({type: actionWidgetTypes.LOADING_NEXT});
      SuggestionService.getUserSuggestion({offset: limit, limit: 10})
        .then((payload: SCPaginatedResponse<SCUserType>) => {
          dispatch({type: actionWidgetTypes.LOAD_NEXT_SUCCESS, payload: payload});
        })
        .catch((error) => {
          dispatch({type: actionWidgetTypes.LOAD_NEXT_FAILURE, payload: {errorLoadNext: error}});
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

  useEffect(() => {
    if (scUserContext.user && cacheStrategy === CacheStrategies.NETWORK_ONLY) {
      onStateChange && onStateChange({cacheStrategy: CacheStrategies.CACHE_FIRST});
    }
  }, [scUserContext.user]);

  // HANDLERS
  /**
   * Handles list change on user connect
   */
  const handleConnect = useMemo(
    () =>
      (user): void => {
        dispatch({
          type: actionWidgetTypes.SET_RESULTS,
          payload: {results: state.results.filter((u) => u.id !== user.id), count: state.count - 1}
        });
      },
    [dispatch, state.count, state.results.length]
  );

  /**
   * Handles pagination
   */
  const handleNext = useMemo(
    () => (): void => {
      dispatch({type: actionWidgetTypes.LOADING_NEXT});
      http
        .request({
          url: state.next,
          method: Endpoints.UserSuggestion.method
        })
        .then((res: AxiosResponse<SCPaginatedResponse<SCUserType>>) => {
          // dispatch({type: actionWidgetTypes.LOAD_NEXT_SUCCESS, payload: res.data});
        });
    },
    [dispatch, state.next, state.isLoadingNext, state.initialized]
  );

  const handleToggleDialogOpen = (): void => {
    setOpenDialog((prev) => !prev);
  };

  // RENDER
  if ((autoHide && !state.count && state.initialized) || !scUserContext.user) {
    return <HiddenPlaceholder />;
  }
  if (!state.initialized) {
    return <Skeleton />;
  }
  const content = (
    <CardContent>
      <Typography className={classes.title} variant="h5">
        <FormattedMessage id="ui.userSuggestionWidget.title" defaultMessage="ui.userSuggestionWidget.title" />
      </Typography>
      {!state.count ? (
        <Typography className={classes.noResults} variant="body2">
          <FormattedMessage id="ui.userSuggestionWidget.noResults" defaultMessage="ui.userSuggestionWidget.noResults" />
        </Typography>
      ) : (
        <React.Fragment>
          <List>
            {state.results.slice(0, state.visibleItems).map((user: SCUserType) => (
              <ListItem key={user.id}>
                <User
                  elevation={0}
                  user={user}
                  {...(followEnabled
                    ? {followConnectUserButtonProps: {onFollow: handleConnect}}
                    : {followConnectUserButtonProps: {onChangeConnectionStatus: handleConnect}})}
                  {...UserProps}
                />
              </ListItem>
            ))}
          </List>
          {state.count > state.visibleItems && (
            <Button className={classes.showMore} onClick={handleToggleDialogOpen}>
              <FormattedMessage id="ui.userSuggestionWidget.button.showAll" defaultMessage="ui.userSuggestionWidget.button.showAll" />
            </Button>
          )}
        </React.Fragment>
      )}
      {openDialog && (
        <DialogRoot
          className={classes.dialogRoot}
          title={<FormattedMessage defaultMessage="ui.userSuggestionWidget.title" id="ui.userSuggestionWidget.title" />}
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
                <FormattedMessage id="ui.userSuggestionWidget.noMoreResults" defaultMessage="ui.userSuggestionWidget.noMoreResults" />
              </Typography>
            }>
            <List>
              {state.results.map((user: SCUserType) => (
                <ListItem key={user.id}>
                  <User
                    elevation={0}
                    user={user}
                    {...(followEnabled
                      ? {followConnectUserButtonProps: {onFollow: handleConnect}}
                      : {followConnectUserButtonProps: {onChangeConnectionStatus: handleConnect}})}
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
