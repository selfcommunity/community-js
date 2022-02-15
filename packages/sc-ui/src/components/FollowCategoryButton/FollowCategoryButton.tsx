import React, {useContext, useEffect, useState} from 'react';
import {styled} from '@mui/material/styles';
import {Logger, SCCategoriesManagerType, SCCategoryType, SCUserContext, SCUserContextType, useSCFetchCategory} from '@selfcommunity/core';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {LoadingButton} from '@mui/lab';
import {FormattedMessage} from 'react-intl';

const PREFIX = 'SCFollowCategoryButton';

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

export default function FollowCategoryButton(props: FollowCategoryButtonProps): JSX.Element {
  // PROPS
  const {className, categoryId, category, onFollow, ...rest} = props;

  const {scCategory, setSCCategory} = useSCFetchCategory({id: categoryId, category});
  const [followed, setFollowed] = useState<boolean>(null);
  const scUserContext: SCUserContextType = useContext(SCUserContext);
  const scCategoriesManager: SCCategoriesManagerType = scUserContext.managers.categories;

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

  // User anonymous
  if (!scUserContext.user) {
    return null;
  }

  return (
    <FollowButton
      size="small"
      variant="outlined"
      onClick={followCategory}
      loading={followed === null || scCategoriesManager.isLoading(scCategory)}
      className={className}
      {...rest}>
      {followed ? (
        <FormattedMessage defaultMessage="ui.followCategoryButton.unfollow" id="ui.followCategoryButton.unfollow" />
      ) : (
        <FormattedMessage defaultMessage="ui.followCategoryButton.follow" id="ui.followCategoryButton.follow" />
      )}
    </FollowButton>
  );
}
