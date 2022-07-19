import React, {useContext, useEffect, useState} from 'react';
import {styled} from '@mui/material/styles';
import {Button, Typography, List, CardContent, ListItem} from '@mui/material';
import {http, Endpoints, HttpResponse} from '@selfcommunity/api-services';
import {SCUserContext, SCUserContextType, useIsComponentMountedRef} from '@selfcommunity/react-core';
import {SCCategoryType} from '@selfcommunity/types';
import Skeleton from './Skeleton';
import Category, {CategoryProps} from '../Category';
import {FormattedMessage} from 'react-intl';
import classNames from 'classnames';
import Widget from '../Widget';
import {useThemeProps} from '@mui/system';
import HiddenPlaceholder from '../../shared/HiddenPlaceholder';

const PREFIX = 'SCCategoriesSuggestion';

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
 * > API documentation for the Community-JS Categories Suggestion component. Learn about the available props and the CSS API.
 *
 #### Import
 ```jsx
 import {CategoriesSuggestion} from '@selfcommunity/react-ui';
 ```
 #### Component Name
 The name `SCCategoriesSuggestion` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCCategoriesSuggestion-root|Styles applied to the root element.|
 |title|.SCCategoriesSuggestion-title|Styles applied to the title element.|
 |noResults|.SCCategoriesSuggestion-no-results|Styles applied to no results section.|
 |showMore|.SCCategoriesSuggestion-show-more|Styles applied to show more button element.|


 * @param inProps
 */
export default function CategoriesSuggestion(inProps: CategoriesListProps): JSX.Element {
  // CONST
  const limit = 3;

  // PROPS
  const props: CategoriesListProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });

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

  // REFS
  const isMountedRef = useIsComponentMountedRef();

  /**
   * Handles list change on category follow
   */
  function handleOnFollowCategory(category, follow) {
    setCategories(categories.filter((c) => c.id !== category.id));
    setTotal((prev) => prev - 1);
    setHasMore(total - 1 > limit);
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
      .then((res: HttpResponse<any>) => {
        if (isMountedRef.current) {
          const data = res.data;
          setCategories(data.results);
          setHasMore(data.count > visibleCategories);
          setLoading(false);
          setTotal(data.count);
        }
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
        <CardContent>
          <Typography className={classes.title} variant="h5">
            <FormattedMessage id="ui.categoriesSuggestion.title" defaultMessage="ui.categoriesSuggestion.title" />
          </Typography>
          {!total ? (
            <Typography className={classes.noResults} variant="body2">
              <FormattedMessage id="ui.categoriesSuggestion.noResults" defaultMessage="ui.categoriesSuggestion.noResults" />
            </Typography>
          ) : (
            <React.Fragment>
              <List>
                {categories.slice(0, visibleCategories).map((category: SCCategoryType) => (
                  <ListItem key={category.id}>
                    <Category elevation={0} category={category} followCategoryButtonProps={{onFollow: handleOnFollowCategory}} {...CategoryProps} />
                  </ListItem>
                ))}
              </List>
              {hasMore && (
                <Button size="small" className={classes.showMore} onClick={() => loadCategories(2)}>
                  <FormattedMessage id="ui.categoriesSuggestion.button.showMore" defaultMessage="ui.categoriesSuggestion.button.showMore" />
                </Button>
              )}
            </React.Fragment>
          )}
          {openCategoriesSuggestionDialog && <></>}
        </CardContent>
      )}
    </React.Fragment>
  );

  /**
   * Renders root object (if results and if user is logged, otherwise component is hidden)
   */
  if (autoHide && !total) {
    return <HiddenPlaceholder />;
  }
  if (scUserContext.user) {
    return (
      <Root className={classNames(classes.root, className)} {...rest}>
        {c}
      </Root>
    );
  }
  return <HiddenPlaceholder />;
}
