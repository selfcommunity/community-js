import React from 'react';
import {GenericSkeleton} from '../Skeleton';
import {styled} from '@mui/material/styles';

const PREFIX = 'SCThreadSkeleton';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(GenericSkeleton, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));
/**
 * > API documentation for the Community-JS Thread Skeleton component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {ThreadSkeleton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCThreadSkeleton` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCThreadSkeleton-root|Styles applied to the root element.|
 *
 */
export default function ThreadSkeleton(): JSX.Element {
  return <Root className={classes.root} />;
}
