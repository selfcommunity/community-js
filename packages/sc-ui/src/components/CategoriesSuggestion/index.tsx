import React, {useEffect, useState} from 'react';
import {styled} from '@mui/material/styles';
import List from '@mui/material/List';
import {Button, Divider, Typography} from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import {Endpoints, http} from '@selfcommunity/core';
import CategoriesSuggestionSkeleton from '../Skeleton/CategoriesSuggestionSkeleton';
import Category from '../Category';
import {withSCTheme} from '@selfcommunity/core';
import {AxiosResponse} from 'axios';
import {SCCategoryType} from '@selfcommunity/core/src/types';

const PREFIX = 'CategoriesSuggestion';

const Root = styled(Card, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  maxWidth: 700,
  marginBottom: theme.spacing(2)
}));

function CategoriesSuggestion(): JSX.Element {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [openCategoriesSuggestionDialog, setOpenCategoriesSuggestionDialog] = useState<boolean>(false);

  function fetchCategoriesSuggestion() {
    http
      .request({
        url: Endpoints.CategorySuggestion.url(),
        method: Endpoints.CategorySuggestion.method
      })
      .then((res: AxiosResponse<any>) => {
        const data = res.data;
        setCategories(data.results);
        setHasMore(data.count > 4);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
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
        <Typography variant="body1">Explore Interests</Typography>
        <List>
          {categories.slice(0, 4).map((category: SCCategoryType) => (
            <div>
              <Category contained={false} scCategory={category} key={category.id} />
              <Divider />
            </div>
          ))}
        </List>
        {hasMore && (
          <Button size="small" onClick={() => setOpenCategoriesSuggestionDialog(true)}>
            See More
          </Button>
        )}
        {openCategoriesSuggestionDialog && <></>}
      </CardContent>
    </Root>
  );
}
export default withSCTheme(CategoriesSuggestion);
