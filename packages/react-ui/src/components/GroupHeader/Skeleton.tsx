import React from 'react';
import {Box, Button, Icon, IconButton, Stack, Typography, useTheme} from '@mui/material';
import {styled} from '@mui/material/styles';
import Skeleton from '@mui/material/Skeleton';
import {SCThemeType} from '@selfcommunity/react-core';
import {PREFIX} from './constants';

const classes = {
  root: `${PREFIX}-skeleton-root`,
  cover: `${PREFIX}-cover`,
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
 * > API documentation for the Community-JS Group Headerr Skeleton component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {GroupHeaderSkeleton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCGroupHeader-skeleton-root` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCGroupHeader-skeleton-root|Styles applied to the root element.|
 |avatar|.SCGroupHeader-avatar|Styles applied to the avatar element.|
 |cover|.SCGroupHeader-cover|Styles applied to the cover element.|
 |actions|.SCGroupHeader-actions|Styles applied to the actions section.|
 |section|.SCGroupHeader-section|Styles applied to the info section.|
 |username|.SCGroupHeader-username|Styles applied to the username element.|
 *
 */
function GroupHeaderSkeleton(): JSX.Element {
  const theme = useTheme<SCThemeType>();

  return (
    <Root className={classes.root}>
      <Skeleton className={classes.cover} animation="wave" variant="rectangular" />
      <Box className={classes.avatar}>
        <Skeleton
          animation="wave"
          variant="circular"
          width={theme.selfcommunity.group.avatar.sizeLarge}
          height={theme.selfcommunity.group.avatar.sizeLarge}
        />
      </Box>
      <Box className={classes.section}>
        <Typography variant="h5" className={classes.username}>
          <Skeleton animation="wave" sx={{height: 30, width: 100}} />
        </Typography>
        {/*<Stack direction="row" className={classes.actions}>*/}
        {/*  <Button variant="contained" disabled>*/}
        {/*    <Skeleton animation="wave" sx={{height: 20, width: 60}} />*/}
        {/*  </Button>*/}
        {/*  <IconButton disabled>*/}
        {/*    <Icon>more_vert</Icon>*/}
        {/*  </IconButton>*/}
        {/*</Stack>*/}
      </Box>
    </Root>
  );
}

export default GroupHeaderSkeleton;
