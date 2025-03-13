import React from 'react';
import {Box, CircularProgress} from '@mui/material';
import {styled} from '@mui/material/styles';
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
 * > API documentation for the Community-JS User Payment Methods Skeleton component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {UserPaymentMethodsSkeleton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCUserPaymentMethodsSkeleton-skeleton-root` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCUserPaymentMethodsSkeleton-skeleton-root|Styles applied to the root element.|
 *
 */

function UserPaymentMethodsSkeleton(): JSX.Element {
  return (
    <Root className={classes.root}>
      <CircularProgress color="secondary" />
    </Root>
  );
}

export default UserPaymentMethodsSkeleton;
