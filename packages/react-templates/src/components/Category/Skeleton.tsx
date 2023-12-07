import React from 'react';
import {Box} from '@mui/material';
import {styled} from '@mui/material/styles';
import CategoryFeedSkeleton from '../CategoryFeed/Skeleton';
import {CategoryHeaderSkeleton} from '@selfcommunity/react-ui';
import {PREFIX} from './constants';

const classes = {
  root: `${PREFIX}-skeleton-root`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'SkeletonRoot'
})(() => ({}));

/**
 * > API documentation for the Community-JS Category Skeleton Template. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {CategorySkeleton} from '@selfcommunity/react-templates';
 ```

 #### Component Name

 The name `SCCategoryTemplate-skeleton-root` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCCategoryTemplate-skeleton-root|Styles applied to the root element.|
 *
 */
export default function CategorySkeleton(): JSX.Element {
  return (
    <Root className={classes.root}>
      <CategoryHeaderSkeleton />
      <CategoryFeedSkeleton />
    </Root>
  );
}
