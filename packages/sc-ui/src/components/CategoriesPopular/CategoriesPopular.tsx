import React, {useEffect, useMemo, useState} from 'react';
import {styled} from '@mui/material/styles';
import {Button, List, Typography} from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import {Endpoints, http, Logger} from '@selfcommunity/core';
import Skeleton from './Skeleton';
import {AxiosResponse} from 'axios';
import {SCCategoryType} from '@selfcommunity/core/src/types';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {FormattedMessage} from 'react-intl';
import Category from '../Category';
import {CategoriesListProps} from '../CategoriesSuggestion';
import classNames from 'classnames';

const PREFIX = 'SCCategoriesPopular';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(Card, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  maxWidth: 700,
  marginBottom: theme.spacing(2)
}));

/**
 > API documentation for the Community-UI Categories Popular component. Learn about the available props and the CSS API.
 *
 #### Import
 ```jsx
 import CategoriesPopular from '@selfcommunity/ui';
 ```

 #### Component Name
 The name `SCCategoriesPopular` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCCategoriesPopular-root|Styles applied to the root element.|

 * @param props
 */
export default function CategoriesPopular(props: CategoriesListProps): JSX.Element {
  // CONST
  const limit = 3;

  // PROPS
  const {autoHide = true, className, CategoryProps = {}, ...rest} = props;

  // STATE
  const [categories, setCategories] = useState<any[]>([]);
  const [visibleCategories, setVisibleCategories] = useState<number>(limit);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [openPopularCategoriesDialog, setOpenPopularCategoriesDialog] = useState<boolean>(false);

  /**
   * Fetches popular categories list
   */
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

  /**
   * Loads more categories on "see more" button click
   */
  function loadCategories() {
    const newIndex = visibleCategories + limit;
    const newHasMore = newIndex < categories.length - 1;
    setVisibleCategories(newIndex);
    setHasMore(newHasMore);
  }

  /**
   * On mount, fetches popular categories list
   */
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

  /**
   * Renders popular categories list
   */
  const c = (
    <React.Fragment>
      {loading ? (
        <Skeleton elevation={0} />
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
              <List>
                {categories.slice(0, visibleCategories).map((category: SCCategoryType, index) => (
                  <div key={index}>
                    <Category elevation={0} category={category} key={category.id} popular={true} {...CategoryProps} />
                  </div>
                ))}
              </List>
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
    </React.Fragment>
  );

  /**
   * Renders root object (if results and autoHide prop is set to false, otherwise component is hidden)
   */
  if (autoHide && !total) {
    return null;
  }
  return (
    <Root className={classNames(classes.root, className)} {...rest}>
      {c}
    </Root>
  );
}
