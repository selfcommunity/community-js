import React from 'react';
import {Box, Button, Icon, IconButton, Stack, Typography, useTheme} from '@mui/material';
import {styled} from '@mui/material/styles';
import Skeleton from '@mui/material/Skeleton';
import {SCThemeType} from '@selfcommunity/react-core';
import {PREFIX} from './constants';

const classes = {
  root: `${PREFIX}-skeleton-root`,
  avatar: `${PREFIX}-avatar`,
  actions: `${PREFIX}-actions`,
  section: `${PREFIX}-section`,
  username: `${PREFIX}-username`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'SkeletonRoot'
})(() => ({}));

/**
 * > API documentation for the Community-JS User Profile AppBar Skeleton component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {UserProfileHeaderSkeleton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCUserProfileHeader-skeleton-root` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCUserProfileHeader-skeleton-root|Styles applied to the root element.|
 |avatar|.SCUserProfileHeader-avatar|Styles applied to the avatar element.|
 |actions|.SCUserProfileHeader-actions|Styles applied to the actions section.|
 |section|.SCUserProfileHeader-section|Styles applied to the info section.|
 |username|.SCUserProfileHeader-username|Styles applied to the username element.|
 *
 */
function UserProfileHeaderSkeleton(): JSX.Element {
  const theme = useTheme<SCThemeType>();

  return (
    <Root className={classes.root}>
      <Skeleton sx={{height: 350}} animation="wave" variant="rectangular" />
      <Box className={classes.avatar}>
        <Skeleton
          animation="wave"
          variant="circular"
          width={theme.selfcommunity.user.avatar.sizeXLarge}
          height={theme.selfcommunity.user.avatar.sizeXLarge}
        />
      </Box>
      <Box className={classes.section}>
        <Typography variant="h5" className={classes.username}>
          <Skeleton animation="wave" sx={{height: 30, width: 100, margin: '0 auto'}} />
        </Typography>
        <Stack direction="row" className={classes.actions}>
          <Button variant="contained" disabled>
            <Skeleton animation="wave" sx={{height: 20, width: 60}} />
          </Button>
          <IconButton disabled>
            <Icon>more_vert</Icon>
          </IconButton>
        </Stack>
      </Box>
    </Root>
  );
}

export default UserProfileHeaderSkeleton;
