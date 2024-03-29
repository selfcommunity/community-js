import React from 'react';
import {Toolbar} from '@mui/material';
import {styled} from '@mui/material/styles';
import Skeleton from '@mui/material/Skeleton';
import { PREFIX } from './constants';

const classes = {
  root: `${PREFIX}-skeleton-root`,
  logo: `${PREFIX}-logo`
};

const Root = styled(Toolbar, {
  name: PREFIX,
  slot: 'SkeletonRoot'
})(() => ({}));
/**
 * > API documentation for the Community-JS Navigation Toolbar Mobile Skeleton component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {NavigationToolbarMobileSkeleton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCNavigationToolbarMobileSkeleton` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCNavigationToolbarMobileSkeleton-root|Styles applied to the root element.|
 |logo|.SCNavigationToolbarMobileSkeleton-logo|Styles applied to the logo element.|
 *
 */
export default function NavigationToolbarMobileSkeleton(): JSX.Element {
  return (
    <Root className={classes.root}>
      <Skeleton className={classes.logo} animation="wave" variant="rectangular" />
    </Root>
  );
}
