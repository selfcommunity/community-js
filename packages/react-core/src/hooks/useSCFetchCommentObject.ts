import {useEffect, useMemo, useState} from 'react';
import {SCOPE_SC_CORE} from '../constants/Errors';
import {SCCommentType} from '@selfcommunity/types';
import {http, Endpoints, HttpResponse} from '@selfcommunity/api-services';
import {CacheStrategies, Logger, LRUCache} from '@selfcommunity/utils';
import {getCommentObjectCacheKey} from '../constants/Cache';
import {useDeepCompareEffectNoCheck} from 'use-deep-compare-effect';

/**
 :::info
 This custom hooks is used to fetch a comment.
 :::
 * @param object
 * @param object.id
 * @param object.commentObject
 * @param cacheStrategy
 */
export default function useSCFetchCommentObject({
  id = null,
  commentObject = null,
  cacheStrategy = CacheStrategies.CACHE_FIRST,
}: {
  id?: number;
  commentObject?: SCCommentType;
  cacheStrategy?: CacheStrategies;
}) {
  const __commentObjectId = commentObject ? commentObject.id : id;

  // CACHE
  const __commentObjectCacheKey = getCommentObjectCacheKey(__commentObjectId);

  const [obj, setObj] = useState<SCCommentType>(
    cacheStrategy !== CacheStrategies.NETWORK_ONLY ? LRUCache.get(__commentObjectCacheKey, commentObject) : null
  );
  const [error, setError] = useState<string>(null);

  /**
   * Memoized fetchCommentObject
   */
  const fetchCommentObject = useMemo(
    () => () => {
      return http
        .request({
          url: Endpoints.Comment.url({id: __commentObjectId}),
          method: Endpoints.Comment.method,
        })
        .then((res: HttpResponse<any>) => {
          if (res.status >= 300) {
            return Promise.reject(res);
          }
          return Promise.resolve(res.data);
        });
    },
    [__commentObjectId]
  );

  /**
   * If id and feedObjectType resolve feddObject
   */
  useEffect(() => {
    if (__commentObjectId && (!obj || cacheStrategy === CacheStrategies.STALE_WHILE_REVALIDATE)) {
      fetchCommentObject()
        .then((obj) => {
          setObj(obj);
          LRUCache.set(__commentObjectCacheKey, obj);
        })
        .catch((err) => {
          LRUCache.delete(__commentObjectCacheKey);
          setError(`CommentObject with id ${id} not found`);
          Logger.error(SCOPE_SC_CORE, `CommentObject with id ${id} not found`);
          Logger.error(SCOPE_SC_CORE, err.message);
        });
    }
  }, [__commentObjectId]);

  useDeepCompareEffectNoCheck(() => {
    if (commentObject) {
      setObj(commentObject);
      LRUCache.set(__commentObjectCacheKey, obj);
    }
  }, [commentObject]);

  return {obj, setObj, error};
}
