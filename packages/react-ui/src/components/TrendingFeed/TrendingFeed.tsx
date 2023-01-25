import React, {useContext, useEffect, useMemo, useReducer, useState} from 'react';
import {styled} from '@mui/material/styles';
import List from '@mui/material/List';
import {Button, CardContent, ListItem, Typography} from '@mui/material';
import Widget from '../Widget';
import {SCFeedObjectType} from '@selfcommunity/types';
import {http, Endpoints, HttpResponse} from '@selfcommunity/api-services';
import {CacheStrategies, Logger} from '@selfcommunity/utils';
import {SCOPE_SC_UI} from '../../constants/Errors';
import FeedObject from '../FeedObject';
import {FormattedMessage} from 'react-intl';
import {SCFeedObjectTemplateType} from '../../types/feedObject';
import classNames from 'classnames';
import BaseDialog from '../../shared/BaseDialog';
import CentralProgress from '../../shared/CentralProgress';
import InfiniteScroll from '../../shared/InfiniteScroll';
import Skeleton from './Skeleton';
import {useThemeProps} from '@mui/system';
import HiddenPlaceholder from '../../shared/HiddenPlaceholder';
import {
  SCCache,
  SCPreferences,
  SCPreferencesContext,
  SCPreferencesContextType,
  SCUserContext,
  SCUserContextType,
  useIsComponentMountedRef
} from '@selfcommunity/react-core';
import {VirtualScrollerItemProps} from '../../types/virtualScroller';
import {actionToolsTypes, dataToolsReducer, stateToolsInitializer} from '../../utils/tools';

const PREFIX = 'SCTrendingFeed';

const classes = {
  root: `${PREFIX}-root`,
  title: `${PREFIX}-title`,
  noResults: `${PREFIX}-no-results`,
  trendingItem: `${PREFIX}-trending-item`,
  showMore: `${PREFIX}-show-more`
};

const Root = styled(Widget, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  marginBottom: theme.spacing(2),
  [`& .${classes.trendingItem}`]: {
    marginBottom: 0
  }
}));
export interface TrendingFeedProps extends VirtualScrollerItemProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
  /**
   * Id of category
   * @default null
   */
  categoryId?: number;
  /**
   * Feed Object template type
   * @default 'preview'
   */
  template?: SCFeedObjectTemplateType;
  /**
   * Hides this component
   * @default false
   */
  autoHide?: boolean;
  /**
   * Shows results in a page instead of in a dialog card
   * @default null
   */
  pageUrl?: () => void;
  /**
   * Caching strategies
   * @default CacheStrategies.CACHE_FIRST
   */
  cacheStrategy?: CacheStrategies;
  /**
   * Any other properties
   */
  [p: string]: any;
}

/**
 * > API documentation for the Community-JS Trending Feed component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {TrendingFeed} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCTrendingFeed` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCTrendingFeed-root|Styles applied to the root element.|
 |title|.SCTrendingFeed-title|Styles applied to the title element.|
 |noResults|.SCTrendingFeed-no-results|Styles applied to no results section.|
 |trendingItem|.SCTrendingFeed-trending-item|Styles applied to the trending feed item element.|
 |showMore|.SCTrendingFeed-show-more|Styles applied to show more button element.|

 * @param inProps
 */
export default function TrendingFeed(inProps: TrendingFeedProps): JSX.Element {
  //CONST
  const limit = 4;

  // PROPS
  const props: TrendingFeedProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });

  const {
    className = null,
    categoryId = null,
    template = SCFeedObjectTemplateType.SNIPPET,
    autoHide = null,
    cacheStrategy = CacheStrategies.NETWORK_ONLY,
    onHeightChange,
    onStateChange,
    pageUrl = null,
    ...rest
  } = props;

  // REFS
  const isMountedRef = useIsComponentMountedRef();
  // CONTEXT
  const scUserContext: SCUserContextType = useContext(SCUserContext);
  const scPreferencesContext: SCPreferencesContextType = useContext(SCPreferencesContext);
  const contentAvailability =
    SCPreferences.CONFIGURATIONS_CONTENT_AVAILABILITY in scPreferencesContext.preferences &&
    scPreferencesContext.preferences[SCPreferences.CONFIGURATIONS_CONTENT_AVAILABILITY].value;
  // STATE
  const [state, dispatch] = useReducer(
    dataToolsReducer,
    {
      isLoadingNext: true,
      next: `${Endpoints.CategoryTrendingFeed.url({id: categoryId})}?limit=10`,
      cacheKey: SCCache.getToolsStateCacheKey(SCCache.TRENDING_FEED_TOOLS_STATE_CACHE_PREFIX_KEY, categoryId),
      cacheStrategy
    },
    stateToolsInitializer
  );
  const [openTrendingPostDialog, setOpenTrendingPostDialog] = useState<boolean>(false);
  // CONST
  const authUserId = scUserContext.user ? scUserContext.user.id : null;
  /**
   * Fetches a list of trending posts
   */
  const fetchTrendingPost = useMemo(
    () => () => {
      return http.request({
        url: state.next,
        method: Endpoints.CategoryTrendingFeed.method
      });
    },
    [dispatch, state.next, state.isLoadingNext]
  );

  const handleDialogOpening = () => {
    setOpenTrendingPostDialog(true);
  };

  useEffect(() => {
    if (!contentAvailability && !authUserId) {
      return;
    } else if (cacheStrategy === CacheStrategies.NETWORK_ONLY) {
      onStateChange && onStateChange({cacheStrategy: CacheStrategies.CACHE_FIRST});
    }
  }, [authUserId]);

  /**
   * On mount, fetches trending posts list
   */
  useEffect(() => {
    let ignore = false;
    if (state.next) {
      fetchTrendingPost()
        .then((res: HttpResponse<any>) => {
          if (res.status < 300 && isMountedRef.current && !ignore) {
            const data = res.data;
            dispatch({
              type: actionToolsTypes.LOAD_NEXT_SUCCESS,
              payload: {
                results: data.results,
                count: data.count,
                next: data.next
              }
            });
          }
        })
        .catch((error) => {
          dispatch({type: actionToolsTypes.LOAD_NEXT_FAILURE, payload: {errorLoadNext: error}});
          Logger.error(SCOPE_SC_UI, error);
        });
      return () => {
        ignore = true;
      };
    }
  }, [state.next]);

  /**
   * Renders the list
   */
  if (state.isLoadingNext) {
    return <Skeleton />;
  }
  const f = (
    <CardContent>
      <Typography className={classes.title} variant="h5">
        <FormattedMessage id="ui.trendingFeed.title" defaultMessage="ui.trendingFeed.title" />
      </Typography>
      {!state.count ? (
        <Typography className={classes.noResults} variant="body2">
          <FormattedMessage id="ui.trendingFeed.noResults" defaultMessage="ui.trendingFeed.noResults" />
        </Typography>
      ) : (
        <React.Fragment>
          <List>
            {state.results.slice(0, limit).map((obj: SCFeedObjectType, index) => (
              <ListItem key={index}>
                <FeedObject elevation={0} feedObject={obj[obj.type]} template={template} className={classes.trendingItem} />
              </ListItem>
            ))}
          </List>
          {limit < state.count && (
            <Button className={classes.showMore} onClick={pageUrl ?? handleDialogOpening}>
              <FormattedMessage id="ui.trendingFeed.button.showMore" defaultMessage="ui.trendingFeed.button.showMore" />
            </Button>
          )}
        </React.Fragment>
      )}
      {openTrendingPostDialog && (
        <BaseDialog
          title={<FormattedMessage id="ui.trendingFeed.title" defaultMessage="ui.trendingFeed.title" />}
          onClose={() => setOpenTrendingPostDialog(false)}
          open={openTrendingPostDialog}>
          {state.isLoadingNext ? (
            <CentralProgress size={50} />
          ) : (
            <InfiniteScroll
              dataLength={state.results.length}
              next={fetchTrendingPost}
              hasMoreNext={Boolean(state.next)}
              loaderNext={<CentralProgress size={30} />}
              height={400}
              endMessage={
                <p style={{textAlign: 'center'}}>
                  <b>
                    <FormattedMessage id="ui.trendingFeed.noMoreResults" defaultMessage="ui.trendingFeed.noMoreResults" />
                  </b>
                </p>
              }>
              <List>
                {state.results.map((obj: SCFeedObjectType, index) => (
                  <ListItem key={index}>
                    <FeedObject elevation={0} feedObject={obj[obj.type]} template={template} className={classes.trendingItem} />
                  </ListItem>
                ))}
              </List>
            </InfiniteScroll>
          )}
        </BaseDialog>
      )}
    </CardContent>
  );

  /**
   * If content availability community option is false and user is anonymous, component is hidden.
   */
  if (!contentAvailability && !scUserContext.user) {
    return <HiddenPlaceholder />;
  }
  /**
   * Renders root object (if results and autoHide prop is set to false, otherwise component is hidden)
   */
  if (autoHide && !state.count) {
    return <HiddenPlaceholder />;
  }
  return (
    <Root className={classNames(classes.root, className)} {...rest}>
      {f}
    </Root>
  );
}
