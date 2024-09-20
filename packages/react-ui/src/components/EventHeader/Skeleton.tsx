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
 * > API documentation for the Community-JS Event Header Skeleton component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {EventHeaderSkeleton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCEventHeader-skeleton-root` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCEventHeader-skeleton-root|Styles applied to the root element.|
 |avatar|.SCEventHeader-avatar|Styles applied to the avatar element.|
 |cover|.SCEventHeader-cover|Styles applied to the cover element.|
 |info|.SCEventHeader-info|Styles applied to the info info.|
 *
 */
function EventHeaderSkeleton(): JSX.Element {
  const theme = useTheme<SCThemeType>();

  return (
    <Root className={classes.root}>
      <Skeleton className={classes.cover} animation="wave" variant="rectangular" />
      <Box className={classes.avatar}>
        <Skeleton
          animation="wave"
          variant="rectangular"
          width={theme.selfcommunity.group.avatar.sizeLarge}
          height={theme.selfcommunity.group.avatar.sizeLarge}
        />
      </Box>
      <Box className={classes.info}>
        <Typography variant="h5" mb={1}>
          <Skeleton animation="wave" variant="rectangular" sx={{height: 20, width: '50%'}} />
        </Typography>
        <Typography mb={1}>
          <Skeleton animation="wave" variant="rectangular" sx={{height: 30, width: '30%'}} />
        </Typography>
        <Typography>
          <Skeleton animation="wave" variant="rectangular" sx={{height: 15, width: '20%'}} />
        </Typography>
      </Box>
    </Root>
  );
}

export default EventHeaderSkeleton;
