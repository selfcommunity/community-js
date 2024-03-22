import {useEffect, useMemo, useState} from 'react';
import {SCOPE_SC_CORE} from '../constants/Errors';
import {SCGroupType} from '@selfcommunity/types';
import {Endpoints, http, HttpResponse} from '@selfcommunity/api-services';
import {CacheStrategies, Logger, LRUCache, objectWithoutProperties} from '@selfcommunity/utils';
import {getGroupObjectCacheKey} from '../constants/Cache';
import {useDeepCompareEffectNoCheck} from 'use-deep-compare-effect';
import {useSCUser} from '../components/provider/SCUserProvider';
import {SCUserContextType} from '../types/context';

/**
 :::info
 This custom hook is used to fetch a group object.
 :::
 * @param object
 * @param object.id
 * @param object.group
 * @param object.cacheStrategy
 */
export default function useSCFetchGroup({
  id = null,
  group = null,
  cacheStrategy = CacheStrategies.CACHE_FIRST,
}: {
  id?: number | string;
  group?: SCGroupType;
  cacheStrategy?: CacheStrategies;
}) {
  const __groupId = group ? group.id : id;

  // CONTEXT
  const scUserContext: SCUserContextType = useSCUser();
  const authUserId = scUserContext.user ? scUserContext.user.id : null;

  // CACHE
  const __groupCacheKey = getGroupObjectCacheKey(__groupId);
  const __group = authUserId ? group : objectWithoutProperties<SCGroupType>(group, ['subscribed']);

  const [scGroup, setSCGroup] = useState<SCGroupType>(cacheStrategy !== CacheStrategies.NETWORK_ONLY ? LRUCache.get(__groupCacheKey, __group) : null);
  const [error, setError] = useState<string>(null);

  /**
   * Memoized fetchTag
   */
  const fetchGroup = useMemo(
    () => () => {
      return http
        .request({
          url: Endpoints.GetGroupInfo.url({id: __groupId}),
          method: Endpoints.GetGroupInfo.method,
        })
        .then((res: HttpResponse<SCGroupType>) => {
          if (res.status >= 300) {
            return Promise.reject(res);
          }
          return Promise.resolve(res.data);
        });
    },
    [__groupId]
  );

  /**
   * If id attempt to get the group by id
   */
  useEffect(() => {
    if (__groupId && (!scGroup || (scGroup && __groupId !== scGroup.id))) {
      fetchGroup()
        .then((obj: SCGroupType) => {
          const _c: SCGroupType = authUserId ? obj : objectWithoutProperties<SCGroupType>(obj, ['subscribed']);
          setSCGroup(_c);
          LRUCache.set(__groupCacheKey, _c);
        })
        .catch((err) => {
          LRUCache.delete(__groupCacheKey);
          setError(`Group with id ${id} not found`);
          Logger.error(SCOPE_SC_CORE, `Group with id ${id} not found`);
          Logger.error(SCOPE_SC_CORE, err.message);
        });
    }
  }, [__groupId]);

  useDeepCompareEffectNoCheck(() => {
    if (group) {
      const _c: SCGroupType = authUserId ? group : objectWithoutProperties<SCGroupType>(group, ['subscribed']);
      setSCGroup(_c);
      LRUCache.set(__groupCacheKey, _c);
    }
  }, [group]);

  return {scGroup, setSCGroup, error};
}
