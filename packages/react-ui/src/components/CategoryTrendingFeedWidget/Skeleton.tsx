import React from 'react';
import Widget from '../Widget';
import List from '@mui/material/List';
import {styled} from '@mui/material/styles';
import FeedObjectSkeleton from '../FeedObject/Skeleton';
import {CardContent} from '@mui/material';
import {PREFIX} from './constants';

const classes = {
  root: `${PREFIX}-skeleton-root`,
  list: `${PREFIX}-list`
};

const Root = styled(Widget, {
  name: PREFIX,
  slot: 'SkeletonRoot'
})(() => ({}));

/**
 * > API documentation for the Community-JS Trending Feed Widget Skeleton component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {CategoryTrendingFeedWidgetSkeleton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCCategoryTrendingFeedWidget-skeleton-root` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCCategoryTrendingFeedWidget-skeleton-root|Styles applied to the root element.|
 |list|.SCCategoryTrendingFeedWidget-list|Styles applied to the list element.|
 *
 */
export default function CategoryTrendingFeedWidgetSkeleton(props): JSX.Element {
  return (
    <Root className={classes.root} {...props}>
      <CardContent>
        <List className={classes.list}>
          {[...Array(4)].map((post, index) => (
            <FeedObjectSkeleton key={index} elevation={0} />
          ))}
        </List>
      </CardContent>
    </Root>
  );
}
