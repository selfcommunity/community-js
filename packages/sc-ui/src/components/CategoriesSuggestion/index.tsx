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
import {FormattedMessage} from 'react-intl';

const PREFIX = 'SCCategoriesSuggestion';

const Root = styled(Card, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  maxWidth: 700,
  marginBottom: theme.spacing(2)
}));

export default function CategoriesSuggestion(props): JSX.Element {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [openCategoriesSuggestionDialog, setOpenCategoriesSuggestionDialog] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);

  function fetchCategoriesSuggestion() {
    http
      .request({
        url: Endpoints.CategoriesSuggestion.url(),
        method: Endpoints.CategoriesSuggestion.method
      })
      .then((res: AxiosResponse<any>) => {
        const data = res.data;
        setCategories(data.results);
        setHasMore(data.count > 4);
        setLoading(false);
        setTotal(data.count);
      })
      .catch((error) => {
        console.log(error);
      });
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
          <Typography variant="body1">
            <FormattedMessage id="ui.categoriesSuggestion.title" defaultMessage="ui.categoriesSuggestion.title" />
          </Typography>
          {!total ? (
            <Typography variant="body2">
              <FormattedMessage id="ui.categoriesSuggestion.noResults" defaultMessage="ui.categoriesSuggestion.noResults" />
            </Typography>
          ) : (
            <React.Fragment>
              {categories.slice(0, 4).map((category: SCCategoryType, index) => (
                <div key={index}>
                  <Category contained={false} category={category} key={category.id} />
                  <Divider />
                </div>
              ))}
              {hasMore && (
                <Button size="small" onClick={() => setOpenCategoriesSuggestionDialog(true)}>
                  <FormattedMessage id="ui.categoriesSuggestion.button.showMore" defaultMessage="ui.categoriesSuggestion.button.showMore" />
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
