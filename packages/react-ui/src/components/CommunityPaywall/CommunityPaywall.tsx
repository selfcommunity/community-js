import React, {useEffect, useState} from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import {styled} from '@mui/material/styles';
import {useThemeProps} from '@mui/system';
import classNames from 'classnames';
import {PaymentApiClient} from '@selfcommunity/api-services';
import {SCCommunityPaymentProducts, SCContentType, SCPaymentOrder, SCPaymentPrice, SCPaymentProduct} from '@selfcommunity/types';
import {useIsComponentMountedRef, useSCPaymentsEnabled} from '@selfcommunity/react-core';
import {PREFIX} from './constants';
import CommunityPaywallSkeleton from './Skeleton';
import PaymentProduct from '../PaymentProduct';
import {Logger} from '@selfcommunity/utils';
import {SCOPE_SC_UI} from '../../constants/Errors';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(Grid, {
  slot: 'Root',
  name: PREFIX
})(({theme}) => ({}));

export interface CommunityPaywallProps {
  className?: string;
  prefetchedProducts?: SCPaymentProduct[];
  paymentOrder?: SCPaymentOrder;
  onUpdatePaymentOrder?: (price: SCPaymentPrice, contentType?: SCContentType, contentId?: string | number) => void;
}

export default function CommunityPaywall(inProps: CommunityPaywallProps) {
  // PROPS
  const props: CommunityPaywallProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className, prefetchedProducts = [], paymentOrder = null, onUpdatePaymentOrder, ...rest} = props;

  // STATE
  const [products, setProducts] = useState<SCPaymentProduct[]>([]);
  const [payment, setPayment] = useState<SCPaymentOrder | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // HOOKS
  const {isPaymentsEnabled} = useSCPaymentsEnabled();
  const isMountedRef = useIsComponentMountedRef();

  /**
   * On mount, fetches community products
   */
  useEffect(() => {
    if (prefetchedProducts.length) {
      setProducts(prefetchedProducts);
      setPayment(paymentOrder);
      setLoading(false);
    } else {
      PaymentApiClient.getCommunityPaymentProducts()
        .then((data: SCCommunityPaymentProducts) => {
          if (isMountedRef.current) {
            setProducts(data.paywalls);
            setPayment(data.payment_order);
            setLoading(false);
          }
        })
        .catch((error) => {
          Logger.error(SCOPE_SC_UI, error);
        });
    }
  }, [prefetchedProducts.length]);

  if (!isPaymentsEnabled) {
    return null;
  }

  if (loading) {
    return <CommunityPaywallSkeleton />;
  }

  return (
    <Root className={classNames(classes.root, className)} container spacing={4} {...rest}>
      {products.map((p, i) => (
        <Grid xs={4} key={i}>
          <PaymentProduct
            expanded
            paymentProduct={p}
            contentType={SCContentType.COMMUNITY}
            contentId={p.id}
            {...(paymentOrder && {paymentOrder, onUpdatePaymentOrder})}
          />
        </Grid>
      ))}
    </Root>
  );
}
