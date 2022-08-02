import {useEffect, useMemo, useState} from 'react';
import {SCOPE_SC_CORE} from '../constants/Errors';
import {SCCategoryType, SCTagType} from '@selfcommunity/types';
import {http, Endpoints, HttpResponse} from '@selfcommunity/api-services';
import {CacheStrategies, Logger, LRUCache} from '@selfcommunity/utils';
import {getCategoryObjectCacheKey} from '../constants/Cache';
import {useDeepCompareEffectNoCheck} from 'use-deep-compare-effect';

/**
 :::info
 This custom hook is used to fetch a category object.
 :::
 * @param object
 * @param object.id
 * @param object.category
 * @param object.cacheStrategy
 */
export default function useSCFetchCategory({
  id = null,
  category = null,
  cacheStrategy = CacheStrategies.CACHE_FIRST,
}: {
  id?: number | string;
  category?: SCCategoryType;
  cacheStrategy?: CacheStrategies;
}) {
  const __categoryId = category ? category.id : id;

  // CACHE
  const __categoryCacheKey = getCategoryObjectCacheKey(__categoryId);

  const [scCategory, setSCCategory] = useState<SCCategoryType>(
    cacheStrategy !== CacheStrategies.NETWORK_ONLY ? LRUCache.get(__categoryCacheKey, category) : null
  );
  const [error, setError] = useState<string>(null);

  /**
   * Memoized fetchTag
   */
  const fetchCategory = useMemo(
    () => () => {
      return http
        .request({
          url: Endpoints.Category.url({id: __categoryId}),
          method: Endpoints.Category.method,
        })
        .then((res: HttpResponse<SCTagType>) => {
          if (res.status >= 300) {
            return Promise.reject(res);
          }
          return Promise.resolve(res.data);
        });
    },
    [__categoryId]
  );

  /**
   * If id attempt to get the category by id
   */
  useEffect(() => {
    if (__categoryId && (!scCategory || cacheStrategy === CacheStrategies.STALE_WHILE_REVALIDATE)) {
      fetchCategory()
        .then((obj: SCCategoryType) => {
          setSCCategory(obj);
          LRUCache.set(__categoryCacheKey, obj);
        })
        .catch((err) => {
          LRUCache.delete(__categoryCacheKey);
          setError(`Category with id ${id} not found`);
          Logger.error(SCOPE_SC_CORE, `Category with id ${id} not found`);
          Logger.error(SCOPE_SC_CORE, err.message);
        });
    }
  }, [__categoryId]);

  useDeepCompareEffectNoCheck(() => {
    if (category) {
      if (cacheStrategy === CacheStrategies.NETWORK_ONLY) {
        setSCCategory(category);
        LRUCache.set(__categoryCacheKey, category);
      } else {
        setSCCategory(LRUCache.get(__categoryCacheKey, category));
      }
    }
  }, [category]);

  return {scCategory, setSCCategory, error};
}
