import React, {useContext, useEffect, useState} from 'react';
import {styled} from '@mui/material/styles';
import {Button, Typography, List} from '@mui/material';
import {Endpoints, http, SCUserContext, SCUserContextType, SCCategoryType} from '@selfcommunity/core';
import Skeleton from './Skeleton';
import Category, {CategoryProps} from '../Category';
import {AxiosResponse} from 'axios';
import {FormattedMessage} from 'react-intl';
import classNames from 'classnames';
import Widget from '../Widget';

const PREFIX = 'SCCategoriesSuggestion';

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
  marginBottom: theme.spacing(2),
  padding: 16,
  paddingBottom: 24
}));

export interface CategoriesListProps {
  /**
   * The user id
   * @default null
   */
  userId?: number;
  /**
   * Hides this component
   * @default false
   */
  autoHide?: boolean;
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
  /**
   * Props to spread to single category object
   * @default empty object
   */
  CategoryProps?: CategoryProps;

  /**
   * Other props
   */
  [p: string]: any;
}

/**
 * > API documentation for the Community-UI Categories Suggestion component. Learn about the available props and the CSS API.
 *
 #### Import
 ```jsx
 import {CategoriesSuggestion} from '@selfcommunity/ui';
 ```
 #### Component Name
 The name `SCCategoriesSuggestion` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCCategoriesSuggestion-root|Styles applied to the root element.|
 |title|.SCCategoriesSuggestion-title|Styles applied to the title element.|
 |noResults|.SCCategoriesSuggestion-noResults|Styles applied to noResults section.|


 * @param props
 */
export default function CategoriesSuggestion(props: CategoriesListProps): JSX.Element {
  // CONST
  const limit = 3;

  // PROPS
  const {autoHide, className, CategoryProps = {}, ...rest} = props;

  // STATE
  const [categories, setCategories] = useState<any[]>([]);
  const [visibleCategories, setVisibleCategories] = useState<number>(limit);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [openCategoriesSuggestionDialog, setOpenCategoriesSuggestionDialog] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);

  // CONTEXT
  const scUserContext: SCUserContextType = useContext(SCUserContext);

  // CONST
  const authUserId = scUserContext.user ? scUserContext.user.id : null;

  /**
   * Handles list change on category follow
   */
  function handleOnFollowCategory(category, follow) {
    setCategories(categories.filter((c) => c.id !== category.id));
    if (visibleCategories < limit && total > 1) {
      loadCategories(1);
    }
  }

  /**
   * Fetches categories suggestion list
   */
  function fetchCategoriesSuggestion() {
    http
      .request({
        url: Endpoints.CategoriesSuggestion.url(),
        method: Endpoints.CategoriesSuggestion.method
      })
      .then((res: AxiosResponse<any>) => {
        const data = res.data;
        setCategories(data.results);
        setHasMore(data.count > visibleCategories);
        setLoading(false);
        setTotal(data.count);
      })
      .catch((error) => {
        console.log(error);
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
   * On mount, fetches categories suggestion list
   */
  useEffect(() => {
    if (scUserContext.user) {
      fetchCategoriesSuggestion();
    }
  }, [authUserId]);

  /**
   * Renders categories suggestion list
   */
  const c = (
    <React.Fragment>
      {loading ? (
        <Skeleton elevation={0} />
      ) : (
        <>
          <Typography className={classes.title} variant="body1">
            <FormattedMessage id="ui.categoriesSuggestion.title" defaultMessage="ui.categoriesSuggestion.title" />
          </Typography>
          {!total ? (
            <Typography className={classes.noResults} variant="body2">
              <FormattedMessage id="ui.categoriesSuggestion.noResults" defaultMessage="ui.categoriesSuggestion.noResults" />
            </Typography>
          ) : (
            <React.Fragment>
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
                  <FormattedMessage id="ui.categoriesSuggestion.button.showMore" defaultMessage="ui.categoriesSuggestion.button.showMore" />
                </Button>
              )}
            </React.Fragment>
          )}
          {openCategoriesSuggestionDialog && <></>}
        </>
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
    return (
      <Root className={classNames(classes.root, className)} {...rest}>
        {c}
      </Root>
    );
  }
  return null;
}
