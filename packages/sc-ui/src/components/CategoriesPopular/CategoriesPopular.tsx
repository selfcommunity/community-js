import React, {useEffect, useMemo, useState} from 'react';
import {styled} from '@mui/material/styles';
import {Button, List, Typography} from '@mui/material';
import {Endpoints, http, Logger} from '@selfcommunity/core';
import Skeleton from './Skeleton';
import {AxiosResponse} from 'axios';
import {SCCategoryType} from '@selfcommunity/core/src/types';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {FormattedMessage} from 'react-intl';
import Category from '../Category';
import {CategoriesListProps} from '../CategoriesSuggestion';
import classNames from 'classnames';
import BaseDialog from '../../shared/BaseDialog';
import CentralProgress from '../../shared/CentralProgress';
import InfiniteScroll from 'react-infinite-scroll-component';
import Widget from '../Widget';

const PREFIX = 'SCCategoriesPopular';

const classes = {
  root: `${PREFIX}-root`,
  title: `${PREFIX}-title`,
  noResults: `${PREFIX}-noResults`
};

const Root = styled(Widget, {
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
 import {CategoriesPopular} from '@selfcommunity/ui';
 ```

 #### Component Name
 The name `SCCategoriesPopular` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCCategoriesPopular-root|Styles applied to the root element.|
 |title|.SCCategoriesPopular-title|Styles applied to the title element.|
 |noResults|.SCCategoriesPopular-noResults|Styles applied to noResults section.|

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
  const [next, setNext] = useState<string>(`${Endpoints.PopularCategories.url()}?limit=10`);
  /**
   * Fetches popular categories list
   */
  const fetchPopularCategories = useMemo(
    () => () => {
      if (next) {
        http
          .request({
            url: next,
            method: Endpoints.PopularCategories.method
          })
          .then((res: AxiosResponse<any>) => {
            if (res.status < 300) {
              const data = res.data;
              setCategories([...categories, ...data['results']]);
              setHasMore(data['count'] > visibleCategories);
              setNext(data['next']);
              setLoading(false);
              setTotal(data['count']);
            }
          })
          .catch((error) => {
            setLoading(false);
            Logger.error(SCOPE_SC_UI, error);
          });
      }
    },
    [categories, next, loading]
  );

  /**
   * On mount, fetches popular categories list
   */
  useEffect(() => {
    fetchPopularCategories();
  }, []);

  /**
   * Renders popular categories list
   */
  const c = (
    <React.Fragment>
      {loading ? (
        <Skeleton elevation={0} />
      ) : (
        <>
          <Typography className={classes.title} variant="body1">
            <FormattedMessage id="ui.categoriesPopular.title" defaultMessage="ui.categoriesPopular.title" />
          </Typography>
          {!total ? (
            <Typography className={classes.noResults} variant="body2">
              <FormattedMessage id="ui.categoriesPopular.noResults" defaultMessage="ui.categoriesPopular.noResults" />
            </Typography>
          ) : (
            <React.Fragment>
              <List>
                {categories.slice(0, visibleCategories).map((category: SCCategoryType, index) => (
                  <div key={index}>
                    <Category elevation={0} category={category} key={category.id} {...CategoryProps} />
                  </div>
                ))}
              </List>
              {hasMore && (
                <Button size="small" onClick={() => setOpenPopularCategoriesDialog(true)}>
                  <FormattedMessage id="ui.categoriesPopular.button.showAll" defaultMessage="ui.categoriesPopular.button.showAll" />
                </Button>
              )}
            </React.Fragment>
          )}
          {openPopularCategoriesDialog && (
            <BaseDialog
              title={<FormattedMessage defaultMessage="ui.categoriesPopular.title" id="ui.categoriesPopular.title" />}
              onClose={() => setOpenPopularCategoriesDialog(false)}
              open={openPopularCategoriesDialog}>
              {loading ? (
                <CentralProgress size={50} />
              ) : (
                <InfiniteScroll
                  dataLength={categories.length}
                  next={fetchPopularCategories}
                  hasMore={Boolean(next)}
                  loader={<CentralProgress size={30} />}
                  height={400}
                  endMessage={
                    <p style={{textAlign: 'center'}}>
                      <b>
                        <FormattedMessage id="ui.categoriesPopular.noMoreResults" defaultMessage="ui.categoriesPopular.noMoreResults" />
                      </b>
                    </p>
                  }>
                  <List>
                    {categories.map((c, index) => (
                      <Category elevation={0} category={c} key={c.id} sx={{m: 0}} {...CategoryProps} />
                    ))}
                  </List>
                </InfiniteScroll>
              )}
            </BaseDialog>
          )}
        </>
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
