import React, {useContext, useEffect, useMemo, useReducer, useState} from 'react';
import {styled} from '@mui/material/styles';
import List from '@mui/material/List';
import {Button, CardContent, ListItem, Typography} from '@mui/material';
import {UserService} from '@selfcommunity/api-services';
import {CacheStrategies, isInteger, Logger} from '@selfcommunity/utils';
import {SCCache, SCPreferences, SCPreferencesContext, SCPreferencesContextType, SCUserContextType, useSCUser} from '@selfcommunity/react-core';
import {actionWidgetTypes, dataWidgetReducer, stateWidgetInitializer} from '../../utils/widget';
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
})(() => ({}));

const DialogRoot = styled(BaseDialog, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.dialogRoot
})(() => ({}));

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
 * > API documentation for the Community-JS User Profile Categories Followed Widget component. Learn about the available props and the CSS API.
 *
 *
 * This component renders the list of the categories that the given user follows.
 * Take a look at our <strong>demo</strong> component [here](/docs/sdk/community-js/react-ui/Components/UserFollowedCategories)

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

  // CONTEXT
  const scUserContext: SCUserContextType = useSCUser();
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
      cacheKey: SCCache.getWidgetStateCacheKey(SCCache.CATEGORIES_FOLLOWED_TOOLS_STATE_CACHE_PREFIX_KEY, userId),
      cacheStrategy
    },
    stateWidgetInitializer
  );
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  /**
   * Initialize component
   * Fetch data only if the component is not initialized and it is not loading data
   */
  const _initComponent = useMemo(
    () => (): void => {
      if (!state.initialized && !state.isLoadingNext) {
        UserService.getUserFollowedCategories(userId, null)
          .then((categories: SCCategoryType[]) => {
            dispatch({
              type: actionWidgetTypes.LOAD_NEXT_SUCCESS,
              payload: {
                count: categories.length,
                results: categories,
                initialized: true
              }
            });
          })
          .catch((error) => {
            dispatch({type: actionWidgetTypes.LOAD_NEXT_FAILURE, payload: {errorLoadNext: error}});
            Logger.error(SCOPE_SC_UI, error);
          });
      }
    },
    [state.isLoadingNext, state.initialized, userId, dispatch]
  );

  // EFFECTS
  useEffect(() => {
    let _t;
    if ((contentAvailability || (!contentAvailability && scUserContext.user?.id)) && isInteger(userId) && scUserContext.user !== undefined) {
      _t = setTimeout(_initComponent);
      return (): void => {
        _t && clearTimeout(_t);
      };
    }
  }, [scUserContext.user, contentAvailability, userId]);

  /**
   * Virtual feed update
   */
  useEffect(() => {
    onHeightChange && onHeightChange();
  }, [state.results.length]);

  useEffect(() => {
    if ((!contentAvailability && !scUserContext.user) || !isInteger(userId)) {
      return;
    } else if (cacheStrategy === CacheStrategies.NETWORK_ONLY) {
      onStateChange && onStateChange({cacheStrategy: CacheStrategies.CACHE_FIRST});
    }
  }, [contentAvailability, cacheStrategy, scUserContext.user, userId]);

  // HANDLERS
  const handleOnFollowCategory = (category): void => {
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
  if ((autoHide && !state.count && state.initialized) || !userId) {
    return <HiddenPlaceholder />;
  }
  if (!state.initialized) {
    return <Skeleton />;
  }
  const content = (
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
      {content}
    </Root>
  );
}
