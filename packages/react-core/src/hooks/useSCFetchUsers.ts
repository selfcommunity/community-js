import {useEffect, useState} from 'react';
import {SCOPE_SC_CORE} from '../constants/Errors';
import {SCUserAutocompleteType} from '@selfcommunity/types';
import {Endpoints, http} from '@selfcommunity/api-services';
import {CacheStrategies, Logger, LRUCache} from '@selfcommunity/utils';
import {getUserObjectCacheKey, getUsersObjectCacheKey} from '../constants/Cache';

// Hydrate cache
const hydrate = (ids: number[]) => {
  if (!ids) return null;
  const users: SCUserAutocompleteType[] = ids.map((id) => {
    const __userCacheKey = getUserObjectCacheKey(id);
    return LRUCache.get(__userCacheKey);
  });
  if (users.filter((u) => !u).length > 0) {
    return null; // revalidate cache
  }
  return users;
};

/**
 :::info
 This custom hook is used to fetch users.
 @param object.cacheStrategy

 :::tip Context can be consumed in this way:

 ```jsx
 const {users, isLoading} = useSCFetchUsers();
 ```
 :::
 * @param props
 */
const useSCFetchUsers = (props?: {cacheStrategy?: CacheStrategies; search?: string}) => {
  const {cacheStrategy = CacheStrategies.CACHE_FIRST, search = ''} = props || {};
  const __usersCacheKey = getUsersObjectCacheKey(search);

  const cachedUsers = cacheStrategy !== CacheStrategies.NETWORK_ONLY ? hydrate(LRUCache.get(__usersCacheKey, null)) : null;
  const [data, setData] = useState<{users: SCUserAutocompleteType[]; isLoading: boolean}>(
    cachedUsers !== null ? {users: cachedUsers, isLoading: false} : {users: [], isLoading: false}
  );

  const fetchUsers = async (next: string = Endpoints.UserAutocomplete.url(), searchParam?: string): Promise<SCUserAutocompleteType[]> => {
    const response = await http.request({
      url: next,
      method: Endpoints.UserAutocomplete.method,
      params: searchParam ? {search: searchParam} : undefined,
    });
    const data: any = response.data;
    if (data.next) {
      return data.results.concat(await fetchUsers(data.next, searchParam));
    }
    return data.results;
  };

  useEffect(() => {
    if (!search) return;
    if (cacheStrategy === CacheStrategies.CACHE_FIRST && cachedUsers) return;
    fetchUsers(undefined, search)
      .then((data) => {
        setData({users: data, isLoading: false});
        LRUCache.set(
          __usersCacheKey,
          data.map((u: SCUserAutocompleteType) => {
            const __userCacheKey = getUserObjectCacheKey(u.id);
            LRUCache.set(__userCacheKey, u);
            return u.id;
          })
        );
      })
      .catch((error) => {
        console.error(error);
        Logger.error(SCOPE_SC_CORE, 'Unable to retrieve users');
        setData((prev) => ({...prev, isLoading: false}));
      });
  }, [search]);

  return data;
};

export default useSCFetchUsers;
