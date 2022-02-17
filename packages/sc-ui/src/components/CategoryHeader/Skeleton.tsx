import React from 'react';
import {Box} from '@mui/material';
import {styled} from '@mui/material/styles';
import Skeleton from '@mui/material/Skeleton';

const PREFIX = 'SCCategoryHeaderSkeleton';

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
