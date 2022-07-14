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
import {SCCustomAdvPosition, SCUserType} from '@selfcommunity/types';
import {EndpointType} from '@selfcommunity/api-services';
import {CacheStrategies} from '@selfcommunity/utils';
import classNames from 'classnames';
import PubSub from 'pubsub-js';
import {useThemeProps} from '@mui/system';
import Widget from '../Widget';
import InfiniteScroll from 'react-infinite-scroll-component';
import VirtualizedScroller, {VirtualScrollChild} from '../../shared/VirtualizedScroller';
import {widgetReducer, widgetSort} from '../../utils/feed';
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
    cacheStrategy = CacheStrategies.NETWORK_ONLY
  } = props;

  // CONTEXT
  const scPreferences: SCPreferencesContextType = useSCPreferences();
  const scUserContext: SCUserContextType = useContext(SCUserContext);

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
  const _widgets: SCFeedWidgetType[] = useMemo(
    () =>
      (offset = 0) => {
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
            ...Array.from({length: offset / DEFAULT_WIDGETS_NUMBER + 1}, (_, i) => i * DEFAULT_WIDGETS_NUMBER).map((position): SCFeedWidgetType => {
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
      },
    [widgets, preferences]
  );

  // CONST
  const authUserId = scUserContext.user ? scUserContext.user.id : null;
  const limit = useMemo(() => endpointQueryParams.limit || DEFAULT_PAGINATION_ITEMS_NUMBER, [endpointQueryParams]);

  // Define offset based on initial offset
  const offset = useMemo(
    () => (endpointQueryParams.offset > 0 ? Math.max(endpointQueryParams.offset - _widgets(endpointQueryParams.offset).length, 0) : 0),
    [endpointQueryParams]
  );

  // RENDER
  const theme: Theme = useTheme();
  const oneColLayout = useMediaQuery(theme.breakpoints.down('md'));

  // STATE
  const [feedDataLeft, setFeedDataLeft] = useState([]);
  const [feedDataRight, setFeedDataRight] = useState([]);

  /**
   * Callback onNextPage
   * @param page
   * @param offset
   * @param total
   * @param data
   */
  const onNextPage = (page, offset, total, data) => {
    setFeedDataLeft((prev) => prev.concat(_getFeedDataLeft(data)));
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
    setFeedDataLeft((prev) => _getFeedDataLeft(data).concat(prev));
    onPreviousData && onPreviousData(page, offset, total, data);
  };

  // PAGINATION FEED
  const feedDataObject = useSCFetchFeed({
    id,
    endpoint,
    endpointQueryParams: {...endpointQueryParams, ...{offset}},
    onNextPage: onNextPage,
    onPreviousPage: onPreviousPage,
    cacheStrategy
  });

  /**
   * Get left column data
   * @param data
   */
  const _getFeedDataLeft = (data) => {
    // if load initial data from cache take into account how much widgets should be included
    const _currentFeedLength =
      data.length + (data.length <= limit ? feedDataLeft.length : Math.ceil(data.length / DEFAULT_WIDGETS_NUMBER)) + endpointQueryParams.offset;
    if (oneColLayout) {
      return _widgets(_currentFeedLength)
        .map((w, i) =>
          Object.assign({}, w, {position: w.position * (w.column === 'right' ? 5 : 1) - feedDataLeft.length - endpointQueryParams.offset, id: i})
        )
        .filter((w) => w.position > -1)
        .sort(widgetSort)
        .reduce(widgetReducer(feedDataLeft.total, limit), [...data]);
    }
    return _widgets(_currentFeedLength)
      .map((w, i) => Object.assign({}, w, {position: w.position - feedDataLeft.length - endpointQueryParams.offset, id: i}))
      .filter((w) => w.column === 'left' && w.position > -1)
      .sort(widgetSort)
      .reduce(widgetReducer(feedDataLeft.total, limit), [...data]);
  };

  /**
   * Get right column data
   */
  const _getFeedDataRight = () => {
    if (oneColLayout) {
      return [];
    }
    return _widgets()
      .filter((w) => w.column === 'right')
      .sort(widgetSort);
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
    return <>{virtualScrollerMountState.current && HeaderComponent}</>;
  };

  /**
   * Bootstrap initial data
   */
  const _initFeedData = useMemo(
    () => () => {
      if (cacheStrategy === CacheStrategies.CACHE_FIRST && feedDataObject.componentLoaded) {
        // Set current cached feed
        setFeedDataLeft(_getFeedDataLeft(feedDataObject.feedData));
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

  // EXPOSED METHODS
  useImperativeHandle(ref, () => ({
    addFeedData: (data: any) => {
      setFeedDataLeft([...[data], ...feedDataLeft]);
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
