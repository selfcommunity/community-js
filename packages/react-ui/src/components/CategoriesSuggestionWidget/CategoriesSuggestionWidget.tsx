import React, {useCallback, useEffect, useMemo, useReducer, useRef, useState} from 'react';
import {styled} from '@mui/material/styles';
import {Button, CardContent, List, ListItem, Typography, useMediaQuery, useTheme} from '@mui/material';
import {Endpoints, http, SCPaginatedResponse, SuggestionService} from '@selfcommunity/api-services';
import {SCCache, SCThemeType, SCUserContextType, useSCUser} from '@selfcommunity/react-core';
import {SCCategoryType} from '@selfcommunity/types';
import Skeleton from './Skeleton';
import Category, {CategoryProps, CategorySkeleton} from '../Category';
import {FormattedMessage} from 'react-intl';
import classNames from 'classnames';
import Widget, {WidgetProps} from '../Widget';
import {useThemeProps} from '@mui/system';
import HiddenPlaceholder from '../../shared/HiddenPlaceholder';
import {VirtualScrollerItemProps} from '../../types/virtualScroller';
import {CacheStrategies, Logger} from '@selfcommunity/utils';
import {actionWidgetTypes, dataWidgetReducer, stateWidgetInitializer} from '../../utils/widget';
import BaseDialog, {BaseDialogProps} from '../../shared/BaseDialog';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {AxiosResponse} from 'axios';
import InfiniteScroll from '../../shared/InfiniteScroll';
import {PREFIX} from './constants';
import PubSub from 'pubsub-js';
import {SCCategoryEventType, SCTopicType} from '../../constants/PubSub';

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

export interface CategoriesSuggestionWidgetProps extends VirtualScrollerItemProps, WidgetProps {
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
   * Props to spread to single category object
   * @default empty object
   */
  CategoryProps?: CategoryProps;

  /**
   * Caching strategies
   * @default CacheStrategies.CACHE_FIRST
   */
  cacheStrategy?: CacheStrategies;

  /**
   * Props to spread to categories suggestion dialog
   * @default {}
   */
  DialogProps?: BaseDialogProps;

  /**
   * Other props
   */
  [p: string]: any;
}

/**
 * > API documentation for the Community-JS Categories Suggestion component. Learn about the available props and the CSS API.
 *
 *
 * This component renders a list of suggested categories.
 * Take a look at our <strong>demo</strong> component [here](/docs/sdk/community-js/react-ui/Components/CategoriesSuggestion)

 #### Import
 ```jsx
 import {CategoriesSuggestionWidget} from '@selfcommunity/react-ui';
 ```
 #### Component Name
 The name `SCCategoriesSuggestionWidget` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCCategoriesSuggestionWidget-root|Styles applied to the root element.|
 |title|.SCCategoriesSuggestionWidget-title|Styles applied to the title element.|
 |noResults|.SCCategoriesSuggestionWidget-no-results|Styles applied to no results section.|
 |showMore|.SCCategoriesSuggestionWidget-show-more|Styles applied to show more button element.|
 |dialogRoot|.SCCategoriesSuggestionWidget-dialog-root|Styles applied to the root dialog element.|
 |endMessage|.SCCategoriesSuggestionWidget-end-message|Styles applied to the end message element.|

 * @param inProps
 */
export default function CategoriesSuggestionWidget(inProps: CategoriesSuggestionWidgetProps): JSX.Element {
  // PROPS
  const props: CategoriesSuggestionWidgetProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });

  const {
    autoHide = true,
    limit = 3,
    className,
    CategoryProps = {},
    cacheStrategy = CacheStrategies.NETWORK_ONLY,
    onHeightChange,
    onStateChange,
    DialogProps = {},
    categoryId, // Removed from root DOM
    ...rest
  } = props;

  // CONTEXT
  const scUserContext: SCUserContextType = useSCUser();

  // STATE
  const [state, dispatch] = useReducer(
    dataWidgetReducer,
    {
      isLoadingNext: false,
      next: null,
      cacheKey: SCCache.getWidgetStateCacheKey(SCCache.CATEGORIES_SUGGESTION_TOOLS_STATE_CACHE_PREFIX_KEY),
      cacheStrategy,
      visibleItems: limit
    },
    stateWidgetInitializer
  );
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  // HOOKS
  const theme = useTheme<SCThemeType>();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // REFS
  const updatesSubscription = useRef(null);

  /**
   * Initialize component
   * Fetch data only if the component is not initialized and it is not loading data
   */
  const _initComponent = useMemo(
    () => (): void => {
      if (!state.initialized && !state.isLoadingNext) {
        dispatch({type: actionWidgetTypes.LOADING_NEXT});
        SuggestionService.getCategorySuggestion({limit})
          .then((payload: SCPaginatedResponse<SCCategoryType>) => {
            dispatch({type: actionWidgetTypes.LOAD_NEXT_SUCCESS, payload: {...payload, initialized: true}});
          })
          .catch((error) => {
            dispatch({type: actionWidgetTypes.LOAD_NEXT_FAILURE, payload: {errorLoadNext: error}});
            Logger.error(SCOPE_SC_UI, error);
          });
      }
    },
    [state.isLoadingNext, state.initialized, limit, dispatch]
  );

  /**
   * Subscriber for pubsub callback
   */
  const onEditCategoryHandler = useCallback(
    (_msg: string, edited: SCCategoryType) => {
      const _categories = [...state.results];
      const updatedCategories = _categories.map((c) => (c.id === edited.id ? {...c, ...edited} : c));
      dispatch({type: actionWidgetTypes.SET_RESULTS, payload: {results: updatedCategories}});
    },
    [dispatch, state.results]
  );

  /**
   * On mount, subscribe to receive event updates (only edit)
   */
  useEffect(() => {
    updatesSubscription.current = PubSub.subscribe(`${SCTopicType.CATEGORY}.${SCCategoryEventType.EDIT}`, onEditCategoryHandler);

    return () => {
      updatesSubscription.current && PubSub.unsubscribe(updatesSubscription.current);
    };
  }, [onEditCategoryHandler]);

  // EFFECTS
  useEffect(() => {
    let _t;
    if (scUserContext.user) {
      _t = setTimeout(_initComponent);
      return (): void => {
        _t && clearTimeout(_t);
      };
    }
  }, [scUserContext.user]);

  useEffect(() => {
    if (openDialog && state.next && state.results.length <= limit && state.initialized) {
      dispatch({type: actionWidgetTypes.LOADING_NEXT});
      SuggestionService.getCategorySuggestion({offset: limit, limit: 10})
        .then((payload: SCPaginatedResponse<SCCategoryType>) => {
          dispatch({type: actionWidgetTypes.LOAD_NEXT_SUCCESS, payload: payload});
        })
        .catch((error) => {
          dispatch({type: actionWidgetTypes.LOAD_NEXT_FAILURE, payload: {errorLoadNext: error}});
          Logger.error(SCOPE_SC_UI, error);
        });
    }
  }, [openDialog, state.next, state.results.length, state.initialized, limit]);

  /**
   * Virtual feed update
   */
  useEffect(() => {
    onHeightChange && onHeightChange();
  }, [state.results]);

  useEffect(() => {
    if (scUserContext.user && cacheStrategy === CacheStrategies.NETWORK_ONLY) {
      onStateChange && onStateChange({cacheStrategy: CacheStrategies.CACHE_FIRST});
    }
  }, [scUserContext.user]);

  // HANDLERS
  /**
   * Handles list change on category follow
   * !important: don't remove the category from the list after follow for the
   * way backend side results are generated
   */
  const handleFollow = useMemo(
    () =>
      (category): void => {
        const newCategories = [...state.results];
        const index = newCategories.findIndex((u) => u.id === category.id);
        if (index !== -1) {
          if (category.followed) {
            newCategories[index].followers_counter = category.followers_counter - 1;
            newCategories[index].followed = !category.followed;
          } else {
            newCategories[index].followers_counter = category.followers_counter + 1;
            newCategories[index].followed = !category.followed;
          }
          dispatch({type: actionWidgetTypes.SET_RESULTS, payload: {results: newCategories}});
        }
      },
    [dispatch, state.count, state.results]
  );

  /**
   * Handles pagination
   */
  const handleNext = useMemo(
    () => (): void => {
      dispatch({type: actionWidgetTypes.LOADING_NEXT});
      http
        .request({
          url: state.next,
          method: Endpoints.CategoriesSuggestion.method
        })
        .then((res: AxiosResponse<SCPaginatedResponse<SCCategoryType>>) => {
          dispatch({type: actionWidgetTypes.LOAD_NEXT_SUCCESS, payload: res.data});
        });
    },
    [dispatch, state.next, state.isLoadingNext, state.initialized]
  );

  const handleToggleDialogOpen = (): void => {
    setOpenDialog((prev) => !prev);
  };

  // RENDER
  if ((autoHide && !state.count && state.initialized) || !scUserContext.user) {
    return <HiddenPlaceholder />;
  }
  if (!state.initialized) {
    return <Skeleton />;
  }

  const content = (
    <CardContent>
      <Typography className={classes.title} variant="h5">
        <FormattedMessage id="ui.categoriesSuggestionWidget.title" defaultMessage="ui.categoriesSuggestionWidget.title" />
      </Typography>
      {!state.count ? (
        <Typography className={classes.noResults} variant="body2">
          <FormattedMessage id="ui.categoriesSuggestionWidget.noResults" defaultMessage="ui.categoriesSuggestionWidget.noResults" />
        </Typography>
      ) : (
        <React.Fragment>
          <List>
            {state.results.slice(0, state.visibleItems).map((category: SCCategoryType) => (
              <ListItem key={category.id}>
                <Category elevation={0} category={category} categoryFollowButtonProps={{onFollow: handleFollow}} {...CategoryProps} />
              </ListItem>
            ))}
          </List>
          {state.count > state.visibleItems && (
            <Button className={classes.showMore} onClick={handleToggleDialogOpen}>
              <FormattedMessage id="ui.categoriesSuggestionWidget.button.showAll" defaultMessage="ui.categoriesSuggestionWidget.button.showAll" />
            </Button>
          )}
        </React.Fragment>
      )}
      {openDialog && (
        <DialogRoot
          className={classes.dialogRoot}
          title={<FormattedMessage defaultMessage="ui.categoriesSuggestionWidget.title" id="ui.categoriesSuggestionWidget.title" />}
          onClose={handleToggleDialogOpen}
          open={openDialog}
          {...DialogProps}>
          <InfiniteScroll
            dataLength={state.results.length}
            next={handleNext}
            hasMoreNext={Boolean(state.next)}
            loaderNext={<CategorySkeleton elevation={0} {...CategoryProps} />}
            height={isMobile ? '100%' : 400}
            endMessage={
              <Typography className={classes.endMessage}>
                <FormattedMessage id="ui.categoriesSuggestionWidget.noMoreResults" defaultMessage="ui.categoriesSuggestionWidget.noMoreResults" />
              </Typography>
            }>
            <List>
              {state.results.map((c) => (
                <ListItem key={c.id}>
                  <Category elevation={0} category={c} {...CategoryProps} categoryFollowButtonProps={{onFollow: handleFollow}} />
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
