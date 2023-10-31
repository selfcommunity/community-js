import React from 'react';
import {CategoryTrendingFeedWidgetSkeleton} from '../CategoryTrendingFeedWidget';
import {styled} from '@mui/material/styles';
import {PREFIX} from './constants';

const classes = {
  root: `${PREFIX}-skeleton-root`
};

const Root = styled(CategoryTrendingFeedWidgetSkeleton, {
  name: PREFIX,
  slot: 'SkeletonRoot'
})(() => ({}));
/**
 * > API documentation for the Community-JS Related Feed Objects Widget Skeleton component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {RelatedFeedObjectsWidgetSkeleton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCRelatedFeedObjects-skeleton-root` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCRelatedFeedObjectsWidget-skeleton-root|Styles applied to the root element.|
 *
 */
export default function RelatedFeedObjectsWidgetSkeleton(): JSX.Element {
  return <Root className={classes.root} />;
}
