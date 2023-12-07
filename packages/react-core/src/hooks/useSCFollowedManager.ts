import {useEffect, useMemo} from 'react';
import {http, Endpoints, HttpResponse} from '@selfcommunity/api-services';
import {SCPreferencesContextType} from '../types';
import {SCUserType} from '@selfcommunity/types';
import {Logger} from '@selfcommunity/utils';
import {SCOPE_SC_CORE} from '../constants/Errors';
import {useSCPreferences} from '../components/provider/SCPreferencesProvider';
import {CONFIGURATIONS_FOLLOW_ENABLED} from '../constants/Preferences';
import useSCCachingManager from './useSCCachingManager';

/**
 * Used on refresh and in isFollowed method
 * Check if the user status is 'followed'
 * to update the cache and data
 */
const STATUS_FOLLOWED = 'followed';

/**
 :::info
 This custom hook is used to manage followed users.
 :::
 :::tipHow to use it:

 Follow these steps:
 ```jsx
 1. const scUserContext: SCUserContextType = useSCUser();
 2. const scFollowedManager: SCFollowedManagerType = scUserContext.manager.followed;
 3. scFollowedManager.isFollowed(user)
 ```
 :::
 */
export default function useSCFollowedManager(user?: SCUserType) {
  const {cache, updateCache, emptyCache, data, setData, loading, setLoading, setUnLoading, isLoading} = useSCCachingManager();
  const scPreferencesContext: SCPreferencesContextType = useSCPreferences();
  const authUserId = user ? user.id : null;
  const followEnabled =
    CONFIGURATIONS_FOLLOW_ENABLED in scPreferencesContext.preferences && scPreferencesContext.preferences[CONFIGURATIONS_FOLLOW_ENABLED].value;

  /**
   * Memoized refresh all followed
   * It makes a single request to the server and retrieves
   * all the users followed by the authenticated user in a single solution
   * It might be useful for multi-tab sync
   */
  const refresh = useMemo(
    () => (): void => {
      emptyCache();
      if (user && cache.length > 0) {
        // Only if user is authenticated
        http
          .request({
            url: Endpoints.UserConnectionStatuses.url({}),
            method: Endpoints.UserConnectionStatuses.method,
            data: {users: cache},
          })
          .then((res: HttpResponse<any>) => {
            if (res.status >= 300) {
              return Promise.reject(res);
            }
            updateCache(Object.keys(res.data.connection_statuses).map((id) => parseInt(id)));
            setData(
              Object.entries(res.data.connection_statuses)
                .filter(([, v]) => v === STATUS_FOLLOWED)
                .map(([k]) => parseInt(k))
            );
            return Promise.resolve(res.data);
          })
          .catch((e) => {
            Logger.error(SCOPE_SC_CORE, 'Unable to refresh users followed by the authenticated user.');
            Logger.error(SCOPE_SC_CORE, e);
          });
      }
    },
    [data, user, cache]
  );

  /**
   * Memoized follow/unfollow User
   * Toggle action
   */
  const follow = useMemo(
    () =>
      (user: SCUserType): Promise<any> => {
        setLoading(user.id);
        return http
          .request({
            url: Endpoints.FollowUser.url({id: user.id}),
            method: Endpoints.FollowUser.method,
          })
          .then((res: HttpResponse<any>) => {
            if (res.status >= 300) {
              return Promise.reject(res);
            }
            updateCache([user.id]);
            const isFollowed = data.includes(user.id);
            setData((prev) => (isFollowed ? prev.filter((id) => id !== user.id) : [...[user.id], ...prev]));
            setUnLoading(user.id);
            return Promise.resolve(res);
          })
          .catch((e) => {
            setUnLoading(user.id);
            return Promise.reject(e);
          });
      },
    [data, loading, cache]
  );

  /**
   * Check if the authenticated user follow the user
   * Update the followed cached
   * Update followed user
   * @param user
   */
  const checkIsUserFollowed = (user: SCUserType): void => {
    setLoading(user.id);
    http
      .request({
        url: Endpoints.CheckUserFollowed.url({id: user.id}),
        method: Endpoints.CheckUserFollowed.method,
      })
      .then((res: HttpResponse<any>) => {
        if (res.status >= 300) {
          return Promise.reject(res);
        }
        updateCache([user.id]);
        setData((prev) => (res.data.is_followed ? [...prev, ...[user.id]] : prev.filter((id) => id !== user.id)));
        setUnLoading(user.id);
        return Promise.resolve(res.data);
      });
  };

  /**
   * Bypass remote check if the user is followed
   */
  const getConnectionStatus = useMemo(
    () =>
      (user: SCUserType): boolean => {
        const isFollowed = user.connection_status === STATUS_FOLLOWED;
        updateCache([user.id]);
        setData((prev) => (isFollowed ? [...prev, ...[user.id]] : prev));
        return isFollowed;
      },
    [data, cache]
  );

  /**
   * Memoized isFollowed
   * If user is already in cache -> check if the user is in followed,
   * otherwise, check if auth user follow the user
   */
  const isFollowed = useMemo(() => {
    return (user: SCUserType): boolean => {
      if (cache.includes(user.id)) {
        return Boolean(data.includes(user.id));
      }
      if (authUserId) {
        if ('connection_status' in user) {
          return getConnectionStatus(user);
        }
        if (!isLoading(user)) {
          checkIsUserFollowed(user);
        }
      }
      return false;
    };
  }, [data, loading, cache, authUserId]);

  /**
   * Empty cache on logout
   */
  useEffect(() => {
    if (!authUserId) {
      emptyCache();
    }
  }, [authUserId]);

  if (!followEnabled || !user) {
    return {followed: data, loading, isLoading};
  }
  return {followed: data, loading, isLoading, follow, isFollowed, refresh, emptyCache};
}
