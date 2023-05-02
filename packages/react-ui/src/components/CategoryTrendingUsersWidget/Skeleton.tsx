import React from 'react';
import Widget, {WidgetProps} from '../Widget';
import List from '@mui/material/List';
import {styled} from '@mui/material/styles';
import UserSkeleton from '../User/Skeleton';
import {CardContent, ListItem} from '@mui/material';

const PREFIX = 'SCCategoryTrendingPeopleWidgetSkeleton';

const classes = {
  root: `${PREFIX}-root`,
  list: `${PREFIX}-list`
};

const Root = styled(Widget)(({theme}) => ({
  marginBottom: theme.spacing(2)
}));
/**
 * > API documentation for the Community-JS Trending People Widget Skeleton component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {CategoryTrendingPeopleWidgetSkeleton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCCategoryTrendingPeopleWidgetSkeleton` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCCategoryTrendingPeopleWidgetSkeleton-root|Styles applied to the root element.|
 |list|.SCCategoryTrendingPeopleWidgetSkeleton-list|Styles applied to the list element.|
 *
 */
export default function CategoryTrendingPeopleWidgetSkeleton(props: WidgetProps): JSX.Element {
  return (
    <Root className={classes.root} {...props}>
      <CardContent>
        <List className={classes.list}>
          {[...Array(4)].map((person, index) => (
            <ListItem key={index}>
              <UserSkeleton elevation={0} />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Root>
  );
}
