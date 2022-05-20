import React, {forwardRef, ForwardRefRenderFunction, ReactNode, useContext, useEffect, useImperativeHandle, useMemo, useRef, useState} from 'react';
import {styled, useTheme} from '@mui/material/styles';
import {CardContent, Grid, Hidden, Theme, useMediaQuery} from '@mui/material';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {FormattedMessage} from 'react-intl';
import {GenericSkeleton} from '../Skeleton';
import {SCFeedWidgetType} from '../../types/feed';
import Sticky from 'react-stickynode';
import CustomAdv, {CustomAdvProps} from '../CustomAdv';
import {SCUserType, SCCustomAdvPosition, SCFeedUnitType, SCNotificationAggregatedType} from '@selfcommunity/types';
import {http, EndpointType, HttpResponse} from '@selfcommunity/api-services';
import {Logger} from '@selfcommunity/utils';
import {SCPreferences, SCPreferencesContextType, SCUserContext, SCUserContextType, useSCPreferences} from '@selfcommunity/react-core';
import classNames from 'classnames';
import PubSub from 'pubsub-js';
import useThemeProps from '@mui/material/styles/useThemeProps';
import {appendURLSearchParams} from '@selfcommunity/utils';
import {Virtuoso} from 'react-virtuoso';
import Widget from '../Widget';

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
  endpointQueryParams?: Record<string, string | number>[];

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

interface FeedData {
  left: Array<SCFeedWidgetType | SCFeedUnitType>;
  right: Array<SCFeedWidgetType>;
}

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
const LOADING = 1;
const LOADED = 2;

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
    endpointQueryParams = [{limit: 10}],
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
    CustomAdvProps = {}
  } = props;

  // STATE
  const [feedData, setFeedData] = useState([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [next, setNext] = useState<string>(appendURLSearchParams(endpoint.url({}), endpointQueryParams));

  // CONTEXT
  const scPreferences: SCPreferencesContextType = useSCPreferences();
  const scUserContext: SCUserContextType = useContext(SCUserContext);

  // CONST
  const authUserId = scUserContext.user ? scUserContext.user.id : null;

  // REFS
  const refreshSubscription = useRef(null);

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
        ...Array.from({length: feedData.length / 10}, (_, i) => i * 10).map((position): SCFeedWidgetType => {
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
  }, [widgets, feedData, preferences]);

  /**
   * Fetch main feed
   * Manage pagination, infinite scrolling
   */
  const fetch = () => {
    if (!loading) {
      setLoading(true);
      return http
        .request({
          url: next,
          method: endpoint.method
        })
        .then((res: HttpResponse<{next?: string; previous?: string; results: SCNotificationAggregatedType[]}>) => {
          const data = res.data;
          setFeedData([...feedData, ...data.results]);
          setNext(data.next);
          setLoading(false);
          onFetchData && onFetchData(res.data);
        })
        .catch((error) => {
          Logger.error(SCOPE_SC_UI, error);
        });
    }
  };

  const refresh = () => {
    setNext(endpoint.url({}));
    setFeedData([]);
    fetch();
  };

  const subscriber = (msg, data) => {
    if (data.refresh) {
      refresh();
    }
  };

  // EFFECTS
  useEffect(() => {
    fetch();
  }, [authUserId]);

  useEffect(() => {
    refreshSubscription.current = PubSub.subscribe(id, subscriber);
    return () => {
      PubSub.unsubscribe(refreshSubscription.current);
    };
  }, []);

  // EXPOSED METHODS
  useImperativeHandle(ref, () => ({
    addFeedData: (data: any) => {
      setFeedData([data, ...feedData]);
    }
  }));

  // RENDER
  const theme: Theme = useTheme();
  const oneColLayout = useMediaQuery(theme.breakpoints.down('md'));

  const getData = useMemo(
    () => (): FeedData => {
      const widgetSort = (w1, w2) => (w1.position > w2.position ? 1 : -1);
      const widgetReducer = (value, w) => {
        value.splice(w.position, 0, w);
        return value;
      };
      if (oneColLayout) {
        return {
          left: _widgets
            .map((w) => Object.assign({}, w, {position: w.position * (w.column === 'right' ? 5 : 1)}))
            .sort(widgetSort)
            .reduce(widgetReducer, feedData),
          right: []
        };
      } else {
        return {
          left: _widgets
            .filter((w) => w.column === 'left')
            .sort(widgetSort)
            .reduce(widgetReducer, feedData),
          right: _widgets.filter((w) => w.column === 'right').sort(widgetSort)
        };
      }
    },
    [loading, oneColLayout, feedData, _widgets]
  );

  const data = getData();

  const InnerItem = React.memo(({index, d}) => {
    return (
      <>
        {d.type === 'widget' ? (
          <d.component key={`widget_left_${index}`} {...d.componentProps} {...(d.publishEvents && {publicationChannel: id})}></d.component>
        ) : (
          <ItemComponent key={`item_${itemIdGenerator(d)}`} {...itemPropsGenerator(scUserContext.user, d)} {...ItemProps} sx={{width: '100%'}} />
        )}
      </>
    );
  });

  const itemContent = (i, d) => {
    return <InnerItem index={i} d={d} />;
  };

  return (
    <Root container spacing={2} id={id} className={classNames(classes.root, className)}>
      <Grid item xs={12} md={7}>
        <div className={classes.left} style={{overflow: 'visible'}}>
          <Virtuoso
            useWindowScroll
            totalCount={data.left.length}
            data={data.left}
            endReached={fetch}
            overscan={{main: 3000, reverse: 2000}}
            // atBottomThreshold={600}
            itemContent={itemContent}
            components={{
              Footer: () =>
                next ? (
                  <ItemSkeleton {...ItemSkeletonProps} />
                ) : (
                  <Widget className={classes.end}>
                    <CardContent>{endMessage}</CardContent>
                  </Widget>
                )
            }}
          />
        </div>
      </Grid>
      {data.right.length > 0 && (
        <Hidden smDown>
          <Grid item xs={12} md={5}>
            <Sticky enabled className={classes.right} {...FeedSidebarProps}>
              <React.Suspense fallback={<GenericSkeleton />}>
                {data.right.map((d, i) => (
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
