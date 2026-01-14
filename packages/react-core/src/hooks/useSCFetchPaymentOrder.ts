import {Endpoints, http, HttpResponse} from '@selfcommunity/api-services';
import {SCPaymentOrder} from '@selfcommunity/types';
import {CacheStrategies, Logger, LRUCache} from '@selfcommunity/utils';
import {useCallback, useEffect, useMemo, useState} from 'react';
import {useDeepCompareEffectNoCheck} from 'use-deep-compare-effect';
import {useSCUser} from '../components/provider/SCUserProvider';
import {getPaymentOrderObjectCacheKey} from '../constants/Cache';
import {SCOPE_SC_CORE} from '../constants/Errors';
import {SCUserContextType} from '../types/context';

/**
 :::info
 This custom hook is used to fetch a payment order.
 :::
 * @param object
 * @param object.id
 * @param object.paymentOrder
 * @param object.cacheStrategy
 */
export default function useSCFetchPaymentOrder({
  id = null,
  paymentOrder = null,
  cacheStrategy = CacheStrategies.NETWORK_ONLY,
}: {
  id?: number | string;
  paymentOrder?: SCPaymentOrder;
  cacheStrategy?: CacheStrategies;
}) {
  const __paymentOrderId = useMemo(() => paymentOrder?.id || id, [paymentOrder, id]);

  // CONTEXT
  const scUserContext: SCUserContextType = useSCUser();
  const authUserId = useMemo(() => scUserContext.user?.id || null, [scUserContext.user]);

  // CACHE
  const __paymentOrderCacheKey = useMemo(() => getPaymentOrderObjectCacheKey(__paymentOrderId), [__paymentOrderId]);
  const [scPaymentOrder, setScPaymentOrder] = useState<SCPaymentOrder>(
    cacheStrategy !== CacheStrategies.NETWORK_ONLY ? LRUCache.get(__paymentOrderCacheKey, paymentOrder) : null
  );
  const [error, setError] = useState<string>(null);

  const setSCPaymentOrder = useCallback(
    (c: SCPaymentOrder) => {
      setScPaymentOrder(c);
      LRUCache.set(__paymentOrderCacheKey, c);
    },
    [setScPaymentOrder, __paymentOrderCacheKey]
  );

  /**
   * Memoized fetch order
   */
  const fetchPaymentOrder = useMemo(
    () => (id: string | number) => {
      return http
        .request({
          url: Endpoints.GetPaymentOrder.url({id}),
          method: Endpoints.GetPaymentOrder.method,
        })
        .then((res: HttpResponse<SCPaymentOrder>) => {
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
    if (id !== null && id !== undefined && !paymentOrder) {
      fetchPaymentOrder(id)
        .then((e: SCPaymentOrder) => {
          setSCPaymentOrder(e);
        })
        .catch((err) => {
          LRUCache.delete(__paymentOrderCacheKey);
          Logger.error(SCOPE_SC_CORE, err.message);
        });
    }
  }, [id, paymentOrder, authUserId]);

  useDeepCompareEffectNoCheck(() => {
    if (paymentOrder) {
      setSCPaymentOrder(paymentOrder);
    }
  }, [paymentOrder, authUserId]);

  return {scPaymentOrder, setSCPaymentOrder, error};
}
