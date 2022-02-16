import React from 'react';
import {Box, Divider, Grid, Paper, Typography} from '@mui/material';
import {styled} from '@mui/material/styles';
import Skeleton from '@mui/material/Skeleton';

const PREFIX = 'SCUserProfileHeaderSkeleton';

const classes = {
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

function UserProfileHeaderSkeleton(): JSX.Element {
  return (
    <Root>
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
