import React, {useEffect, useMemo, useState} from 'react';
import {styled} from '@mui/material/styles';
import {Button, CardContent, List, ListItem, Typography, useMediaQuery, useTheme} from '@mui/material';
import {http, Endpoints, HttpResponse} from '@selfcommunity/api-services';
import {Logger} from '@selfcommunity/utils';
import Skeleton from './Skeleton';
import {SCCategoryType} from '@selfcommunity/types';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {FormattedMessage} from 'react-intl';
import Category from '../Category';
import {CategoriesListProps} from '../CategoriesSuggestion';
import classNames from 'classnames';
import BaseDialog from '../../shared/BaseDialog';
import CentralProgress from '../../shared/CentralProgress';
import InfiniteScroll from '../../shared/InfiniteScroll';
import Widget from '../Widget';
import {useThemeProps} from '@mui/system';
import HiddenPlaceholder from '../../shared/HiddenPlaceholder';
import {useIsComponentMountedRef} from '@selfcommunity/react-core';

const PREFIX = 'SCCategoriesPopular';

const classes = {
  root: `${PREFIX}-root`,
  title: `${PREFIX}-title`,
  noResults: `${PREFIX}-no-results`,
  showMore: `${PREFIX}-show-more`
};

const Root = styled(Widget, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  marginBottom: theme.spacing(2)
}));

/**
 > API documentation for the Community-JS Categories Popular component. Learn about the available props and the CSS API.
 *
 #### Import
 ```jsx
 import {CategoriesPopular} from '@selfcommunity/react-ui';
 ```

 #### Component Name
 The name `SCCategoriesPopular` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCCategoriesPopular-root|Styles applied to the root element.|
 |title|.SCCategoriesPopular-title|Styles applied to the title element.|
 |noResults|.SCCategoriesPopular-no-results|Styles applied to no results section.|
 |showMore|.SCCategoriesPopular-show-more|Styles applied to show more button element.|

 * @param inProps
 */
export default function CategoriesPopular(inProps: CategoriesListProps): JSX.Element {
  // CONST
  const limit = 3;

  // PROPS
  const props: CategoriesListProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });

  const {autoHide = true, className, CategoryProps = {}, ...rest} = props;

  // REFS
  const isMountedRef = useIsComponentMountedRef();

  // STATE
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
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
          .then((res: HttpResponse<any>) => {
            if (res.status < 300 && isMountedRef.current) {
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
   * Handles followers counter update on follow/unfollow action.
   * @param category
   */
  function handleFollowersUpdate(category) {
    const newCategories = [...categories];
    const index = newCategories.findIndex((u) => u.id === category.id);
    if (index !== -1) {
      if (category.followed) {
        newCategories[index].followers_counter = category.followers_counter - 1;
        newCategories[index].followed = !category.followed;
      } else {
        newCategories[index].followers_counter = category.followers_counter + 1;
        newCategories[index].followed = !category.followed;
      }
      setCategories(newCategories);
    }
  }

  /**
   * Renders popular categories list
   */
  if (loading) {
    return <Skeleton />;
  }
  const c = (
    <CardContent>
      <Typography className={classes.title} variant="h5">
        <FormattedMessage id="ui.categoriesPopular.title" defaultMessage="ui.categoriesPopular.title" />
      </Typography>
      {!total ? (
        <Typography className={classes.noResults} variant="body2">
          <FormattedMessage id="ui.categoriesPopular.noResults" defaultMessage="ui.categoriesPopular.noResults" />
        </Typography>
      ) : (
        <React.Fragment>
          <List>
            {categories.slice(0, visibleCategories).map((category: SCCategoryType) => (
              <ListItem key={category.id}>
                <Category elevation={0} category={category} followCategoryButtonProps={{onFollow: handleFollowersUpdate}} {...CategoryProps} />
              </ListItem>
            ))}
          </List>
          {hasMore && (
            <Button size="small" className={classes.showMore} onClick={() => setOpenPopularCategoriesDialog(true)}>
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
              hasMoreNext={Boolean(next)}
              loaderNext={<CentralProgress size={30} />}
              height={isMobile ? '100vh' : 400}
              endMessage={
                <p style={{textAlign: 'center'}}>
                  <b>
                    <FormattedMessage id="ui.categoriesPopular.noMoreResults" defaultMessage="ui.categoriesPopular.noMoreResults" />
                  </b>
                </p>
              }>
              <List>
                {categories.map((c) => (
                  <ListItem key={c.id}>
                    <Category elevation={0} category={c} {...CategoryProps} followCategoryButtonProps={{onFollow: handleFollowersUpdate}} />
                  </ListItem>
                ))}
              </List>
            </InfiniteScroll>
          )}
        </BaseDialog>
      )}
    </CardContent>
  );

  /**
   * Renders root object (if results and autoHide prop is set to false, otherwise component is hidden)
   */
  if (autoHide && !total) {
    return <HiddenPlaceholder />;
  }
  return (
    <Root className={classNames(classes.root, className)} {...rest}>
      {c}
    </Root>
  );
}
