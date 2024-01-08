import {useEffect, useMemo, useRef} from 'react';
import {http, Endpoints, HttpResponse, EndpointType} from '@selfcommunity/api-services';
import {SCPreferencesContextType} from '../types';
import {SCNotificationTopicType, SCNotificationTypologyType, SCUserType} from '@selfcommunity/types';
import {Logger} from '@selfcommunity/utils';
import {SCOPE_SC_CORE} from '../constants/Errors';
import {useSCPreferences} from '../components/provider/SCPreferencesProvider';
import {CONFIGURATIONS_FOLLOW_ENABLED} from '../constants/Preferences';
import useSCCachingManager from './useSCCachingManager';
import PubSub from 'pubsub-js';
import {SCNotificationMapping} from '../constants/Notification';
import {SCConnectionStatus} from '@selfcommunity/types';
import {useDeepCompareEffectNoCheck} from 'use-deep-compare-effect';

/**
 :::info
 This custom hook is used to manage to manage friends.
 :::

 :::tip How to use it:

 Follow these steps:
 ```jsx
 1. const scUserContext: SCUserContextType = useSCUser();
 2. const scConnectionsManager: SCConnectionsManagerType = scUserContext.manager.connections;
 3. scConnectionsManager.status(user)
 ```
 :::
 */
export default function useSCConnectionsManager(user?: SCUserType) {
  const {cache, updateCache, emptyCache, data, setData, loading, setLoading, setUnLoading, isLoading} = useSCCachingManager();
  const scPreferencesContext: SCPreferencesContextType = useSCPreferences();
  const authUserId = user ? user.id : null;
  const connectionsDisabled =
    CONFIGURATIONS_FOLLOW_ENABLED in scPreferencesContext.preferences && scPreferencesContext.preferences[CONFIGURATIONS_FOLLOW_ENABLED].value;
  const notificationConnAcceptSubscription = useRef(null);
  const notificationConnRequestSubscription = useRef(null);
  const notificationConnRemoveSubscription = useRef(null);
  const notificationConnRequestCancelSubscription = useRef(null);

  /**
   * Notification subscriber handler
   * @param msg
   * @param data
   */
  const notificationSubscriber = (msg, dataMsg) => {
    if (dataMsg.data.connection !== undefined) {
      let _upd: {user: string; state: string};
      switch (SCNotificationMapping[dataMsg.data.activity_type]) {
        case SCNotificationTypologyType.CONNECTION_REQUEST:
          _upd = {user: 'request_user', state: SCConnectionStatus.CONNECTION_REQUEST_RECEIVED};
          break;
        case SCNotificationTypologyType.CONNECTION_CANCEL_REQUEST:
          _upd = {user: 'cancel_request_user', state: null};
          break;
        case SCNotificationTypologyType.CONNECTION_ACCEPT:
          _upd = {user: 'accept_user', state: SCConnectionStatus.CONNECTED};
          break;
        case SCNotificationTypologyType.CONNECTION_REMOVE:
          _upd = {user: 'remove_user', state: null};
          break;
      }
      updateCache([dataMsg.data[_upd.user].id]);
      setData((prev) => getDataUpdated(prev, dataMsg.data[_upd.user].id, _upd.state));
    }
  };

  /**
   * Subscribe to notification types user_follow, user_unfollow
   */
  useDeepCompareEffectNoCheck(() => {
    notificationConnAcceptSubscription.current = PubSub.subscribe(
      `${SCNotificationTopicType.INTERACTION}.${SCNotificationTypologyType.CONNECTION_ACCEPT}`,
      notificationSubscriber
    );
    notificationConnRequestSubscription.current = PubSub.subscribe(
      `${SCNotificationTopicType.INTERACTION}.${SCNotificationTypologyType.CONNECTION_REQUEST}`,
      notificationSubscriber
    );
    notificationConnRequestCancelSubscription.current = PubSub.subscribe(
      `${SCNotificationTopicType.INTERACTION}.${SCNotificationTypologyType.CONNECTION_CANCEL_REQUEST}`,
      notificationSubscriber
    );
    notificationConnRemoveSubscription.current = PubSub.subscribe(
      `${SCNotificationTopicType.INTERACTION}.${SCNotificationTypologyType.CONNECTION_REMOVE}`,
      notificationSubscriber
    );
    return () => {
      PubSub.unsubscribe(notificationConnAcceptSubscription.current);
      PubSub.unsubscribe(notificationConnRequestSubscription.current);
      PubSub.unsubscribe(notificationConnRequestCancelSubscription.current);
      PubSub.unsubscribe(notificationConnRemoveSubscription.current);
    };
  }, [data]);

  /**
   * Memoized refresh all connections
   * It makes a single request to the server and retrieves
   * all the users connected by the authenticated user in a single solution
   * It might be useful for multi-tab sync
   */
  const refresh = useMemo(
    () => (): void => {
      emptyCache();
      if (authUserId && cache.length > 0) {
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
            setData(Object.keys(res.data.connection_statuses).map((k) => ({[k]: res.data.connection_statuses[k]})));
            return Promise.resolve(res.data);
          })
          .catch((e) => {
            Logger.error(SCOPE_SC_CORE, 'Unable to refresh users Connections by the authenticated user.');
            Logger.error(SCOPE_SC_CORE, e);
          });
      }
    },
    [data, authUserId, cache]
  );

  /**
   * Memoized Request connection
   */
  const handleRequest = useMemo(
    () =>
      (user: SCUserType, endpoint: EndpointType): Promise<any> => {
        setLoading(user.id);
        return http
          .request({
            url: endpoint.url({id: user.id}),
            method: endpoint.method,
          })
          .then((res: HttpResponse<{connection_status: string}>) => {
            if (res.status >= 300) {
              return Promise.reject(res);
            }
            updateCache([user.id]);
            setData((prev) => getDataUpdated(prev, user.id, res.data.connection_status));
            setUnLoading(user.id);
            return Promise.resolve(res.data);
          })
          .catch((e) => {
            Logger.error(SCOPE_SC_CORE, e);
            if (e && e.response && e.response && e.response.status && e.response.status === 403) {
              setUnLoading(user.id);
              return Promise.reject(e);
            }
            return checkUserConnectionStatus(user);
          });
      },
    [data, loading, cache]
  );

  /**
   * Memoized Request connection
   */
  const requestConnection = useMemo(
    () =>
      (user: SCUserType): Promise<any> => {
        return handleRequest(user, Endpoints.UserRequestConnection);
      },
    [handleRequest]
  );

  /**
   * Memoized cancel request connection
   */
  const cancelRequestConnection = useMemo(
    () =>
      (user: SCUserType): Promise<any> => {
        return handleRequest(user, Endpoints.UserCancelRequestConnection);
      },
    [handleRequest]
  );

  /**
   * Memoized Remove connection
   */
  const removeConnection = useMemo(
    () =>
      (user: SCUserType): Promise<any> => {
        return handleRequest(user, Endpoints.UserRemoveConnection);
      },
    [handleRequest]
  );

  /**
   * Memoized Accept Request connection
   */
  const acceptConnection = useMemo(
    () =>
      (user: SCUserType): Promise<any> => {
        return handleRequest(user, Endpoints.UserAcceptRequestConnection);
      },
    [handleRequest]
  );

  /**
   * Return current user status if exists,
   * otherwise return null
   */
  const getCurrentUserCacheStatus = useMemo(
    () =>
      (user: SCUserType): string => {
        const d = data.filter((k) => parseInt(Object.keys(k)[0]) === user.id);
        return d.length ? d[0][user.id] : null;
      },
    [data]
  );

  /**
   * Check if the authenticated user is connected with the user
   * Update the users cached
   * Update user statuses
   * @param user
   */
  const checkUserConnectionStatus = (user: SCUserType): Promise<any> => {
    setLoading(user.id);
    return http
      .request({
        url: Endpoints.UserCheckConnectionStatus.url({id: user.id}),
        method: Endpoints.UserCheckConnectionStatus.method,
      })
      .then((res: HttpResponse<any>) => {
        if (res.status >= 300) {
          return Promise.reject(res);
        }
        setData((prev) => getDataUpdated(prev, user.id, res.data.connection_status));
        updateCache([user.id]);
        setUnLoading(user.id);
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        setUnLoading(user.id);
        return Promise.reject(e);
      });
  };

  /**
   * Get updated data
   * @param data
   * @param userId
   * @param connectionStatus
   */
  const getDataUpdated = (data, userId, connectionStatus) => {
    const _index = data.findIndex((k) => parseInt(Object.keys(k)[0]) === userId);
    let _data;
    if (_index < 0) {
      _data = [...data, ...[{[userId]: connectionStatus}]];
    } else {
      _data = data.map((k, i) => {
        if (parseInt(Object.keys(k)[0]) === userId) {
          return {[Object.keys(k)[0]]: connectionStatus};
        }
        return {[Object.keys(k)[0]]: data[i][Object.keys(k)[0]]};
      });
    }
    return _data;
  };

  /**
   * Bypass remote check if the user is followed
   */
  const getConnectionStatus = useMemo(
    () => (user: SCUserType) => {
      updateCache([user.id]);
      setData((prev) => getDataUpdated(prev, user.id, user.connection_status));
      return user.connection_status;
    },
    [data, cache]
  );

  /**
   * Memoized status
   * If user is already in cache -> check data user statuses,
   * otherwise, check if auth user is connected with user
   */
  const status = (user: SCUserType): string => {
    if (cache.includes(user.id)) {
      return getCurrentUserCacheStatus(user);
    }
    if (authUserId) {
      if ('connection_status' in user) {
        return getConnectionStatus(user);
      }
      if (!isLoading(user)) {
        checkUserConnectionStatus(user);
      }
    }
    return null;
  };

  /**
   * Empty cache on logout
   */
  useEffect(() => {
    if (!authUserId) {
      emptyCache();
    }
  }, [authUserId]);

  if (connectionsDisabled || !user) {
    return {connections: data, loading, isLoading};
  }
  return {
    connections: data,
    loading,
    isLoading,
    status,
    requestConnection,
    cancelRequestConnection,
    acceptConnection,
    removeConnection,
    refresh,
    emptyCache,
  };
}
