import React, {useContext, useEffect, useMemo, useState} from 'react';
import {styled} from '@mui/material/styles';
import List from '@mui/material/List';
import {Avatar, Button, Divider, ListItem, ListItemSecondaryAction, ListItemText, Typography} from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import {Endpoints, http, Logger} from '@selfcommunity/core';
import CategoriesSuggestionSkeleton from '../Skeleton/CategoriesSuggestionSkeleton';
import {AxiosResponse} from 'axios';
import {SCCategoryType} from '@selfcommunity/core/src/types';
import {SCOPE_SC_UI} from '../../constants/Errors';
import FollowButton from '../CategoryFollowButton';
import {FormattedMessage, defineMessages, useIntl} from 'react-intl';

const messages = defineMessages({
  categoryFollowers: {
    id: 'ui.categoriesPopular.categoryFollowers',
    defaultMessage: 'ui.categoriesPopular.categoryFollowers'
  }
});

const PREFIX = 'SCCategoriesPopular';

const Root = styled(Card, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  maxWidth: 700,
  marginBottom: theme.spacing(2)
}));

export default function CategoriesPopular(props): JSX.Element {
  const [categories, setCategories] = useState<any[]>([]);
  const [visibleCategories, setVisibleCategories] = useState<number>(3);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [openPopularCategoriesDialog, setOpenPopularCategoriesDialog] = useState<boolean>(false);
  const intl = useIntl();

  const fetchPopularCategories = useMemo(
    () => () => {
      return http
        .request({
          url: Endpoints.PopularCategories.url(),
          method: Endpoints.PopularCategories.method
        })
        .then((res: AxiosResponse<any>) => {
          if (res.status >= 300) {
            return Promise.reject(res);
          }
          return Promise.resolve(res.data);
        });
    },
    []
  );

  function loadCategories() {
    setVisibleCategories((prevVisibleCategories) => prevVisibleCategories + 3);
  }

  useEffect(() => {
    fetchPopularCategories()
      .then((data: AxiosResponse<any>) => {
        setCategories(data['results']);
        setHasMore(data['count'] > visibleCategories);
        setLoading(false);
        setTotal(data['count']);
      })
      .catch((error) => {
        Logger.error(SCOPE_SC_UI, error);
      });
  }, []);

  return (
    <Root {...props}>
      {loading ? (
        <CategoriesSuggestionSkeleton elevation={0} />
      ) : (
        <CardContent>
          <Typography variant="body1">
            <FormattedMessage id="ui.categoriesPopular.title" defaultMessage="ui.categoriesPopular.title" />
          </Typography>
          {!total ? (
            <Typography variant="body2">
              <FormattedMessage id="ui.categoriesPopular.noResults" defaultMessage="ui.categoriesPopular.noResults" />
            </Typography>
          ) : (
            <React.Fragment>
              {categories.slice(0, visibleCategories).map((category: SCCategoryType, index) => (
                <div key={index}>
                  <List>
                    <ListItem button={true} key={category.id}>
                      <ListItemText
                        primary={category.name}
                        secondary={`${intl.formatMessage(messages.categoryFollowers, {total: category.followers_count})}`}
                      />
                      <ListItemSecondaryAction>
                        <FollowButton category={category} />
                      </ListItemSecondaryAction>
                    </ListItem>
                    <Divider />
                  </List>
                </div>
              ))}
              {hasMore && (
                <Button size="small" onClick={() => loadCategories()}>
                  <FormattedMessage id="ui.categoriesPopular.button.showMore" defaultMessage="ui.categoriesPopular.button.showMore" />
                </Button>
              )}
            </React.Fragment>
          )}
          {openPopularCategoriesDialog && <></>}
        </CardContent>
      )}
    </Root>
  );
}
