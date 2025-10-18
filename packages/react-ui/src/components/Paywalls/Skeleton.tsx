import {Box, Grid, useMediaQuery, useTheme, styled} from '@mui/material';
import {PREFIX} from './constants';
import classNames from 'classnames';
import PaymentProductSkeleton from '../PaymentProduct/Skeleton';
import {SCThemeType} from '@selfcommunity/react-core';

const classes = {
  root: `${PREFIX}-skeleton-root`,
  products: `${PREFIX}-products`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'SkeletonRoot'
})(() => ({
  overflow: 'hidden'
}));

/**
 * > API documentation for the Community-JS PaywallsSkeleton component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {PaywallsSkeleton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCPaywallsSkeleton-skeleton-root` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCPaywallsSkeleton-skeleton-root|Styles applied to the root element.|
 *
 */
export default function PaywallsSkeleton(inProps): JSX.Element {
  const {className, PaymentProductSkeletonProps = {}, ...rest} = inProps;

  // HOOKS
  const theme = useTheme<SCThemeType>();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Root className={classNames(classes.root, className)} {...rest}>
      <Grid container width="100%" spacing={{xs: 3}} className={classes.products}>
        {[...Array(isMobile ? 1 : 2)].map((_product, index) => (
          <Grid key={index}>
            <PaymentProductSkeleton elevation={0} variant="outlined" {...PaymentProductSkeletonProps} />
          </Grid>
        ))}
      </Grid>
    </Root>
  );
}
