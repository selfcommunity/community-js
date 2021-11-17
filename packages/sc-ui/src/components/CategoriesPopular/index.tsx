import React, {useEffect, useState} from 'react';
import {styled} from '@mui/material/styles';
import List from '@mui/material/List';
import {Avatar, Button, Divider, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText, Typography} from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import {Endpoints, http, Logger} from '@selfcommunity/core';
import CategoriesSuggestionSkeleton from '../Skeleton/CategoriesSuggestionSkeleton';
import Category from '../Category';
import {AxiosResponse} from 'axios';
import {SCCategoryType} from '@selfcommunity/core/src/types';
import {SCOPE_SC_UI} from '../../constants/Errors';
import FollowButton from '../Button';

const PREFIX = 'SCCategoriesPopular';

const Root = styled(Card, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  maxWidth: 700,
  marginBottom: theme.spacing(2)
}));

export default function CategoriesPopular({followed = null}: {followed?: boolean}, props): JSX.Element {
  const [categories, setCategories] = useState<any[]>([]);
  const [visibleCategories, setVisibleCategories] = useState<number>(3);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [openCategoriesSuggestionDialog, setOpenCategoriesSuggestionDialog] = useState<boolean>(false);
  const buttonText = followed ? 'Followed' : 'Follow';

  function fetchCategoriesSuggestion() {
    http
      .request({
        url: Endpoints.PopularCategories.url(),
        method: Endpoints.PopularCategories.method
      })
      .then((res: AxiosResponse<any>) => {
        const data = res.data;
        setCategories(data.results);
        setHasMore(data.count > visibleCategories);
        setLoading(false);
        setTotal(data.count);
      })
      .catch((error) => {
        Logger.error(SCOPE_SC_UI, error);
      });
  }

  function loadCategories() {
    setVisibleCategories((prevVisibleCategories) => prevVisibleCategories + 3);
  }

  useEffect(() => {
    fetchCategoriesSuggestion();
  }, []);

  return (
    <Root {...props}>
      {loading ? (
        <CategoriesSuggestionSkeleton elevation={0} />
      ) : (
        <CardContent>
          <Typography variant="body1">Popular Categories</Typography>
          {!total ? (
            <Typography variant="body2">No categories</Typography>
          ) : (
            <React.Fragment>
              {categories.slice(0, visibleCategories).map((category: SCCategoryType, index) => (
                <div key={index}>
                  <List>
                    <ListItem button={true} key={category.id}>
                      <ListItemText primary={category.name} secondary={<Typography>Followed by {category.followers_count} people.</Typography>} />
                      <ListItemSecondaryAction>
                        <FollowButton scCategoryId={category.id}>{buttonText}</FollowButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                    <Divider />
                  </List>
                </div>
              ))}
              {hasMore && (
                <Button size="small" onClick={() => loadCategories()}>
                  See More
                </Button>
              )}
            </React.Fragment>
          )}
          {openCategoriesSuggestionDialog && <></>}
        </CardContent>
      )}
    </Root>
  );
}
