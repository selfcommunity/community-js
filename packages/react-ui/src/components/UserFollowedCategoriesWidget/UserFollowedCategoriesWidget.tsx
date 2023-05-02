import React, {useEffect, useMemo, useReducer, useState} from 'react';
import {styled} from '@mui/material/styles';
import List from '@mui/material/List';
import {Button, CardContent, ListItem, Typography} from '@mui/material';
import {UserService} from '@selfcommunity/api-services';
import {CacheStrategies, Logger} from '@selfcommunity/utils';
import {SCCache, SCUserContextType, useSCUser} from '@selfcommunity/react-core';
import {actionToolsTypes, dataToolsReducer, stateToolsInitializer} from '../../utils/tools';
import Category, {CategoryProps, CategorySkeleton} from '../Category';
import {SCCategoryType} from '@selfcommunity/types';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {FormattedMessage} from 'react-intl';
import Skeleton from './Skeleton';
import classNames from 'classnames';
import BaseDialog, {BaseDialogProps} from '../../shared/BaseDialog';
import Widget, {WidgetProps} from '../Widget';
import {useThemeProps} from '@mui/system';
import HiddenPlaceholder from '../../shared/HiddenPlaceholder';
import {VirtualScrollerItemProps} from '../../types/virtualScroller';

const PREFIX = 'SCUserCategoriesFollowedWidget';

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

export interface UserFollowedCategoriesWidgetProps extends VirtualScrollerItemProps, WidgetProps {
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
 > API documentation for the Community-JS User Profile Categories Followed Widget component. Learn about the available props and the CSS API.
 > This component renders the list of the categories that the given user follows.

 #### Import
 ```jsx
 import {UserFollowedCategoriesWidget} from '@selfcommunity/react-ui';
 ```
 #### Component Name
 The name `SCUserCategoriesFollowedWidget` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCUserCategoriesFollowedWidget-root|Styles applied to the root element.|
 |title|.SCUserCategoriesFollowedWidget-title|Styles applied to the title element.|
 |noResults|.SCUserCategoriesFollowedWidget-no-results|Styles applied to no results section.|
 |showMore|.SCUserCategoriesFollowedWidget-show-more|Styles applied to show more button element.|
 |dialogRoot|.SCUserCategoriesFollowedWidget-dialog-root|Styles applied to the root dialog element.|
 |endMessage|.SCUserCategoriesFollowedWidget-end-message|Styles applied to the end message element.|
 * @param inProps
 */
export default function UserFollowedCategoriesWidget(inProps: UserFollowedCategoriesWidgetProps): JSX.Element {
  // PROPS
  const props: UserFollowedCategoriesWidgetProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {
    userId,
    autoHide,
    limit = 3,
    className,
    CategoryProps = {},
    cacheStrategy = CacheStrategies.NETWORK_ONLY,
    onHeightChange,
    onStateChange,
    DialogProps = {},
    ...rest
  } = props;

  // STATE
  const [state, dispatch] = useReducer(
    dataToolsReducer,
    {
      isLoadingNext: true,
      next: null,
      cacheKey: SCCache.getToolsStateCacheKey(SCCache.CATEGORIES_FOLLOWED_TOOLS_STATE_CACHE_PREFIX_KEY, userId),
      cacheStrategy
    },
    stateToolsInitializer
  );
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  // CONTEXT
  const scUserContext: SCUserContextType = useSCUser();

  // MEMO
  const authUserId = useMemo(() => (scUserContext.user ? scUserContext.user.id : null), [scUserContext.user]);

  // EFFECTS
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
    UserService.getUserFollowedCategories(userId)
      .then((categories: SCCategoryType[]) => {
        dispatch({
          type: actionToolsTypes.LOAD_NEXT_SUCCESS,
          payload: {
            count: categories.length,
            results: categories
          }
        });
      })
      .catch((error) => {
        dispatch({type: actionToolsTypes.LOAD_NEXT_FAILURE, payload: {errorLoadNext: error}});
        Logger.error(SCOPE_SC_UI, error);
      });
  }, []);

  /**
   * Virtual feed update
   */
  useEffect(() => {
    onHeightChange && onHeightChange();
  }, [state.results.length]);

  // HANDLERS
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

  const handleToggleDialogOpen = () => {
    setOpenDialog((prev) => !prev);
  };

  // RENDER
  if (state.isLoadingNext) {
    return <Skeleton />;
  }
  if ((autoHide && !state.count) || !userId) {
    return <HiddenPlaceholder />;
  }
  const c = (
    <CardContent>
      <Typography className={classes.title} variant="h5">
        <FormattedMessage
          id="ui.userFollowedCategoriesWidget.title"
          defaultMessage="ui.userFollowedCategoriesWidget.title"
          values={{total: state.count}}
        />
      </Typography>
      {!state.count ? (
        <Typography className={classes.noResults} variant="body2">
          <FormattedMessage
            id="ui.userFollowedCategoriesWidget.subtitle.noResults"
            defaultMessage="ui.userFollowedCategoriesWidget.subtitle.noResults"
          />
        </Typography>
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
            <Button className={classes.showMore} onClick={handleToggleDialogOpen}>
              <FormattedMessage id="ui.userFollowedCategoriesWidget.button.showAll" defaultMessage="ui.userFollowedCategoriesWidget.button.showAll" />
            </Button>
          )}
          {openDialog && (
            <DialogRoot
              className={classes.dialogRoot}
              title={
                <FormattedMessage
                  id="ui.userFollowedCategoriesWidget.title"
                  defaultMessage="ui.userFollowedCategoriesWidget.title"
                  values={{total: state.count}}
                />
              }
              onClose={handleToggleDialogOpen}
              open={openDialog}
              scroll="paper"
              {...DialogProps}>
              <List>
                {state.results.map((c) => (
                  <ListItem key={c.id}>
                    <Category elevation={0} category={c} followCategoryButtonProps={{onFollow: handleOnFollowCategory}} {...CategoryProps} />
                  </ListItem>
                ))}
                {state.isLoadingNext && (
                  <ListItem>
                    <CategorySkeleton elevation={0} {...CategoryProps} />
                  </ListItem>
                )}
              </List>
              <Typography className={classes.endMessage}>
                <FormattedMessage id="ui.userFollowedCategoriesWidget.noMoreResults" defaultMessage="ui.userFollowedCategoriesWidget.noMoreResults" />
              </Typography>
            </DialogRoot>
          )}
        </React.Fragment>
      )}
    </CardContent>
  );
  return (
    <Root className={classNames(classes.root, className)} {...rest}>
      {c}
    </Root>
  );
}
