import React, {useEffect, useMemo, useReducer, useState} from 'react';
import {styled} from '@mui/material/styles';
import List from '@mui/material/List';
import {Button, CardContent, ListItem, Typography, useMediaQuery, useTheme} from '@mui/material';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {
  SCCache,
  SCPreferences,
  SCPreferencesContextType,
  SCThemeType,
  SCUserContextType,
  useSCFetchFeedObject,
  useSCPreferences,
  useSCUser
} from '@selfcommunity/react-core';

import FeedObject, {FeedObjectProps, FeedObjectSkeleton} from '../FeedObject';
import {FormattedMessage} from 'react-intl';
import {SCFeedObjectTemplateType} from '../../types/feedObject';
import CustomAdv from '../CustomAdv';
import classNames from 'classnames';
import BaseDialog, {BaseDialogProps} from '../../shared/BaseDialog';
import InfiniteScroll from '../../shared/InfiniteScroll';
import Widget, {WidgetProps} from '../Widget';
import {useThemeProps} from '@mui/system';
import {http, Endpoints, FeedObjectService, SCPaginatedResponse} from '@selfcommunity/api-services';
import {CacheStrategies, Logger} from '@selfcommunity/utils';
import {SCContributionType, SCCustomAdvPosition, SCFeedObjectType} from '@selfcommunity/types';
import HiddenPlaceholder from '../../shared/HiddenPlaceholder';
import {VirtualScrollerItemProps} from '../../types/virtualScroller';
import {actionWidgetTypes, dataWidgetReducer, stateWidgetInitializer} from '../../utils/widget';
import {AxiosResponse} from 'axios';
import Skeleton from './Skeleton';

const PREFIX = 'SCRelatedFeedObjectsWidget';

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

export interface RelatedFeedObjectWidgetProps extends VirtualScrollerItemProps, WidgetProps {
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

const PREFERENCES = [
  SCPreferences.ADVERTISING_CUSTOM_ADV_ENABLED,
  SCPreferences.ADVERTISING_CUSTOM_ADV_ONLY_FOR_ANONYMOUS_USERS_ENABLED,
  SCPreferences.CONFIGURATIONS_CONTENT_AVAILABILITY
];
/**
 *> API documentation for the Community-JS Related FeedObjects component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {RelatedFeedObjectsWidget} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCRelatedFeedObjectsWidget` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCCategoryTrendingFeedWidget-root|Styles applied to the root element.|
 |title|.SCCategoryTrendingFeedWidget-title|Styles applied to the title element.|
 |noResults|.SCCategoryTrendingFeedWidget-no-results|Styles applied to no results section.|
 |followersItem|.SCCategoryTrendingFeedWidget-followers-item|Styles applied to follower item element.|
 |showMore|.SCCategoryTrendingFeedWidget-show-more|Styles applied to show more button element.|

 *
 * @param inProps
 */
export default function RelatedFeedObjectWidget(inProps: RelatedFeedObjectWidgetProps): JSX.Element {
  // PROPS
  const props: RelatedFeedObjectWidgetProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {
    feedObject,
    feedObjectId,
    feedObjectType,
    template = SCFeedObjectTemplateType.SNIPPET,
    className = null,
    autoHide = null,
    limit = 5,
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
      cacheKey: SCCache.getWidgetStateCacheKey(SCCache.RELATED_FEED_TOOLS_STATE_CACHE_PREFIX_KEY, feedObjectId),
      cacheStrategy,
      visibleItems: limit
    },
    stateWidgetInitializer
  );
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  // CONTEXT
  const scUserContext: SCUserContextType = useSCUser();
  const scPreferences: SCPreferencesContextType = useSCPreferences();

  // HOOKS
  const {obj} = useSCFetchFeedObject({id: feedObjectId, feedObject, feedObjectType});
  const theme = useTheme<SCThemeType>();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const objId = obj ? obj.id : null;

  // MEMO
  const preferences = useMemo(() => {
    const _preferences = {};
    PREFERENCES.map((p) => (_preferences[p] = p in scPreferences.preferences ? scPreferences.preferences[p].value : null));
    return _preferences;
  }, [scPreferences.preferences]);

  /**
   * Initialize component
   * Fetch data only if the component is not initialized and it is not loading data
   */
  const _initComponent = useMemo(
    () => (): void => {
      if (!state.initialized && !state.isLoadingNext) {
        dispatch({type: actionWidgetTypes.LOADING_NEXT});
        FeedObjectService.relatedFeedObjects(obj.type, obj.id, {limit})
          .then((payload: SCPaginatedResponse<SCFeedObjectType>) => {
            dispatch({type: actionWidgetTypes.LOAD_NEXT_SUCCESS, payload: {...payload, initialized: true}});
          })
          .catch((error) => {
            dispatch({type: actionWidgetTypes.LOAD_NEXT_FAILURE, payload: {errorLoadNext: error}});
            Logger.error(SCOPE_SC_UI, error);
          });
      }
    },
    [objId, state.initialized, state.isLoadingNext, limit, dispatch]
  );

  // EFFECTS
  useEffect(() => {
    let _t: string | number | NodeJS.Timeout;
    if (
      scUserContext.user !== undefined &&
      objId &&
      preferences &&
      (preferences[SCPreferences.CONFIGURATIONS_CONTENT_AVAILABILITY] ||
        (!preferences[SCPreferences.CONFIGURATIONS_CONTENT_AVAILABILITY] && scUserContext.user?.id))
    ) {
      _t = setTimeout(_initComponent);
      return (): void => {
        _t && clearTimeout(_t);
      };
    }
  }, [objId, scUserContext.user, preferences]);

  // Add 10 - limit items to initial dialog page
  useEffect(() => {
    if (openDialog && state.next && state.results.length === limit && state.initialized) {
      dispatch({type: actionWidgetTypes.LOADING_NEXT});
      FeedObjectService.relatedFeedObjects(obj.type, obj.id, {offset: limit, limit: 10})
        .then((payload: SCPaginatedResponse<SCFeedObjectType>) => {
          dispatch({type: actionWidgetTypes.LOAD_NEXT_SUCCESS, payload: payload});
        })
        .catch((error) => {
          dispatch({type: actionWidgetTypes.LOAD_NEXT_FAILURE, payload: {errorLoadNext: error}});
          Logger.error(SCOPE_SC_UI, error);
        });
    }
  }, [openDialog, limit, state.next, state.initialized, state.results.length, obj]);

  /**
   * Virtual feed update
   */
  useEffect(() => {
    onHeightChange && onHeightChange();
  }, [state.results]);

  useEffect(() => {
    if (!preferences[SCPreferences.CONFIGURATIONS_CONTENT_AVAILABILITY] && !scUserContext.user) {
      return;
    } else if (obj?.id !== null && cacheStrategy === CacheStrategies.NETWORK_ONLY) {
      onStateChange && onStateChange({cacheStrategy: CacheStrategies.CACHE_FIRST});
    }
  }, [obj?.id, preferences, cacheStrategy, scUserContext.user]);

  // HANDLERS
  const handleNext = useMemo(
    () => (): void => {
      dispatch({type: actionWidgetTypes.LOADING_NEXT});
      http
        .request({
          url: state.next,
          method: Endpoints.RelatedFeedObjects.method
        })
        .then((res: AxiosResponse<SCPaginatedResponse<SCFeedObjectType>>) => {
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
  if ((!preferences[SCPreferences.CONFIGURATIONS_CONTENT_AVAILABILITY] && !scUserContext.user) || (autoHide && !state.count && state.initialized)) {
    return <HiddenPlaceholder />;
  }
  if (!state.initialized) {
    return <Skeleton />;
  }
  const renderAdvertising = (): JSX.Element | null => {
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
  };
  const advPosition = Math.floor(Math.random() * (Math.min(state.count, 5) - 1 + 1) + 1);

  const content = (
    <CardContent>
      <Typography className={classes.title} variant="h5">
        <FormattedMessage id="ui.relatedFeedObjectsWidget.title" defaultMessage="ui.relatedFeedObjectsWidget.title" />
      </Typography>
      {!state.count ? (
        <Typography className={classes.noResults} variant="body2">
          <FormattedMessage id="ui.relatedFeedObjectsWidget.noResults" defaultMessage="ui.relatedFeedObjectsWidget.noResults" />
        </Typography>
      ) : (
        <React.Fragment>
          <List>
            {state.results.slice(0, state.visibleItems).map((obj: SCFeedObjectType, index) => (
              <React.Fragment key={index}>
                <ListItem key={obj.id}>
                  <FeedObject elevation={0} feedObject={obj} template={template} {...FeedObjectProps} />
                </ListItem>
                {advPosition === index && renderAdvertising()}
              </React.Fragment>
            ))}
          </List>
          {state.count > state.visibleItems && (
            <Button className={classes.showMore} onClick={handleToggleDialogOpen}>
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
                  <FeedObject elevation={0} feedObject={obj} {...FeedObjectProps} />
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
