import {useEffect, useMemo, useState} from 'react';
import {SCOPE_SC_CORE} from '../constants/Errors';
import {SCIncubatorType} from '@selfcommunity/types';
import {http, Endpoints, HttpResponse} from '@selfcommunity/api-services';
import {CacheStrategies, Logger, LRUCache, objectWithoutProperties} from '@selfcommunity/utils';
import {getIncubatorObjectCacheKey} from '../constants/Cache';
import {useDeepCompareEffectNoCheck} from 'use-deep-compare-effect';
import {SCUserContextType} from '../types/context';
import {useSCUser} from '../components/provider/SCUserProvider';

/**
 :::info
 This custom hook is used to fetch an incubator object.
 :::
 * @param object
 * @param object.id
 * @param object.incubator
 * @param object.cacheStrategy
 */
export default function useSCFetchIncubator({
  id = null,
  incubator = null,
  cacheStrategy = CacheStrategies.CACHE_FIRST,
}: {
  id?: number;
  incubator?: SCIncubatorType;
  cacheStrategy?: CacheStrategies;
}) {
  const __incubatorId = incubator ? incubator.id : id;
  // CONTEXT
  const scUserContext: SCUserContextType = useSCUser();
  const authUserId = scUserContext.user ? scUserContext.user.id : null;
  // CACHE
  const __incubatorCacheKey = getIncubatorObjectCacheKey(__incubatorId);
  const __incubator = authUserId ? incubator : objectWithoutProperties<SCIncubatorType>(incubator, ['subscribed']);
  const [scIncubator, setSCIncubator] = useState<SCIncubatorType>(
    cacheStrategy !== CacheStrategies.NETWORK_ONLY ? LRUCache.get(__incubatorCacheKey, __incubator) : null
  );
  const [error, setError] = useState<string>(null);

  /**
   * Memoized fetchIncubator
   */
  const fetchIncubator = useMemo(
    () => () => {
      return http
        .request({
          url: Endpoints.GetASpecificIncubator.url({id: __incubatorId}),
          method: Endpoints.GetASpecificIncubator.method,
        })
        .then((res: HttpResponse<SCIncubatorType>) => {
          if (res.status >= 300) {
            return Promise.reject(res);
          }
          return Promise.resolve(res.data);
        });
    },
    [__incubatorId]
  );

  /**
   * If id resolve the obj
   */
  useEffect(() => {
    if (__incubatorId && (!scIncubator || (scIncubator && __incubatorId !== scIncubator.id))) {
      fetchIncubator()
        .then((obj: SCIncubatorType) => {
          const _i: SCIncubatorType = authUserId ? obj : objectWithoutProperties<SCIncubatorType>(obj, ['subscribed']);
          setSCIncubator(_i);
          LRUCache.set(__incubatorCacheKey, _i);
        })
        .catch((err) => {
          LRUCache.delete(__incubatorCacheKey);
          setError(`Incubator with id ${id} not found`);
          Logger.error(SCOPE_SC_CORE, `Incubator with id ${id} not found`);
          Logger.error(SCOPE_SC_CORE, err.message);
        });
    }
  }, [__incubatorId]);

  useDeepCompareEffectNoCheck(() => {
    if (incubator) {
      const _i: SCIncubatorType = authUserId ? incubator : objectWithoutProperties<SCIncubatorType>(incubator, ['subscribed']);
      setSCIncubator(_i);
      LRUCache.set(__incubatorCacheKey, _i);
    }
  }, [incubator]);

  return {scIncubator, setSCIncubator, error};
}
