import React from 'react';
import {TrendingPeopleWidgetSkeleton} from '../TrendingPeopleWidget';
import {WidgetProps} from '../Widget';
import {styled} from '@mui/material/styles';

const PREFIX = 'SCUserFollowersWidgetSkeleton';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(TrendingPeopleWidgetSkeleton, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));

/**
 * > API documentation for the Community-JS User Followers Widget Skeleton component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {UserFollowersSkeleton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCUserFollowersWidgetSkeleton` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCUserFollowersWidgetSkeleton-root|Styles applied to the root element.|
 *
 */
export default function UserFollowersSkeleton(props: WidgetProps): JSX.Element {
  return <Root className={classes.root} {...props} />;
}
