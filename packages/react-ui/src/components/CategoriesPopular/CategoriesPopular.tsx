import React, {useContext, useEffect, useMemo, useReducer, useState} from 'react';
import {styled} from '@mui/material/styles';
import {Button, CardContent, List, ListItem, Typography, useMediaQuery, useTheme} from '@mui/material';
import {Endpoints, http, HttpResponse} from '@selfcommunity/api-services';
import {CacheStrategies, Logger} from '@selfcommunity/utils';
import Skeleton from './Skeleton';
import {SCCategoryType} from '@selfcommunity/types';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {FormattedMessage} from 'react-intl';
import Category from '../Category';
import {CategoriesListProps} from '../CategoriesSuggestion';
import classNames from 'classnames';
import BaseDialog from '../../shared/BaseDialog';
import CentralProgress from '../../shared/CentralProgress';
import InfiniteScroll from '../../shared/InfiniteScroll';
import Widget from '../Widget';
import {useThemeProps} from '@mui/system';
import HiddenPlaceholder from '../../shared/HiddenPlaceholder';
import {
  SCCache,
  SCPreferences,
  SCPreferencesContext,
  SCPreferencesContextType,
  SCUserContext,
  SCUserContextType,
  useIsComponentMountedRef,
  SCThemeType
} from '@selfcommunity/react-core';
import {actionToolsTypes, dataToolsReducer, stateToolsInitializer} from '../../utils/tools';

const PREFIX = 'SCCategoriesPopular';

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

/**
 > API documentation for the Community-JS Categories Popular component. Learn about the available props and the CSS API.
 *
 #### Import
 ```jsx
 import {CategoriesPopular} from '@selfcommunity/react-ui';
 ```

 #### Component Name
 The name `SCCategoriesPopular` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCCategoriesPopular-root|Styles applied to the root element.|
 |title|.SCCategoriesPopular-title|Styles applied to the title element.|
 |noResults|.SCCategoriesPopular-no-results|Styles applied to no results section.|
 |showMore|.SCCategoriesPopular-show-more|Styles applied to show more button element.|

 * @param inProps
 */
export default function CategoriesPopular(inProps: CategoriesListProps): JSX.Element {
  // CONST
  const limit = 3;

  // PROPS
  const props: CategoriesListProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });

  const {
    autoHide = true,
    className,
    CategoryProps = {},
    onHeightChange,
    onStateChange,
    cacheStrategy = CacheStrategies.NETWORK_ONLY,
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
  const theme = useTheme<SCThemeType>();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [state, dispatch] = useReducer(
    dataToolsReducer,
    {
      isLoadingNext: true,
      next: `${Endpoints.PopularCategories.url()}?limit=10`,
      cacheKey: SCCache.getToolsStateCacheKey(SCCache.CATEGORIES_POPULAR_TOOLS_STATE_CACHE_PREFIX_KEY),
      cacheStrategy,
      visibleItems: limit
    },
    stateToolsInitializer
  );
  const [openPopularCategoriesDialog, setOpenPopularCategoriesDialog] = useState<boolean>(false);
  // CONST
  const authUserId = scUserContext.user ? scUserContext.user.id : null;
  /**
   * Fetches popular categories list
   */
  const fetchPopularCategories = useMemo(
    () => () => {
      return http.request({
        url: state.next,
        method: Endpoints.PopularCategories.method
      });
    },
    [dispatch, state.next, state.isLoadingNext]
  );
  useEffect(() => {
    if (!contentAvailability && !authUserId) {
      return;
    } else if (cacheStrategy === CacheStrategies.NETWORK_ONLY) {
      onStateChange && onStateChange({cacheStrategy: CacheStrategies.CACHE_FIRST});
      // dispatch({type: actionToolsTypes.LOADING_NEXT});
    }
  }, [authUserId]);
  /**
   * On mount, fetches popular categories list
   */
  useEffect(() => {
    let ignore = false;
    if (state.next) {
      fetchPopularCategories()
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
   * Renders popular categories list
   */
  if (state.isLoadingNext) {
    return <Skeleton />;
  }
  const c = (
    <CardContent>
      <Typography className={classes.title} variant="h5">
        <FormattedMessage id="ui.categoriesPopular.title" defaultMessage="ui.categoriesPopular.title" />
      </Typography>
      {!state.count ? (
        <Typography className={classes.noResults} variant="body2">
          <FormattedMessage id="ui.categoriesPopular.noResults" defaultMessage="ui.categoriesPopular.noResults" />
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
            <Button className={classes.showMore} onClick={() => setOpenPopularCategoriesDialog(true)}>
              <FormattedMessage id="ui.categoriesPopular.button.showAll" defaultMessage="ui.categoriesPopular.button.showAll" />
            </Button>
          )}
        </React.Fragment>
      )}
      {openPopularCategoriesDialog && (
        <BaseDialog
          title={<FormattedMessage defaultMessage="ui.categoriesPopular.title" id="ui.categoriesPopular.title" />}
          onClose={() => setOpenPopularCategoriesDialog(false)}
          open={openPopularCategoriesDialog}>
          {state.isLoadingNext ? (
            <CentralProgress size={50} />
          ) : (
            <InfiniteScroll
              dataLength={state.results.length}
              next={fetchPopularCategories}
              hasMoreNext={Boolean(state.next)}
              loaderNext={<CentralProgress size={30} />}
              height={isMobile ? '100vh' : 400}
              endMessage={
                <p style={{textAlign: 'center'}}>
                  <b>
                    <FormattedMessage id="ui.categoriesPopular.noMoreResults" defaultMessage="ui.categoriesPopular.noMoreResults" />
                  </b>
                </p>
              }>
              <List>
                {state.results.map((c) => (
                  <ListItem key={c.id}>
                    <Category elevation={0} category={c} {...CategoryProps} followCategoryButtonProps={{onFollow: handleFollowersUpdate}} />
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
      {c}
    </Root>
  );
}
