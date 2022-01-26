import {useEffect, useMemo, useRef, useState} from 'react';
import {AxiosResponse} from 'axios';
import http from '../utils/http';
import Endpoints from '../constants/Endpoints';
import {SCNotificationTopicType, SCNotificationType, SCNotificationTypologyType, SCPreferencesContextType, SCUserType} from '../types';
import {Logger} from '../utils/logger';
import {SCOPE_SC_CORE} from '../constants/Errors';
import {useSCPreferences} from '../components/provider/SCPreferencesProvider';
import {CONFIGURATIONS_FOLLOW_ENABLED} from '../constants/Preferences';
import useSCCachingManager from './useSCCachingManager';
import PubSub from 'pubsub-js';
import {SCNotificationMapping} from '../constants/Notification';

/**
 * Used on refresh and in isFollowed method
 * Check if the user status is 'followed'
 * to update the cache and data
 */
const STATUS_FOLLOWED = 'followed';

/**
 * Custom hook 'useSCFollowedManager'
 * Use this hook to manage followed users:
 * 1. const scUserContext: SCUserContextType = useSCUser();
 * 2. const scFollowedManager: SCFollowedManagerType = scUserContext.manager.followed;
 * 3. scFollowedManager.isFollowed(user)
 */
export default function useSCFollowedManager(user?: SCUserType) {
  const {cache, updateCache, emptyCache, data, setData, loading, setLoading, isLoading} = useSCCachingManager();
  const scPreferencesContext: SCPreferencesContextType = useSCPreferences();
  const followEnabled =
    CONFIGURATIONS_FOLLOW_ENABLED in scPreferencesContext.preferences && scPreferencesContext.preferences[CONFIGURATIONS_FOLLOW_ENABLED].value;
  const notificationFollowSubscription = useRef(null);
  const notificationUnFollowSubscription = useRef(null);

  /**
   * Notification subscriber only for FOLLOW
   * @param msg
   * @param data
   */
  const notificationSubscriber = (msg, data) => {
    if (data.connection && data.connection_id !== undefined) {
      updateCache([data.connection_id]);
      if (SCNotificationMapping[data.data.activity_type] === SCNotificationTypologyType.USER_FOLLOW) {
        if (!data.includes(user.id)) {
          setData((prev) => [...[data.connection_id], ...prev]);
        }
      } else if (SCNotificationMapping[data.data.activity_type] === SCNotificationTypologyType.USER_UNFOLLOW) {
        if (data.includes(user.id)) {
          setData((prev) => prev.filter((id) => id !== data.connection_id));
        }
      }
    }
  };

  /**
   * Subscribe to notification types user_follow, user_unfollow
   */
  useEffect(() => {
    notificationFollowSubscription.current = PubSub.subscribe(
      `${SCNotificationTopicType.INTERACTION}.${SCNotificationTypologyType.USER_FOLLOW}`,
      notificationSubscriber
    );
    notificationUnFollowSubscription.current = PubSub.subscribe(
      `${SCNotificationTopicType.INTERACTION}.${SCNotificationTypologyType.USER_UNFOLLOW}`,
      notificationSubscriber
    );
    return () => {
      PubSub.unsubscribe(notificationFollowSubscription.current);
      PubSub.unsubscribe(notificationUnFollowSubscription.current);
    };
  }, []);

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
          .then((res: AxiosResponse<any>) => {
            if (res.status >= 300) {
              return Promise.reject(res);
            }
            updateCache(Object.keys(res.data.connection_statuses).map((id) => parseInt(id)));
            setData(
              Object.entries(res.data.connection_statuses)
                .filter(([k, v]) => v === STATUS_FOLLOWED)
                .map(([k, v]) => parseInt(k))
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
            const isFollowed = data.includes(user.id);
            setData((prev) => (isFollowed ? prev.filter((id) => id !== user.id) : [...[user.id], ...prev]));
            setLoading((prev) => prev.filter((u) => u !== user.id));
            return Promise.resolve(res.data);
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
        setData((prev) => (res.data.is_followed ? [...prev, ...[user.id]] : prev.filter((id) => id !== user.id)));
        setLoading((prev) => prev.filter((u) => u !== user.id));
        return Promise.resolve(res.data);
      });
  };

  /**
   * Bypass remote check if the user is followed
   */
  const getConnectionStatus = useMemo(
    () => (user: SCUserType) => {
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
  const isFollowed = useMemo(
    () =>
      (user: SCUserType): boolean => {
        if (cache.includes(user.id)) {
          return Boolean(data.includes(user.id));
        }
        if ('connection_status' in user) {
          return getConnectionStatus(user);
        }
        if (!loading.includes(user.id)) {
          checkIsUserFollowed(user);
        }
        return false;
      },
    [data, loading, cache]
  );

  if (!followEnabled) {
    return null;
  }
  return {followed: data, loading, isLoading, follow, isFollowed, refresh, emptyCache};
}
