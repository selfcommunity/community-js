import React from 'react';
import {CategoryTrendingPeopleWidgetSkeleton} from '../CategoryTrendingUsersWidget';
import {WidgetProps} from '../Widget';
import {styled} from '@mui/material/styles';
import {PREFIX} from './constants';

const classes = {
  root: `${PREFIX}-skeleton-root`
};

const Root = styled(CategoryTrendingPeopleWidgetSkeleton, {
  name: PREFIX,
  slot: 'SkeletonRoot'
})(() => ({}));

/**
 * > API documentation for the Community-JS Group Invited Widget Skeleton component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {GroupInvitedWidgetSkeleton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCGroupInvitedWidget-skeleton-root` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCGroupInvitedWidget-skeleton-root|Styles applied to the root element.|
 *
 */
export default function GroupInvitedWidgetSkeleton(props: WidgetProps): JSX.Element {
  return <Root className={classes.root} {...props} />;
}
