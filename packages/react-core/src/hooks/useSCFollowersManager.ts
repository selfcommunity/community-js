import {useEffect, useMemo, useRef} from 'react';
import {http, Endpoints, HttpResponse} from '@selfcommunity/api-services';
import {SCPreferencesContextType} from '../types';
import {SCNotificationTopicType, SCNotificationTypologyType, SCUserType} from '@selfcommunity/types';
import {useSCPreferences} from '../components/provider/SCPreferencesProvider';
import {CONFIGURATIONS_FOLLOW_ENABLED} from '../constants/Preferences';
import useSCCachingManager from './useSCCachingManager';
import PubSub from 'pubsub-js';
import {SCNotificationMapping} from '../constants/Notification';

/**
 :::info
 This custom hook is used to manage followers users.
 :::
 :::tipHow to use it:

 Follow these steps:
 ```jsx
 1. const scUserContext: SCUserContextType = useSCUser();
 2. const scFollowersManager: SCFollowersManagerType = scUserContext.manager.followers;
 3. scFollowersManager.isFollowers(user)
 ```
 :::
 */
export default function useSCFollowersManager(user?: SCUserType) {
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
  const notificationSubscriber = (msg, d) => {
    if (SCNotificationMapping[d.data.activity_type] === SCNotificationTypologyType.USER_FOLLOW) {
      updateCache([d.data.follower.id]);
      if (!data.includes(d.data.follower.id)) {
        setData((prev) => [...[d.data.follower.id], ...prev]);
      }
    } else if (SCNotificationMapping[d.data.activity_type] === SCNotificationTypologyType.USER_UNFOLLOW) {
      updateCache([d.data.unfollower.id]);
      if (data.includes(d.data.unfollower.id)) {
        setData((prev) => prev.filter((id) => id !== d.data.unfollower.id));
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
  }, [data.length, cache.length]);

  /**
   * Check if the user is a followers of the authenticated user
   * Update the followers cached
   * @param user
   */
  const checkIsUserFollowers = (user: SCUserType): void => {
    setLoading((prev) => (prev.includes(user.id) ? prev : [...prev, ...[user.id]]));
    http
      .request({
        url: Endpoints.CheckUserFollower.url({id: user.id}),
        method: Endpoints.CheckUserFollower.method,
      })
      .then((res: HttpResponse<any>) => {
        if (res.status >= 300) {
          return Promise.reject(res);
        }
        updateCache([user.id]);
        setData((prev) => (res.data.is_follower ? [...prev, ...[user.id]] : prev.filter((id) => id !== user.id)));
        setLoading((prev) => prev.filter((u) => u !== user.id));
        return Promise.resolve(res.data);
      });
  };

  /**
   * Memoized isFollower
   * If user is already in cache -> check if the user is in followers,
   * otherwise, check if user is a followers of the authenticated user
   */
  const isFollower = useMemo(
    () =>
      (user: SCUserType): boolean => {
        if (cache.includes(user.id)) {
          return Boolean(data.includes(user.id));
        }
        if (!loading.includes(user.id)) {
          checkIsUserFollowers(user);
        }
        return false;
      },
    [data, loading, cache]
  );

  if (!followEnabled || !user) {
    return {followers: data, loading, isLoading};
  }
  return {followers: data, loading, isLoading, isFollower, emptyCache};
}
