import React from 'react';
import {TrendingPeopleWidgetSkeleton} from '../TrendingPeopleWidget';
import {WidgetProps} from '../Widget';
import {styled} from '@mui/material/styles';

const PREFIX = 'SCUsersFollowedWidgetSkeleton';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(TrendingPeopleWidgetSkeleton, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));

/**
 * > API documentation for the Community-JS Users Followed Widget Skeleton component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {UsersFollowedWidgetSkeleton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCUsersFollowedWidgetSkeleton` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCUsersFollowedWidgetSkeleton-root|Styles applied to the root element.|
 *
 */

export default function UsersFollowedWidgetSkeleton(props: WidgetProps): JSX.Element {
  return <Root className={classes.root} {...props} />;
}
