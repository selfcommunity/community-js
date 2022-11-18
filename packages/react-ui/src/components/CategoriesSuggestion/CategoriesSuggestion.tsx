import React, {useContext, useEffect, useReducer, useState} from 'react';
import {styled} from '@mui/material/styles';
import {Button, CardContent, List, ListItem, Typography} from '@mui/material';
import {Endpoints, http, HttpResponse} from '@selfcommunity/api-services';
import {SCCache, SCUserContext, SCUserContextType, useIsComponentMountedRef} from '@selfcommunity/react-core';
import {SCCategoryType} from '@selfcommunity/types';
import Skeleton from './Skeleton';
import Category, {CategoryProps} from '../Category';
import {FormattedMessage} from 'react-intl';
import classNames from 'classnames';
import Widget from '../Widget';
import {useThemeProps} from '@mui/system';
import HiddenPlaceholder from '../../shared/HiddenPlaceholder';
import {VirtualScrollerItemProps} from '../../types/virtualScroller';
import {CacheStrategies} from '@selfcommunity/utils';
import {actionToolsTypes, dataToolsReducer, stateToolsInitializer} from '../../utils/tools';

const PREFIX = 'SCCategoriesSuggestion';

const classes = {
  root: `${PREFIX}-root`,
  title: `${PREFIX}-title`,
  noResults: `${PREFIX}-no-results`,
  showMore: `${PREFIX}-show-more`
};

const Root = styled(Widget, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  marginBottom: theme.spacing(2)
}));

export interface CategoriesListProps extends VirtualScrollerItemProps {
  /**
   * The user id
   * @default null
   */
  userId: number;
  /**
   * Hides this component
   * @default false
   */
  autoHide?: boolean;
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
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
   * Other props
   */
  [p: string]: any;
}

/**
 * > API documentation for the Community-JS Categories Suggestion component. Learn about the available props and the CSS API.
 *
 #### Import
 ```jsx
 import {CategoriesSuggestion} from '@selfcommunity/react-ui';
 ```
 #### Component Name
 The name `SCCategoriesSuggestion` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCCategoriesSuggestion-root|Styles applied to the root element.|
 |title|.SCCategoriesSuggestion-title|Styles applied to the title element.|
 |noResults|.SCCategoriesSuggestion-no-results|Styles applied to no results section.|
 |showMore|.SCCategoriesSuggestion-show-more|Styles applied to show more button element.|


 * @param inProps
 */
export default function CategoriesSuggestion(inProps: CategoriesListProps): JSX.Element {
  // CONST
  const limit = 3;

  // PROPS
  const props: CategoriesListProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });

  const {autoHide, className, CategoryProps = {}, onHeightChange, onStateChange, cacheStrategy = CacheStrategies.NETWORK_ONLY, ...rest} = props;

  const [state, dispatch] = useReducer(
    dataToolsReducer,
    {
      isLoadingNext: true,
      next: Endpoints.CategoriesSuggestion.url({}),
      cacheKey: SCCache.getToolsStateCacheKey(SCCache.CATEGORIES_SUGGESTION_TOOLS_STATE_CACHE_PREFIX_KEY),
      cacheStrategy,
      visibleItems: limit
    },
    stateToolsInitializer
  );
  const [openCategoriesSuggestionDialog, setOpenCategoriesSuggestionDialog] = useState<boolean>(false);

  // CONTEXT
  const scUserContext: SCUserContextType = useContext(SCUserContext);

  // CONST
  const authUserId = scUserContext.user ? scUserContext.user.id : null;

  // REFS
  const isMountedRef = useIsComponentMountedRef();

  /**
   * Handles list change on category follow
   */
  function handleOnFollowCategory(category, follow) {
    dispatch({
      type: actionToolsTypes.SET_RESULTS,
      payload: {results: state.results.filter((c) => c.id !== category.id), count: state.count - 1}
    });
  }

  /**
   * Fetches categories suggestion list
   */
  function fetchCategoriesSuggestion() {
    http
      .request({
        url: Endpoints.CategoriesSuggestion.url(),
        method: Endpoints.CategoriesSuggestion.method
      })
      .then((res: HttpResponse<any>) => {
        if (isMountedRef.current) {
          const data = res.data;
          dispatch({
            type: actionToolsTypes.LOAD_NEXT_SUCCESS,
            payload: {
              results: data.results,
              count: data.results.length
            }
          });
        }
      })
      .catch((error) => {
        dispatch({type: actionToolsTypes.LOAD_NEXT_FAILURE, payload: {errorLoadNext: error}});
        console.log(error);
      });
  }

  /**
   * Loads more categories on "see more" button click
   */
  function loadCategories(n) {
    dispatch({type: actionToolsTypes.SET_VISIBLE_ITEMS, payload: {visibleItems: state.visibleItems + n}});
  }

  /**
   * On mount, fetches categories suggestion list
   */
  useEffect(() => {
    if (scUserContext.user && cacheStrategy === CacheStrategies.NETWORK_ONLY) {
      console.log('fetch categorie network');
      fetchCategoriesSuggestion();
      onStateChange && onStateChange({cacheStrategy: CacheStrategies.CACHE_FIRST});
    }
  }, [authUserId]);

  /**
   * Virtual feed update
   */
  useEffect(() => {
    onHeightChange && onHeightChange();
  }, [state.results]);

  /**
   * Renders categories suggestion list
   */
  const c = (
    <React.Fragment>
      {state.isLoadingNext ? (
        <Skeleton elevation={0} />
      ) : (
        <CardContent>
          <Typography className={classes.title} variant="h5">
            <FormattedMessage id="ui.categoriesSuggestion.title" defaultMessage="ui.categoriesSuggestion.title" />
          </Typography>
          {!state.count ? (
            <Typography className={classes.noResults} variant="body2">
              <FormattedMessage id="ui.categoriesSuggestion.noResults" defaultMessage="ui.categoriesSuggestion.noResults" />
            </Typography>
          ) : (
            <React.Fragment>
              <List>
                {state.results.slice(0, state.visibleItems).map((category: SCCategoryType) => (
                  <ListItem key={category.id}>
                    <Category elevation={0} category={category} followCategoryButtonProps={{onFollow: handleOnFollowCategory}} {...CategoryProps} />
                  </ListItem>
                ))}
              </List>
              {state.visibleItems < state.results.length && (
                <Button size="small" className={classes.showMore} onClick={() => loadCategories(2)}>
                  <FormattedMessage id="ui.categoriesSuggestion.button.showMore" defaultMessage="ui.categoriesSuggestion.button.showMore" />
                </Button>
              )}
            </React.Fragment>
          )}
          {openCategoriesSuggestionDialog && <></>}
        </CardContent>
      )}
    </React.Fragment>
  );

  /**
   * Renders root object (if results and if user is logged, otherwise component is hidden)
   */
  if (autoHide && !state.count) {
    return <HiddenPlaceholder />;
  }
  if (scUserContext.user) {
    return (
      <Root className={classNames(classes.root, className)} {...rest}>
        {c}
      </Root>
    );
  }
  return <HiddenPlaceholder />;
}
