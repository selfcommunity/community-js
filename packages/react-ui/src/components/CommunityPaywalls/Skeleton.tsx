import {useMediaQuery, useTheme, styled, Grid2, Grid2Props} from '@mui/material';
import {PREFIX} from './constants';
import classNames from 'classnames';
import PaymentProductSkeleton, {PaymentProductSkeletonProps} from '../PaymentProduct/Skeleton';
import {SCThemeType} from '@selfcommunity/react-core';
import {useThemeProps} from '@mui/system';

const classes = {
  root: `${PREFIX}-skeleton-root`,
  products: `${PREFIX}-products`
};

const Root = styled(Grid2, {
  name: PREFIX,
  slot: 'SkeletonRoot'
})(() => ({
  overflow: 'hidden'
}));

export interface CommunityPaywallsSkeletonProps extends Grid2Props {
  className?: string;
  PaymentProductSkeletonComponentProps?: PaymentProductSkeletonProps;
}

/**
 * > API documentation for the Community-JS CommunityPaywall Skeleton component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {CommunityPaywallSkeleton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCCommunityPaywallSkeleton-skeleton-root` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCCommunityPaywallSkeleton-skeleton-root|Styles applied to the root element.|
 *
 */
export default function CommunityPaywallsSkeleton(inProps: CommunityPaywallsSkeletonProps): JSX.Element {
  // PROPS
  const props: CommunityPaywallsSkeletonProps = useThemeProps({
    props: inProps,
    name: `${PREFIX}Skeleton`
  });
  const {className, PaymentProductSkeletonComponentProps, ...rest} = props;

  // HOOKS
  const theme = useTheme<SCThemeType>();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Root className={classNames(classes.root, className)} container width="100%" spacing={4} {...rest}>
      {[...Array(isMobile ? 2 : 3)].map((_product, index) => (
        <Grid2 size={4} key={index}>
          <PaymentProductSkeleton variant="outlined" {...PaymentProductSkeletonComponentProps} />
        </Grid2>
      ))}
    </Root>
  );
}
