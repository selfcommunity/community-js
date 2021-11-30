import React, { useContext, useEffect, useState } from 'react';
import {styled} from '@mui/material/styles';
import {Logger, SCCategoriesManagerType, SCCategoryType, SCUserContext, SCUserContextType, useSCFetchCategory} from '@selfcommunity/core';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {LoadingButton} from '@mui/lab';

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

export default function FollowCategoryButton({categoryId = null, category = null}: {categoryId?: number; category?: SCCategoryType}): JSX.Element {
  const {scCategory, setSCCategory} = useSCFetchCategory({id: categoryId, category});
  const [followed, setFollowed] = useState<boolean>(true);
  console.log('FollowCategoryButton');
  const scUserContext: SCUserContextType = useContext(SCUserContext);
  const scCategoriesManager: SCCategoriesManagerType = scUserContext.managers.categories;

  useEffect(() => {
    setFollowed(scCategoriesManager.isFollowed(scCategory));
  });

  // const buttonText = scCategoriesManager.isFollowed(scCategory) ? 'Unfollow' : 'Follow';
  // const isLoading = scCategoriesManager.isLoading(scCategory);

  const followCategory = () => {
    scCategoriesManager.follow(scCategory).catch((e) => {
      Logger.error(SCOPE_SC_UI, e);
    });
  };

  return (
    <FollowButton size="small" onClick={followCategory} loading={scCategoriesManager.isLoading(scCategory)}>
      {followed ? 'Unfollow' : 'Follow'}
    </FollowButton>
  );
}
