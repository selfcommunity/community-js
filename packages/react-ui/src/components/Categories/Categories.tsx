import React, {useContext, useEffect, useState} from 'react';
import {styled} from '@mui/material/styles';
import {Box, Grid, TextField, Typography} from '@mui/material';
import {CategoryService, Endpoints} from '@selfcommunity/api-services';
import {
  SCPreferences,
  SCPreferencesContext,
  SCPreferencesContextType,
  SCUserContext,
  SCUserContextType,
  useIsComponentMountedRef
} from '@selfcommunity/react-core';
import {SCCategoryType} from '@selfcommunity/types';
import CategoriesSkeleton, {CategoriesSkeletonProps} from './Skeleton';
import Category, {CategoryProps} from '../Category';
import {FormattedMessage} from 'react-intl';
import classNames from 'classnames';
import {useThemeProps} from '@mui/system';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {Logger} from '@selfcommunity/utils';
import HiddenPlaceholder from '../../shared/HiddenPlaceholder';

const PREFIX = 'SCCategories';

const classes = {
  root: `${PREFIX}-root`,
  filters: `${PREFIX}-filter`,
  categories: `${PREFIX}-categories`,
  category: `${PREFIX}-category`,
  noResults: `${PREFIX}-no-results`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  [`& .${classes.filters}`]: {
    marginTop: theme.spacing(),
    marginBottom: theme.spacing(2)
  },
  [`& .${classes.category}`]: {
    '& > div': {
      cursor: 'default'
    },
    ' .SCCategory-category-image': {
      minWidth: 56,
      height: '100%',
      borderTopLeftRadius: theme.shape.borderRadius,
      borderBottomLeftRadius: theme.shape.borderRadius
    }
  }
}));

export interface CategoriesProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;

  /**
   * CategoryComponent component
   * Usefully to override the single Category render component
   * @default Category
   */
  CategoryComponent?: (inProps: CategoryProps) => JSX.Element;

  /**
   * Props to spread to single category object
   * @default {variant: 'outlined', ButtonBaseProps: {disableRipple: 'true'}}
   */
  CategoryComponentProps?: CategoryProps;

  /**
   * CategorySkeletonComponent component
   * Usefully to override the single Category skeleton render component
   * @default Skeleton
   */
  CategoriesSkeletonComponent?: (inProps: any) => JSX.Element;

  /**
   * Props to spread to single category skeleton object
   * @default {variant: 'outlined'}
   */
  CategoriesSkeletonProps?: CategoriesSkeletonProps;

  /**
   * Show/Hide filters
   * @default true
   */
  showFilters?: boolean;

  /**
   * Filters component
   * @param props
   */
  filters?: JSX.Element;

  /**
   * Override filter func
   * @default null
   */
  handleFilterCategories?: (categories: SCCategoryType[]) => SCCategoryType[];

  /**
   * Prefetch categories. Useful for SSR.
   * Use this to init the component with categories
   * @default null
   */
  prefetchedCategories?: SCCategoryType[];

  /**
   * Other props
   */
  [p: string]: any;
}

/**
 * > API documentation for the Community-JS Categories component. Learn about the available props and the CSS API.
 *
 #### Import
 ```jsx
 import {Categories} from '@selfcommunity/react-ui';
 ```
 #### Component Name
 The name `SCCategories` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCCategories-root|Styles applied to the root element.|
 |filters|.SCCategories-filter|Styles applied to the filter.|
 |categories|.SCCategories-categories|Styles applied to the list of categories.|
 |category|.SCCategories-category|Styles applied to the of category element.|
 |noResults|.SCCategories-no-results|Styles applied to no results section.|

 * @param inProps
 */
export default function Categories(inProps: CategoriesProps): JSX.Element {
  // PROPS
  const props: CategoriesProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });

  const {
    className,
    CategoryComponent = Category,
    CategoryComponentProps = {variant: 'outlined', ButtonBaseProps: {disableRipple: true, component: Box}},
    CategoriesSkeletonComponent = CategoriesSkeleton,
    CategoriesSkeletonProps = {},
    showFilters = true,
    filters,
    handleFilterCategories,
    prefetchedCategories = [],
    ...rest
  } = props;

  // STATE
  const [categories, setCategories] = useState<SCCategoryType[]>(prefetchedCategories);
  const [loading, setLoading] = useState<boolean>(!prefetchedCategories.length);
  const [filterName, setFilterName] = useState<string>('');

  // CONTEXT
  const scUserContext: SCUserContextType = useContext(SCUserContext);
  const scPreferencesContext: SCPreferencesContextType = useContext(SCPreferencesContext);
  const contentAvailability =
    SCPreferences.CONFIGURATIONS_CONTENT_AVAILABILITY in scPreferencesContext.preferences &&
    scPreferencesContext.preferences[SCPreferences.CONFIGURATIONS_CONTENT_AVAILABILITY].value;

  // CONST
  const authUserId = scUserContext.user ? scUserContext.user.id : null;

  // REFS
  const isMountedRef = useIsComponentMountedRef();

  /**
   * Fetches categories list
   */
  const fetchCategories = async (next: string = Endpoints.CategoryList.url({})): Promise<[]> => {
    const data: any = await CategoryService.getAllCategories({active: true}, {url: next});
    return data.next ? data.results.concat(await fetchCategories(data.next)) : data.results;
  };

  /**
   * On mount, fetches categories list
   */
  useEffect(() => {
    if (!contentAvailability && !authUserId) {
      return;
    } else if (scUserContext.user && !prefetchedCategories.length) {
      fetchCategories()
        .then((data: any) => {
          if (isMountedRef.current) {
            setCategories(data);
            setLoading(false);
          }
        })
        .catch((error) => {
          Logger.error(SCOPE_SC_UI, error);
        });
    }
  }, [authUserId, prefetchedCategories.length]);

  /**
   * Get categories filtered
   */
  const getFilteredCategories = () => {
    if (handleFilterCategories) {
      return handleFilterCategories(categories);
    }
    if (filterName) {
      return categories.filter((c) => c.name.toLowerCase().includes(filterName.toLowerCase()));
    }
    return categories;
  };

  /**
   * Handle change filter name
   * @param event
   */
  const handleOnChangeFilterName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterName(event.target.value);
  };

  /**
   * Renders categories list
   */
  const filteredCategories = getFilteredCategories();
  const c = (
    <>
      {showFilters && (
        <Grid container direction="row" justifyContent="center" alignItems="center" className={classes.filters}>
          {filters ? (
            filters
          ) : (
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                value={filterName}
                label={<FormattedMessage id="ui.categories.filterByName" defaultMessage="ui.categories.filterByName" />}
                variant="outlined"
                onChange={handleOnChangeFilterName}
                disabled={loading}
              />
            </Grid>
          )}
        </Grid>
      )}
      {loading ? (
        <CategoriesSkeletonComponent {...CategoriesSkeletonProps} />
      ) : (
        <Grid container spacing={{xs: 3}} className={classes.categories}>
          {!filteredCategories.length ? (
            <Grid item>
              <Typography className={classes.noResults} variant="body2">
                <FormattedMessage id="ui.categories.noResults" defaultMessage="ui.categories.noResults" />
              </Typography>
            </Grid>
          ) : (
            <>
              {filteredCategories.map((category: SCCategoryType) => (
                <Grid item xs={12} sm={6} md={4} key={category.id}>
                  <CategoryComponent category={category} {...CategoryComponentProps} className={classes.category} />
                </Grid>
              ))}
            </>
          )}
        </Grid>
      )}
    </>
  );

  /**
   * Renders root object (if content availability community option is false and user is anonymous, component is hidden)
   */
  if (!contentAvailability && !scUserContext.user) {
    return <HiddenPlaceholder />;
  }
  return (
    <Root className={classNames(classes.root, className)} {...rest}>
      {c}
    </Root>
  );
}
