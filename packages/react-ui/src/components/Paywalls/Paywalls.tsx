import React, {useEffect, useMemo, useState} from 'react';
import {Alert, Box} from '@mui/material';
import {styled} from '@mui/material/styles';
import {useThemeProps} from '@mui/system';
import classNames from 'classnames';
import {PaymentApiClient} from '@selfcommunity/api-services';
import {SCPaymentProduct, SCContentType, SCPurchasableContent, SCPaymentOrder, SCPaymentPrice} from '@selfcommunity/types';
import {useIsComponentMountedRef, useSCPaymentsEnabled} from '@selfcommunity/react-core';
import {PREFIX} from './constants';
import PaymentProductsSkeleton from './Skeleton';
import {Logger} from '@selfcommunity/utils';
import {SCOPE_SC_UI} from '../../constants/Errors';
import PaymentProducts from '../PaymentProducts';
import {FormattedMessage} from 'react-intl';

const classes = {
  root: `${PREFIX}-root`,
  error: `${PREFIX}-error`
};

const Root = styled(Box, {
  slot: 'Root',
  name: PREFIX
})(({theme}) => ({}));

export interface PaywallsProps {
  className?: string;
  contentType?: SCContentType;
  contentId?: number | string;
  content?: SCPurchasableContent;
  prefetchedPaymentContentStatus?: SCPurchasableContent;
  onUpdatePaymentOrder?: (price: SCPaymentPrice, contentType?: SCContentType, contentId?: string | number) => void;
}

export default function Paywalls(inProps: PaywallsProps) {
  // PROPS
  const props: PaywallsProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className, contentId, contentType, content, prefetchedPaymentContentStatus, onUpdatePaymentOrder, ...rest} = props;

  // STATE
  const [products, setProducts] = useState<SCPaymentProduct[]>([]);
  const [paymentOrder, setPaymentOrder] = useState<SCPaymentOrder>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // HOOKS
  const {isPaymentsEnabled} = useSCPaymentsEnabled();
  const isMountedRef = useIsComponentMountedRef();

  // Check if the payment price is in the current list
  const isPaymentProductPriceIncluded = useMemo(() => {
    let _included = false;
    if (!products.length) {
      return true;
    }
    products.map((p) => {
      if (p.payment_prices) {
        const _ids = p.payment_prices.map((price) => price.id);
        console.log(_ids);
        if (_ids.indexOf(paymentOrder.payment_price.id) > -1) {
          console.log('found payment order', paymentOrder.payment_price.id, _ids);
          _included = _included || true;
        }
      }
    });
    return _included;
  }, [products, paymentOrder]);

  /**
   * On mount, fetch payment content status
   */
  useEffect(() => {
    if (prefetchedPaymentContentStatus) {
      setProducts(prefetchedPaymentContentStatus.paywalls);
      setPaymentOrder(prefetchedPaymentContentStatus.payment_order);
      setLoading(false);
    } else if (content && contentType) {
      setProducts(content.paywalls || []);
      setPaymentOrder(content.payment_order || null);
      setLoading(false);
    } else if (contentId !== undefined && contentType) {
      PaymentApiClient.getPaymentContentStatus({content_id: contentId, content_type: contentType})
        .then((data) => {
          if (isMountedRef.current) {
            setProducts(data.paywalls);
            setPaymentOrder(data.payment_order);
            setLoading(false);
          }
        })
        .catch((error) => {
          Logger.error(SCOPE_SC_UI, error);
        });
    }
  }, [prefetchedPaymentContentStatus]);

  if (!isPaymentsEnabled) {
    return null;
  }

  return (
    <Root className={classNames(classes.root, className)} {...rest}>
      {loading ? (
        <PaymentProductsSkeleton />
      ) : (
        <>
          <PaymentProducts
            contentType={contentType}
            {...(content ? {content} : {contentId})}
            prefetchedProducts={products}
            paymentOrder={paymentOrder}
            {...(paymentOrder && {paymentOrder, onUpdatePaymentOrder})}
          />
          {paymentOrder && !isPaymentProductPriceIncluded && (
            <Alert severity="error" className={classes.error}>
              <FormattedMessage id="ui.paywalls.priceNotIncluded" defaultMessage="ui.paywalls.priceNotIncluded" />
            </Alert>
          )}
        </>
      )}
    </Root>
  );
}
