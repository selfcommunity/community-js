import React from 'react';
import Widget from '../Widget';
import {CardContent, ListItem, styled, List} from '@mui/material';
import GroupSkeleton from '../Group/Skeleton';

const PREFIX = 'SCUserSubscribedGroupsWidgetSkeleton';

const classes = {
  root: `${PREFIX}-skeleton-root`,
  list: `${PREFIX}-list`
};

const Root = styled(Widget, {
  name: PREFIX,
  slot: 'SkeletonRoot'
})(() => ({}));
/**
 * > API documentation for the Community-JS User Profile Categories Followed Widget Skeleton component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {UserSubscribedGroupsWidgetSkeleton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCUserCategoriesFollowedWidget-skeleton-root` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCUserSubscribedGroupsWidget-skeleton-root|Styles applied to the root element.|
 *
 */
export default function UserSubscribedGroupsWidgetSkeleton(props): JSX.Element {
  return (
    <Root className={classes.root} {...props}>
      <CardContent>
        <List className={classes.list}>
          {[...Array(3)].map((category, index) => (
            <ListItem key={index}>
              <GroupSkeleton elevation={0} />
            </ListItem>
          ))}
        </List>
      </CardContent>
      );
    </Root>
  );
}
