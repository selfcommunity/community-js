import React, {useCallback, useContext, useEffect, useMemo, useState} from 'react';
import {styled} from '@mui/material/styles';
import {Card, CardContent, Grid, Hidden, Theme, useMediaQuery} from '@mui/material';
import {
  http,
  Logger,
  SCCustomAdvPosition,
  SCFeedUnitType,
  SCNotificationAggregatedType,
  SCPreferences,
  SCPreferencesContextType,
  SCUserContext,
  SCUserContextType,
  useSCPreferences
} from '@selfcommunity/core';
import {AxiosResponse} from 'axios';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {FormattedMessage} from 'react-intl';
import {FeedObjectSkeleton, GenericSkeleton} from '../Skeleton';
import InfiniteScroll from 'react-infinite-scroll-component';
import FeedObject, {FeedObjectProps} from '../FeedObject';
import {FeedObjectTemplateType} from '../../types/feedObject';
import {EndpointType} from '@selfcommunity/core/src/constants/Endpoints';
import {SCFeedWidgetType} from '../../types/Feed';
import Sticky from 'react-stickynode';
import {useTheme} from '@mui/styles';
import {InlineComposer} from '@selfcommunity/ui';
import CustomAdv from '../CustomAdv';

const PREFIX = 'SCFeed';

const classes = {
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
  marginTop: theme.spacing(2),
  [`& .${classes.left}`]: {
    padding: '3px'
  },
  [`& .${classes.end}, & .${classes.refresh}`]: {
    textAlign: 'center'
  }
}));

export interface StickySidebarProps {
  top: string | number;
  bottomBoundary: string | number;
}

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
   * Widgets to insert into the feed
   * @default empty array
   */
  widgets?: SCFeedWidgetType[];

  /**
   * Props to spread to single feed object
   * @default empty object
   */
  FeedObjectProps?: FeedObjectProps;

  /**
   * Props to spread to single feed object
   * @default {top: 0, bottomBoundary: `#${id}`}
   */
  StickySidebarProps?: StickySidebarProps;
}

interface FeedData {
  left: Array<SCFeedWidgetType | SCFeedUnitType>;
  right: Array<SCFeedWidgetType>;
}

const PREFERENCES = [SCPreferences.ADVERTISING_CUSTOM_ADV_ENABLED, SCPreferences.ADVERTISING_CUSTOM_ADV_ONLY_FOR_ANONYMOUS_USERS_ENABLED];

export default function Feed(props: FeedProps): JSX.Element {
  // PROPS
  const {id = 'feed', className, endpoint, widgets = [], FeedObjectProps = {}, StickySidebarProps = {top: 0, bottomBoundary: `#${id}`}} = props;

  // STATE
  const [feedData, setFeedData] = useState([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [next, setNext] = useState<string>(endpoint.url({}));

  // CONTEXT
  const scPreferences: SCPreferencesContextType = useSCPreferences();
  const scAuthContext: SCUserContextType = useContext(SCUserContext);

  /*
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
      ((preferences[SCPreferences.ADVERTISING_CUSTOM_ADV_ONLY_FOR_ANONYMOUS_USERS_ENABLED] && scAuthContext.user === null) ||
        !preferences[SCPreferences.ADVERTISING_CUSTOM_ADV_ONLY_FOR_ANONYMOUS_USERS_ENABLED])
    ) {
      return [
        ...widgets,
        {
          type: 'widget',
          component: CustomAdv,
          componentProps: {
            position: SCCustomAdvPosition.POSITION_FEED_SIDEBAR
          },
          column: 'right',
          position: 0
        },
        ...Array.from({length: feedData.length / 10}, (_, i) => i * 10).map((position): SCFeedWidgetType => {
          return {
            type: 'widget',
            component: CustomAdv,
            componentProps: {
              position: SCCustomAdvPosition.POSITION_FEED
            },
            column: 'left',
            position
          };
        })
      ];
    }
    return [...widgets];
  }, [widgets, feedData, preferences]);

  console.log(_widgets);

  /**
   * Fetch main feed
   * Manage pagination, infinite scrolling
   */
  const fetch = () => {
    setLoading(true);
    http
      .request({
        url: next,
        method: endpoint.method
      })
      .then((res: AxiosResponse<{next?: string; previous?: string; results: SCNotificationAggregatedType[]}>) => {
        const data = res.data;
        setFeedData([...feedData, ...data.results]);
        setNext(data.next);
      })
      .catch((error) => {
        Logger.error(SCOPE_SC_UI, error);
      })
      .then(() => setLoading(false));
  };

  const refresh = () => {
    setNext(endpoint.url({}));
    fetch();
  };

  /**
   * On mount, fetch first page of notifications
   */
  useEffect(() => {
    fetch();
  }, []);

  // Main Loop

  const theme: Theme = useTheme();
  const oneColLayout = useMediaQuery(theme.breakpoints.down('sm'));

  const getData = useCallback((): FeedData => {
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
          .reduce(widgetReducer, [...feedData]),
        right: []
      };
    } else {
      return {
        left: _widgets
          .filter((w) => w.column === 'left')
          .sort(widgetSort)
          .reduce(widgetReducer, [...feedData]),
        right: _widgets.filter((w) => w.column === 'right').sort(widgetSort)
      };
    }
  }, [oneColLayout, feedData]);

  const data = getData();

  return (
    <Root container spacing={2} id="feed" className={className}>
      <Grid item xs={12} md={7}>
        <React.Suspense fallback={<FeedObjectSkeleton template={FeedObjectTemplateType.PREVIEW} />}>
          <InfiniteScroll
            className={classes.left}
            dataLength={data.left.length}
            next={fetch}
            hasMore={Boolean(next)}
            loader={false}
            endMessage={
              <Card variant="outlined" className={classes.end}>
                <CardContent>
                  <FormattedMessage id="ui.feed.noOtherFeedObject" defaultMessage="ui.feed.noOtherFeedObject" />{' '}
                </CardContent>
              </Card>
            }
            refreshFunction={refresh}
            pullDownToRefresh
            pullDownToRefreshThreshold={1000}
            pullDownToRefreshContent={null}
            releaseToRefreshContent={
              <Card variant="outlined" className={classes.refresh}>
                <CardContent>
                  &#8593; <FormattedMessage id="ui.feed.refreshRelease" defaultMessage="ui.feed.refreshRelease" />{' '}
                </CardContent>
              </Card>
            }>
            {data.left.map((d, i) =>
              d.type === 'widget' ? (
                <d.component key={i} {...d.componentProps}></d.component>
              ) : (
                <FeedObject
                  key={i}
                  feedObject={d[d.type]}
                  feedObjectType={d.type}
                  feedObjectActivities={d.activities ? d.activities : null}
                  {...FeedObjectProps}
                  sx={{width: '100%'}}
                />
              )
            )}
          </InfiniteScroll>
          {loading && Array.from({length: 5}).map((e, i) => <FeedObjectSkeleton key={i} template={FeedObjectTemplateType.PREVIEW} />)}
        </React.Suspense>
      </Grid>
      {data.right.length > 0 && (
        <Hidden smDown>
          <Grid item xs={12} md={5}>
            <Sticky enabled className={classes.right} {...StickySidebarProps}>
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
}
