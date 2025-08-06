import React, {useMemo} from 'react';
import {Typography, styled, CardContent} from '@mui/material';
import {useThemeProps} from '@mui/system';
import classNames from 'classnames';
import {useSCFetchPaymentProduct, useSCPaymentsEnabled} from '@selfcommunity/react-core';
import {
  SCPaymentProduct,
  SCContentType,
  SCPurchasableContent,
  SCPaymentOrder,
  SCPaymentPrice,
  SCPaymentProductTemplateType
} from '@selfcommunity/types';
import {PREFIX} from './constants';
import PaymentProductSkeleton from './Skeleton';
import PaymentProductPrice, {PaymentProductPriceProps} from '../PaymentProductPrice';
import Widget, {WidgetProps} from '../Widget';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(Widget, {
  slot: 'Root',
  name: PREFIX
})(({theme}) => ({}));

export interface PaymentProductProps extends WidgetProps {
  className?: string;
  paymentProductId?: number;
  paymentProduct?: SCPaymentProduct;
  contentType?: SCContentType;
  contentId?: number | string;
  content?: SCPurchasableContent;
  paymentOrder?: SCPaymentOrder;
  onUpdatePaymentOrder?: (price: SCPaymentPrice, contentType?: SCContentType, contentId?: string | number) => void;
  template?: SCPaymentProductTemplateType;
  hideDescription?: boolean;
  hidePaymentProductPrices?: boolean;
  PaymentProductPriceComponentProps?: PaymentProductPriceProps;
}

export default function PaymentProduct(inProps: PaymentProductProps) {
  // PROPS
  const props: PaymentProductProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {
    className,
    paymentProductId,
    paymentProduct,
    contentType,
    contentId,
    content,
    paymentOrder,
    onUpdatePaymentOrder,
    hideDescription = false,
    hidePaymentProductPrices = false,
    PaymentProductPriceComponentProps = {},
    ...rest
  } = props;

  // HOOKS
  const {isPaymentsEnabled} = useSCPaymentsEnabled();
  const {scPaymentProduct} = useSCFetchPaymentProduct({id: paymentProductId, paymentProduct});

  // CONST
  const productPaymentPriceIds = useMemo(() => {
    if (scPaymentProduct && scPaymentProduct.payment_prices) {
      return scPaymentProduct.payment_prices.map((p) => p.id);
    }
    return [];
  }, [scPaymentProduct]);

  if (!isPaymentsEnabled) {
    return null;
  }

  if (!scPaymentProduct) {
    return <PaymentProductSkeleton />;
  }

  return (
    <Root disabled={!productPaymentPriceIds.length} className={classNames(classes.root, className)} {...rest}>
      <CardContent>
        <Typography variant="h5" component="div">
          <b>{scPaymentProduct.name && scPaymentProduct.name}</b>
        </Typography>
        {scPaymentProduct.description && !hideDescription && (
          <Typography variant="body1" component="div">
            {scPaymentProduct.description}
          </Typography>
        )}
        {!hidePaymentProductPrices &&
          scPaymentProduct.payment_prices &&
          scPaymentProduct.payment_prices.map((price, index) => (
            <PaymentProductPrice
              price={price}
              key={index}
              {...PaymentProductPriceComponentProps}
              {...(contentType && {contentType})}
              {...(content ? {content} : {contentId})}
              {...(paymentOrder && {paymentOrder, onHandleActionBuy: onUpdatePaymentOrder})}
            />
          ))}
      </CardContent>
    </Root>
  );
}
