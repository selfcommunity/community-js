import React, {useContext, useEffect, useMemo, useReducer, useState} from 'react';
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

const PREFIX = 'SCCategoriesSuggestionWidget';

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
})(({theme}) => ({}));

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


 * @param inProps
 */
export default function CategoriesSuggestionWidget(inProps: CategoriesListProps): JSX.Element {
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
      next: `${Endpoints.CategoriesSuggestion.url()}?limit=10`,
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
  const fetchCategoriesSuggestion = useMemo(
    () => () => {
      return http.request({
        url: state.next,
        method: Endpoints.CategoriesSuggestion.method
      });
    },
    [dispatch, state.next, state.isLoadingNext]
  );

  /**
   * Loads more categories on "see more" button click
   */
  function loadCategories(n) {
    dispatch({type: actionToolsTypes.SET_VISIBLE_ITEMS, payload: {visibleItems: state.visibleItems + n}});
  }
  useEffect(() => {
    if (scUserContext.user && cacheStrategy === CacheStrategies.NETWORK_ONLY) {
      onStateChange && onStateChange({cacheStrategy: CacheStrategies.CACHE_FIRST});
    }
  }, [authUserId]);
  /**
   * On mount, fetches categories suggestion list
   */
  useEffect(() => {
    let ignore = false;
    if (state.next && scUserContext.user) {
      fetchCategoriesSuggestion()
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
          console.log(error);
        });
      return () => {
        ignore = true;
      };
    }
  }, [state.next, authUserId]);

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
                    <Category elevation={0} category={category} followCategoryButtonProps={{onFollow: handleOnFollowCategory}} {...CategoryProps} />
                  </ListItem>
                ))}
              </List>
              {state.visibleItems < state.results.length && (
                <Button className={classes.showMore} onClick={() => loadCategories(2)}>
                  <FormattedMessage
                    id="ui.categoriesSuggestionWidget.button.showMore"
                    defaultMessage="ui.categoriesSuggestionWidget.button.showMore"
                  />
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
