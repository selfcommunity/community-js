import React, {useContext, useEffect, useState} from 'react';
import {styled} from '@mui/material/styles';
import List from '@mui/material/List';
import {Button, CardContent, Typography} from '@mui/material';
import {Endpoints, http, Logger, SCUserContext, SCUserContextType} from '@selfcommunity/core';
import Category from '../Category';
import {AxiosResponse} from 'axios';
import {SCCategoryType} from '@selfcommunity/core/src/types';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {defineMessages, useIntl, FormattedMessage} from 'react-intl';
import {CategoriesListProps} from '../CategoriesSuggestion';
import Skeleton from './Skeleton';
import classNames from 'classnames';
import BaseDialog from '../../shared/BaseDialog';
import CentralProgress from '../../shared/CentralProgress';
import InfiniteScroll from 'react-infinite-scroll-component';
import Widget from '../Widget';
import useThemeProps from '@mui/material/styles/useThemeProps';

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
  maxWidth: 700,
  marginBottom: theme.spacing(2)
}));
/**
 > API documentation for the Community-UI Categories Followed component. Learn about the available props and the CSS API.
 *
 #### Import
 ```jsx
 import {CategoriesFollowed} from '@selfcommunity/ui';
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
  const {userId, autoHide, className, CategoryProps = {}} = props;

  // STATE
  const [categories, setCategories] = useState<any[]>([]);
  const [visibleCategories, setVisibleCategories] = useState<number>(limit);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [openCategoriesFollowedDialog, setOpenCategoriesFollowedDialog] = useState<boolean>(false);
  const [next, setNext] = useState<string>(`${Endpoints.FollowedCategories.url({id: userId ?? scUserContext.user['id']})}?limit=10`);

  // CONST
  const authUserId = scUserContext.user ? scUserContext.user.id : null;

  /**
   * Handles list change on category follow
   */
  function handleOnFollowCategory(category, follow) {
    if (scUserContext.user['id'] === userId) {
      setCategories(categories.filter((c) => c.id !== category.id));
      setTotal((prev) => prev - 1);
      if (visibleCategories < limit && total > 1) {
        loadCategories(1);
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
        .then((res: AxiosResponse<any>) => {
          const data = res.data;
          setCategories([...categories, ...data]);
          setTotal(data.length);
          setNext(data['next']);
          setHasMore(data.length > visibleCategories);
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
          Logger.error(SCOPE_SC_UI, error);
        });
    }
  }

  /**
   * Loads more categories when followed list changes
   */
  function loadCategories(n) {
    const newIndex = visibleCategories + n;
    const newHasMore = newIndex < categories.length - 1;
    setVisibleCategories(newIndex);
    setHasMore(newHasMore);
  }

  /**
   * On mount, fetches the list of categories followed
   */
  useEffect(() => {
    fetchCategoriesFollowed();
  }, [authUserId]);

  /**
   * Renders the list of categories followed
   */
  const c = (
    <React.Fragment>
      {loading ? (
        <Skeleton elevation={0} />
      ) : (
        <CardContent>
          {!total ? (
            <Typography className={classes.noResults} variant="body2">{`${intl.formatMessage(messages.noCategories)}`}</Typography>
          ) : (
            <React.Fragment>
              <Typography className={classes.title} variant="body1">{`${intl.formatMessage(messages.title, {
                total: total
              })}`}</Typography>
              <List>
                {categories.slice(0, visibleCategories).map((category: SCCategoryType, index) => (
                  <div key={index}>
                    <Category
                      elevation={0}
                      category={category}
                      key={category.id}
                      followCategoryButtonProps={{onFollow: handleOnFollowCategory}}
                      {...CategoryProps}
                    />
                  </div>
                ))}
              </List>
              {hasMore && (
                <Button size="small" className={classes.showMore} onClick={() => setOpenCategoriesFollowedDialog(true)}>
                  <FormattedMessage id="ui.categoriesFollowed.button.showAll" defaultMessage="ui.categoriesFollowed.button.showAll" />
                </Button>
              )}
            </React.Fragment>
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
                  hasMore={Boolean(next)}
                  loader={<CentralProgress size={30} />}
                  height={400}
                  endMessage={
                    <p style={{textAlign: 'center'}}>
                      <b>
                        <FormattedMessage id="ui.categoriesFollowed.noMoreResults" defaultMessage="ui.categoriesFollowed.noMoreResults" />
                      </b>
                    </p>
                  }>
                  <List>
                    {categories.map((c, index) => (
                      <Category
                        elevation={0}
                        category={c}
                        key={c.id}
                        sx={{m: 0}}
                        followCategoryButtonProps={{onFollow: handleOnFollowCategory}}
                        {...CategoryProps}
                      />
                    ))}
                  </List>
                </InfiniteScroll>
              )}
            </BaseDialog>
          )}
        </CardContent>
      )}
    </React.Fragment>
  );

  /**
   * Renders root object (if results and if user is logged, otherwise component is hidden)
   */
  if (autoHide && !total) {
    return null;
  }
  return <Root className={classNames(classes.root, className)}>{c}</Root>;
}
