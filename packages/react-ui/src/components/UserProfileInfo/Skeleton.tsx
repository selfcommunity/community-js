import React from 'react';
import {Box, Grid} from '@mui/material';
import {styled} from '@mui/material/styles';
import Skeleton from '@mui/material/Skeleton';

const PREFIX = 'SCUserProfileInfoSkeleton';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(() => ({}));

/**
 * > API documentation for the Community-UI User Profile Info Skeleton component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {UserProfileInfoSkeleton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCUserProfileInfoSkeleton` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCUserProfileInfoSkeleton-root|Styles applied to the root element.|
 *
 */

function UserProfileInfoSkeleton(): JSX.Element {
  return (
    <Root className={classes.root}>
      <Grid container>
        <Grid item md={12} sm={12}>
          <Skeleton animation="wave" sx={{height: 20, width: '100%'}} />
          <Skeleton animation="wave" sx={{height: 20, width: '100%'}} />
        </Grid>
      </Grid>
    </Root>
  );
}

export default UserProfileInfoSkeleton;
