import React from 'react';
import {CategoryTrendingPeopleWidgetSkeleton} from '../CategoryTrendingUsersWidget';
import {WidgetProps} from '../Widget';
import {styled} from '@mui/material/styles';

const PREFIX = 'SCUserConnectionsWidgetSkeleton';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(CategoryTrendingPeopleWidgetSkeleton, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));

/**
 * > API documentation for the Community-JS User Connections Widget Skeleton component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {UserConnectionsSkeleton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCUserConnectionsWidgetSkeleton` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCUserConnectionsWidgetSkeleton-root|Styles applied to the root element.|
 *
 */
export default function UserConnectionsSkeleton(props: WidgetProps): JSX.Element {
  return <Root className={classes.root} {...props} />;
}
