import React from 'react';
import {Box, Typography, useTheme} from '@mui/material';
import {styled} from '@mui/material/styles';
import Skeleton from '@mui/material/Skeleton';
import {SCThemeType} from '@selfcommunity/react-core';
import {PREFIX} from './constants';

const classes = {
  root: `${PREFIX}-skeleton-root`,
  cover: `${PREFIX}-cover`,
  avatar: `${PREFIX}-avatar`,
  info: `${PREFIX}-info`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'SkeletonRoot'
})(() => ({}));

/**
 * > API documentation for the Community-JS Group Header Skeleton component. Learn about the available props and the CSS API.

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
 |info|.SCGroupHeader-info|Styles applied to the info info.|
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
      <Box className={classes.info}>
        <Typography variant="h5">
          <Skeleton animation="wave" sx={{height: 30, width: 200}} />
        </Typography>
        <Typography>
          <Skeleton animation="wave" sx={{height: 20, width: 150}} />
        </Typography>
        <Typography>
          <Skeleton animation="wave" sx={{height: 20, width: 100}} />
        </Typography>
      </Box>
    </Root>
  );
}

export default GroupHeaderSkeleton;
