import React from 'react';
import {TrendingPeopleSkeleton} from '../TrendingPeople';
import {WidgetProps} from '../Widget';
import {styled} from '@mui/material/styles';

const PREFIX = 'SCUserFollowersSkeleton';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(TrendingPeopleSkeleton, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));

/**
 * > API documentation for the Community-UI User Followers Skeleton component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {UserFollowersSkeleton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCUserFollowersSkeleton` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCUserFollowersSkeleton-root|Styles applied to the root element.|
 *
 */
export default function UserFollowersSkeleton(props: WidgetProps): JSX.Element {
  return <Root className={classes.root} {...props} />;
}
