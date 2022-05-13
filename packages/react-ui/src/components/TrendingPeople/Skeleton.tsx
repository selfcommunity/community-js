import React from 'react';
import Widget, {WidgetProps} from '../Widget';
import List from '@mui/material/List';
import {styled} from '@mui/material/styles';
import UserSkeleton from '../User/Skeleton';
import {CardContent, ListItem} from '@mui/material';

const PREFIX = 'SCTrendingPeopleSkeleton';

const classes = {
  root: `${PREFIX}-root`,
  list: `${PREFIX}-list`
};

const Root = styled(Widget)(({theme}) => ({
  marginBottom: theme.spacing(2),
  [`& .${classes.list}`]: {
    marginLeft: -16,
    marginRight: -16
  }
}));
/**
 * > API documentation for the Community-JS Trending People Skeleton component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {TrendingPeopleSkeleton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCTrendingPeopleSkeleton` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCTrendingPeopleSkeleton-root|Styles applied to the root element.|
 |list|.SCTrendingPeopleSkeleton-list|Styles applied to the list element.|
 *
 */
export default function TrendingPeopleSkeleton(props: WidgetProps): JSX.Element {
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
