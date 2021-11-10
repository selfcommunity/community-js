import React, {useContext, useEffect, useState} from 'react';
import {styled} from '@mui/material/styles';
import List from '@mui/material/List';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import {Avatar, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText} from '@mui/material';
import {Endpoints, http} from '@selfcommunity/core';
import CategoryBoxSkeleton from '../Skeleton/CategoryBoxSkeleton';
import FollowButton from '../Button';
import {AxiosResponse} from 'axios';
import {SCCategoryType} from '@selfcommunity/core/src/types';

const PREFIX = 'SCCategory';

const Root = styled(Card, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  maxWidth: 700,
  marginBottom: theme.spacing(2)
}));

function Category({
  scCategoryId = null,
  scCategory = null,
  contained = true,
  followed = null
}: {
  scCategoryId?: number;
  scCategory?: SCCategoryType;
  contained: boolean;
  followed?: boolean;
}): JSX.Element {
  const [category, setCategory] = useState<SCCategoryType>(scCategory);
  const buttonText = followed ? 'Followed' : 'Follow';

  /**
   * If category not in props, attempt to get the interest by id (in props) if exist
   */
  function fetchCategory() {
    http
      .request({
        url: Endpoints.Category.url({id: scCategoryId}),
        method: Endpoints.Category.method
      })
      .then((res: AxiosResponse<SCCategoryType>) => {
        const data = res.data;
        setCategory(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    if (!category) {
      fetchCategory();
    }
  }, []);

  const c = (
    <React.Fragment>
      {category ? (
        <ListItem button={true}>
          <ListItemAvatar>
            <Avatar alt={category.name} src={category.image_original} variant="square" />
          </ListItemAvatar>
          <ListItemText primary={category.name} secondary={category.slogan} />
          <ListItemSecondaryAction>
            <FollowButton scCategoryId={category.id}>{buttonText}</FollowButton>
          </ListItemSecondaryAction>
        </ListItem>
      ) : (
        <CategoryBoxSkeleton contained />
      )}
    </React.Fragment>
  );

  if (contained) {
    return (
      <Root variant="outlined">
        <CardContent>
          <List>{c}</List>
        </CardContent>
      </Root>
    );
  }
  return c;
}

export default Category;
