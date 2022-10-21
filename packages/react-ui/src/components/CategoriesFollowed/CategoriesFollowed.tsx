import React, {useContext, useEffect, useState} from 'react';
import {styled} from '@mui/material/styles';
import List from '@mui/material/List';
import {Button, CardContent, ListItem, Typography, useMediaQuery, useTheme} from '@mui/material';
import {http, Endpoints, HttpResponse} from '@selfcommunity/api-services';
import {Logger} from '@selfcommunity/utils';
import {SCUserContext, SCUserContextType, useIsComponentMountedRef} from '@selfcommunity/react-core';
import Category from '../Category';
import {SCCategoryType} from '@selfcommunity/types';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {defineMessages, useIntl, FormattedMessage} from 'react-intl';
import {CategoriesListProps} from '../CategoriesSuggestion';
import Skeleton from './Skeleton';
import classNames from 'classnames';
import BaseDialog from '../../shared/BaseDialog';
import CentralProgress from '../../shared/CentralProgress';
import InfiniteScroll from '../../shared/InfiniteScroll';
import Widget from '../Widget';
import {useThemeProps} from '@mui/system';
import HiddenPlaceholder from '../../shared/HiddenPlaceholder';

const messages = defineMessages({
  title: {
    id: 'ui.categoriesFollowed.title',
    defaultMessage: 'ui.categoriesFollowed.title'
  },
  noCategories: {
    id: 'ui.categoriesFollowed.subtitle.noResults',
    defaultMessage: 'ui.categoriesFollowed.subtitle.noResults'
  }
});

const PREFIX = 'SCCategoriesFollowed';

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
 > API documentation for the Community-JS Categories Followed component. Learn about the available props and the CSS API.
 *
 #### Import
 ```jsx
 import {CategoriesFollowed} from '@selfcommunity/react-ui';
 ```
 #### Component Name
 The name `SCCategoriesFollowed` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCCategoryFollowed-root|Styles applied to the root element.|
 |title|.SCCategoryFollowed-title|Styles applied to the title element.|
 |noResults|.SCCategoryFollowed-no-results|Styles applied to no results section.|
 |showMore|.SCCategoryFollowed-show-more|Styles applied to show more button element.|

 * @param inProps
 */
export default function CategoriesFollowed(inProps: CategoriesListProps): JSX.Element {
  // CONST
  const limit = 3;

  // INTL
  const intl = useIntl();

  // CONTEXT
  const scUserContext: SCUserContextType = useContext(SCUserContext);

  // PROPS
  const props: CategoriesListProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {userId, autoHide, className, CategoryProps = {}, onHeightChange} = props;

  // REFS
  const isMountedRef = useIsComponentMountedRef();

  // STATE
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [openCategoriesFollowedDialog, setOpenCategoriesFollowedDialog] = useState<boolean>(false);
  const [next, setNext] = useState<string>(`${Endpoints.FollowedCategories.url({id: userId})}?limit=10`);

  // CONST
  const authUserId = scUserContext.user ? scUserContext.user.id : null;

  /**
   * Handles list change on category follow
   */
  function handleOnFollowCategory(category) {
    if (scUserContext.user['id'] === userId) {
      setCategories(categories.filter((c) => c.id !== category.id));
      setTotal((prev) => prev - 1);
      setHasMore(total - 1 > limit);
    } else {
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
  }

  /**
   * fetches Categories Followed
   */
  function fetchCategoriesFollowed() {
    if (next) {
      http
        .request({
          url: next,
          method: Endpoints.FollowedCategories.method
        })
        .then((res: HttpResponse<any>) => {
          if (isMountedRef.current) {
            const data = res.data;
            setCategories([...categories, ...data]);
            setTotal(data.length);
            setNext(data['next']);
            setHasMore(data.length > limit);
            setLoading(false);
          }
        })
        .catch((error) => {
          setLoading(false);
          Logger.error(SCOPE_SC_UI, error);
        });
    }
  }

  /**
   * On mount, fetches the list of categories followed
   */
  useEffect(() => {
    if (!userId) {
      return;
    }
    fetchCategoriesFollowed();
  }, [authUserId]);

  /**
   * Virtual feed update
   */
  useEffect(() => {
    onHeightChange && onHeightChange();
  }, [categories.length]);

  /**
   * Renders the list of categories followed
   */
  if (loading) {
    return <Skeleton />;
  }
  const c = (
    <CardContent>
      <Typography className={classes.title} variant="h5">{`${intl.formatMessage(messages.title, {
        total: total
      })}`}</Typography>
      {!total ? (
        <Typography className={classes.noResults} variant="body2">{`${intl.formatMessage(messages.noCategories)}`}</Typography>
      ) : (
        <React.Fragment>
          <List>
            {categories.slice(0, limit).map((category: SCCategoryType) => (
              <ListItem key={category.id}>
                <Category elevation={0} category={category} followCategoryButtonProps={{onFollow: handleOnFollowCategory}} {...CategoryProps} />
              </ListItem>
            ))}
          </List>
          {hasMore && (
            <Button size="small" className={classes.showMore} onClick={() => setOpenCategoriesFollowedDialog(true)}>
              <FormattedMessage id="ui.categoriesFollowed.button.showAll" defaultMessage="ui.categoriesFollowed.button.showAll" />
            </Button>
          )}
          {openCategoriesFollowedDialog && (
            <BaseDialog
              title={`${intl.formatMessage(messages.title, {total: total})}`}
              onClose={() => setOpenCategoriesFollowedDialog(false)}
              open={openCategoriesFollowedDialog}>
              {loading ? (
                <CentralProgress size={50} />
              ) : (
                <InfiniteScroll
                  dataLength={categories.length}
                  next={fetchCategoriesFollowed}
                  hasMoreNext={Boolean(next)}
                  loaderNext={<CentralProgress size={30} />}
                  height={isMobile ? '100vh' : 400}
                  endMessage={
                    <p style={{textAlign: 'center'}}>
                      <b>
                        <FormattedMessage id="ui.categoriesFollowed.noMoreResults" defaultMessage="ui.categoriesFollowed.noMoreResults" />
                      </b>
                    </p>
                  }>
                  <List>
                    {categories.map((c) => (
                      <ListItem key={c.id}>
                        <Category
                          elevation={0}
                          category={c}
                          sx={{m: 0}}
                          followCategoryButtonProps={{onFollow: handleOnFollowCategory}}
                          {...CategoryProps}
                        />
                      </ListItem>
                    ))}
                  </List>
                </InfiniteScroll>
              )}
            </BaseDialog>
          )}
        </React.Fragment>
      )}
    </CardContent>
  );

  /**
   * Renders root object (if results and if user is logged, otherwise component is hidden)
   */
  if (autoHide && !total) {
    return <HiddenPlaceholder />;
  }
  /**
   * If there's no userId, component is hidden.
   */
  if (!userId) {
    return <HiddenPlaceholder />;
  }
  return <Root className={classNames(classes.root, className)}>{c}</Root>;
}
