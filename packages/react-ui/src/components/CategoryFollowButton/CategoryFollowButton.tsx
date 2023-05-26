import React, {useEffect, useState} from 'react';
import {styled} from '@mui/material/styles';
import {CacheStrategies, Logger} from '@selfcommunity/utils';
import {
  SCContextType,
  SCFollowedCategoriesManagerType,
  SCUserContextType,
  useSCContext,
  useSCFetchCategory,
  useSCUser
} from '@selfcommunity/react-core';
import {SCCategoryType} from '@selfcommunity/types';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {LoadingButton} from '@mui/lab';
import {FormattedMessage} from 'react-intl';
import classNames from 'classnames';
import {useThemeProps} from '@mui/system';
import {SCCategoryAutoFollowType} from '@selfcommunity/types';

const PREFIX = 'SCFollowCategoryButton';

const classes = {
  root: `${PREFIX}-root`
};

const FollowButton = styled(LoadingButton, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));

export interface CategoryFollowButtonProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
  /**
   * Id of the category
   * @default null
   */
  categoryId?: number;

  /**
   * Category Object
   * @default null
   */
  category?: SCCategoryType;

  /**
   * onFollow callback
   * @param user
   * @param followed
   */
  onFollow?: (category: SCCategoryType, followed: boolean) => any;

  /**
   * Others properties
   */
  [p: string]: any;
}

/**
 * > API documentation for the Community-JS Follow Category Button component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {CategoryFollowButton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCFollowCategoryButton` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCFollowCategoryButton-root|Styles applied to the root element.|

 * @param inProps
 */
export default function CategoryFollowButton(inProps: CategoryFollowButtonProps): JSX.Element {
  // PROPS
  const props: CategoryFollowButtonProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });

  const {className, categoryId, category, onFollow, ...rest} = props;

  // CONTEXT
  const scContext: SCContextType = useSCContext();
  const scUserContext: SCUserContextType = useSCUser();
  const scCategoriesManager: SCFollowedCategoriesManagerType = scUserContext.managers.categories;

  // CONST
  const authUserId = scUserContext.user ? scUserContext.user.id : null;

  const {scCategory, setSCCategory} = useSCFetchCategory({
    id: categoryId,
    category,
    cacheStrategy: authUserId ? CacheStrategies.CACHE_FIRST : CacheStrategies.STALE_WHILE_REVALIDATE
  });
  const [followed, setFollowed] = useState<boolean>(null);

  useEffect(() => {
    /**
     * Call scCategoriesManager.isFollowed inside an effect
     * to avoid warning rendering child during update parent state
     */
    if (authUserId) {
      setFollowed(scCategoriesManager.isFollowed(scCategory));
    }
  }, [authUserId, scCategoriesManager.isFollowed]);

  const followCategory = () => {
    scCategoriesManager
      .follow(scCategory)
      .then(() => {
        onFollow && onFollow(scCategory, !followed);
      })
      .catch((e) => {
        Logger.error(SCOPE_SC_UI, e);
      });
  };

  const handleFollowAction = () => {
    if (!scUserContext.user) {
      scContext.settings.handleAnonymousAction();
    } else {
      followCategory();
    }
  };

  if (!scCategory || (scCategory && followed && scCategory.auto_follow === SCCategoryAutoFollowType.FORCED)) {
    return null;
  }

  return (
    <FollowButton
      size="small"
      variant="outlined"
      onClick={handleFollowAction}
      loading={scUserContext.user === undefined || followed === null || scCategoriesManager.isLoading(scCategory)}
      className={classNames(classes.root, className)}
      {...rest}>
      {followed && scUserContext.user ? (
        <FormattedMessage defaultMessage="ui.followCategoryButton.unfollow" id="ui.followCategoryButton.unfollow" />
      ) : (
        <FormattedMessage defaultMessage="ui.followCategoryButton.follow" id="ui.followCategoryButton.follow" />
      )}
    </FollowButton>
  );
}
