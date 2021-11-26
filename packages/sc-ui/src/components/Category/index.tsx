import React, {useContext, useEffect, useState} from 'react';
import {styled} from '@mui/material/styles';
import List from '@mui/material/List';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import {Avatar, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText} from '@mui/material';
import {Logger, useSCFetchCategory} from '@selfcommunity/core';
import CategoryBoxSkeleton from '../Skeleton/CategoryBoxSkeleton';
import FollowButton from '../CategoryFollowButton';
import {SCCategoryType} from '@selfcommunity/core';

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

  const c = (
    <React.Fragment>
      {scCategory ? (
        <ListItem button={true}>
          <ListItemAvatar>
            <Avatar alt={scCategory.name} src={scCategory.image_original} variant="square" />
          </ListItemAvatar>
          <ListItemText primary={scCategory.name} secondary={scCategory.slogan} />
          <ListItemSecondaryAction>
            <FollowButton category={scCategory} />
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
