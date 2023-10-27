import React from 'react';
import {Box} from '@mui/material';
import {styled} from '@mui/material/styles';
import Skeleton from '@mui/material/Skeleton';
import {PREFIX} from './constants';

const classes = {
  root: `${PREFIX}-skeleton-root`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'SkeletonRoot'
})(() => ({}));
/**
 * > API documentation for the Community-JS Category AppBar Skeleton component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {CategoryHeaderSkeleton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCCategoryHeader-skeleton-root` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCCategoryHeader-skeleton-root|Styles applied to the root element.|
 *
 */
export default function CategoryHeaderSkeleton(): JSX.Element {
  return (
    <Root className={classes.root}>
      <Skeleton sx={{height: 270}} animation="wave" variant="rectangular" />
      <Box>
        <Skeleton animation="wave" sx={{height: 20, maxWidth: 300, width: '100%', margin: '0 auto'}} />
      </Box>
      <Box>
        <Skeleton animation="wave" sx={{height: 20, maxWidth: 300, width: '100%', margin: '0 auto'}} />
      </Box>
    </Root>
  );
}
