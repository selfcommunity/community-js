import React from 'react';
import {Box, Typography} from '@mui/material';
import {styled} from '@mui/material/styles';
import Skeleton from '@mui/material/Skeleton';
import {PREFIX} from './constants';

const classes = {
  root: `${PREFIX}-skeleton-root`,
  field: `${PREFIX}-field`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'SkeletonRoot'
})(() => ({}));

/**
 * > API documentation for the Community-JS User Profile Info Skeleton component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {UserProfileInfoSkeleton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCUserProfileInfo-skeleton-root` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCUserProfileInfo-skeleton-root|Styles applied to the root element.|
 *
 */

function UserProfileInfoSkeleton(): JSX.Element {
  return (
    <Root className={classes.root}>
      {Array.from({length: 3}).map((v, i) => (
        <Box className={classes.field} key={i}>
          <Typography variant="h6">
            <Skeleton animation="wave" sx={{height: 20, width: '50%'}} />
          </Typography>
          <Typography variant="body2">
            <Skeleton animation="wave" sx={{height: 20, width: '80%'}} />
          </Typography>
        </Box>
      ))}
    </Root>
  );
}

export default UserProfileInfoSkeleton;
