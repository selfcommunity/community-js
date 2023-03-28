import {useEffect, useMemo, useState} from 'react';
import {Endpoints, http, HttpResponse} from '@selfcommunity/api-services';
import {CacheStrategies, Logger, LRUCache} from '@selfcommunity/utils';
import {SCOPE_SC_CORE} from '../constants/Errors';
import {SCContributionType, SCFeedDiscussionType, SCFeedObjectType, SCFeedPostType, SCFeedStatusType} from '@selfcommunity/types';
import {useDeepCompareEffectNoCheck} from 'use-deep-compare-effect';
import {getFeedObjectCacheKey} from '../constants/Cache';

/**
 :::info
 This custom hook is used to fetch a feed object.
 :::
 * @param object
 * @param object.id
 * @param object.feedObject
 * @param object.feedObjectType
 * @param object.cacheStrategy
 */
export default function useSCFetchFeedObject({
  id = null,
  feedObject = null,
  feedObjectType = SCContributionType.POST || SCContributionType.DISCUSSION || SCContributionType.STATUS,
  cacheStrategy = CacheStrategies.CACHE_FIRST,
}: {
  id?: number | string;
  feedObject?: SCFeedObjectType;
  feedObjectType?: Exclude<SCContributionType, SCContributionType.COMMENT>;
  cacheStrategy?: CacheStrategies;
}) {
  const __feedObjectId = feedObject ? feedObject.id : id;
  const __feedObjectType = feedObject ? feedObject.type : feedObjectType;

  // CACHE
  const __feedObjectCacheKey = getFeedObjectCacheKey(__feedObjectId, __feedObjectType);

  const [obj, setObj] = useState<SCFeedDiscussionType | SCFeedPostType | SCFeedStatusType>(
    cacheStrategy !== CacheStrategies.NETWORK_ONLY ? LRUCache.get(__feedObjectCacheKey, feedObject) : feedObject
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
    if (__feedObjectId && __feedObjectType && !feedObject) {
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
      if (cacheStrategy === CacheStrategies.NETWORK_ONLY) {
        setObj(feedObject);
        LRUCache.set(__feedObjectCacheKey, feedObject);
      } else {
        setObj(LRUCache.get(__feedObjectCacheKey, feedObject));
      }
    }
  }, [feedObject]);

  return {obj, setObj, error};
}
