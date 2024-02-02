import {useEffect, useMemo, useState} from 'react';
import {SCOPE_SC_CORE} from '../constants/Errors';
import {Endpoints, http, HttpResponse} from '@selfcommunity/api-services';
import {CacheStrategies, Logger, LRUCache} from '@selfcommunity/utils';
import {SCCustomAdvPosition, SCCustomAdvType} from '@selfcommunity/types';
import useIsComponentMountedRef from '../utils/hooks/useIsComponentMountedRef';
import {getAdvObjectCacheKey} from '../constants/Cache';

/**
 :::info
 This custom hook is used to fetch a custom adv object.
 :::
 * @param object
 * @param object.position
 * @param object.categoryId
 * @param cacheStrategy
 */
export default function useSCFetchCustomAdv({
  id = null,
  position = null,
  categoriesId = null,
  cacheStrategy = CacheStrategies.CACHE_FIRST,
}: {
  id?: number;
  position?: SCCustomAdvPosition;
  categoriesId?: Array<number>;
  cacheStrategy?: CacheStrategies;
}) {
  const [scCustomAdv, setSCCustomAdv] = useState<SCCustomAdvType | null>(
    id !== null && cacheStrategy === CacheStrategies.CACHE_FIRST && LRUCache.get(getAdvObjectCacheKey(id))
      ? LRUCache.get(getAdvObjectCacheKey(id))
      : null
  );
  const [error, setError] = useState<string>(null);

  // REFS
  const mounted = useIsComponentMountedRef();

  /**
   * Cache advertising object
   */
  const storeCache = useMemo(
    () => (data: SCCustomAdvType[]) => {
      data.map((d) => {
        LRUCache.set(getAdvObjectCacheKey(d.id), d);
      });
    },
    []
  );

  /**
   * Memoized fetchCustomAdv
   */
  const fetchCustomAdv = useMemo(
    () => () => {
      if (id !== null) {
        return http
          .request({
            url: Endpoints.CustomAdv.url({id}),
            method: Endpoints.CustomAdv.method,
          })
          .then((res: HttpResponse<any>) => {
            if (res.status >= 300) {
              return Promise.reject(res);
            }
            return Promise.resolve([res.data]);
          });
      }
      return http
        .request({
          url: Endpoints.CustomAdvSearch.url({}),
          method: Endpoints.CustomAdvSearch.method,
          params: {
            ...(position && {position: position}),
            ...{categories: categoriesId ? `[${categoriesId.toString()}]` : '[]'},
          },
        })
        .then((res: HttpResponse<any>) => {
          if (res.status >= 300) {
            return Promise.reject(res);
          }
          return Promise.resolve(res.data.results);
        });
    },
    [id, position, `${categoriesId}`]
  );

  /**
   * If id attempt to get the category by id
   */
  useEffect(() => {
    if (!scCustomAdv || cacheStrategy !== CacheStrategies.CACHE_FIRST) {
      fetchCustomAdv()
        .then((data: SCCustomAdvType[]) => {
          if (mounted.current) {
            setSCCustomAdv(data[Math.floor(Math.random() * data.length)]);
          }
          storeCache(data);
        })
        .catch((err) => {
          if (mounted.current) {
            setError(`Custom ADV with position ${position} not found`);
          }
          Logger.error(SCOPE_SC_CORE, `Custom ADV with position ${position} not found`);
          Logger.error(SCOPE_SC_CORE, err.message);
        });
    }
  }, [id, position, `${categoriesId}`, scCustomAdv]);

  return {scCustomAdv, setSCCustomAdv, error};
}
