import React, {useEffect, useMemo, useReducer} from 'react';
import {styled} from '@mui/material/styles';
import {
  Category,
  CentralProgress,
  InfiniteScroll,
  CategoryProps,
  actionToolsTypes,
  dataToolsReducer,
  stateToolsInitializer
} from '@selfcommunity/react-ui';
import {SCCache, useIsComponentMountedRef} from '@selfcommunity/react-core';
import {FormattedMessage} from 'react-intl';
import {useThemeProps} from '@mui/system';
import {Endpoints, http, HttpResponse} from '@selfcommunity/api-services';
import {Grid, Box, useMediaQuery, useTheme} from '@mui/material';
import Skeleton from './Skeleton';
import {CacheStrategies} from '@selfcommunity/utils';
import classNames from 'classnames';

const PREFIX = 'SCCategoriesListTemplate';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));

export interface CategoriesListProps {
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
 * > API documentation for the Community-JS Users List Template. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {UsersList} from '@selfcommunity/react-templates';
 ```

 #### Component Name

 The name `SCUsersListTemplate` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCCategoriesListTemplate-root|Styles applied to the root element.|
 *
 * @param inProps
 */
export default function CategoriesList(inProps: CategoriesListProps): JSX.Element {
  // PROPS
  const props: CategoriesListProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className, CategoryProps = {}, onHeightChange, onStateChange, cacheStrategy = CacheStrategies.NETWORK_ONLY, ...rest} = props;
  // REFS
  const isMountedRef = useIsComponentMountedRef();
  // STATE
  const [state, dispatch] = useReducer(
    dataToolsReducer,
    {
      isLoadingNext: true,
      next: `${Endpoints.CategoryList.url()}?limit=10`,
      cacheKey: SCCache.getToolsStateCacheKey(SCCache.CATEGORIES_LIST_TOOLS_STATE_CACHE_PREFIX_KEY),
      cacheStrategy
    },
    stateToolsInitializer
  );
  /**
   * Fetches categories list
   */
  const fetchCategories = useMemo(
    () => () => {
      return http.request({
        url: state.next,
        method: Endpoints.PopularCategories.method
      });
    },
    [dispatch, state.next, state.isLoadingNext]
  );
  useEffect(() => {
    if (cacheStrategy === CacheStrategies.NETWORK_ONLY) {
      onStateChange && onStateChange({cacheStrategy: CacheStrategies.CACHE_FIRST});
    }
  }, []);
  /**
   * On mount, fetches categories list
   */
  useEffect(() => {
    let ignore = false;
    if (state.next) {
      fetchCategories()
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
        });
      return () => {
        ignore = true;
      };
    }
  }, [state.next]);
  /**
   * Handles followers counter update on follow/unfollow action.
   * @param category
   */
  function handleFollowersUpdate(category) {
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
      dispatch({
        type: actionToolsTypes.SET_RESULTS,
        payload: {results: newCategories}
      });
    }
  }

  /**
   * Renders categories list
   */
  if (state.isLoadingNext) {
    return <Skeleton />;
  }
  return (
    <Root className={classNames(classes.root, className)} {...rest}>
      <InfiniteScroll
        dataLength={state.results.length}
        next={fetchCategories}
        hasMoreNext={Boolean(state.next)}
        loaderNext={<CentralProgress size={30} />}
        height={'100%'}
        endMessage={
          <p style={{textAlign: 'center'}}>
            <b>
              <FormattedMessage id="ui.categoriesPopular.noMoreResults" defaultMessage="ui.categoriesPopular.noMoreResults" />
            </b>
          </p>
        }>
        <Grid container spacing={{xs: 2, md: 3}} columns={{xs: 2, sm: 6, md: 12}}>
          {state.results.map((c) => (
            <Grid item xs={2} sm={4} md={4} key={c.id}>
              <Category elevation={0} category={c} {...CategoryProps} followCategoryButtonProps={{onFollow: handleFollowersUpdate}} />
            </Grid>
          ))}
        </Grid>
      </InfiniteScroll>
    </Root>
  );
}
