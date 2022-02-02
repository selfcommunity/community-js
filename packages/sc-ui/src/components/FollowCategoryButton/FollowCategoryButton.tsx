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
})(({theme}) => ({
  border: '0px',
  color: 'black',
  borderRadius: 20,
  backgroundColor: '#e2e2e2',
  paddingTop: '4px',
  paddingRight: '16px',
  paddingBottom: '4px',
  paddingLeft: '16px'
}));

export default function FollowCategoryButton({
  categoryId = null,
  category = null,
  onFollow = null,
  ...rest
}: {
  categoryId?: number;
  category?: SCCategoryType;
  onFollow?: (category: SCCategoryType, followed: boolean) => any;
  [p: string]: any;
}): JSX.Element {
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
    <FollowButton size="small" onClick={followCategory} loading={followed === null || scCategoriesManager.isLoading(scCategory)} {...rest}>
      {followed ? (
        <FormattedMessage defaultMessage="ui.followCategoryButton.unfollow" id="ui.followCategoryButton.unfollow" />
      ) : (
        <FormattedMessage defaultMessage="ui.followCategoryButton.follow" id="ui.followCategoryButton.follow" />
      )}
    </FollowButton>
  );
}
