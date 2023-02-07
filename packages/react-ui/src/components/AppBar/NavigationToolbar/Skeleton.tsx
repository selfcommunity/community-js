import React from 'react';
import {Toolbar} from '@mui/material';
import {styled} from '@mui/material/styles';
import Skeleton from '@mui/material/Skeleton';
import {SCThemeType} from '@selfcommunity/react-core';

const PREFIX = 'SCNavigationToolbarSkeleton';

const classes = {
  root: `${PREFIX}-root`,
  logo: `${PREFIX}-logo`,
  navigation: `${PREFIX}-navigation`,
  avatar: `${PREFIX}-avatar`
};

const Root = styled(Toolbar, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}: {theme: SCThemeType}) => ({
  [`& .${classes.logo}`]: {
    width: 100,
    height: 20
  },
  [`& .${classes.navigation}`]: {
    flexGrow: 1,
    margin: theme.spacing(0, 20)
  },
  [`& .${classes.avatar}`]: {
    width: theme.selfcommunity.user.avatar.sizeMedium,
    height: theme.selfcommunity.user.avatar.sizeMedium
  }
}));

/**
 * > API documentation for the Community-JS Navigation Toolbar Skeleton component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {MobileHeaderSkeleton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCNavigationToolbarSkeleton` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCNavigationToolbarSkeleton-root|Styles applied to the root element.|
 |logo|.SCNavigationToolbarSkeleton-logo|Styles applied to the logo element.|
 |navigation|.SCNavigationToolbarSkeleton-navigation|Styles applied to the navigation element.|
 |avatar|.SCNavigationToolbarSkeleton-avatar|Styles applied to the avatar element.|
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
