import React from 'react';
import {GenericSkeleton} from '../Skeleton';
import {styled} from '@mui/material/styles';

const PREFIX = 'SCLoyaltyProgramSkeleton';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(GenericSkeleton, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));
/**
 * > API documentation for the Community-JS Loyalty Program Skeleton component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {LoyaltyProgramSkeleton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCLoyaltyProgramSkeleton` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCLoyaltyProgramSkeleton-root|Styles applied to the root element.|
 *
 */
export default function LoyaltyProgramSkeleton(): JSX.Element {
  return <Root className={classes.root} />;
}
