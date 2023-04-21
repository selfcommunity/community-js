import React, {useContext, useEffect, useReducer, useState} from 'react';
import {styled} from '@mui/material/styles';
import List from '@mui/material/List';
import {Button, CardContent, ListItem, Typography, useMediaQuery, useTheme} from '@mui/material';
import {Endpoints, http, HttpResponse} from '@selfcommunity/api-services';
import {CacheStrategies, Logger} from '@selfcommunity/utils';
import {SCCache, SCThemeType, SCUserContext, SCUserContextType, useIsComponentMountedRef} from '@selfcommunity/react-core';
import {actionToolsTypes, dataToolsReducer, stateToolsInitializer} from '../../utils/tools';
import Category from '../Category';
import {SCCategoryType} from '@selfcommunity/types';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import {CategoriesListProps} from '../CategoriesSuggestionWidget';
import Skeleton from './Skeleton';
import classNames from 'classnames';
import BaseDialog from '../../shared/BaseDialog';
import CentralProgress from '../../shared/CentralProgress';
import InfiniteScroll from '../../shared/InfiniteScroll';
import Widget from '../Widget';
import {useThemeProps} from '@mui/system';
import HiddenPlaceholder from '../../shared/HiddenPlaceholder';

const messages = defineMessages({
  title: {
    id: 'ui.categoriesFollowedWidget.title',
    defaultMessage: 'ui.categoriesFollowedWidget.title'
  },
  noCategories: {
    id: 'ui.categoriesFollowedWidget.subtitle.noResults',
    defaultMessage: 'ui.categoriesFollowedWidget.subtitle.noResults'
  }
});

const PREFIX = 'SCCategoriesFollowedWidget';

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
 > API documentation for the Community-JS Categories Followed Widget component. Learn about the available props and the CSS API.
 *
 #### Import
 ```jsx
 import {CategoriesFollowedWidget} from '@selfcommunity/react-ui';
 ```
 #### Component Name
 The name `SCCategoriesFollowedWidget` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCCategoriesFollowedWidget-root|Styles applied to the root element.|
 |title|.SCCategoriesFollowedWidget-title|Styles applied to the title element.|
 |noResults|.SCCategoriesFollowedWidget-no-results|Styles applied to no results section.|
 |showMore|.SCCategoriesFollowedWidget-show-more|Styles applied to show more button element.|

 * @param inProps
 */
export default function CategoriesFollowedWidget(inProps: CategoriesListProps): JSX.Element {
  // CONST
  const limit = 3;

  // INTL
  const intl = useIntl();

  // CONTEXT
  const scUserContext: SCUserContextType = useContext(SCUserContext);

  // PROPS
  const props: CategoriesListProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {userId, autoHide, className, CategoryProps = {}, cacheStrategy = CacheStrategies.NETWORK_ONLY, onHeightChange, onStateChange} = props;

  // REFS
  const isMountedRef = useIsComponentMountedRef();

  // STATE
  const theme = useTheme<SCThemeType>();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [state, dispatch] = useReducer(
    dataToolsReducer,
    {
      isLoadingNext: true,
      next: `${Endpoints.FollowedCategories.url({id: userId})}?limit=10`,
      cacheKey: SCCache.getToolsStateCacheKey(SCCache.CATEGORIES_FOLLOWED_TOOLS_STATE_CACHE_PREFIX_KEY, userId),
      cacheStrategy
    },
    stateToolsInitializer
  );

  const [openCategoriesFollowedDialog, setOpenCategoriesFollowedDialog] = useState<boolean>(false);

  // CONST
  const authUserId = scUserContext.user ? scUserContext.user.id : null;

  /**
   * Handles list change on category follow
   */
  function handleOnFollowCategory(category) {
    if (scUserContext.user['id'] === userId) {
      dispatch({
        type: actionToolsTypes.SET_RESULTS,
        payload: {results: state.results.filter((c) => c.id !== category.id), count: state.count - 1}
      });
    } else {
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
  }

  /**
   * fetches Categories Followed
   */
  function fetchCategoriesFollowed() {
    return http.request({
      url: state.next,
      method: Endpoints.FollowedCategories.method
    });
  }
  useEffect(() => {
    if (!userId) {
      return;
    } else if (cacheStrategy === CacheStrategies.NETWORK_ONLY) {
      onStateChange && onStateChange({cacheStrategy: CacheStrategies.CACHE_FIRST});
    }
  }, [authUserId]);
  /**
   * On mount, fetches the list of categories followed
   */
  useEffect(() => {
    let ignore = false;
    if (state.next) {
      fetchCategoriesFollowed()
        .then((res: HttpResponse<any>) => {
          if (res.status < 300 && isMountedRef.current && !ignore) {
            const data = res.data;
            dispatch({
              type: actionToolsTypes.LOAD_NEXT_SUCCESS,
              payload: {
                results: data,
                count: data.length
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
   * Virtual feed update
   */
  useEffect(() => {
    onHeightChange && onHeightChange();
  }, [state.results.length]);

  /**
   * Renders the list of categories followed
   */
  if (state.isLoadingNext) {
    return <Skeleton />;
  }
  const c = (
    <CardContent>
      <Typography className={classes.title} variant="h5">{`${intl.formatMessage(messages.title, {
        total: state.count
      })}`}</Typography>
      {!state.count ? (
        <Typography className={classes.noResults} variant="body2">{`${intl.formatMessage(messages.noCategories)}`}</Typography>
      ) : (
        <React.Fragment>
          <List>
            {state.results.slice(0, limit).map((category: SCCategoryType) => (
              <ListItem key={category.id}>
                <Category elevation={0} category={category} followCategoryButtonProps={{onFollow: handleOnFollowCategory}} {...CategoryProps} />
              </ListItem>
            ))}
          </List>
          {limit < state.count && (
            <Button className={classes.showMore} onClick={() => setOpenCategoriesFollowedDialog(true)}>
              <FormattedMessage id="ui.categoriesFollowedWidget.button.showAll" defaultMessage="ui.categoriesFollowedWidget.button.showAll" />
            </Button>
          )}
          {openCategoriesFollowedDialog && (
            <BaseDialog
              title={
                isMobile ? (
                  <FormattedMessage id="ui.categoriesFollowedWidget.modal.title" defaultMessage="ui.categoriesFollowedWidget.modal.title" />
                ) : (
                  `${intl.formatMessage(messages.title, {total: state.count})}`
                )
              }
              onClose={() => setOpenCategoriesFollowedDialog(false)}
              open={openCategoriesFollowedDialog}>
              {state.isLoadingNext ? (
                <CentralProgress size={50} />
              ) : (
                <InfiniteScroll
                  dataLength={state.results.length}
                  next={fetchCategoriesFollowed}
                  hasMoreNext={Boolean(state.next)}
                  loaderNext={<CentralProgress size={30} />}
                  height={isMobile ? '100vh' : 400}
                  endMessage={
                    <Typography variant="body2" align="center" fontWeight="bold">
                      <FormattedMessage id="ui.categoriesFollowedWidget.noMoreResults" defaultMessage="ui.categoriesFollowedWidget.noMoreResults" />
                    </Typography>
                  }>
                  <List>
                    {state.results.map((c) => (
                      <ListItem key={c.id}>
                        <Category elevation={0} category={c} followCategoryButtonProps={{onFollow: handleOnFollowCategory}} {...CategoryProps} />
                      </ListItem>
                    ))}
                  </List>
                </InfiniteScroll>
              )}
            </BaseDialog>
          )}
        </React.Fragment>
      )}
    </CardContent>
  );

  /**
   * Renders root object (if results and if user is logged, otherwise component is hidden)
   */
  if (autoHide && !state.count) {
    return <HiddenPlaceholder />;
  }
  /**
   * If there's no userId, component is hidden.
   */
  if (!userId) {
    return <HiddenPlaceholder />;
  }
  return <Root className={classNames(classes.root, className)}>{c}</Root>;
}
