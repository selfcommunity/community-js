import React from 'react';
import {Box} from '@mui/material';
import {styled} from '@mui/material/styles';
import CategoryFeedSkeleton from '../CategoryFeed/Skeleton';
import {GroupHeaderSkeleton} from '@selfcommunity/react-ui';
import {PREFIX} from './constants';

const classes = {
  root: `${PREFIX}-skeleton-root`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'SkeletonRoot'
})(() => ({}));

/**
 * > API documentation for the Community-JS Group Skeleton Template. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {GroupSkeletonTemplate} from '@selfcommunity/react-templates';
 ```

 #### Component Name

 The name `SCGroupTemplate-skeleton-root` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCGroupTemplate-skeleton-root|Styles applied to the root element.|
 *
 */
export default function GroupSkeletonTemplate(): JSX.Element {
  return (
    <Root className={classes.root}>
      <GroupHeaderSkeleton />
      <CategoryFeedSkeleton />
    </Root>
  );
}
