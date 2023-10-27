import React, {useEffect, useMemo, useReducer, useState} from 'react';
import {styled} from '@mui/material/styles';
import List from '@mui/material/List';
import {Button, CardContent, ListItem, Typography, useMediaQuery, useTheme} from '@mui/material';
import Widget, {WidgetProps} from '../Widget';
import {SCFeedUnitType} from '@selfcommunity/types';
import {CategoryService, Endpoints, http, SCPaginatedResponse} from '@selfcommunity/api-services';
import {CacheStrategies, isInteger, Logger} from '@selfcommunity/utils';
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
 *
 *
 * This component renders a specific category's trending posts, discussions, statuses list.
 * Take a look at our <strong>demo</strong> component [here](/docs/sdk/community-js/react-ui/Components/CategoryTrendingFeed)

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
 |showMore|.SCCategoryTrendingFeedWidget-show-more|Styles applied to show more button element.|
 |dialogRoot|.SCCategoryTrendingFeedWidget-dialog-root|Styles applied to dialog root element.|
 |endMessage|.SCCategoryTrendingFeedWidget-end-message|Styles applied to the end message element.|

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
  const catId = scCategory ? scCategory.id : null;

  /**
   * Initialize component
   * Fetch data only if the component is not initialized and it is not loading data
   */
  const _initComponent = useMemo(
    () => (): void => {
      if (!state.initialized && !state.isLoadingNext) {
        dispatch({type: actionWidgetTypes.LOADING_NEXT});
        CategoryService.getCategoryTrendingFeed(catId, {limit})
          .then((payload: SCPaginatedResponse<SCFeedUnitType>) => {
            dispatch({type: actionWidgetTypes.LOAD_NEXT_SUCCESS, payload: {...payload, initialized: true}});
          })
          .catch((error) => {
            dispatch({type: actionWidgetTypes.LOAD_NEXT_FAILURE, payload: {errorLoadNext: error}});
            Logger.error(SCOPE_SC_UI, error);
          });
      }
    },
    [catId, state.isLoadingNext, state.initialized, limit, dispatch]
  );

  // EFFECTS
  useEffect(() => {
    let _t;
    if (scUserContext.user !== undefined && catId && (contentAvailability || (!contentAvailability && scUserContext.user?.id))) {
      _t = setTimeout(_initComponent);
      return (): void => {
        _t && clearTimeout(_t);
      };
    }
  }, [catId, scUserContext.user, contentAvailability]);

  // Add 10 - limit items to initial dialog page
  useEffect(() => {
    if (openDialog && state.next && state.results.length === limit && state.initialized) {
      dispatch({type: actionWidgetTypes.LOADING_NEXT});
      CategoryService.getCategoryTrendingFeed(catId, {offset: limit, limit: 10})
        .then((payload: SCPaginatedResponse<SCFeedUnitType>) => {
          dispatch({
            type: actionWidgetTypes.LOAD_NEXT_SUCCESS,
            payload: {...payload, initialized: true}
          });
        })
        .catch((error) => {
          dispatch({type: actionWidgetTypes.LOAD_NEXT_FAILURE, payload: {errorLoadNext: error}});
          Logger.error(SCOPE_SC_UI, error);
        });
    }
  }, [openDialog, limit, state.next, state.results.length, state.initialized, catId]);

  /**
   * Virtual feed update
   */
  useEffect(() => {
    onHeightChange && onHeightChange();
  }, [state.results]);

  useEffect(() => {
    if (!contentAvailability && !scUserContext.user) {
      return;
    } else if (isInteger(catId) && cacheStrategy === CacheStrategies.NETWORK_ONLY) {
      onStateChange && onStateChange({cacheStrategy: CacheStrategies.CACHE_FIRST});
    }
  }, [contentAvailability, cacheStrategy, catId, scUserContext.user]);

  // HANDLERS
  const handleNext = useMemo(
    () => (): void => {
      dispatch({type: actionWidgetTypes.LOADING_NEXT});
      http
        .request({
          url: state.next,
          method: Endpoints.CategoryTrendingFeed.method
        })
        .then((res: AxiosResponse<SCPaginatedResponse<SCFeedUnitType>>) => {
          dispatch({
            type: actionWidgetTypes.LOAD_NEXT_SUCCESS,
            payload: res.data
          });
        });
    },
    [dispatch, state.next]
  );

  const handleToggleDialogOpen = (): void => {
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
            {state.results.slice(0, state.visibleItems).map((obj: SCFeedUnitType) => (
              <ListItem key={obj[obj.type].id}>
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
              {state.results.map((obj: SCFeedUnitType) => (
                <ListItem key={obj[obj.type].id}>
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
