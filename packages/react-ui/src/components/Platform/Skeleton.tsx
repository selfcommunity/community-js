import React from 'react';
import {GenericSkeleton} from '../Skeleton';
import {styled} from '@mui/material/styles';

const PREFIX = 'SCPlatformSkeleton';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(GenericSkeleton, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));
/**
 * > API documentation for the Community-UI Platform Skeleton component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {PlatformSkeleton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCPlatformSkeleton` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCPlatformSkeleton-root|Styles applied to the root element.|
 *
 */

export default function PlatformSkeleton(): JSX.Element {
  return <Root className={classes.root} />;
}
