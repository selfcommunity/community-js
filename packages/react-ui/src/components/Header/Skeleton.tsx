import React from 'react';
import {Box} from '@mui/material';
import {styled} from '@mui/material/styles';
import Skeleton from '@mui/material/Skeleton';

const PREFIX = 'SCHeaderSkeleton';

const classes = {
  root: `${PREFIX}-root`,
  icon: `${PREFIX}-icon`,
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(() => ({
  position: 'relative',
  // [`& .${classes.icon}`]: {
  // },
}));
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
 |icon|.SCHeaderSkeleton-icon|Styles applied to the icon element.|
 *
 */
export default function CategoryHeaderSkeleton(): JSX.Element {
  return (
    <Root className={classes.root}>
      <Skeleton sx={{height: 60}} animation="wave" variant="rectangular" />
    </Root>
  );
}
