import React from 'react';
import {Toolbar} from '@mui/material';
import {styled} from '@mui/material/styles';
import Skeleton from '@mui/material/Skeleton';
import {PREFIX} from './constants';

const classes = {
  root: `${PREFIX}-skeleton-root`,
  logo: `${PREFIX}-logo`,
  navigation: `${PREFIX}-navigation`,
  avatar: `${PREFIX}-avatar`
};

const Root = styled(Toolbar, {
  name: PREFIX,
  slot: 'SkeletonRoot'
})(() => ({}));

/**
 * > API documentation for the Community-JS Navigation Toolbar Skeleton component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {MobileHeaderSkeleton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCNavigationToolbar-skeleton-root` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCNavigationToolbar-skeleton-root|Styles applied to the root element.|
 |logo|.SCNavigationToolbar-logo|Styles applied to the logo element.|
 |navigation|.SCNavigationToolbar-navigation|Styles applied to the navigation element.|
 |avatar|.SCNavigationToolbar-avatar|Styles applied to the avatar element.|
 *
 */
export default function NavigationToolbarSkeleton(): JSX.Element {
  return (
    <Root className={classes.root}>
      <Skeleton className={classes.logo} animation="wave" variant="rectangular" />
      <Skeleton className={classes.navigation} animation="wave" variant="rectangular" />
      <Skeleton className={classes.avatar} animation="wave" variant="rounded" />
    </Root>
  );
}
