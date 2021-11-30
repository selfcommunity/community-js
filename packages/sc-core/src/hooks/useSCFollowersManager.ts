import {useMemo, useRef, useState} from 'react';
import {AxiosResponse} from 'axios';
import http from '../utils/http';
import Endpoints from '../constants/Endpoints';
import {SCPreferencesContextType, SCUserType} from '../types';
import {Logger} from '../utils/logger';
import {SCOPE_SC_CORE} from '../constants/Errors';
import {useSCPreferencesContext} from '../components/provider/SCPreferencesProvider';
import {CONFIGURATIONS_FOLLOW_ENABLED} from '../constants/Preferences';

/**
 * Custom hook 'useSCFollowedManager'
 * Use this hook to manage categories followed:
 * 1. const scUserContext: SCUserContextType = useSCUser();
 * 2. const scFollowedManager: SCFollowedManagerType = scUserContext.manager.followed;
 * 3. scFollowedManager.isFollowed(user)
 */
export default function useSCFollowedManager() {
  const cache = useRef<number[]>([]);
  const [followed, setFollowed] = useState<SCUserType[]>([]);
  const [loading, setLoading] = useState<number[]>([]);
  const scPreferencesContext: SCPreferencesContextType = useSCPreferencesContext();
  const followEnabled =
    CONFIGURATIONS_FOLLOW_ENABLED in scPreferencesContext.preferences && scPreferencesContext.preferences[CONFIGURATIONS_FOLLOW_ENABLED].value;

  /**
   * Update followed cache
   * @param userIds
   */
  const updateCache = useMemo(
    () =>
      (userIds: number[]): void => {
        userIds.map((u) => {
          if (!cache.current.includes(u)) {
            cache.current.push(u);
          }
        });
      },
    [cache]
  );

  /**
   * Empty cache
   * emptying the cache each isFollow request
   * results in a request to the server
   */
  const emptyCache = useMemo(
    () => (): void => {
      cache.current = [];
    },
    [cache]
  );

  /**
   * User is checking
   * Return true if the manager is checking
   * the follow status of the user
   * @param user
   */
  const isLoading = useMemo(
    () =>
      (user: SCUserType): boolean => {
        return loading.includes(user.id);
      },
    [loading]
  );

  /**
   * Memoized refresh all followed
   * It makes a single request to the server and retrieves
   * all the users followed by the authenticated user in a single solution
   * It might be useful for multi-tab sync
   */
  const refresh = useMemo(
    () => () => {
      Logger.warn(SCOPE_SC_CORE, 'This method has not yet been implemented.');
    },
    []
  );

  /**
   * Memoized follow/unfollow User
   * Toggle action
   */
  const follow = useMemo(
    () => (user: SCUserType) => {
      setLoading((prev) => [...prev, ...[user.id]]);
      return http
        .request({
          url: Endpoints.FollowUser.url({id: user.id}),
          method: Endpoints.FollowUser.method,
        })
        .then((res: AxiosResponse<any>) => {
          if (res.status >= 300) {
            return Promise.reject(res);
          }
          updateCache([user.id]);
          const isFollowed = followed.filter((u) => u.id === user.id).length > 0;
          if (isFollowed) {
            setFollowed(followed.filter((u: SCUserType) => u.id !== user.id));
          } else {
            setFollowed([...[user], ...followed]);
          }
          setLoading((prev) => prev.filter((u) => u !== user.id));
          return Promise.resolve(res.data);
        });
    },
    [followed, loading, cache]
  );

  /**
   * Check if the authenticated user follow the user
   * Update the followed cached
   * Update followed user
   * @param user
   */
  const checkIsUserFollowed = (user: SCUserType) => {
    setLoading((prev) => (prev.includes(user.id) ? prev : [...prev, ...[user.id]]));
    http
      .request({
        url: Endpoints.CheckUserFollowed.url({id: user.id}),
        method: Endpoints.CheckUserFollowed.method,
      })
      .then((res: AxiosResponse<any>) => {
        if (res.status >= 300) {
          return Promise.reject(res);
        }
        updateCache([user.id]);
        if (res.data.is_followed) {
          setFollowed((prev) => [...[user], ...prev]);
        } else {
          setFollowed((prev) => prev.filter((u: SCUserType) => u.id !== user.id));
        }
        setLoading((prev) => prev.filter((u) => u !== user.id));
        return Promise.resolve(res.data);
      });
  };

  /**
   * Memoized isFollowed
   * If user is already in cache -> check if the user is in followed,
   * otherwise, check if auth user follow the user
   */
  const isFollowed = useMemo(
    () =>
      (user: SCUserType): boolean => {
        if (cache.current.includes(user.id)) {
          return Boolean(followed.filter((u) => u.id === user.id).length);
        }
        if (!loading.includes(user.id)) {
          checkIsUserFollowed(user);
        }
        return false;
      },
    [followed, loading, cache]
  );

  if (!followEnabled) {
    return null;
  }
  return {followed, loading, isLoading, follow, isFollowed, refresh, emptyCache};
}
