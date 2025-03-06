import React, {useCallback, useMemo} from 'react';
import {Avatar, Box, Button, Icon, Typography, useMediaQuery, useTheme, Zoom} from '@mui/material';
import {styled} from '@mui/material/styles';
import {useThemeProps} from '@mui/system';
import {SCContentType, SCPaymentOrder, SCPaymentPrice, SCPaymentPriceCurrencyType, SCPurchasableContent} from '@selfcommunity/types';
import {PREFIX} from './constants';
import PaymentProductPriceSkeleton from './Skeleton';
import {FormattedMessage, useIntl} from 'react-intl';
import {Link, SCRoutes, SCRoutingContextType, SCThemeType, useSCPaymentsEnabled, useSCRouting} from '@selfcommunity/react-core';
import BaseItem from '../../shared/BaseItem';

const classes = {
  root: `${PREFIX}-root`,
  image: `${PREFIX}-image`,
  primary: `${PREFIX}-primary`,
  secondary: `${PREFIX}-secondary`,
  button: `${PREFIX}-button`,
  action: `${PREFIX}-action`
};

const Root = styled(BaseItem, {
  slot: 'Root',
  name: PREFIX
})(({theme}) => ({}));

export interface PaymentProductPriceProps {
  className?: string;
  id?: number | string;
  price?: SCPaymentPrice;
  contentType?: SCContentType;
  contentId?: number | string;
  content?: SCPurchasableContent;
  actions?: React.ReactNode;
  paymentOrder?: SCPaymentOrder;
  onHandleActionBuy?: (price: SCPaymentPrice, contentType?: SCContentType, contentId?: string | number) => void;
}

export default function PaymentProductPrice(inProps: PaymentProductPriceProps) {
  // PROPS
  const props: PaymentProductPriceProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className, id, price, contentType, contentId, content, actions, onHandleActionBuy, paymentOrder, ...rest} = props;

  // ROUTING
  const scRoutingContext: SCRoutingContextType = useSCRouting();

  // HOOKS
  const theme = useTheme<SCThemeType>();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const intl = useIntl();
  const {isPaymentsEnabled} = useSCPaymentsEnabled();

  const formattedPrice = useMemo(() => {
    return (
      <b>
        {(price.unit_amount / 1000).toFixed(2)}
        {price.currency === SCPaymentPriceCurrencyType.EUR && '€'}
      </b>
    );
  }, [price]);

  const handleActionBuy = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      onHandleActionBuy && onHandleActionBuy(price, contentType, contentId);
    },
    [onHandleActionBuy, price, contentType, contentId]
  );

  if (!isPaymentsEnabled) {
    return null;
  }

  if (!price) {
    return <PaymentProductPriceSkeleton />;
  }

  return (
    <Root
      disableTypography
      className={classes.root}
      image={
        <Box className={classes.image}>
          <Avatar variant="square" alt={'price.name'} className={classes.image}>
            <Icon>card_giftcard</Icon>
          </Avatar>
        </Box>
      }
      primary={<Typography variant="body1">{formattedPrice}</Typography>}
      secondary={
        <>
          {!isMobile && (
            <Typography component="p" variant="body2" className={classes.secondary}>
              {price.description}
            </Typography>
          )}
          <>
            {paymentOrder && (
              <Typography component="p" variant="body2" className={classes.secondary}>
                <FormattedMessage
                  defaultMessage="ui.paymentProduct.action.purchasedAt"
                  id="ui.paymentProduct.action.purchasedAt"
                  values={{
                    purchasedAt: intl.formatDate(new Date(), {day: 'numeric', year: 'numeric', month: 'long'})
                  }}
                />
              </Typography>
            )}
          </>
        </>
      }
      actions={
        actions ?? (
          <Box className={classes.action}>
            <Zoom in style={{transitionDelay: '200ms'}}>
              <Button
                size="small"
                color="error"
                variant="contained"
                component={Link}
                startIcon={<Icon>card_giftcard</Icon>}
                {...(paymentOrder && {disabled: true})}
                {...(onHandleActionBuy && {onClick: handleActionBuy})}
                to={scRoutingContext.url(SCRoutes.CHECKOUT_PAYMENT, {
                  content_type: contentType.toLowerCase(),
                  content_id: content ? content.id : contentId,
                  price_id: price.id
                })}>
                {paymentOrder && paymentOrder.payment_price.id === price.id ? (
                  <FormattedMessage defaultMessage="ui.paymentProduct.action.purchased" id="ui.paymentProduct.action.purchased" />
                ) : (
                  <FormattedMessage defaultMessage="ui.paymentProduct.action.buy" id="ui.paymentProduct.action.buy" />
                )}
              </Button>
            </Zoom>
          </Box>
        )
      }
      {...rest}
    />
  );
}
