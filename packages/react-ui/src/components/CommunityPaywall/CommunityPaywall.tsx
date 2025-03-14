import React, {useEffect, useState} from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import {styled} from '@mui/material/styles';
import {useThemeProps} from '@mui/system';
import classNames from 'classnames';
import {Endpoints, PaymentApiClient} from '@selfcommunity/api-services';
import {SCContentType, SCPaymentOrder, SCPaymentPrice, SCPaymentProduct} from '@selfcommunity/types';
import {useIsComponentMountedRef, useSCPaymentsEnabled} from '@selfcommunity/react-core';
import {PREFIX} from './constants';
import CommunityPaywallSkeleton from './Skeleton';
import PaymentProduct from '../PaymentProduct';
import {Logger} from '@selfcommunity/utils';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {AxiosRequestConfig} from 'axios';

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
  const {className, prefetchedProducts = [], paymentOrder, onUpdatePaymentOrder, ...rest} = props;

  // STATE
  const [products, setProducts] = useState<SCPaymentProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // HOOKS
  const {isPaymentsEnabled} = useSCPaymentsEnabled();
  const isMountedRef = useIsComponentMountedRef();

  /**
   * Fetches products list
   */
  const fetchProducts = async (next: string = Endpoints.GetContentProducts.url({})): Promise<SCPaymentProduct[]> => {
    const data = await PaymentApiClient.getPaymentProducts({content_id: 1, content_type: SCContentType.COMMUNITY}, {
      url: next
    } as AxiosRequestConfig);
    return data.next ? data.results.concat(await fetchProducts(data.next)) : data.results;
  };

  /**
   * On mount, fetches products/prices list
   */
  useEffect(() => {
    if (prefetchedProducts.length) {
      setProducts(prefetchedProducts);
      setLoading(false);
    } else {
      fetchProducts()
        .then((data) => {
          if (isMountedRef.current) {
            setProducts(data);
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
