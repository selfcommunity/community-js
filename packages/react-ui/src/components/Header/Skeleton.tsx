import React from 'react';
import {AppBar, Box} from '@mui/material';
import {styled} from '@mui/material/styles';
import Skeleton from '@mui/material/Skeleton';

const PREFIX = 'SCHeaderSkeleton';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(() => ({}));
/**
 * > API documentation for the Community-JS Header Skeleton component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {HeaderSkeleton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCHeaderSkeleton` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCHeaderSkeleton-root|Styles applied to the root element.|
 *
 */
export default function HeaderSkeleton(): JSX.Element {
  return (
    <Root className={classes.root}>
      <AppBar sx={{position: 'fixed', backgroundColor: '#fff'}}><Skeleton sx={{height: 60}} animation="wave" variant="rectangular" /></AppBar>
    </Root>
  );
}
