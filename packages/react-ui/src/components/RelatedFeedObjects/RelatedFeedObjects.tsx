import React, {useContext, useEffect, useMemo, useReducer, useState} from 'react';
import {styled} from '@mui/material/styles';
import List from '@mui/material/List';
import {Button, CardContent, ListItem, Typography} from '@mui/material';
import TrendingFeedSkeleton from '../TrendingFeed/Skeleton';
import {SCOPE_SC_UI} from '../../constants/Errors';
import FeedObject, {FeedObjectProps} from '../FeedObject';
import {FormattedMessage} from 'react-intl';
import {SCFeedObjectTemplateType} from '../../types/feedObject';
import CustomAdv from '../CustomAdv';
import classNames from 'classnames';
import BaseDialog from '../../shared/BaseDialog';
import CentralProgress from '../../shared/CentralProgress';
import InfiniteScroll from '../../shared/InfiniteScroll';
import Widget from '../Widget';
import {useThemeProps} from '@mui/system';
import {http, Endpoints, HttpResponse} from '@selfcommunity/api-services';
import {CacheStrategies, Logger} from '@selfcommunity/utils';
import {SCContributionType, SCCustomAdvPosition, SCFeedDiscussionType, SCFeedObjectType} from '@selfcommunity/types';
import HiddenPlaceholder from '../../shared/HiddenPlaceholder';
import {
  SCCache,
  SCPreferences,
  SCPreferencesContext,
  SCPreferencesContextType,
  SCUserContextType,
  useIsComponentMountedRef,
  useSCFetchFeedObject,
  useSCPreferences,
  useSCUser
} from '@selfcommunity/react-core';
import {VirtualScrollerItemProps} from '../../types/virtualScroller';
import {actionToolsTypes, dataToolsReducer, stateToolsInitializer} from '../../utils/tools';

const PREFIX = 'SCRelatedFeedObjects';

const classes = {
  root: `${PREFIX}-root`,
  title: `${PREFIX}-title`,
  noResults: `${PREFIX}-no-results`,
  relatedItem: `${PREFIX}-related-item`,
  showMore: `${PREFIX}-show-more`
};

const Root = styled(Widget, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  maxWidth: 500,
  marginBottom: theme.spacing(2),
  [`& .${classes.relatedItem}`]: {
    marginBottom: 0
  }
}));

export interface RelatedFeedObjectsProps extends VirtualScrollerItemProps {
  /**
   * Id of the feed object
   * @default null
   */
  feedObjectId?: number;
  /**
   * Type of  feed object
   * @default 'discussion'
   */
  feedObjectType?: Exclude<SCContributionType, SCContributionType.COMMENT>;
  /**
   * Feed Object
   * @default null
   */
  feedObject?: SCFeedObjectType;
  /**
   * Feed Object template type
   * @default 'snippet'
   */
  template?: SCFeedObjectTemplateType;
  /**
   * Props to spread to single feed object
   * @default empty object
   */
  FeedObjectProps?: FeedObjectProps;
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
  /**
   * Hides this component
   * @default false
   */
  autoHide?: boolean;
  /**
   * Caching strategies
   * @default CacheStrategies.CACHE_FIRST
   */
  cacheStrategy?: CacheStrategies;
  /**
   * Other props
   */
  [p: string]: any;
}

const PREFERENCES = [SCPreferences.ADVERTISING_CUSTOM_ADV_ENABLED, SCPreferences.ADVERTISING_CUSTOM_ADV_ONLY_FOR_ANONYMOUS_USERS_ENABLED];
/**
 *> API documentation for the Community-JS Related FeedObjects component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {RelatedFeedObjects} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCRelatedFeedObjects` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCRelatedFeedObjects-root|Styles applied to the root element.|
 |title|.SCRelatedFeedObjects-title|Styles applied to the title element.|
 |no-results|.SCRelatedFeedObjects-no-results|Styles applied to no results section.|
 |relatedItem|.SCRelatedFeedObjects-related-item|Styles applied to the related item element.|
 |showMore|.SCRelatedFeedObjects-show-more|Styles applied to show more button element.|

 *
 * @param inProps
 */
export default function RelatedFeedObjects(inProps: RelatedFeedObjectsProps): JSX.Element {
  // CONST
  const limit = 4;

  // CONTEXT
  const scPreferences: SCPreferencesContextType = useSCPreferences();
  const scUserContext: SCUserContextType = useSCUser();
  const scPreferencesContext: SCPreferencesContextType = useContext(SCPreferencesContext);
  const contentAvailability =
    SCPreferences.CONFIGURATIONS_CONTENT_AVAILABILITY in scPreferencesContext.preferences &&
    scPreferencesContext.preferences[SCPreferences.CONFIGURATIONS_CONTENT_AVAILABILITY].value;

  // PROPS
  const props: RelatedFeedObjectsProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {
    feedObject,
    feedObjectId,
    feedObjectType,
    template = SCFeedObjectTemplateType.SNIPPET,
    FeedObjectProps = {},
    className,
    autoHide = true,
    cacheStrategy = CacheStrategies.NETWORK_ONLY,
    onHeightChange,
    onStateChange,
    ...rest
  } = props;
  // REFS
  const isMountedRef = useIsComponentMountedRef();
  // STATE
  const [state, dispatch] = useReducer(
    dataToolsReducer,
    {
      isLoadingNext: true,
      next: `${Endpoints.RelatedFeedObjects.url({
        type: feedObject ? feedObject.type : feedObjectType,
        id: feedObject ? feedObject.id : feedObjectId
      })}?limit=10`,
      cacheKey: SCCache.getToolsStateCacheKey(SCCache.RELATED_FEED_TOOLS_STATE_CACHE_PREFIX_KEY),
      cacheStrategy
    },
    stateToolsInitializer
  );
  const {obj, setObj} = useSCFetchFeedObject({id: feedObjectId, feedObject, feedObjectType});
  const [openRelatedFeedObjectsDialog, setOpenRelatedFeedObjectsDialog] = useState<boolean>(false);
  const objId = obj ? obj.id : null;
  const authUserId = scUserContext.user ? scUserContext.user.id : null;
  /**
   * Compute preferences
   */
  const preferences = useMemo(() => {
    const _preferences = {};
    PREFERENCES.map((p) => (_preferences[p] = p in scPreferences.preferences ? scPreferences.preferences[p].value : null));
    return _preferences;
  }, [scPreferences.preferences]);

  /**
   * Render advertising
   */
  function renderAdvertising() {
    if (
      preferences[SCPreferences.ADVERTISING_CUSTOM_ADV_ENABLED] &&
      ((preferences[SCPreferences.ADVERTISING_CUSTOM_ADV_ONLY_FOR_ANONYMOUS_USERS_ENABLED] && scUserContext.user === null) ||
        !preferences[SCPreferences.ADVERTISING_CUSTOM_ADV_ONLY_FOR_ANONYMOUS_USERS_ENABLED])
    ) {
      return (
        <ListItem>
          <CustomAdv
            position={SCCustomAdvPosition.POSITION_RELATED_POSTS_COLUMN}
            {...(obj.categories.length && {categoriesId: obj.categories.map((c) => c.id)})}
          />
        </ListItem>
      );
    }
    return null;
  }

  /**
   * Fetches related discussions list
   */
  const fetchRelated = useMemo(
    () => () => {
      if (state.next) {
        return http.request({
          url: state.next,
          method: Endpoints.RelatedFeedObjects.method
        });
      }
    },
    [dispatch, state.next, state.isLoadingNext]
  );

  useEffect(() => {
    if (!contentAvailability && !authUserId) {
      return;
    } else if (objId !== null && cacheStrategy === CacheStrategies.NETWORK_ONLY) {
      onStateChange && onStateChange({cacheStrategy: CacheStrategies.CACHE_FIRST});
    }
  }, [objId, authUserId]);

  /**
   * On mount, fetches related discussions list
   */
  useEffect(() => {
    let ignore = false;
    if (state.next) {
      fetchRelated()
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
   * Renders related discussions list
   */
  if (state.isLoadingNext) {
    return <TrendingFeedSkeleton />;
  }
  const advPosition = Math.floor(Math.random() * (Math.min(state.count, 5) - 1 + 1) + 1);
  const d = (
    <CardContent>
      <Typography className={classes.title} variant="h5">
        <FormattedMessage id="ui.relatedFeedObjects.title" defaultMessage="ui.relatedFeedObjects.title" />
      </Typography>
      {!state.count ? (
        <Typography className={classes.noResults} variant="body2">
          <FormattedMessage id="ui.relatedFeedObjects.noResults" defaultMessage="ui.relatedFeedObjects.noResults" />
        </Typography>
      ) : (
        <React.Fragment>
          <List>
            {state.results.slice(0, limit).map((obj: SCFeedDiscussionType, index) => {
              return (
                <React.Fragment key={index}>
                  <ListItem>
                    <FeedObject elevation={0} feedObject={obj} template={template} className={classes.relatedItem} {...FeedObjectProps} />
                  </ListItem>
                  {advPosition === index && renderAdvertising()}
                </React.Fragment>
              );
            })}
          </List>
          {limit < state.count && (
            <Button className={classes.showMore} onClick={() => setOpenRelatedFeedObjectsDialog(true)}>
              <FormattedMessage id="ui.relatedFeedObjects.button.showMore" defaultMessage="ui.relatedFeedObjects.button.showMore" />
            </Button>
          )}
        </React.Fragment>
      )}
      {openRelatedFeedObjectsDialog && (
        <BaseDialog
          title={<FormattedMessage id="ui.relatedFeedObjects.title" defaultMessage="ui.relatedFeedObjects.title" />}
          onClose={() => setOpenRelatedFeedObjectsDialog(false)}
          open={openRelatedFeedObjectsDialog}>
          {state.isLoadingNext ? (
            <CentralProgress size={50} />
          ) : (
            <InfiniteScroll
              dataLength={state.results.length}
              next={fetchRelated}
              hasMoreNext={Boolean(state.next)}
              loaderNext={<CentralProgress size={30} />}
              height={400}
              endMessage={
                <p style={{textAlign: 'center'}}>
                  <b>
                    <FormattedMessage id="ui.relatedFeedObjects.noMoreResults" defaultMessage="ui.relatedFeedObjects.noMoreResults" />
                  </b>
                </p>
              }>
              <List>
                {state.results.map((obj: SCFeedDiscussionType, index) => (
                  <ListItem key={index}>
                    <FeedObject elevation={0} feedObject={obj} template={template} className={classes.relatedItem} {...FeedObjectProps} />
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
      {d}
    </Root>
  );
}
