import React, {useContext} from 'react';
import {styled} from '@mui/material/styles';
import {Logger, SCCategoriesManagerType, SCCategoryType, SCUserContext, SCUserContextType, useSCFetchCategory} from '@selfcommunity/core';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {LoadingButton} from '@mui/lab';

const PREFIX = 'SCCategoryFollowButton';

const SCButton = styled(LoadingButton, {
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

function CategoryFollowButton({
  children = null,
  categoryId = null,
  category = null,
  ...rest
}: {
  children?: React.ReactNode;
  categoryId?: number;
  category?: SCCategoryType;
  [p: string]: any;
}): JSX.Element {
  const {scCategory, setSCCategory} = useSCFetchCategory({id: categoryId, category});

  const scUserContext: SCUserContextType = useContext(SCUserContext);
  const scCategoriesManager: SCCategoriesManagerType = scUserContext.categoriesManager;
  const buttonText = scCategoriesManager.isFollowed(category) ? 'Unfollow' : 'Follow';

  const followCategory = () => {
    scCategoriesManager.follow(scCategory).catch((e) => {
      Logger.error(SCOPE_SC_UI, e);
    });
  };

  return (
    <SCButton size="small" onClick={followCategory} loading={scCategoriesManager.isLoading(category)} {...rest}>
      {buttonText}
    </SCButton>
  );
}

export default CategoryFollowButton;
