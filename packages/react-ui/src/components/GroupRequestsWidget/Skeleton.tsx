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
 * > API documentation for the Community-JS Group Requests Widget Skeleton component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {GroupRequestsWidgetSkeleton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCGroupRequestsWidget-skeleton-root` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCGroupRequestsWidget-skeleton-root|Styles applied to the root element.|
 *
 */
export default function GroupRequestsWidgetSkeleton(props: WidgetProps): JSX.Element {
  return <Root className={classes.root} {...props} />;
}
