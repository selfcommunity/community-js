import React from 'react';
import {Box, Typography} from '@mui/material';
import {styled} from '@mui/material/styles';
import Skeleton from '@mui/material/Skeleton';

const PREFIX = 'SCUserProfileHeaderSkeleton';

const classes = {
  root: `${PREFIX}-root`,
  avatar: `${PREFIX}-avatar`,
  username: `${PREFIX}-username`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(() => ({
  position: 'relative',
  [`& .${classes.avatar}`]: {
    position: 'absolute',
    top: 190,
    width: '100%',
    [`& .MuiSkeleton-root`]: {
      border: '#FFF solid 5px',
      margin: '0 auto'
    }
  },
  [`& .${classes.username}`]: {
    marginTop: 50,
    textAlign: 'center'
  }
}));

/**
 * > API documentation for the Community-UI User Profile Header Skeleton component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {UserProfileHeaderSkeleton} from '@selfcommunity/ui';
 ```

 #### Component Name

 The name `SCUserProfileHeaderSkeleton` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCUserProfileHeaderSkeleton-root|Styles applied to the root element.|
 |avatar|.SCUserProfileHeaderSkeleton-avatar|Styles applied to the avatar element.|
 |username|.SCUserProfileHeaderSkeleton-username|Styles applied to the username element.|
 *
 */
function UserProfileHeaderSkeleton(): JSX.Element {
  return (
    <Root className={classes.root}>
      <Skeleton sx={{height: 350}} animation="wave" variant="rectangular" />
      <Box className={classes.avatar}>
        <Skeleton animation="wave" variant="circular" width={200} height={200} />
      </Box>
      <Typography variant="h5" className={classes.username}>
        <Skeleton animation="wave" sx={{height: 20, width: 100, margin: '0 auto'}} />
      </Typography>
    </Root>
  );
}

export default UserProfileHeaderSkeleton;
