import React, {useContext, useEffect, useState} from 'react';
import {styled} from '@mui/material/styles';
import List from '@mui/material/List';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import {Avatar, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText} from '@mui/material';
import {useSCFetchCategory} from '@selfcommunity/core';
import CategoryBoxSkeleton from '../Skeleton/CategoryBoxSkeleton';
import FollowButton from '../FollowButton';
import {SCCategoryType} from '@selfcommunity/core/src/types';

const PREFIX = 'SCCategory';

const Root = styled(Card, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  maxWidth: 700
}));

function Category({
  id = null,
  category = null,
  contained = true,
  followed = null,
  ...rest
}: {
  id?: number;
  category?: SCCategoryType;
  followed?: boolean;
  [p: string]: any;
}): JSX.Element {
  const {scCategory, setSCCategory} = useSCFetchCategory({id, category});
  const buttonText = followed ? 'Followed' : 'Follow';

  const c = (
    <React.Fragment>
      {scCategory ? (
        <ListItem button={true}>
          <ListItemAvatar>
            <Avatar alt={scCategory.name} src={scCategory.image_original} variant="square" />
          </ListItemAvatar>
          <ListItemText primary={scCategory.name} secondary={scCategory.slogan} />
          <ListItemSecondaryAction>
            <FollowButton scCategoryId={scCategory.id}>{buttonText}</FollowButton>
          </ListItemSecondaryAction>
        </ListItem>
      ) : (
        <CategoryBoxSkeleton elevation={0} />
      )}
    </React.Fragment>
  );

  return (
    <Root {...rest}>
      <CardContent>
        <List>{c}</List>
      </CardContent>
    </Root>
  );
}

export default Category;
