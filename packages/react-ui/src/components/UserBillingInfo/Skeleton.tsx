import React from 'react';
import {Box, Grid} from '@mui/material';
import {UserBillingInfoMode} from '../../constants/Billing';
import Skeleton from '@mui/material/Skeleton';

/**
 * > API documentation for the Community-JS User Billing Info Skeleton component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {UserBillingInfoSkeleton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCUserBillingInfoSkeleton-skeleton-root` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCUserBillingInfoSkeleton-skeleton-root|Styles applied to the root element.|
 *
 */

export interface UserSkeletonBillingInfoProps {
  mode?: UserBillingInfoMode;
}

export default function UserBillingInfoSkeleton(props: UserSkeletonBillingInfoProps): JSX.Element | null {
  if (props.mode === UserBillingInfoMode.READ) {
    return (
      <Box>
        <Skeleton variant="rectangular" height={15} width={200} sx={{mb: 2}} />
        <Skeleton variant="rectangular" height={15} width={250} sx={{mb: 2}} />
        <Skeleton variant="rectangular" height={15} width={220} sx={{mb: 2}} />
        <Skeleton variant="rectangular" height={15} width={190} sx={{mb: 2}} />
      </Box>
    );
  }
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6}>
        <Skeleton variant="rectangular" height={50} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <Skeleton variant="rectangular" height={50} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <Skeleton variant="rectangular" height={50} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <Skeleton variant="rectangular" height={50} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <Skeleton variant="rectangular" height={50} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <Skeleton variant="rectangular" height={50} />
      </Grid>
      <Grid item xs={12} sm={6} justifyContent={'center'}>
        <Skeleton variant="rounded" height={30} width={100} />
      </Grid>
    </Grid>
  );
}
