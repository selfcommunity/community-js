import {useMediaQuery, useTheme, styled, Skeleton, CardContent} from '@mui/material';
import BaseItem from '../../shared/BaseItem';
import {SCThemeType} from '@selfcommunity/react-core';
import {PREFIX} from './constants';
import classNames from 'classnames';
import PaymentProductPriceSkeleton from '../PaymentProductPrice/Skeleton';
import {useThemeProps} from '@mui/system';
import Widget, {WidgetProps} from '../Widget';

const classes = {
  root: `${PREFIX}-skeleton-root`,
  primary: `${PREFIX}-primary`,
  secondary: `${PREFIX}-secondary`,
  button: `${PREFIX}-button`,
  action: `${PREFIX}-action`
};

const Root = styled(Widget, {
  name: PREFIX,
  slot: 'SkeletonRoot'
})(() => ({}));

export interface PaymentProductSkeletonProps extends WidgetProps {
  className?: string;
}

/**
 * > API documentation for the Community-JS PaymentProductSkeleton component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {PaymentProductSkeleton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCPaymentProductSkeleton-skeleton-root` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCPaymentProductSkeleton-skeleton-root|Styles applied to the root element.|
 *
 */
export default function PaymentProductSkeleton(inProps: PaymentProductSkeletonProps): JSX.Element {
  // PROPS
  const props: PaymentProductSkeletonProps = useThemeProps({
    props: inProps,
    name: `${PREFIX}Skeleton`
  });
  const {...rest} = props;

  // HOOKS
  const theme = useTheme<SCThemeType>();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Root className={classNames(classes.root)} {...rest}>
      <CardContent>
        <BaseItem
          elevation={0}
          primary={<Skeleton animation="wave" height={10} width={isMobile ? 40 : 70} className={classes.primary} />}
          secondary={<Skeleton animation="wave" height={10} width={isMobile ? 70 : 120} className={classes.secondary} />}
        />
        <PaymentProductPriceSkeleton />
        <PaymentProductPriceSkeleton />
        <PaymentProductPriceSkeleton />
      </CardContent>
    </Root>
  );
}
