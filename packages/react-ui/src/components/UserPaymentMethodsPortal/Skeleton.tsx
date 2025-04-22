import React from 'react';
import {Box, CircularProgress, styled} from '@mui/material';
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
 * > API documentation for the Community-JS User Payment Methods Portal Skeleton component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {UserPaymentMethodsPortalSkeleton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCUserPaymentMethodsPortalSkeleton-skeleton-root` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCUserPaymentMethodsPortalSkeleton-skeleton-root|Styles applied to the root element.|
 *
 */

function UserPaymentMethodsPortalSkeleton(): JSX.Element {
  return (
    <Root className={classes.root}>
      <CircularProgress color="secondary" />
    </Root>
  );
}

export default UserPaymentMethodsPortalSkeleton;
