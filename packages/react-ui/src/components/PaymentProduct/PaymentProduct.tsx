import React from 'react';
import {AccordionDetails, AccordionSummary, Typography} from '@mui/material';
import {styled} from '@mui/material/styles';
import {useThemeProps} from '@mui/system';
import classNames from 'classnames';
import {useSCPaymentsEnabled} from '@selfcommunity/react-core';
import {SCPaymentProduct, SCContentType, SCPurchasableContent, SCPaymentOrder, SCPaymentPrice} from '@selfcommunity/types';
import {PREFIX} from './constants';
import PaymentProductSkeleton from './Skeleton';
import Accordion from '@mui/material/Accordion';
import PaymentProductPrice from '../PaymentProductPrice';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(Accordion, {
  slot: 'Root',
  name: PREFIX
})(({theme}) => ({}));

export interface PaymentProductProps {
  className?: string;
  id?: number | string;
  product?: SCPaymentProduct;
  contentType?: SCContentType;
  contentId?: number | string;
  content?: SCPurchasableContent;
  paymentOrder?: SCPaymentOrder;
  onUpdatePaymentOrder?: (price: SCPaymentPrice, contentType?: SCContentType, contentId?: string | number) => void;
}

export default function PaymentProduct(inProps: PaymentProductProps) {
  // PROPS
  const props: PaymentProductProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className, id, product, contentType, contentId, content, paymentOrder, onUpdatePaymentOrder, ...rest} = props;

	// HOOKS
  const {isPaymentsEnabled} = useSCPaymentsEnabled();

  if (!isPaymentsEnabled) {
    return null;
  }

  if (!product) {
    return <PaymentProductSkeleton />;
  }

  return (
    <Root defaultExpanded square className={classNames(classes.root, className)} {...rest}>
      <AccordionSummary aria-controls="panel1-content" id="panel1-header">
        <Typography variant="h5" component="div">
          <b>{product.name}</b>
        </Typography>
        {product.description && (
          <Typography variant="body1" component="div">
            {product.description}
          </Typography>
        )}
      </AccordionSummary>
      <AccordionDetails>
        {product.payment_prices.map((price, index) => (
          <PaymentProductPrice
            price={price}
            key={index}
            contentType={contentType}
            {...(content ? {content} : {contentId})}
            {...(paymentOrder && {paymentOrder, onHandleActionBuy: onUpdatePaymentOrder})}
          />
        ))}
      </AccordionDetails>
    </Root>
  );
}
