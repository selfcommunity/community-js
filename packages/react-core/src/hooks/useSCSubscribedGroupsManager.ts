import {useEffect, useMemo} from 'react';
import {Endpoints, http, HttpResponse} from '@selfcommunity/api-services';
import {SCFeatureName, SCGroupPrivacyType, SCGroupSubscriptionStatusType, SCGroupType, SCUserType} from '@selfcommunity/types';
import useSCCachingManager from './useSCCachingManager';
import {SCOPE_SC_CORE} from '../constants/Errors';
import {Logger} from '@selfcommunity/utils';
import {useSCPreferences} from '../components/provider/SCPreferencesProvider';
import {SCPreferencesContextType} from '../types';

/**
 :::info
 This custom hook is used to manage the groups followed.
 :::

 :::tip How to use it:
 Follow these steps:
 ```jsx
 1. const scUserContext: SCUserContextType = useSCUser();
 2. const scSubscribedGroupsManager: SCSubscribedGroupsManagerType = scUserContext.manager.groups;
 3. scSubscribedGroupsManager.isSubscribed(group)
 ```
 :::
 */
export default function useSCSubscribedGroupsManager(user?: SCUserType) {
  const {cache, updateCache, emptyCache, data, setData, loading, setLoading, setUnLoading, isLoading} = useSCCachingManager();
  const scPreferencesContext: SCPreferencesContextType = useSCPreferences();
  const authUserId = user ? user.id : null;
  const groupsDisabled = scPreferencesContext.features && !scPreferencesContext.features.includes(SCFeatureName.GROUPING);

  /**
   * Memoized refresh all groups
   * It makes a single request to the server and retrieves
   * all the groups followed by the user in a single solution
   * It might be useful for multi-tab sync
   */
  const refresh = useMemo(
    () => (): void => {
      emptyCache();
      if (user) {
        // Only if user is authenticated
        http
          .request({
            url: Endpoints.GetUserGroups.url(),
            method: Endpoints.GetUserGroups.method,
          })
          .then((res: HttpResponse<any>) => {
            if (res.status >= 300) {
              return Promise.reject(res);
            }
            const groupsIds = res.data.results.map((g: SCGroupType) => g.id);
            updateCache(groupsIds);
            setData(res.data.results.map((g: SCGroupType) => ({[g.id]: g.subscription_status})));
            return Promise.resolve(res.data);
          })
          .catch((e) => {
            Logger.error(SCOPE_SC_CORE, 'Unable to refresh the authenticated user groups.');
            Logger.error(SCOPE_SC_CORE, e);
          });
      }
    },
    [data, user, cache]
  );

  /**
   * Memoized subscribe Group
   * Toggle action
   */
  const subscribe = useMemo(
    () =>
      (group: SCGroupType, userId?: number): Promise<any> => {
        setLoading(group.id);
        if (userId) {
          return http
            .request({
              url: Endpoints.InviteOrAcceptGroupRequest.url({id: group.id}),
              method: Endpoints.InviteOrAcceptGroupRequest.method,
              data: {users: [userId]},
            })
            .then((res: HttpResponse<any>) => {
              if (res.status >= 300) {
                return Promise.reject(res);
              }
              updateCache([group.id]);
              setData((prev) => getDataUpdated(prev, group.id, SCGroupSubscriptionStatusType.SUBSCRIBED));
              setUnLoading(group.id);
              return Promise.resolve(res.data);
            });
        } else {
          return http
            .request({
              url: Endpoints.SubscribeToGroup.url({id: group.id}),
              method: Endpoints.SubscribeToGroup.method,
            })
            .then((res: HttpResponse<any>) => {
              if (res.status >= 300) {
                return Promise.reject(res);
              }
              updateCache([group.id]);
              setData((prev) =>
                getDataUpdated(
                  prev,
                  group.id,
                  group.privacy === SCGroupPrivacyType.PRIVATE && group.subscription_status !== SCGroupSubscriptionStatusType.INVITED
                    ? SCGroupSubscriptionStatusType.REQUESTED
                    : SCGroupSubscriptionStatusType.SUBSCRIBED
                )
              );
              setUnLoading(group.id);
              return Promise.resolve(res.data);
            });
        }
      },
    [data, loading, cache]
  );

  /**
   * Memoized subscribe Group
   * Toggle action
   */
  const unsubscribe = useMemo(
    () =>
      (group: SCGroupType): Promise<any> => {
        if (group.subscription_status !== SCGroupSubscriptionStatusType.REQUESTED) {
          setLoading(group.id);
          return http
            .request({
              url: Endpoints.UnsubscribeFromGroup.url({id: group.id}),
              method: Endpoints.UnsubscribeFromGroup.method,
            })
            .then((res: HttpResponse<any>) => {
              if (res.status >= 300) {
                return Promise.reject(res);
              }
              updateCache([group.id]);
              setData((prev) => getDataUpdated(prev, group.id, null));
              setUnLoading(group.id);
              return Promise.resolve(res.data);
            });
        }
      },
    [data, loading, cache]
  );

  /**
   * Check the authenticated user subscription status to the group
   * Update the groups cached
   * Update groups subscription statuses
   * @param group
   */
  const checkGroupSubscriptionStatus = (group: SCGroupType): Promise<any> => {
    setLoading(group.id);
    return http
      .request({
        url: Endpoints.GetGroupSubscriptionStatus.url({id: group.id}),
        method: Endpoints.GetGroupSubscriptionStatus.method,
      })
      .then((res: HttpResponse<any>) => {
        if (res.status >= 300) {
          return Promise.reject(res);
        }
        setData((prev) => getDataUpdated(prev, group.id, res.data.status));
        updateCache([group.id]);
        setUnLoading(group.id);
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        setUnLoading(group.id);
        return Promise.reject(e);
      });
  };

  /**
   * Get updated data
   * @param data
   * @param groupId
   * @param subscriptionStatus
   */
  const getDataUpdated = (data, groupId, subscriptionStatus) => {
    const _index = data.findIndex((k) => parseInt(Object.keys(k)[0]) === groupId);
    let _data;
    if (_index < 0) {
      _data = [...data, ...[{[groupId]: subscriptionStatus}]];
    } else {
      _data = data.map((k, i) => {
        if (parseInt(Object.keys(k)[0]) === groupId) {
          return {[Object.keys(k)[0]]: subscriptionStatus};
        }
        return {[Object.keys(k)[0]]: data[i][Object.keys(k)[0]]};
      });
    }
    return _data;
  };

  /**
   * Return current group subscription status if exists,
   * otherwise return null
   */
  const getCurrentGroupCacheStatus = useMemo(
    () =>
      (group: SCGroupType): string => {
        const d = data.filter((k) => parseInt(Object.keys(k)[0]) === group.id);
        return d.length ? d[0][group.id] : null;
      },
    [data]
  );

  /**
   * Bypass remote check if the group is subscribed
   */
  const getSubscriptionStatus = useMemo(
    () => (group: SCGroupType) => {
      updateCache([group.id]);
      setData((prev) => getDataUpdated(prev, group.id, group.subscription_status));
      return group.subscription_status;
    },
    [data, cache]
  );

  /**
   * Memoized subscriptionStatus
   * If group is already in cache -> check if the group is in groups,
   * otherwise, check if user subscribe the group
   */
  const subscriptionStatus = useMemo(
    () =>
      (group: SCGroupType): string => {
        // Cache is valid also for anonymous user
        if (cache.includes(group.id)) {
          return getCurrentGroupCacheStatus(group);
        }
        if (authUserId) {
          if ('subscription_status' in group) {
            return getSubscriptionStatus(group);
          }
          if (!isLoading(group)) {
            checkGroupSubscriptionStatus(group);
          }
        }
        return null;
      },
    [loading, cache, authUserId]
  );

  /**
   * Empty cache on logout
   */
  useEffect(() => {
    if (!authUserId) {
      emptyCache();
    }
  }, [authUserId]);

  if (groupsDisabled || !user) {
    return {groups: data, loading, isLoading};
  }
  return {groups: data, loading, isLoading, subscribe, unsubscribe, subscriptionStatus, refresh, emptyCache};
}
