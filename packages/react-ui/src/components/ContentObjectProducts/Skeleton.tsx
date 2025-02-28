import React from 'react';
import {styled} from '@mui/material/styles';
import {Box, Grid} from '@mui/material';
import BaseItem from '../../shared/BaseItem';
import {PREFIX} from './constants';
import classNames from 'classnames';
import ContentObjectProductSkeleton from '../ContentObjectProduct/Skeleton';

const classes = {
  root: `${PREFIX}-skeleton-root`,
  products: `${PREFIX}-products`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'SkeletonRoot'
})(() => ({
	overflow: 'hidden',
}));

/**
 * > API documentation for the Community-JS ContentObjectProductsSkeleton component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {ContentObjectProductsSkeleton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCContentObjectProductsSkeleton-skeleton-root` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCContentObjectProductsSkeleton-skeleton-root|Styles applied to the root element.|
 *
 */
export default function ContentObjectProductsSkeleton(inProps): JSX.Element {
  const {className, ContentObjectProductSkeletonProps = {}, ...rest} = inProps;

  return (
    <Root className={classNames(classes.root, className)} {...rest}>
      <Grid container spacing={{xs: 3}} className={classes.products}>
        {[...Array(5)].map((product, index) => (
          <Grid item xs={12} key={index}>
            <ContentObjectProductSkeleton elevation={0} variant={'outlined'} {...ContentObjectProductSkeletonProps} />
          </Grid>
        ))}
      </Grid>
    </Root>
  );
}
