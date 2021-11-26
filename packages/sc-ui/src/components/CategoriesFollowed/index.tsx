import React, {useContext, useEffect, useMemo, useState} from 'react';
import {styled} from '@mui/material/styles';
import List from '@mui/material/List';
import {Button, Divider, Typography} from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import {Endpoints, http, Logger} from '@selfcommunity/core';
import CategoriesSuggestionSkeleton from '../Skeleton/CategoriesSuggestionSkeleton';
import Category from '../Category';
import {AxiosResponse} from 'axios';
import {SCCategoryType} from '@selfcommunity/core/src/types';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {defineMessages, useIntl, FormattedMessage} from 'react-intl';

const messages = defineMessages({
  categoriesFollowed: {
    id: 'ui.categoriesFollowed.categoriesFollowed',
    defaultMessage: 'ui.categoriesFollowed.categoriesFollowed'
  },
  noCategories: {
    id: 'ui.categoriesFollowed.subtitle.noResults',
    defaultMessage: 'ui.categoriesFollowed.subtitle.noResults'
  }
});

const PREFIX = 'SCCategoriesFollowed';

const Root = styled(Card, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  maxWidth: 700,
  marginBottom: theme.spacing(2)
}));

export default function CategoriesFollowed(props): JSX.Element {
  const [categories, setCategories] = useState<any[]>([]);
  const [visibleCategories, setVisibleCategories] = useState<number>(3);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [followed, setFollowed] = useState<boolean>(false);
  const [openCategoriesFollowedDialog, setOpenCategoriesFollowedDialog] = useState<boolean>(false);
  const intl = useIntl();

  /**
   * fetchCategoriesFollower
   */
  const fetchCategoriesFollower = useMemo(
    () => () => {
      return http
        .request({
          url: Endpoints.CategoriesFollowed.url(),
          method: Endpoints.CategoriesFollowed.method
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
    fetchCategoriesFollower()
      .then((data: AxiosResponse<any>) => {
        setCategories(data['results']);
        setHasMore(data['count'] > visibleCategories);
        setLoading(false);
        setTotal(data['count']);
        setFollowed(true);
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
          <Typography variant="body1">{`${intl.formatMessage(messages.categoriesFollowed, {total: total})}`}</Typography>
          {!total ? (
            <Typography variant="body2">{`${intl.formatMessage(messages.noCategories)}`}</Typography>
          ) : (
            <React.Fragment>
              <List>
                {categories.slice(0, visibleCategories).map((category: SCCategoryType, index) => (
                  <div key={index}>
                    <Category elevation={0} category={category} key={category.id} />
                    <Divider />
                  </div>
                ))}
              </List>
              {hasMore && (
                <Button size="small" onClick={() => loadCategories()}>
                  <FormattedMessage id="ui.categoriesFollowed.button.showMore" defaultMessage="ui.categoriesFollowed.button.showMore" />
                </Button>
              )}
            </React.Fragment>
          )}
          {openCategoriesFollowedDialog && <></>}
        </CardContent>
      )}
    </Root>
  );
}
