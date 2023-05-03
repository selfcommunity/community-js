import {useEffect, useMemo, useState} from 'react';
import {SCOPE_SC_CORE} from '../constants/Errors';
import {SCCategoryType, SCTagType} from '@selfcommunity/types';
import {Endpoints, http, HttpResponse} from '@selfcommunity/api-services';
import {CacheStrategies, Logger, LRUCache, objectWithoutProperties} from '@selfcommunity/utils';
import {getCategoryObjectCacheKey} from '../constants/Cache';
import {useDeepCompareEffectNoCheck} from 'use-deep-compare-effect';
import {SCUserContextType, useSCUser} from '@selfcommunity/react-core';

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

  // CONTEXT
  const scUserContext: SCUserContextType = useSCUser();
  const authUserId = scUserContext.user ? scUserContext.user.id : null;

  // CACHE
  const __categoryCacheKey = getCategoryObjectCacheKey(__categoryId);
  const __category = authUserId ? category : objectWithoutProperties<SCCategoryType>(category, ['followed']);

  const [scCategory, setSCCategory] = useState<SCCategoryType>(
    cacheStrategy !== CacheStrategies.NETWORK_ONLY ? LRUCache.get(__categoryCacheKey, __category) : null
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
    if (__categoryId && (!scCategory || (scCategory && __categoryId !== scCategory.id))) {
      fetchCategory()
        .then((obj: SCCategoryType) => {
          const _c: SCCategoryType = authUserId ? obj : objectWithoutProperties<SCCategoryType>(obj, ['followed']);
          setSCCategory(_c);
          LRUCache.set(__categoryCacheKey, _c);
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
      const _c: SCCategoryType = authUserId ? category : objectWithoutProperties<SCCategoryType>(category, ['followed']);
      setSCCategory(_c);
      LRUCache.set(__categoryCacheKey, _c);
    }
  }, [category]);

  return {scCategory, setSCCategory, error};
}
