import React from 'react';
import Widget from '../Widget';
import List from '@mui/material/List';
import {styled} from '@mui/material/styles';
import FeedObjectSkeleton from '../FeedObject/Skeleton';
import {CardContent} from '@mui/material';

const PREFIX = 'SCCategoryTrendingFeedWidgetSkeleton';

const classes = {
  root: `${PREFIX}-root`,
  list: `${PREFIX}-list`
};

const Root = styled(Widget)(({theme}) => ({
  marginBottom: theme.spacing(2)
}));
/**
 * > API documentation for the Community-JS Trending Feed Widget Skeleton component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {CategoryTrendingFeedWidgetSkeleton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCCategoryTrendingFeedWidgetSkeleton` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCCategoryTrendingFeedWidgetSkeleton-root|Styles applied to the root element.|
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
