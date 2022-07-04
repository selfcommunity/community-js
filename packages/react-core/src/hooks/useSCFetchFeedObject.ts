import {useEffect, useMemo, useState} from 'react';
import {http, Endpoints, HttpResponse} from '@selfcommunity/api-services';
import {Logger} from '@selfcommunity/utils';
import {SCOPE_SC_CORE} from '../constants/Errors';
import {SCFeedDiscussionType, SCFeedObjectType, SCFeedObjectTypologyType, SCFeedPostType, SCFeedStatusType} from '@selfcommunity/types';
import {useDeepCompareEffectNoCheck} from 'use-deep-compare-effect';
import {LRUCache, CacheStrategies} from '@selfcommunity/utils';
import {getFeedObjectCacheKey} from '../constants/Cache';

/**
 :::info
 This custom hook is used to fetch a feed object.
 :::
 * @param object
 * @param object.id
 * @param object.feedObject
 * @param object.feedObjectType
 * @param cacheStrategy
 */
export default function useSCFetchFeedObject({
  id = null,
  feedObject = null,
  feedObjectType = SCFeedObjectTypologyType.POST || SCFeedObjectTypologyType.DISCUSSION || SCFeedObjectTypologyType.STATUS,
  cacheStrategy = CacheStrategies.CACHE_FIRST,
}: {
  id?: number;
  feedObject?: SCFeedObjectType;
  feedObjectType?: SCFeedObjectTypologyType;
  cacheStrategy?: CacheStrategies;
}) {
  const __feedObjectId = feedObject ? feedObject.id : id;
  const __feedObjectType = feedObject ? feedObject.type : feedObjectType;

  // CACHE
  const __feedObjectCacheKey = getFeedObjectCacheKey(__feedObjectId, __feedObjectType);

  const [obj, setObj] = useState<SCFeedDiscussionType | SCFeedPostType | SCFeedStatusType>(
    cacheStrategy !== CacheStrategies.NETWORK_ONLY ? LRUCache.get(__feedObjectCacheKey, feedObject) : null
  );
  const [error, setError] = useState<string>(null);

  /**
   * Memoized fetchFeedObject
   */
  const fetchFeedObject = useMemo(
    () => () => {
      return http
        .request({
          url: Endpoints.FeedObject.url({type: __feedObjectType, id: __feedObjectId}),
          method: Endpoints.FeedObject.method,
        })
        .then((res: HttpResponse<any>) => {
          if (res.status >= 300) {
            return Promise.reject(res);
          }
          return Promise.resolve(res.data);
        });
    },
    [__feedObjectId, __feedObjectType]
  );

  /**
   * If id and feedObjectType resolve feedObject
   */
  useEffect(() => {
    if (__feedObjectId && __feedObjectType && (!obj || cacheStrategy === CacheStrategies.STALE_WHILE_REVALIDATE)) {
      fetchFeedObject()
        .then((obj) => {
          setObj(obj);
          LRUCache.set(__feedObjectCacheKey, obj);
        })
        .catch((err) => {
          LRUCache.delete(__feedObjectCacheKey);
          setError(`FeedObject with id ${id} not found`);
          Logger.error(SCOPE_SC_CORE, `FeedObject with id ${id} not found`);
          Logger.error(SCOPE_SC_CORE, err.message);
        });
    }
  }, [__feedObjectId, __feedObjectType]);

  useDeepCompareEffectNoCheck(() => {
    if (feedObject) {
      setObj(feedObject);
      LRUCache.set(__feedObjectCacheKey, obj);
    }
  }, [feedObject]);

  return {obj, setObj, error};
}
