import React from 'react';
import {Box, Grid} from '@mui/material';
import {styled} from '@mui/material/styles';
import Skeleton from '@mui/material/Skeleton';

const PREFIX = 'SCUserProfileEditSkeleton';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(() => ({}));

/**
 * > API documentation for the Community-JS User Profile Edit Skeleton component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {UserProfileEditSkeleton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCUserProfileEditSkeleton` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCUserProfileEditSkeleton-root|Styles applied to the root element.|
 *
 */
export default function UserProfileEditSkeleton(): JSX.Element {
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
