import {useEffect, useState} from 'react';
import {SCOPE_SC_CORE} from '../constants/Errors';
import {SCUserAutocompleteType} from '@selfcommunity/types';
import {Endpoints, http} from '@selfcommunity/api-services';
import {CacheStrategies, Logger, LRUCache} from '@selfcommunity/utils';

const init = {users: [], isLoading: true};

// --- Cache keys
const getUsersObjectCacheKey = () => '__sc_usersAct_object__';
const getUserObjectCacheKey = (id: number) => `__sc_userAct_object__${id}`;

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
const useSCFetchUsers = (props?: {cacheStrategy?: CacheStrategies}) => {
  const {cacheStrategy = CacheStrategies.CACHE_FIRST} = props || {};

  // Cache
  const __usersCacheKey = getUsersObjectCacheKey();

  // State
  const users = cacheStrategy !== CacheStrategies.NETWORK_ONLY ? hydrate(LRUCache.get(__usersCacheKey, null)) : null;
  const [data, setData] = useState<{users: SCUserAutocompleteType[]; isLoading: boolean}>(users !== null ? {users, isLoading: false} : init);

  /**
   * Fetch all users
   */
  const fetchUsers = async (next: string = Endpoints.UserAutocomplete.url()): Promise<[]> => {
    const response = await http.request({
      url: next,
      method: Endpoints.UserAutocomplete.method,
    });
    const data: any = response.data;
    if (data.next) {
      return data.results.concat(await fetchUsers(data.next));
    }
    return data.results;
  };

  useEffect(() => {
    if (cacheStrategy === CacheStrategies.CACHE_FIRST && users) {
      return;
    }
    fetchUsers()
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
      });
  }, []);

  return data;
};

export default useSCFetchUsers;
