import React, {useContext, useEffect, useMemo, useReducer, useState} from 'react';
import {styled} from '@mui/material/styles';
import {Button, CardContent, List, ListItem, Typography, useMediaQuery, useTheme} from '@mui/material';
import {CategoryService, Endpoints, http, SCPaginatedResponse} from '@selfcommunity/api-services';
import {CacheStrategies, isInteger, Logger} from '@selfcommunity/utils';
import Skeleton from './Skeleton';
import {SCCategoryType} from '@selfcommunity/types';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {FormattedMessage} from 'react-intl';
import Category, {CategoryProps, CategorySkeleton} from '../Category';
import classNames from 'classnames';
import BaseDialog, {BaseDialogProps} from '../../shared/BaseDialog';
import InfiniteScroll from '../../shared/InfiniteScroll';
import Widget, {WidgetProps} from '../Widget';
import {useThemeProps} from '@mui/system';
import HiddenPlaceholder from '../../shared/HiddenPlaceholder';
import {
  SCCache,
  SCPreferences,
  SCPreferencesContext,
  SCPreferencesContextType,
  SCThemeType,
  SCUserContext,
  SCUserContextType
} from '@selfcommunity/react-core';
import {actionWidgetTypes, dataWidgetReducer, stateWidgetInitializer} from '../../utils/widget';
import {VirtualScrollerItemProps} from '../../types/virtualScroller';
import {AxiosResponse} from 'axios';

const PREFIX = 'SCCategoriesPopularWidget';

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
})(() => ({}));

const DialogRoot = styled(BaseDialog, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.dialogRoot
})(() => ({}));

export interface CategoriesPopularWidgetProps extends VirtualScrollerItemProps, WidgetProps {
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
   * Props to spread to followed categories dialog
   * @default {}
   */
  DialogProps?: BaseDialogProps;

  /**
   * Other props
   */
  [p: string]: any;
}

/**
 > API documentation for the Community-JS Categories Popular widget component. Learn about the available props and the CSS API.
 * <br/>This component renders a list of popular categories.
 * <br/>Take a look at our <strong>demo</strong> component [here](/docs/sdk/community-js/react-ui/Components/CategoriesPopular) 
 
 #### Import
 ```jsx
 import {CategoriesPopular} from '@selfcommunity/react-ui';
 ```

 #### Component Name
 The name `SCCategoriesPopularWidget` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCCategoriesPopularWidget-root|Styles applied to the root element.|
 |title|.SCCategoriesPopularWidget-title|Styles applied to the title element.|
 |noResults|.SCCategoriesPopularWidget-no-results|Styles applied to no results section.|
 |showMore|.SCCategoriesPopularWidget-show-more|Styles applied to show more button element.|
 |dialogRoot|.SCCategoriesPopularWidget-dialog-root|Styles applied to the root dialog element.|
 |endMessage|.SCCategoriesPopularWidget-end-message|Styles applied to the end message element.|

 * @param inProps
 */
export default function CategoriesPopularWidget(inProps: CategoriesPopularWidgetProps): JSX.Element {
  // PROPS
  const props: CategoriesPopularWidgetProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });

  const {
    autoHide = true,
    limit = 3,
    className,
    CategoryProps = {},
    cacheStrategy = CacheStrategies.CACHE_FIRST,
    onHeightChange,
    onStateChange,
    DialogProps = {},
    categoryId, // Removed from root DOM
    ...rest
  } = props;

  // CONTEXT
  const scUserContext: SCUserContextType = useContext(SCUserContext);
  const scPreferencesContext: SCPreferencesContextType = useContext(SCPreferencesContext);
  const contentAvailability = useMemo(
    () =>
      SCPreferences.CONFIGURATIONS_CONTENT_AVAILABILITY in scPreferencesContext.preferences &&
      scPreferencesContext.preferences[SCPreferences.CONFIGURATIONS_CONTENT_AVAILABILITY].value,
    [scPreferencesContext]
  );

  // STATE
  const [state, dispatch] = useReducer(
    dataWidgetReducer,
    {
      isLoadingNext: false,
      next: null,
      cacheKey: SCCache.getWidgetStateCacheKey(SCCache.CATEGORIES_POPULAR_TOOLS_STATE_CACHE_PREFIX_KEY),
      cacheStrategy,
      visibleItems: limit
    },
    stateWidgetInitializer
  );
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  // HOOKS
  const theme = useTheme<SCThemeType>();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  /**
   * Initialize component
   * Fetch data only if the component is not initialized and it is not loading data
   */
  const _initComponent = useMemo(
    () => (): void => {
      if (!state.initialized && !state.isLoadingNext) {
        dispatch({type: actionWidgetTypes.LOADING_NEXT});
        CategoryService.getPopularCategories({limit})
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

  // EFFECTS
  useEffect(() => {
    let _t;
    if (scUserContext.user !== undefined && (contentAvailability || (!contentAvailability && scUserContext.user?.id))) {
      _t = setTimeout(_initComponent);
      return (): void => {
        _t && clearTimeout(_t);
      };
    }
  }, [scUserContext.user, contentAvailability]);

  useEffect(() => {
    if (openDialog && state.next && state.initialized && state.results.length === limit) {
      CategoryService.getPopularCategories({offset: limit, limit: 10})
        .then((payload: SCPaginatedResponse<SCCategoryType>) => {
          dispatch({type: actionWidgetTypes.LOAD_NEXT_SUCCESS, payload: payload});
        })
        .catch((error) => {
          dispatch({type: actionWidgetTypes.LOAD_NEXT_FAILURE, payload: {errorLoadNext: error}});
          Logger.error(SCOPE_SC_UI, error);
        });
    }
  }, [openDialog, limit, state.next, state.initialized, state.results.length]);

  /**
   * Virtual feed update
   */
  useEffect(() => {
    onHeightChange && onHeightChange();
  }, [state.results]);

  useEffect(() => {
    if (!contentAvailability && !scUserContext.user) {
      return;
    } else if (cacheStrategy === CacheStrategies.NETWORK_ONLY) {
      onStateChange && onStateChange({cacheStrategy: CacheStrategies.CACHE_FIRST});
    }
  }, [contentAvailability, cacheStrategy, scUserContext.user]);

  // HANDLERS
  /**
   * Fetches popular categories list
   */
  const handleNext = useMemo(
    () => (): void => {
      dispatch({type: actionWidgetTypes.LOADING_NEXT});
      http
        .request({
          url: state.next,
          method: Endpoints.PopularCategories.method
        })
        .then((res: AxiosResponse<SCPaginatedResponse<SCCategoryType>>) => {
          dispatch({type: actionWidgetTypes.LOAD_NEXT_SUCCESS, payload: res.data});
        });
    },
    [dispatch, state.next, state.isLoadingNext, state.initialized]
  );

  /**
   * Update counters above the category name and the user follow state
   * @param category
   */
  const handleFollowersUpdate = (category): void => {
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
  };

  const handleToggleDialogOpen = (): void => {
    setOpenDialog((prev) => !prev);
  };

  // RENDER
  if ((!contentAvailability && !scUserContext.user) || (state.initialized && autoHide && !state.count)) {
    return <HiddenPlaceholder />;
  }
  if (!state.initialized) {
    return <Skeleton />;
  }

  const content = (
    <CardContent>
      <Typography className={classes.title} variant="h5">
        <FormattedMessage id="ui.categoriesPopularWidget.title" defaultMessage="ui.categoriesPopularWidget.title" />
      </Typography>
      {!state.count ? (
        <Typography className={classes.noResults} variant="body2">
          <FormattedMessage id="ui.categoriesPopularWidget.noResults" defaultMessage="ui.categoriesPopularWidget.noResults" />
        </Typography>
      ) : (
        <React.Fragment>
          <List>
            {state.results.slice(0, state.visibleItems).map((category: SCCategoryType) => (
              <ListItem key={category.id}>
                <Category elevation={0} category={category} followCategoryButtonProps={{onFollow: handleFollowersUpdate}} {...CategoryProps} />
              </ListItem>
            ))}
          </List>
          {state.count > state.visibleItems && (
            <Button className={classes.showMore} onClick={handleToggleDialogOpen}>
              <FormattedMessage id="ui.categoriesPopularWidget.button.showAll" defaultMessage="ui.categoriesPopularWidget.button.showAll" />
            </Button>
          )}
        </React.Fragment>
      )}
      {openDialog && (
        <DialogRoot
          className={classes.dialogRoot}
          title={<FormattedMessage defaultMessage="ui.categoriesPopularWidget.title" id="ui.categoriesPopularWidget.title" />}
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
                <FormattedMessage id="ui.categoriesPopularWidget.noMoreResults" defaultMessage="ui.categoriesPopularWidget.noMoreResults" />
              </Typography>
            }>
            <List>
              {state.results.map((c) => (
                <ListItem key={c.id}>
                  <Category elevation={0} category={c} {...CategoryProps} followCategoryButtonProps={{onFollow: handleFollowersUpdate}} />
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
