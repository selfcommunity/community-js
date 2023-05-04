import React, {useEffect, useMemo, useReducer, useState} from 'react';
import {styled} from '@mui/material/styles';
import List from '@mui/material/List';
import {Button, CardContent, ListItem, Typography, useMediaQuery, useTheme} from '@mui/material';
import Widget, {WidgetProps} from '../Widget';
import {SCFeedObjectType} from '@selfcommunity/types';
import {CategoryService, Endpoints, http, SCPaginatedResponse} from '@selfcommunity/api-services';
import {CacheStrategies, Logger} from '@selfcommunity/utils';
import {SCOPE_SC_UI} from '../../constants/Errors';
import FeedObject, {FeedObjectProps, FeedObjectSkeleton} from '../FeedObject';
import {FormattedMessage} from 'react-intl';
import {SCFeedObjectTemplateType} from '../../types/feedObject';
import classNames from 'classnames';
import BaseDialog, {BaseDialogProps} from '../../shared/BaseDialog';
import InfiniteScroll from '../../shared/InfiniteScroll';
import Skeleton from './Skeleton';
import {useThemeProps} from '@mui/system';
import HiddenPlaceholder from '../../shared/HiddenPlaceholder';
import {
  Link,
  SCCache,
  SCPreferences,
  SCPreferencesContextType,
  SCRoutes,
  SCRoutingContextType,
  SCThemeType,
  SCUserContextType,
  useSCFetchCategory,
  useSCPreferences,
  useSCRouting,
  useSCUser
} from '@selfcommunity/react-core';
import {VirtualScrollerItemProps} from '../../types/virtualScroller';
import {actionToolsTypes, dataToolsReducer, stateToolsInitializer} from '../../utils/tools';
import {AxiosResponse} from 'axios';

const PREFIX = 'SCCategoryTrendingFeedWidget';

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

export interface CategoryTrendingFeedWidgetProps extends VirtualScrollerItemProps, WidgetProps {
  /**
   * Id of category
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
   * Props to spread to single feed object
   * @default empty object
   */
  FeedObjectProps?: FeedObjectProps;
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
 * > API documentation for the Community-JS Trending Feed Widget component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {CategoryTrendingFeedWidget} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCCategoryTrendingFeedWidget` can be used when providing style overrides in the theme.


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
export default function CategoryTrendingFeedWidget(inProps: CategoryTrendingFeedWidgetProps): JSX.Element {
  // PROPS
  const props: CategoryTrendingFeedWidgetProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {
    className = null,
    categoryId = null,
    autoHide = null,
    limit = 3,
    FeedObjectProps = {
      template: SCFeedObjectTemplateType.SNIPPET
    },
    cacheStrategy = CacheStrategies.CACHE_FIRST,
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
      cacheKey: SCCache.getWidgetStateCacheKey(SCCache.TRENDING_FEED_TOOLS_STATE_CACHE_PREFIX_KEY, categoryId),
      cacheStrategy,
      visibleItems: limit
    },
    stateToolsInitializer
  );
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  // CONTEXT
  const scUserContext: SCUserContextType = useSCUser();
  const scPreferencesContext: SCPreferencesContextType = useSCPreferences();
  const scRoutingContext: SCRoutingContextType = useSCRouting();
  const contentAvailability = useMemo(
    () =>
      SCPreferences.CONFIGURATIONS_CONTENT_AVAILABILITY in scPreferencesContext.preferences &&
      scPreferencesContext.preferences[SCPreferences.CONFIGURATIONS_CONTENT_AVAILABILITY].value,
    [scPreferencesContext]
  );

  // HOOKS
  const theme = useTheme<SCThemeType>();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const {scCategory} = useSCFetchCategory({id: categoryId});

  // EFFECTS
  useEffect(() => {
    if (!contentAvailability && !scUserContext.user) {
      return;
    } else if (cacheStrategy === CacheStrategies.NETWORK_ONLY) {
      onStateChange && onStateChange({cacheStrategy: CacheStrategies.CACHE_FIRST});
    }
  }, [scUserContext.user]);

  /**
   * On mount, fetches trending posts list
   */
  useEffect(() => {
    if ((!contentAvailability && !scUserContext.user) || state.initialized || state.isLoadingNext) {
      return;
    }
    dispatch({
      type: actionToolsTypes.LOADING_NEXT
    });
    const controller = new AbortController();
    CategoryService.getCategoryTrendingFeed(categoryId, {limit}, {signal: controller.signal})
      .then((payload: SCPaginatedResponse<SCFeedObjectType>) => {
        dispatch({
          type: actionToolsTypes.LOAD_NEXT_SUCCESS,
          payload: payload
        });
      })
      .catch((error) => {
        dispatch({type: actionToolsTypes.LOAD_NEXT_FAILURE, payload: {errorLoadNext: error}});
        Logger.error(SCOPE_SC_UI, error);
      });
    return () => controller.abort();
  }, [contentAvailability, scUserContext.user, state.initialized]);

  useEffect(() => {
    if (openDialog && state.next && state.results.length === limit && state.initialized) {
      dispatch({
        type: actionToolsTypes.LOADING_NEXT
      });
      CategoryService.getCategoryTrendingFeed(categoryId, {offset: limit, limit: 10})
        .then((payload: SCPaginatedResponse<SCFeedObjectType>) => {
          dispatch({
            type: actionToolsTypes.LOAD_NEXT_SUCCESS,
            payload: {...payload, initialized: true}
          });
        })
        .catch((error) => {
          dispatch({type: actionToolsTypes.LOAD_NEXT_FAILURE, payload: {errorLoadNext: error}});
          Logger.error(SCOPE_SC_UI, error);
        });
    }
  }, [openDialog, state.next, state.results, state.initialized]);

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
        .then((res: AxiosResponse<SCPaginatedResponse<SCFeedObjectType>>) => {
          dispatch({
            type: actionToolsTypes.LOAD_NEXT_SUCCESS,
            payload: res.data
          });
        });
    },
    [dispatch, state.next, state.isLoadingNext]
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
        <FormattedMessage id="ui.categoryTrendingFeedWidget.title" defaultMessage="ui.categoryTrendingFeedWidget.title" />
      </Typography>
      {!state.count ? (
        <Typography className={classes.noResults} variant="body2">
          <FormattedMessage id="ui.categoryTrendingFeedWidget.noResults" defaultMessage="ui.categoryTrendingFeedWidget.noResults" />
        </Typography>
      ) : (
        <React.Fragment>
          <List>
            {state.results.slice(0, state.visibleItems).map((obj: SCFeedObjectType) => (
              <ListItem key={obj.id}>
                <FeedObject elevation={0} feedObject={obj[obj.type]} {...FeedObjectProps} />
              </ListItem>
            ))}
          </List>
          {state.count > state.visibleItems && (
            <Button
              className={classes.showMore}
              {...(isMobile
                ? {onClick: handleToggleDialogOpen}
                : {component: Link, to: scRoutingContext.url(SCRoutes.CATEGORY_TRENDING_FEED_ROUTE_NAME, scCategory)})}>
              <FormattedMessage id="ui.categoryTrendingFeedWidget.button.showAll" defaultMessage="ui.categoryTrendingFeedWidget.button.showAll" />
            </Button>
          )}
        </React.Fragment>
      )}
      {openDialog && (
        <DialogRoot
          className={classes.dialogRoot}
          title={
            <FormattedMessage
              defaultMessage="ui.categoryTrendingFeedWidget.title"
              id="ui.categoryTrendingFeedWidget.title"
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
            loaderNext={<FeedObjectSkeleton elevation={0} {...FeedObjectProps} />}
            height={isMobile ? '100%' : 400}
            endMessage={
              <Typography className={classes.endMessage}>
                <FormattedMessage id="ui.categoryTrendingFeedWidget.noMoreResults" defaultMessage="ui.categoryTrendingFeedWidget.noMoreResults" />
              </Typography>
            }>
            <List>
              {state.results.map((obj: SCFeedObjectType) => (
                <ListItem key={obj.id}>
                  <FeedObject elevation={0} feedObject={obj[obj.type]} {...FeedObjectProps} />
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
