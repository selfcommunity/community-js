import React from 'react';
import {GenericSkeleton} from '../Skeleton';
import {styled} from '@mui/material/styles';

const PREFIX = 'SCCustomAdvSkeleton';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(GenericSkeleton, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));
/**
 * > API documentation for the Community-UI Custom Adv Skeleton component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {CustomAdvSkeleton} from '@selfcommunity/ui';
 ```

 #### Component Name

 The name `SCCustomAdvSkeleton` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCCustomAdvSkeleton-root|Styles applied to the root element.|
 *
 */
export default function CustomAdvSkeleton(): JSX.Element {
  return <Root className={classes.root} />;
}
