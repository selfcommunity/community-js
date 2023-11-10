import React from 'react';
import {styled} from '@mui/material/styles';
import {Box} from '@mui/material';
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
 * > API documentation for the Community-JS Footer Skeleton component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {FooterSkeleton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCFooter-skeleton-root` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCFooter-skeleton-root|Styles applied to the root element.|
 *
 */

export default function FooterSkeleton(props): JSX.Element {
  return (
    <Root className={classes.root} {...props}>
      <Skeleton animation="wave" height={10} style={{marginBottom: 10}} />
      <Skeleton animation="wave" height={10} width="60%" />
    </Root>
  );
}
