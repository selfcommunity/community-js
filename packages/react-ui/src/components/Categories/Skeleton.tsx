import React from 'react';
import {styled} from '@mui/material/styles';
import {Box, Grid} from '@mui/material';
import CategorySkeleton from '../Category/Skeleton';
import classNames from 'classnames';
import {PREFIX} from './constants';

const classes = {
  root: `${PREFIX}-skeleton-root`,
  categories: `${PREFIX}-categories`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'SkeletonRoot'
})(() => ({}));

export interface CategoriesSkeletonProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;

  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  CategorySkeletonProps?: any;
}

/**
 * > API documentation for the Community-JS Categories Skeleton component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {CategoriesSkeleton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCCategories-skeleton-root` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCCategories-skeleton-root|Styles applied to the root element.|
 |categories|.SCCategories-categories|Styles applied to the categories' element.|
 *
 */
export default function CategoriesSkeleton(inProps: CategoriesSkeletonProps): JSX.Element {
  const {className, CategorySkeletonProps = {}, ...rest} = inProps;

  return (
    <Root className={classNames(classes.root, className)} {...rest}>
      <Grid container spacing={{xs: 3}} className={classes.categories}>
        {[...Array(15)].map((category, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <CategorySkeleton elevation={0} variant={'outlined'} {...CategorySkeletonProps} />
          </Grid>
        ))}
      </Grid>
    </Root>
  );
}
