import React, {useState} from 'react';
import {Box} from '@mui/material';
import {styled} from '@mui/material/styles';
import {useThemeProps} from '@mui/system';
import classNames from 'classnames';
import {PaymentService} from '@selfcommunity/api-services';
import {SCPaymentProduct, SCContentType, SCPurchasableContent, SCPaymentOrder, SCPaymentPrice} from '@selfcommunity/types';
import {useIsComponentMountedRef, useSCPaymentsEnabled} from '@selfcommunity/react-core';
import {PREFIX} from './constants';
import PaymentProductsSkeleton from './Skeleton';
import PaymentProduct from '../PaymentProduct';
import {Logger} from '@selfcommunity/utils';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {AxiosRequestConfig} from 'axios';
import useDeepCompareEffect from 'use-deep-compare-effect';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(Box, {
  slot: 'Root',
  name: PREFIX
})(({theme}) => ({}));

export interface PaymentProductsProps {
  className?: string;
  contentType?: SCContentType;
  contentId?: number | string;
  content?: SCPurchasableContent;
  prefetchedProducts?: SCPaymentProduct[];
  paymentOrder?: SCPaymentOrder;
  onUpdatePaymentOrder?: (price: SCPaymentPrice, contentType?: SCContentType, contentId?: string | number) => void;
}

export default function PaymentProducts(inProps: PaymentProductsProps) {
  // PROPS
  const props: PaymentProductsProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className, contentId, contentType, content, prefetchedProducts = [], paymentOrder, onUpdatePaymentOrder, ...rest} = props;

  // CONST
  const prefetchedProductsIds = prefetchedProducts.map((product) => product.id);

  // STATE
  const [products, setProducts] = useState<SCPaymentProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // HOOKS
  const {isPaymentsEnabled} = useSCPaymentsEnabled();
  const isMountedRef = useIsComponentMountedRef();

  /**
   * Fetches products list
   */
  const fetchProducts = async (next?: string | undefined): Promise<SCPaymentProduct[]> => {
    const data = await PaymentService.getPaymentProducts({content_id: contentId, content_type: contentType}, {
      ...(next && {url: next})
    } as AxiosRequestConfig);
    return data.next ? data.results.concat(await fetchProducts(data.next)) : data.results;
  };

  /**
   * On mount, fetches products/prices list
   */
  useDeepCompareEffect(() => {
    if (prefetchedProducts.length) {
      setProducts(prefetchedProducts);
      setLoading(false);
    } else if (contentId !== undefined && contentType) {
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
    } else if (content && contentType) {
      setProducts(content.paywalls || []);
      setLoading(false);
    }
  }, [prefetchedProductsIds, contentId, contentType]);

  if (!isPaymentsEnabled) {
    return null;
  }

  return (
    <Root className={classNames(classes.root, className)} {...rest}>
      {loading ? (
        <PaymentProductsSkeleton />
      ) : (
        <>
          {products.map((p: SCPaymentProduct, i) => (
            <PaymentProduct
              paymentProduct={p}
              key={i}
              contentType={contentType}
              {...(content ? {content} : {contentId})}
              {...(paymentOrder && {paymentOrder, onUpdatePaymentOrder})}
            />
          ))}
        </>
      )}
    </Root>
  );
}
