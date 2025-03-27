import React, {useEffect, useMemo} from 'react';
import {AccordionDetails, AccordionProps, AccordionSummary, Typography} from '@mui/material';
import {styled} from '@mui/material/styles';
import {useThemeProps} from '@mui/system';
import classNames from 'classnames';
import {useSCFetchEvent, useSCFetchPaymentProduct, useSCPaymentsEnabled} from '@selfcommunity/react-core';
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
import Accordion from '@mui/material/Accordion';
import PaymentProductPrice, {PaymentProductPriceProps} from '../PaymentProductPrice';
import {ButtonProps} from '@mui/material/Button/Button';
import {Logger} from '@selfcommunity/utils/src/utils/logger';
import {SCOPE_SC_UI} from '../../constants/Errors';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(Accordion, {
  slot: 'Root',
  name: PREFIX
})(({theme}) => ({}));

export interface PaymentProductProps extends Pick<AccordionProps, Exclude<keyof AccordionProps, 'children' | 'expanded'>> {
  className?: string;
  paymentProductId?: number;
  paymentProduct?: SCPaymentProduct;
  contentType?: SCContentType;
  contentId?: number | string;
  content?: SCPurchasableContent;
  paymentOrder?: SCPaymentOrder;
  onUpdatePaymentOrder?: (price: SCPaymentPrice, contentType?: SCContentType, contentId?: string | number) => void;
  template?: SCPaymentProductTemplateType;
  expanded?: boolean;
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
    template = SCPaymentProductTemplateType.DETAIL,
    expanded,
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

  const isProductExpanded = useMemo(
    () => !paymentOrder || (paymentOrder && paymentOrder.payment_price && productPaymentPriceIds.indexOf(paymentOrder.payment_price.id) > -1),
    [paymentOrder, productPaymentPriceIds]
  );

  if (!isPaymentsEnabled) {
    return null;
  }

  if (!scPaymentProduct) {
    return <PaymentProductSkeleton />;
  }

  return (
    <Root
      disabled={!productPaymentPriceIds.length}
      defaultExpanded={isProductExpanded && productPaymentPriceIds.length > 0}
      square
      className={classNames(classes.root, className)}
      {...(expanded && {expanded})}
      {...rest}>
      <AccordionSummary aria-controls="panel1-content" id="panel1-header">
        <Typography variant="h5" component="div">
          <b>{scPaymentProduct.name && scPaymentProduct.name}</b>
        </Typography>
        {scPaymentProduct.description && !hideDescription && (
          <Typography variant="body1" component="div">
            {scPaymentProduct.description}
          </Typography>
        )}
      </AccordionSummary>
      <AccordionDetails>
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
      </AccordionDetails>
    </Root>
  );
}
