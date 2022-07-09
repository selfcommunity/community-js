// @ts-nocheck
import React, {
  forwardRef,
  ForwardRefRenderFunction,
  ReactNode,
  useContext,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import {styled, useTheme} from '@mui/material/styles';
import {CardContent, Grid, Hidden, Theme, useMediaQuery} from '@mui/material';
import {FormattedMessage} from 'react-intl';
import {GenericSkeleton} from '../Skeleton';
import {SCFeedWidgetType} from '../../types/feed';
import Sticky from 'react-stickynode';
import CustomAdv, {CustomAdvProps} from '../CustomAdv';
import {SCCustomAdvPosition, SCFeedUnitType, SCUserType} from '@selfcommunity/types';
import {EndpointType} from '@selfcommunity/api-services';
import {CacheStrategies, LRUCache} from '@selfcommunity/utils';
import {
  SCCache,
  SCPreferences,
  SCPreferencesContextType,
  SCUserContext,
  SCUserContextType,
  useSCFetchFeed,
  useSCPreferences
} from '@selfcommunity/react-core';
import classNames from 'classnames';
import PubSub from 'pubsub-js';
import {useThemeProps} from '@mui/system';
import Widget from '../Widget';
import InfiniteScroll from 'react-infinite-scroll-component';
import VirtualScroller from 'virtual-scroller/react';
import {widgetReducer, widgetSort} from '../../utils/feed';

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
  addFeedData: (obj: any) => void;
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
   * Callback invoked whenever data is loaded during paging
   */
  onFetchData?: (data) => any;

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
}

const DEFAULT_PAGINATION_ITEMS_NUMBER = 5;
const PREFERENCES = [SCPreferences.ADVERTISING_CUSTOM_ADV_ENABLED, SCPreferences.ADVERTISING_CUSTOM_ADV_ONLY_FOR_ANONYMOUS_USERS_ENABLED];

/**
 * A wrapper component for children of
 * VirtualScroll. Computes current height and
 * update virtual scroll
 */
const VirtualScrollChild = ({virtualScrollerMountState, children, onHeightChange}) => {
  useLayoutEffect(() => {
    if (virtualScrollerMountState.current) {
      onHeightChange();
    }
  }, []);

  return <div>{children}</div>;
};

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
    widgets = [],
    ItemComponent,
    itemPropsGenerator,
    itemIdGenerator,
    ItemProps = {},
    ItemSkeleton,
    ItemSkeletonProps = {},
    onFetchData,
    FeedSidebarProps = {top: 0, bottomBoundary: `#${id}`},
    CustomAdvProps = {},
    requireAuthentication = false,
    cacheStrategy = CacheStrategies.NETWORK_ONLY
  } = props;

  // CONTEXT
  const scPreferences: SCPreferencesContextType = useSCPreferences();
  const scUserContext: SCUserContextType = useContext(SCUserContext);

  // CONST
  const authUserId = scUserContext.user ? scUserContext.user.id : null;
  const limit = useMemo(() => (endpointQueryParams.limit || DEFAULT_PAGINATION_ITEMS_NUMBER), [endpointQueryParams]);

  // RENDER
  const theme: Theme = useTheme();
  const oneColLayout = useMediaQuery(theme.breakpoints.down('md'));

  // STATE
  const feedDataObject = useSCFetchFeed({
    id,
    endpoint,
    endpointQueryParams,
    onChangePage: onFetchData,
    cacheStrategy
  });
  const [headData, setHeadData] = useState([]);
  const [feedDataLeft, setFeedDataLeft] = useState([]);
  const [feedDataRight, setFeedDataRight] = useState([]);

  /**
   * Compute preferences
   */
  const preferences = useMemo(() => {
    const _preferences = {};
    PREFERENCES.map((p) => (_preferences[p] = p in scPreferences.preferences ? scPreferences.preferences[p].value : null));
    return _preferences;
  }, [scPreferences.preferences]);

  /**
   * Compute Widgets
   */
  const _widgets: SCFeedWidgetType[] = useMemo(() => {
    if (
      preferences[SCPreferences.ADVERTISING_CUSTOM_ADV_ENABLED] &&
      ((preferences[SCPreferences.ADVERTISING_CUSTOM_ADV_ONLY_FOR_ANONYMOUS_USERS_ENABLED] && scUserContext.user === null) ||
        !preferences[SCPreferences.ADVERTISING_CUSTOM_ADV_ONLY_FOR_ANONYMOUS_USERS_ENABLED])
    ) {
      return [
        ...widgets,
        {
          type: 'widget',
          component: CustomAdv,
          componentProps: {
            position: SCCustomAdvPosition.POSITION_FEED_SIDEBAR,
            ...CustomAdvProps
          },
          column: 'right',
          position: 0
        },
        ...Array.from({length: feedDataObject.total / 10}, (_, i) => i * 10).map((position): SCFeedWidgetType => {
          return {
            type: 'widget',
            component: CustomAdv,
            componentProps: {
              position: SCCustomAdvPosition.POSITION_FEED,
              ...CustomAdvProps
            },
            column: 'left',
            position
          };
        })
      ];
    }
    return [...widgets];
  }, [widgets, feedDataObject.total, preferences]);

  const _getFeedDataLeft = () => {
    if (feedDataObject.componentLoaded) {
      if (oneColLayout) {
        return _widgets
          .map((w, i) => Object.assign({}, w, {position: w.position * (w.column === 'right' ? 5 : 1), id: `widget_${i}`}))
          .sort(widgetSort)
          .reduce(widgetReducer(feedDataObject.total, limit), [...headData, ...feedDataObject.feedData]);
      }
      return _widgets
        .filter((w) => w.column === 'left')
        .map((w, i) => Object.assign({}, w, {id: `widget_${i}`}))
        .sort(widgetSort)
        .reduce(widgetReducer(feedDataObject.total, limit), [...headData, ...feedDataObject.feedData]);
    }
    return [];
  };

  const _getFeedDataRight = () => {
    if (feedDataObject.componentLoaded) {
      if (oneColLayout) {
        return [];
      }
      return _widgets.filter((w) => w.column === 'right').sort(widgetSort);
    }
    return [];
  };

  // REFS
  const refreshSubscription = useRef(null);
  const virtualScrollerMountState = useRef(false);

  // VIRTUAL SCROLL HELPERS
  const getScrollItemId = useMemo(
    () =>
      (item: any): string =>
        item.type === 'widget' ? item.id : `${item.type}_${itemIdGenerator(item)}`,
    []
  );
  const getInitialScrollPosition = useMemo(
    () => () => cacheStrategy === CacheStrategies.CACHE_FIRST ? LRUCache.get(SCCache.getFeedSPCacheKey(id)) : 0,
    [id, cacheStrategy]
  );
  const onStateScrollChange = useMemo(
    () => (state) => {
      virtualScrollerState.current = state;
    },
    []
  );
  const onScrollPositionChange = useMemo(
    () => (y) => {
      LRUCache.set(SCCache.getFeedSPCacheKey(id), y);
    },
    [id]
  );
  const onScrollerMount = useMemo(
    () => () => {
      virtualScrollerMountState.current = true;
    },
    []
  );
  const saveVirtualScrollerState = useMemo(
    () =>
      (state): void => {
        LRUCache.set(SCCache.getFeedVirtualScrollStateFeedCacheKey(id), state);
      },
    [id]
  );
  const readVirtualScrollerState = useMemo(
    () => (): number => {
      if (cacheStrategy === CacheStrategies.CACHE_FIRST) {
        return LRUCache.get(SCCache.getFeedVirtualScrollStateFeedCacheKey(id));
      }
      return null;
    },
    [id, cacheStrategy]
  );

  const virtualScrollerState = useRef(readVirtualScrollerState());

  const refresh = () => {
    feedDataObject.reload();
  };

  const subscriber = (msg, data) => {
    if (data.refresh) {
      refresh();
    }
  };

  // EFFECTS
  useEffect(() => {
    if ((requireAuthentication && authUserId !== null) || !requireAuthentication) {
      if (cacheStrategy === CacheStrategies.CACHE_FIRST && feedDataObject.componentLoaded) {
        // Set current cached feed
        setFeedDataLeft(_getFeedDataLeft());
        setFeedDataRight(_getFeedDataRight());
      } else {
        // Load next page
        feedDataObject.getNextPage();
      }
    }
  }, [authUserId, feedDataObject.componentLoaded]);

  useEffect(() => {
    refreshSubscription.current = PubSub.subscribe(id, subscriber);
    return () => {
      PubSub.unsubscribe(refreshSubscription.current);
    };
  }, []);

  useEffect(() => {
    // On Change feed data re-calc feed virtual list
    setFeedDataLeft(_getFeedDataLeft());
    setFeedDataRight(_getFeedDataRight());
  }, [feedDataObject.feedData.length]);

  useEffect(() => {
    return () => {
      // Save `VirtualScroller` state before the page unmounts.
      saveVirtualScrollerState(virtualScrollerState.current);
    };
  });

  // EXPOSED METHODS
  useImperativeHandle(ref, () => ({
    addFeedData: (data: any) => {
      setHeadData(data);
    },
    refresh: () => {
      refresh();
    }
  }));

  const InnerItem = useMemo(
    () =>
      ({onHeightChange, children: item}) => {
        return (
          <VirtualScrollChild virtualScrollerMountState onHeightChange={onHeightChange}>
            {item.type === 'widget' ? (
              <item.component
                id={`widget_${item.position}`}
                {...item.componentProps}
                {...(item.publishEvents && {publicationChannel: id})}></item.component>
            ) : (
              <ItemComponent
                id={`item_${itemIdGenerator(item)}`}
                {...itemPropsGenerator(scUserContext.user, item)}
                {...ItemProps}
                sx={{width: '100%'}}
              />
            )}
          </VirtualScrollChild>
        );
      },
    []
  );

  return (
    <Root container spacing={2} id={id} className={classNames(classes.root, className)}>
      <Grid item xs={12} md={7}>
        <div className={classes.left} style={{overflow: 'visible'}}>
          {(feedDataObject.isLoadingNext && !feedDataLeft.length) || !feedDataLeft.length ? (
            <>
              {[...Array(3)].map((v, i) => (
                <ItemSkeleton key={i} {...ItemSkeletonProps} />
              ))}
            </>
          ) : (
            <InfiniteScroll
              className={classes.left}
              dataLength={feedDataLeft.length}
              next={feedDataObject.getNextPage}
              hasMore={Boolean(feedDataObject.next)}
              loader={<ItemSkeleton {...ItemSkeletonProps} />}
              endMessage={
                <Widget className={classes.end}>
                  <CardContent>{endMessage}</CardContent>
                </Widget>
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
              <VirtualScroller
                items={feedDataLeft}
                itemComponent={InnerItem}
                getItemId={getScrollItemId}
                initialState={readVirtualScrollerState()}
                onMount={onScrollerMount}
                preserveScrollPosition
                preserveScrollPositionOnPrependItems
                onStateChange={onStateScrollChange}
                initialScrollPosition={getInitialScrollPosition()}
                onScrollPositionChange={onScrollPositionChange}
              />
            </InfiniteScroll>
          )}
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
