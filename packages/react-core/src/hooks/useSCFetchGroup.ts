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
  const __group = authUserId ? group : objectWithoutProperties<SCGroupType>(group, ['subscription_status']);

  const [scGroup, setScGroup] = useState<SCGroupType>(cacheStrategy !== CacheStrategies.NETWORK_ONLY ? LRUCache.get(__groupCacheKey, __group) : null);
  const [error, setError] = useState<string>(null);

  const setSCGroup = (group: SCGroupType) => {
    const _c: SCGroupType = authUserId ? group : objectWithoutProperties<SCGroupType>(group, ['subscription_status']);
    setScGroup(_c);
    LRUCache.set(__groupCacheKey, _c);
  };

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
   * Refresh group
   */
  const refreshGroup = useMemo(
    () => () => {
      fetchGroup()
        .then((obj: SCGroupType) => {
          setSCGroup(obj);
        })
        .catch((err) => {
          LRUCache.delete(__groupCacheKey);
          setError(`Error on refresh group with id ${id}`);
          Logger.error(SCOPE_SC_CORE, `Error on refresh group with id ${id}`);
          Logger.error(SCOPE_SC_CORE, err.message);
        });
    },
    [__groupCacheKey, setSCGroup]
  );

  /**
   * If id attempt to get the group by id
   */
  useEffect(() => {
    if (__groupId && (!scGroup || (scGroup && __groupId !== scGroup.id))) {
      fetchGroup()
        .then((obj: SCGroupType) => {
          setSCGroup(obj);
        })
        .catch((err) => {
          LRUCache.delete(__groupCacheKey);
          setError(`Group with id ${id} not found`);
          Logger.error(SCOPE_SC_CORE, `Group with id ${id} not found`);
          Logger.error(SCOPE_SC_CORE, err.message);
        });
    }
  }, [__groupId, authUserId]);

  useDeepCompareEffectNoCheck(() => {
    if (group) {
      setSCGroup(group);
    }
  }, [group, authUserId]);

  return {scGroup, setSCGroup, error, refreshGroup};
}
