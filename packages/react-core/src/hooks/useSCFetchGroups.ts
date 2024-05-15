import {useEffect, useState} from 'react';
import {SCOPE_SC_CORE} from '../constants/Errors';
import {SCGroupType} from '@selfcommunity/types';
import {Endpoints, http} from '@selfcommunity/api-services';
import {CacheStrategies, Logger, LRUCache} from '@selfcommunity/utils';
import {getGroupObjectCacheKey, getGroupsObjectCacheKey} from '../constants/Cache';

const init = {groups: [], isLoading: true};

// HYDRATE the cache
const hydrate = (ids: number[]) => {
  if (!ids) {
    return null;
  }
  const groups: SCGroupType[] = ids.map((id) => {
    const __groupCacheKey = getGroupObjectCacheKey(id);
    return LRUCache.get(__groupCacheKey);
  });

  if (groups.filter((c) => !c).length > 0) {
    // REVALIDATE CACHE
    return null;
  }

  return groups;
};

/**
 :::info
 This custom hook is used to fetch groups.
 @param object.cacheStrategy

 :::tip Context can be consumed in this way:

 ```jsx
 const {groups, isLoading} = useSCFetchGroups();
 ```
 :::
 * @param props
 */
const useSCFetchGroups = (props?: {cacheStrategy?: CacheStrategies}) => {
  // PROPS
  const {cacheStrategy = CacheStrategies.CACHE_FIRST} = props || {};

  // CACHE
  const __groupsCacheKey = getGroupsObjectCacheKey();

  // STATE
  const groups = cacheStrategy !== CacheStrategies.NETWORK_ONLY ? hydrate(LRUCache.get(__groupsCacheKey, null)) : null;
  const [data, setData] = useState<{groups: SCGroupType[]; isLoading: boolean}>(groups !== null ? {groups, isLoading: false} : init);

  /**
   * Fetch groups
   */
  const fetchGroups = async (next: string = Endpoints.GetUserGroups.url()): Promise<[]> => {
    const response = await http.request({
      url: next,
      method: Endpoints.GetUserGroups.method,
    });
    const data: any = response.data;
    if (data.next) {
      return data.results.concat(await fetchGroups(data.next));
    }
    return data.results;
  };

  /**
   * Get groups
   */
  useEffect(() => {
    if (cacheStrategy === CacheStrategies.CACHE_FIRST && groups) {
      return;
    }
    fetchGroups()
      .then((data) => {
        setData({groups: data, isLoading: false});
        LRUCache.set(
          __groupsCacheKey,
          data.map((group: SCGroupType) => {
            const __groupCacheKey = getGroupObjectCacheKey(group.id);
            LRUCache.set(__groupCacheKey, group);
            return group.id;
          })
        );
      })
      .catch((error) => {
        console.log(error);
        Logger.error(SCOPE_SC_CORE, 'Unable to retrieve groups');
      });
  }, []);

  return data;
};

export default useSCFetchGroups;
