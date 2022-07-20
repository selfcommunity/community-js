// @ts-nocheck
import React, {forwardRef, ForwardRefRenderFunction, ReactNode, useContext, useEffect, useImperativeHandle, useMemo, useRef, useState} from 'react';
import {
  SCCache,
  SCPreferences,
  SCPreferencesContextType,
  SCUserContext,
  SCUserContextType,
  useSCFetchFeed,
  useSCPreferences
} from '@selfcommunity/react-core';
import {styled, useTheme} from '@mui/material/styles';
import {CardContent, Grid, Hidden, Theme, useMediaQuery} from '@mui/material';
import {FormattedMessage} from 'react-intl';
import {GenericSkeleton} from '../Skeleton';
import {SCFeedWidgetType} from '../../types/feed';
import Sticky from 'react-stickynode';
import CustomAdv, {CustomAdvProps} from '../CustomAdv';
import {SCCustomAdvPosition, SCFeedUnitType, SCUserType} from '@selfcommunity/types';
import {EndpointType, SCPaginatedResponse} from '@selfcommunity/api-services';
import {CacheStrategies, getQueryStringParameter, updateQueryStringParameter} from '@selfcommunity/utils';
import classNames from 'classnames';
import PubSub from 'pubsub-js';
import {useThemeProps} from '@mui/system';
import Widget from '../Widget';
import InfiniteScroll from 'react-infinite-scroll-component';
import VirtualizedScroller, {VirtualScrollChild} from '../../shared/VirtualizedScroller';
import {widgetSort} from '../../utils/feed';
import Footer from '../Footer';
import FeedSkeleton from './Skeleton';

const PREFIX = 'SCFeed';

const classes = {
  root: `${PREFIX}-root`,
  left: `${PREFIX}-left`,
  right: `${PREFIX}-right`,
  end: `${PREFIX}-end`,
  refresh: `${PREFIX}-refresh`
};

const Root = styled(Grid, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  marginTop: theme.spacing(-2),
  [`& .${classes.left}`]: {
    padding: '0 2px 0 2px',
    [theme.breakpoints.down('md')]: {
      '& > .SCWidget-root, & > .SCCustomAdv-root': {
        maxWidth: 700,
        marginLeft: 'auto',
        marginRight: 'auto'
      }
    }
  },
  [`& .${classes.end}, & .${classes.refresh}`]: {
    textAlign: 'center'
  }
}));

export interface FeedSidebarProps {
  top: string | number;
  bottomBoundary: string | number;
}

export type FeedRef = {
  addFeedData: (obj: any, syncPagination?: boolean) => void;
  refresh: () => void;
};

export interface FeedProps {
  /**
   * Id of the feed object
   * @default 'feed'
   */
  id?: string;

  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;

  /**
   * Feed API Endpoint
   */
  endpoint: EndpointType;

  /**
   * Feed API Query Params
   * @default [{'limit': 5}]
   */
  endpointQueryParams?: Record<string, string | number>;

  /**
   * End message, rendered when no more feed item can be displayed
   * @default <FormattedMessage id="ui.feed.noOtherFeedObject" defaultMessage="ui.feed.noOtherFeedObject" />
   */
  endMessage?: ReactNode;

  /**
   * Refresh message, rendered when no more feed item can be displayed
   * @default <FormattedMessage id="ui.feed.refreshRelease" defaultMessage="ui.feed.refreshRelease" />
   */
  refreshMessage?: ReactNode;

  /**
   * Component used as header. It will be displayed at the beginning of the feed
   @default null
   */
  HeaderComponent?: JSX.Element;

  /**
   * Component used as footer. It will be displayed after the end messages
   @default <Footer>
   */
  FooterComponent?: React.ElementType;

  /**
   * Props to spread to FooterComponent
   * @default empty object
   */
  FooterComponentProps?: any;

  /**
   * Widgets to insert into the feed
   * @default empty array
   */
  widgets?: SCFeedWidgetType[];

  /**
   * Component used to render single feed item retrieved by the endpoint
   */
  ItemComponent: React.ElementType;

  /**
   * Function used to convert the single result returned by the Endpoint into the props necessary to render the ItemComponent
   */
  itemPropsGenerator: (scUser: SCUserType, item) => any;

  /**
   * Function used to generate an id from the single result returned by the Endpoint
   */
  itemIdGenerator: (item) => any;

  /**
   * Props to spread to single feed item
   * @default empty object
   */
  ItemProps?: any;

  /**
   * Skeleton used to render loading effect during fetch
   */
  ItemSkeleton: React.ElementType;

  /**
   * Props to spread to single feed item skeleton
   * @default empty object
   */
  ItemSkeletonProps?: any;

  /**
   * Callback invoked whenever data is loaded during paging next
   */
  onNextData?: (data) => any;

  /**
   * Callback invoked whenever data is loaded during paging previous
   */
  onPreviousData?: (data) => any;

  /**
   * Authenticated or not
   */
  requireAuthentication?: boolean;

  /**
   * Caching strategies
   * @default CacheStrategies.CACHE_FIRST
   */
  cacheStrategy?: CacheStrategies;

  /**
   * Props to spread to single feed object
   * @default {top: 0, bottomBoundary: `#${id}`}
   */
  FeedSidebarProps?: FeedSidebarProps;

  /**
   * Props to spread to single custom adv element (this props can be used only if Custom Adv are enabled)
   * @default {}
   */
  CustomAdvProps?: CustomAdvProps;

  /**
   * Prefetch data. Useful for SSR.
   * Use this to init the component (in particular useSCFetchFeed)
   */
  prefetchedData?: SCPaginatedResponse<SCFeedUnitType>;
}

const WIDGET_PREFIX_KEY = 'widget_';
const DEFAULT_PAGINATION_ITEMS_NUMBER = 5; // data pagination
const DEFAULT_WIDGETS_NUMBER = 10; // every how many elements insert a widget
const PREFERENCES = [SCPreferences.ADVERTISING_CUSTOM_ADV_ENABLED, SCPreferences.ADVERTISING_CUSTOM_ADV_ONLY_FOR_ANONYMOUS_USERS_ENABLED];

/**
 * > API documentation for the Community-JS Feed component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {Feed} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCFeed` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCFeed-root|Styles applied to the root element.|
 |left|.SCFeed-left|Styles applied to the left element.|
 |right|.SCFeed-right|Styles applied to the right element.|
 |end|.SCFeed-end|Styles applied to the end element.|
 |refresh|.SCFeed-refresh|Styles applied to the refresh section.|
 *
 * @param inProps
 */
const Feed: ForwardRefRenderFunction<FeedRef, FeedProps> = (inProps: FeedProps, ref): JSX.Element => {
  // PROPS
  const props: FeedProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {
    id = 'feed',
    className,
    endpoint,
    endpointQueryParams = {limit: DEFAULT_PAGINATION_ITEMS_NUMBER, offset: 0},
    endMessage = <FormattedMessage id="ui.feed.noOtherFeedObject" defaultMessage="ui.feed.noOtherFeedObject" />,
    refreshMessage = <FormattedMessage id="ui.feed.refreshRelease" defaultMessage="ui.feed.refreshRelease" />,
    HeaderComponent,
    FooterComponent = Footer,
    FooterComponentProps = {},
    widgets = [],
    ItemComponent,
    itemPropsGenerator,
    itemIdGenerator,
    ItemProps = {},
    ItemSkeleton,
    ItemSkeletonProps = {},
    onNextData,
    onPreviousData,
    FeedSidebarProps = {top: 0, bottomBoundary: `#${id}`},
    CustomAdvProps = {},
    requireAuthentication = false,
    cacheStrategy = CacheStrategies.NETWORK_ONLY,
    prefetchedData
  } = props;

  // CONTEXT
  const scPreferences: SCPreferencesContextType = useSCPreferences();
  const scUserContext: SCUserContextType = useContext(SCUserContext);

  // CONST
  const authUserId = scUserContext.user ? scUserContext.user.id : null;
  const limit = useMemo(() => endpointQueryParams.limit || DEFAULT_PAGINATION_ITEMS_NUMBER, [endpointQueryParams]);
  const offset = useMemo(() => {
    if (prefetchedData) {
      const currentOffset = getQueryStringParameter(prefetchedData.previous, 'offset') || 0;
      return prefetchedData.previous ? currentOffset + limit : 0;
    }
    return endpointQueryParams.offset || 0;
  }, [endpointQueryParams, prefetchedData]);

  /**
   * Compute preferences
   */
  const preferences = useMemo(() => {
    const _preferences = {};
    PREFERENCES.map((p) => (_preferences[p] = p in scPreferences.preferences ? scPreferences.preferences[p].value : null));
    return _preferences;
  }, [scPreferences.preferences]);

  // RENDER
  const theme: Theme = useTheme();
  const oneColLayout = useMediaQuery(theme.breakpoints.down('md'), {noSsr: typeof window !== 'undefined'});
  const advEnabled = useMemo(
    () =>
      preferences[SCPreferences.ADVERTISING_CUSTOM_ADV_ENABLED] &&
      ((preferences[SCPreferences.ADVERTISING_CUSTOM_ADV_ONLY_FOR_ANONYMOUS_USERS_ENABLED] && scUserContext.user === null) ||
        !preferences[SCPreferences.ADVERTISING_CUSTOM_ADV_ONLY_FOR_ANONYMOUS_USERS_ENABLED]),
    [preferences]
  );

  /**
   * Callback onNextPage
   * @param page
   * @param offset
   * @param total
   * @param data
   */
  const onNextPage = (page, offset, total, data) => {
    setFeedDataLeft((prev) => prev.concat(_getFeedDataLeft(data, offset, total)));
    onNextData && onNextData(page, offset, total, data);
  };

  /**
   * Callback onPreviousPage
   * @param page
   * @param offset
   * @param total
   * @param data
   */
  const onPreviousPage = (page, offset, total, data) => {
    setFeedDataLeft((prev) => _getFeedDataLeft(data, offset, total).concat(prev));
    // Remove item duplicated from headData if the page data already contains
    removeHeadDuplicatedData(data.map((item) => itemIdGenerator(item)));
    onPreviousData && onPreviousData(page, offset, total, data);
  };

  // PAGINATION FEED
  const feedDataObject = useSCFetchFeed({
    id,
    endpoint,
    endpointQueryParams: {...endpointQueryParams, ...{offset, limit}},
    onNextPage: onNextPage,
    onPreviousPage: onPreviousPage,
    cacheStrategy,
    prefetchedData
  });

  /**
   * Compute Base Widgets
   */
  const _widgets: SCFeedWidgetType[] = useMemo(
    () =>
      [
        ...widgets,
        ...(advEnabled
          ? [
              {
                type: 'widget',
                component: CustomAdv,
                componentProps: {
                  position: SCCustomAdvPosition.POSITION_FEED_SIDEBAR,
                  ...CustomAdvProps
                },
                column: 'right',
                position: 0
              }
            ]
          : [])
      ]
        .map((w, i) => Object.assign({}, w, {position: w.position * (w.column === 'right' ? 5 : 1), id: `${w.column}_${i}`}))
        .sort(widgetSort),
    [widgets, advEnabled]
  );

  /**
   * Compute Widgets for the left column
   */
  const _getLeftColumnWidgets: SCFeedWidgetType[] = (position = 1) => {
    const tw = {
      type: 'widget',
      component: CustomAdv,
      componentProps: {
        position: SCCustomAdvPosition.POSITION_FEED,
        ...CustomAdvProps
      },
      column: 'left',
      position,
      id: `left_${position}`
    };
    if (oneColLayout) {
      const remainsWidget = position === feedDataObject.count - 1 ? _widgets.filter((w) => w.position >= feedDataObject.count) : [];
      return [
        ..._widgets.filter((w) => w.position === position),
        ...(advEnabled && position > 0 && position % DEFAULT_WIDGETS_NUMBER === 0 ? [tw] : []),
        ...remainsWidget
      ];
    }
    const remainsWidget =
      position === feedDataObject.count - 1 ? _widgets.filter((w) => w.position >= feedDataObject.count && w.column === 'left') : [];
    return [
      ..._widgets.filter((w) => w.position === position && w.column === 'left'),
      ...(advEnabled && position > 0 && position % DEFAULT_WIDGETS_NUMBER === 0 ? [tw] : []),
      ...remainsWidget
    ];
  };

  /**
   * Compute Widgets for the right column
   */
  const _getRightColumnWidgets: SCFeedWidgetType[] = () => {
    if (oneColLayout) {
      return [];
    }
    return _widgets.filter((w) => w.column === 'right');
  };

  // STATE
  const [feedDataLeft, setFeedDataLeft] = useState([]);
  const [feedDataRight, setFeedDataRight] = useState([]);
  const [headData, setHeadData] = useState([]);

  /**
   * Get left column data
   * @param data
   */
  const _getFeedDataLeft = (data, currentOffset, total) => {
    let result = [];
    if (total < limit) {
      result = _getLeftColumnWidgets();
    } else {
      data.forEach((e, i) => {
        result = result.concat([..._getLeftColumnWidgets(i + currentOffset), ...[e]]);
      });
    }
    return result;
  };

  /**
   * Get right column data
   */
  const _getFeedDataRight = () => {
    return _getRightColumnWidgets();
  };

  // REFS
  const refreshSubscription = useRef(null);
  const virtualScrollerMountState = useRef(false);

  // VIRTUAL SCROLL HELPERS
  const getScrollItemId = useMemo(
    () =>
      (item: any): string =>
        item.type === 'widget' ? `${WIDGET_PREFIX_KEY}${item.id}` : `${item.type}_${itemIdGenerator(item)}`,
    []
  );

  /**
   * Callback on scroll mount
   */
  const onScrollerMount = useMemo(
    () => () => {
      virtualScrollerMountState.current = true;
    },
    []
  );

  /**
   * Callback on refresh
   */
  const refresh = () => {
    feedDataObject.reload();
  };

  /**
   * Callback subscribe events
   * @param msg
   * @param data
   */
  const subscriber = (msg, data) => {
    if (data.refresh) {
      refresh();
    }
  };

  /**
   * Render InlineComposer if need
   */
  const renderHeaderComponent = () => {
    return (
      <>
        {virtualScrollerMountState.current && HeaderComponent}
        {headData.map((item) => {
          const _itemId = `item_${itemIdGenerator(item)}`;
          return <ItemComponent id={_itemId} key={_itemId} {...itemPropsGenerator(scUserContext.user, item)} {...ItemProps} sx={{width: '100%'}} />;
        })}
      </>
    );
  };

  /**
   * Bootstrap initial data
   */
  const _initFeedData = useMemo(
    () => () => {
      if ((cacheStrategy === CacheStrategies.CACHE_FIRST || prefetchedData) && feedDataObject.componentLoaded) {
        // Set current cached feed or prefetched data
        setFeedDataLeft(_getFeedDataLeft(feedDataObject.results, feedDataObject.initialOffset, feedDataObject.count));
      } else {
        // Load next page
        feedDataObject.getNextPage();
      }
      setFeedDataRight(_getFeedDataRight());
    },
    [cacheStrategy, feedDataObject, endpointQueryParams]
  );

  // EFFECTS
  useEffect(() => {
    if (requireAuthentication && authUserId !== null) {
      _initFeedData();
    }
  }, [authUserId]);

  useEffect(() => {
    if (!requireAuthentication) {
      _initFeedData();
    }
  }, []);

  useEffect(() => {
    refreshSubscription.current = PubSub.subscribe(id, subscriber);
    return () => {
      PubSub.unsubscribe(refreshSubscription.current);
    };
  }, []);

  /**
   *
   */
  const removeHeadDuplicatedData = (itemIds) => {
    setHeadData(headData.filter((item) => !itemIds.includes(itemIdGenerator(item))));
  };

  // EXPOSED METHODS
  useImperativeHandle(ref, () => ({
    addFeedData: (data: any, syncPagination: boolean) => {
      // Use headData to save new items in the head of the feed list
      // In this way, the state of the feed (virtualScroller/cache) remains consistent
      setHeadData([...[data], ...headData]);
      if (syncPagination) {
        // Adding an element, re-sync next and previous of feedDataObject
        const nextOffset = parseInt(getQueryStringParameter(feedDataObject.next, 'offset') || feedDataObject.results.length - 1) + 1;
        const previousOffset = parseInt(getQueryStringParameter(feedDataObject.previous, 'offset') || offset) + 1;
        feedDataObject.updateState({
          previous: updateQueryStringParameter(feedDataObject.previous, 'offset', previousOffset),
          next: updateQueryStringParameter(feedDataObject.next, 'offset', nextOffset)
        });
      }
    },
    refresh: () => {
      refresh();
    }
  }));

  const InnerItem = useMemo(
    () =>
      ({state: savedState, onHeightChange, onStateChange, children: item}) => {
        return (
          <VirtualScrollChild virtualScrollerMountState onHeightChange={onHeightChange}>
            {item.type === 'widget' ? (
              <item.component
                id={`${WIDGET_PREFIX_KEY}${item.position}`}
                {...item.componentProps}
                {...(item.publishEvents && {publicationChannel: id})}></item.component>
            ) : (
              <ItemComponent
                id={`item_${itemIdGenerator(item)}`}
                {...itemPropsGenerator(scUserContext.user, item)}
                {...ItemProps}
                sx={{width: '100%'}}
                onChangeLayout={onStateChange}
                {...savedState}
              />
            )}
          </VirtualScrollChild>
        );
      },
    []
  );

  if (feedDataObject.isLoadingNext && !feedDataLeft.length) {
    return (
      <FeedSkeleton>
        {[...Array(3)].map((v, i) => (
          <ItemSkeleton key={i} {...ItemSkeletonProps} />
        ))}
      </FeedSkeleton>
    );
  }

  return (
    <Root container spacing={2} id={id} className={classNames(classes.root, className)}>
      <Grid item xs={12} md={7}>
        <div className={classes.left} style={{overflow: 'visible'}}>
          <InfiniteScroll
            className={classes.left}
            dataLength={feedDataLeft.length}
            next={feedDataObject.getNextPage}
            hasMore={Boolean(feedDataObject.next)}
            loader={<ItemSkeleton {...ItemSkeletonProps} />}
            scrollThreshold={1}
            endMessage={
              <>
                <Widget className={classes.end}>
                  <CardContent>{endMessage}</CardContent>
                </Widget>
                {FooterComponent ? <FooterComponent {...FooterComponentProps} /> : null}
              </>
            }
            refreshFunction={refresh}
            pullDownToRefresh
            pullDownToRefreshThreshold={1000}
            pullDownToRefreshContent={null}
            releaseToRefreshContent={
              <Widget variant="outlined" className={classes.refresh}>
                <CardContent>{refreshMessage}</CardContent>
              </Widget>
            }
            style={{overflow: 'visible'}}>
            {renderHeaderComponent()}
            <VirtualizedScroller
              items={feedDataLeft}
              itemComponent={InnerItem}
              onMount={onScrollerMount}
              getItemId={getScrollItemId}
              preserveScrollPosition
              preserveScrollPositionOnPrependItems
              cacheScrollStateKey={SCCache.getVirtualizedScrollStateCacheKey(id)}
              cacheScrollerPositionKey={SCCache.getFeedSPCacheKey(id)}
              cacheStrategy={cacheStrategy}
            />
          </InfiniteScroll>
        </div>
      </Grid>
      {feedDataRight.length > 0 && (
        <Hidden smDown>
          <Grid item xs={12} md={5}>
            <Sticky enabled className={classes.right} {...FeedSidebarProps}>
              <React.Suspense fallback={<GenericSkeleton />}>
                {feedDataRight.map((d, i) => (
                  <d.component key={i} {...d.componentProps}></d.component>
                ))}
              </React.Suspense>
            </Sticky>
          </Grid>
        </Hidden>
      )}
    </Root>
  );
};

export default forwardRef(Feed);
