import React, {useContext, useEffect, useState} from 'react';
import {styled} from '@mui/material/styles';
import List from '@mui/material/List';
import {Button, Typography} from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import {Endpoints, http, Logger, SCUserContext, SCUserContextType, useSCFetchUser} from '@selfcommunity/core';
import Category from '../Category';
import {AxiosResponse} from 'axios';
import {SCCategoryType} from '@selfcommunity/core/src/types';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {defineMessages, useIntl, FormattedMessage} from 'react-intl';
import {CategoriesListProps} from '../CategoriesSuggestion';
import Skeleton from './Skeleton';
import classNames from 'classnames';

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
 > API documentation for the Community-UI Categories Followed component. Learn about the available props and the CSS API.
 *
 #### Import
 ```jsx
 import CategoriesFollowed from '@selfcommunity/ui';
 ```
 #### Component Name
 The name `SCCategoriesFollowed` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCCategoryFollowed-root|Styles applied to the root element.|

 * @param props
 */
export default function CategoriesFollowed(props: CategoriesListProps): JSX.Element {
  // CONST
  const limit = 3;

  // INTL
  const intl = useIntl();

  // CONTEXT
  const scUserContext: SCUserContextType = useContext(SCUserContext);

  // PROPS
  const {userId, autoHide, className, CategoryProps = {}} = props;

  // STATE
  const [categories, setCategories] = useState<any[]>([]);
  const [visibleCategories, setVisibleCategories] = useState<number>(limit);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);

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
    http
      .request({
        url: Endpoints.FollowedCategories.url({id: userId ?? scUserContext.user['id']}),
        method: Endpoints.FollowedCategories.method
      })
      .then((res: AxiosResponse<any>) => {
        const data = res.data;
        setCategories(data);
        setTotal(data.length);
        setHasMore(data.length > visibleCategories);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        Logger.error(SCOPE_SC_UI, error);
      });
  }

  /**
   * Loads more categories on "see more" button click
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
    if (scUserContext.user) {
      fetchCategoriesFollowed();
    }
  }, []);

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
            <Typography variant="body2">{`${intl.formatMessage(messages.noCategories)}`}</Typography>
          ) : (
            <React.Fragment>
              <Typography variant="body1">{`${intl.formatMessage(messages.categoriesFollowed, {total: total})}`}</Typography>
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
                <Button size="small" onClick={() => loadCategories(2)}>
                  <FormattedMessage id="ui.categoriesFollowed.button.showMore" defaultMessage="ui.categoriesFollowed.button.showMore" />
                </Button>
              )}
            </React.Fragment>
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
  if (scUserContext.user) {
    return <Root className={classNames(classes.root, className)}>{c}</Root>;
  }
  return null;
}
