import React, {forwardRef, ForwardRefRenderFunction} from 'react';
import {Box, TableCell, TableRow} from '@mui/material';
import {styled} from '@mui/material/styles';
import {PREFIX} from './constants';
import {useThemeProps} from '@mui/system';
import classNames from 'classnames';
import {UserPaymentMethodsProps} from './UserPaymentMethods';
import Skeleton from '@mui/material/Skeleton';

const classes = {
  root: `${PREFIX}-skeleton-root`,
  field: `${PREFIX}-field`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'SkeletonRoot'
})(() => ({}));

export interface UserPaymentMethodsSkeletonProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;

  /**
   * Show billing address
   */
  showBillingAddress?: boolean;
}

// eslint-disable-next-line @typescript-eslint/ban-types
export type UserPaymentMethodsSkeletonRef = {};

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
 * @param inProps
 * @param ref
 */
const UserPaymentMethodsSkeleton: ForwardRefRenderFunction<UserPaymentMethodsSkeletonRef, UserPaymentMethodsSkeletonProps> = (
  inProps: UserPaymentMethodsSkeletonProps,
  ref: React.ForwardedRef<UserPaymentMethodsSkeletonRef>
): JSX.Element => {
  // PROPS
  const props: UserPaymentMethodsProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className = null, showBillingAddress = false, ...rest} = props;

  return (
    <Root className={classNames(classes.root, className)} {...rest}>
      <TableRow>
        <TableCell component="th" scope="row">
          <Skeleton variant="text" height={40} />
        </TableCell>
        <TableCell component="th" scope="row">
          <Skeleton variant="text" height={40} width={200} />
        </TableCell>
        <TableCell component="th" scope="row">
          <Skeleton variant="text" height={40} width={50} />
        </TableCell>
        {showBillingAddress && (
          <TableCell component="th" scope="row">
            <Skeleton variant="text" height={40} width={150} />
          </TableCell>
        )}
        <TableCell component="th" scope="row">
          <Skeleton variant="rectangular" width={25} height={25} />
        </TableCell>
        <TableCell component="th" scope="row">
          <Skeleton variant="rounded" width={105} height={35} />
        </TableCell>
      </TableRow>
    </Root>
  );
};

export default forwardRef(UserPaymentMethodsSkeleton);
