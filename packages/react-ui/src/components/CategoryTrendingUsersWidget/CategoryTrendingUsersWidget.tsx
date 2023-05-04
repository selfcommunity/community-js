import React, {useContext, useEffect, useMemo, useReducer, useState} from 'react';
import {styled} from '@mui/material/styles';
import List from '@mui/material/List';
import {Button, CardContent, ListItem, Typography, useMediaQuery, useTheme} from '@mui/material';
import Widget, {WidgetProps} from '../Widget';
import {http, Endpoints, HttpResponse, CategoryService, SCPaginatedResponse} from '@selfcommunity/api-services';
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
import {FormattedMessage} from 'react-intl';
import User, {UserProps, UserSkeleton} from '../User';
import classNames from 'classnames';
import BaseDialog, {BaseDialogProps} from '../../shared/BaseDialog';
import CentralProgress from '../../shared/CentralProgress';
import InfiniteScroll from '../../shared/InfiniteScroll';
import Skeleton from './Skeleton';
import {useThemeProps} from '@mui/system';
import HiddenPlaceholder from '../../shared/HiddenPlaceholder';
import {VirtualScrollerItemProps} from '../../types/virtualScroller';
import {CacheStrategies, Logger} from '@selfcommunity/utils';
import {actionWidgetTypes, dataWidgetReducer, stateWidgetInitializer} from '../../utils/widget';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {SCUserType} from '@selfcommunity/types/src/types';
import {AxiosResponse} from 'axios';

const PREFIX = 'SCCategoryTrendingUsersWidget';

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

export interface CategoryTrendingUsersWidgetProps extends VirtualScrollerItemProps, WidgetProps {
  /**
   * Category id
   * @default null
   */
  categoryId?: number;

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
 * > API documentation for the Community-JS Trending People Widget component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {CategoryTrendingUsersWidget} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCCategoryTrendingUsersWidget` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCCategoryTrendingFeedWidget-root|Styles applied to the root element.|
 |title|.SCCategoryTrendingFeedWidget-title|Styles applied to the title element.|
 |noResults|.SCCategoryTrendingFeedWidget-no-results|Styles applied to no results section.|
 |followersItem|.SCCategoryTrendingFeedWidget-followers-item|Styles applied to follower item element.|
 |showMore|.SCCategoryTrendingFeedWidget-show-more|Styles applied to show more button element.|

 * @param inProps
 */
export default function CategoryTrendingUsersWidget(inProps: CategoryTrendingUsersWidgetProps): JSX.Element {
  // PROPS
  const props: CategoryTrendingUsersWidgetProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {
    className = null,
    categoryId = null,
    autoHide = null,
    limit = 3,
    UserProps = {},
    cacheStrategy = CacheStrategies.CACHE_FIRST,
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
      cacheKey: SCCache.getWidgetStateCacheKey(SCCache.TRENDING_FEED_TOOLS_STATE_CACHE_PREFIX_KEY, categoryId),
      cacheStrategy,
      visibleItems: limit
    },
    stateWidgetInitializer
  );
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  // CONTEXT
  const scUserContext: SCUserContextType = useSCUser();
  const scPreferencesContext: SCPreferencesContextType = useSCPreferences();
  const contentAvailability = useMemo(
    () =>
      SCPreferences.CONFIGURATIONS_CONTENT_AVAILABILITY in scPreferencesContext.preferences &&
      scPreferencesContext.preferences[SCPreferences.CONFIGURATIONS_CONTENT_AVAILABILITY].value,
    [scPreferencesContext]
  );

  // HOOKS
  const theme = useTheme<SCThemeType>();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // EFFECTS
  useEffect(() => {
    if (!contentAvailability && !scUserContext.user) {
      return;
    } else if (cacheStrategy === CacheStrategies.NETWORK_ONLY) {
      onStateChange && onStateChange({cacheStrategy: CacheStrategies.CACHE_FIRST});
    }
  }, [scUserContext.user]);

  /**
   * On mount, fetches trending user list
   */
  useEffect(() => {
    if ((!contentAvailability && !scUserContext.user) || state.initialized || state.isLoadingNext) {
      return;
    }
    dispatch({
      type: actionWidgetTypes.LOADING_NEXT
    });
    const controller = new AbortController();
    CategoryService.getCategoryTrendingFollowers(categoryId, {limit}, {signal: controller.signal})
      .then((payload: SCPaginatedResponse<SCUserType>) => {
        dispatch({
          type: actionWidgetTypes.LOAD_NEXT_SUCCESS,
          payload: {...payload, initialized: true}
        });
      })
      .catch((error) => {
        dispatch({type: actionWidgetTypes.LOAD_NEXT_FAILURE, payload: {errorLoadNext: error}});
        Logger.error(SCOPE_SC_UI, error);
      });
    return () => controller.abort();
  }, [contentAvailability, scUserContext.user]);

  useEffect(() => {
    if (openDialog && state.next && state.results.length === limit && state.initialized) {
      dispatch({
        type: actionWidgetTypes.LOADING_NEXT
      });
      CategoryService.getCategoryTrendingFollowers(categoryId, {offset: limit, limit: 10})
        .then((payload: SCPaginatedResponse<SCUserType>) => {
          dispatch({
            type: actionWidgetTypes.LOAD_NEXT_SUCCESS,
            payload: payload
          });
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

  // HANDLERS
  const handleNext = useMemo(
    () => () => {
      if (!state.initialized || state.isLoadingNext) {
        return;
      }
      dispatch({
        type: actionWidgetTypes.LOADING_NEXT
      });
      return http
        .request({
          url: state.next,
          method: Endpoints.UserFollowers.method
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

  const handleToggleDialogOpen = () => {
    setOpenDialog((prev) => !prev);
  };

  // RENDER
  if ((!contentAvailability && !scUserContext.user) || (autoHide && !state.count && state.initialized)) {
    return <HiddenPlaceholder />;
  }
  if (!state.initialized) {
    return <Skeleton />;
  }

  const content = (
    <CardContent>
      <Typography className={classes.title} variant="h5">
        <FormattedMessage id="ui.categoryTrendingUsersWidget.title" defaultMessage="ui.categoryTrendingUsersWidget.title" />
      </Typography>
      {!state.count ? (
        <Typography className={classes.noResults} variant="body2">
          <FormattedMessage id="ui.categoryTrendingUsersWidget.noResults" defaultMessage="ui.categoryTrendingUsersWidget.noResults" />
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
              <FormattedMessage id="ui.categoryTrendingUsersWidget.button.showAll" defaultMessage="ui.categoryTrendingUsersWidget.button.showAll" />
            </Button>
          )}
        </React.Fragment>
      )}
      {openDialog && (
        <DialogRoot
          className={classes.dialogRoot}
          title={
            <FormattedMessage
              defaultMessage="ui.categoryTrendingUsersWidget.title"
              id="ui.categoryTrendingUsersWidget.title"
              values={{total: state.count}}
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
                <FormattedMessage id="ui.categoryTrendingUsersWidget.noMoreResults" defaultMessage="ui.categoryTrendingUsersWidget.noMoreResults" />
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
