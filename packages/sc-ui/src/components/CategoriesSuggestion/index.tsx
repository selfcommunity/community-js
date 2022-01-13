import React, {useEffect, useState} from 'react';
import {styled} from '@mui/material/styles';
import {Button, Divider, Typography} from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import {Endpoints, http} from '@selfcommunity/core';
import CategoriesSuggestionSkeleton from '../Skeleton/CategoriesSuggestionSkeleton';
import Category, {CategoryProps} from '../Category';
import {AxiosResponse} from 'axios';
import {SCCategoryType} from '@selfcommunity/core/src/types';
import {FormattedMessage} from 'react-intl';

const PREFIX = 'SCCategoriesSuggestion';

const Root = styled(Card, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  maxWidth: 700,
  marginBottom: theme.spacing(2)
}));

export interface CategoriesListProps {
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
}

export default function CategoriesSuggestion(props: CategoriesListProps): JSX.Element {
  // CONST
  const limit = 3;

  // PROPS
  const {autoHide, className, CategoryProps = {}} = props;

  // STATE
  const [categories, setCategories] = useState<any[]>([]);
  const [visibleCategories, setVisibleCategories] = useState<number>(limit);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [openCategoriesSuggestionDialog, setOpenCategoriesSuggestionDialog] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);

  /**
   * Handles list change on category follow
   */
  function handleClick(clickedId) {
    setCategories(categories.filter((c) => c.id !== clickedId));
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
    fetchCategoriesSuggestion();
  }, []);

  /**
   * Renders categories suggestion list
   */
  const c = (
    <React.Fragment>
      {loading ? (
        <CategoriesSuggestionSkeleton elevation={0} />
      ) : (
        <CardContent>
          <Typography variant="body1">
            <FormattedMessage id="ui.categoriesSuggestion.title" defaultMessage="ui.categoriesSuggestion.title" />
          </Typography>
          {!total ? (
            <Typography variant="body2">
              <FormattedMessage id="ui.categoriesSuggestion.noResults" defaultMessage="ui.categoriesSuggestion.noResults" />
            </Typography>
          ) : (
            <React.Fragment>
              {categories.slice(0, visibleCategories).map((category: SCCategoryType, index) => (
                <div key={index}>
                  <Category elevation={0} category={category} key={category.id} onFollowProps={() => handleClick(category.id)} {...CategoryProps} />
                  {index < visibleCategories - 1 ? <Divider /> : null}
                </div>
              ))}
              {hasMore && (
                <Button size="small" onClick={() => loadCategories(2)}>
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
   * Renders root object (if not hidden by autoHide prop)
   */
  if (!autoHide) {
    return <Root className={className}>{c}</Root>;
  }
  return null;
}
