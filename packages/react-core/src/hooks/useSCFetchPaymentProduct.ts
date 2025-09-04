import {Endpoints, http, HttpResponse} from '@selfcommunity/api-services';
import {SCPaymentProduct} from '@selfcommunity/types';
import {CacheStrategies, Logger, LRUCache} from '@selfcommunity/utils';
import {useCallback, useEffect, useMemo, useState} from 'react';
import {useDeepCompareEffectNoCheck} from 'use-deep-compare-effect';
import {useSCUser} from '../components/provider/SCUserProvider';
import {getPaymentProductObjectCacheKey} from '../constants/Cache';
import {SCOPE_SC_CORE} from '../constants/Errors';
import {SCUserContextType} from '../types/context';

/**
 :::info
 This custom hook is used to fetch a payment product.
 :::
 * @param object
 * @param object.id
 * @param object.paymentProduct
 * @param object.cacheStrategy
 */
export default function useSCFetchPaymentProduct({
  id = null,
  paymentProduct = null,
  cacheStrategy = CacheStrategies.NETWORK_ONLY,
}: {
  id?: number | string;
  paymentProduct?: SCPaymentProduct;
  cacheStrategy?: CacheStrategies;
}) {
  const __paymentProductId = useMemo(() => paymentProduct?.id || id, [paymentProduct, id]);

  // CONTEXT
  const scUserContext: SCUserContextType = useSCUser();
  const authUserId = useMemo(() => scUserContext.user?.id || null, [scUserContext.user]);

  // CACHE
  const __paymentProductCacheKey = useMemo(() => getPaymentProductObjectCacheKey(__paymentProductId), [__paymentProductId]);
  const [scPaymentProduct, setScPaymentProduct] = useState<SCPaymentProduct>(
    cacheStrategy !== CacheStrategies.NETWORK_ONLY ? LRUCache.get(__paymentProductCacheKey, paymentProduct) : null
  );
  const [error, setError] = useState<string>(null);

  const setSCPaymentProduct = useCallback(
    (c: SCPaymentProduct) => {
      setScPaymentProduct(c);
      LRUCache.set(__paymentProductCacheKey, c);
    },
    [setScPaymentProduct, __paymentProductCacheKey]
  );

  /**
   * Memoized fetch product
   */
  const fetchPaymentProduct = useMemo(
    () => (id: string | number) => {
      return http
        .request({
          url: Endpoints.GetPaymentProduct.url({id}),
          method: Endpoints.GetPaymentProduct.method,
        })
        .then((res: HttpResponse<SCPaymentProduct>) => {
          if (res.status >= 300) {
            return Promise.reject(res);
          }
          return Promise.resolve(res.data);
        });
    },
    []
  );

  /**
   * If id attempt to get the course by id
   */
  useEffect(() => {
    if (id !== null && id !== undefined && !paymentProduct) {
      fetchPaymentProduct(id)
        .then((e: SCPaymentProduct) => {
          setSCPaymentProduct(e);
        })
        .catch((err) => {
          LRUCache.delete(__paymentProductCacheKey);
          Logger.error(SCOPE_SC_CORE, err.message);
        });
    }
  }, [id, paymentProduct, authUserId]);

  useDeepCompareEffectNoCheck(() => {
    if (paymentProduct) {
      setSCPaymentProduct(paymentProduct);
    }
  }, [paymentProduct, authUserId]);

  return {scPaymentProduct, setSCPaymentProduct, error};
}
