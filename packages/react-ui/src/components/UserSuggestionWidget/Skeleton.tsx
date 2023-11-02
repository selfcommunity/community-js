import React from 'react';
import {styled} from '@mui/material/styles';
import UserSkeleton from '../User/Skeleton';
import Widget from '../Widget';
import {List, CardContent, ListItem} from '@mui/material';
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
 * > API documentation for the Community-JS People Suggestion Skeleton component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {UserSuggestionWidgetSkeleton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCUserSuggestionWidget-skeleton-root` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCUserSuggestionWidget-skeleton-root|Styles applied to the root element.|
 |list|.SCUserSuggestionWidget-list|Styles applied to the list element.|
 *
 */
function UserSuggestionWidgetSkeleton(props): JSX.Element {
  return (
    <Root className={classes.root} {...props}>
      <CardContent>
        <List className={classes.list}>
          {[...Array(4)].map((user, index) => (
            <ListItem key={index}>
              <UserSkeleton elevation={0} />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Root>
  );
}

export default UserSuggestionWidgetSkeleton;
