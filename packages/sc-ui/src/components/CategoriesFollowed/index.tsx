import React, {useEffect, useState} from 'react';
import {styled} from '@mui/material/styles';
import List from '@mui/material/List';
import {Button, Divider, Typography} from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import {Endpoints, http} from '@selfcommunity/core';
import CategoriesSuggestionSkeleton from '../Skeleton/CategoriesSuggestionSkeleton';
import Category from '../Category';
import {AxiosResponse} from 'axios';
import {SCCategoryType} from '@selfcommunity/core/src/types';

const PREFIX = 'SCCategoriesFollowed';

const Root = styled(Card, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  maxWidth: 700,
  marginBottom: theme.spacing(2)
}));

function CategoriesFollowed(): JSX.Element {
  const [categories, setCategories] = useState<any[]>([]);
  const [visibleCategories, setVisibleCategories] = useState<number>(3);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [followed, setFollowed] = useState<boolean>(false);
  const [openCategoriesSuggestionDialog, setOpenCategoriesSuggestionDialog] = useState<boolean>(false);

  function fetchCategoriesSuggestion() {
    http
      .request({
        url: Endpoints.CategoriesFollowed.url(),
        method: Endpoints.CategoriesFollowed.method
      })
      .then((res: AxiosResponse<any>) => {
        const data = res.data;
        setCategories(data.results);
        setHasMore(data.count > visibleCategories);
        setLoading(false);
        setTotal(data.count);
        setFollowed(true);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function loadCategories() {
    setVisibleCategories((prevVisibleCategories) => prevVisibleCategories + 3);
  }

  useEffect(() => {
    fetchCategoriesSuggestion();
  }, []);

  if (loading) {
    return <CategoriesSuggestionSkeleton />;
  }
  return (
    <Root variant={'outlined'}>
      <CardContent>
        <Typography variant="body1">{total} Interests</Typography>
        <List>
          {categories.slice(0, visibleCategories).map((category: SCCategoryType, index) => (
            <div key={index}>
              <Category contained={false} scCategory={category} followed={followed} key={category.id} />
              <Divider />
            </div>
          ))}
        </List>
        {hasMore && (
          <Button size="small" onClick={() => loadCategories()}>
            Show More
          </Button>
        )}
        {openCategoriesSuggestionDialog && <></>}
      </CardContent>
    </Root>
  );
}
export default CategoriesFollowed;
