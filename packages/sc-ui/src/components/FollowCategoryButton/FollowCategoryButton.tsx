import React, {useContext, useEffect, useState} from 'react';
import {styled} from '@mui/material/styles';
import {
  Logger,
  SCCategoryType,
  SCContextType,
  SCUserContext,
  SCUserContextType,
  useSCContext,
  useSCFetchCategory,
  SCFollowedCategoriesManagerType
} from '@selfcommunity/core';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {LoadingButton} from '@mui/lab';
import {FormattedMessage} from 'react-intl';
import classNames from 'classnames';

const PREFIX = 'SCFollowCategoryButton';

const classes = {
  root: `${PREFIX}-root`
};

const FollowButton = styled(LoadingButton, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));

export interface FollowCategoryButtonProps {
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
 * > API documentation for the Community-UI Follow Category Button component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {FollowCategoryButton} from '@selfcommunity/ui';
 ```

 #### Component Name

 The name `SCFollowCategoryButton` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCFollowCategoryButton-root|Styles applied to the root element.|

 * @param props
 */
export default function FollowCategoryButton(props: FollowCategoryButtonProps): JSX.Element {
  // PROPS
  const {className, categoryId, category, onFollow, ...rest} = props;

  const {scCategory, setSCCategory} = useSCFetchCategory({id: categoryId, category});
  const [followed, setFollowed] = useState<boolean>(null);

  // CONTEXT
  const scContext: SCContextType = useSCContext();
  const scUserContext: SCUserContextType = useContext(SCUserContext);
  const scCategoriesManager: SCFollowedCategoriesManagerType = scUserContext.managers.categories;

  useEffect(() => {
    /**
     * Call scCategoriesManager.isFollowed inside an effect
     * to avoid warning rendering child during update parent state
     */
    if (scUserContext.user) {
      setFollowed(scCategoriesManager.isFollowed(scCategory));
    }
  });

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

  return (
    <FollowButton
      size="small"
      variant="outlined"
      onClick={handleFollowAction}
      loading={scUserContext.user ? followed === null || scCategoriesManager.isLoading(scCategory) : null}
      className={classNames(classes.root, className)}
      {...rest}>
      {followed ? (
        <FormattedMessage defaultMessage="ui.followCategoryButton.unfollow" id="ui.followCategoryButton.unfollow" />
      ) : (
        <FormattedMessage defaultMessage="ui.followCategoryButton.follow" id="ui.followCategoryButton.follow" />
      )}
    </FollowButton>
  );
}
