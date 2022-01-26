import {useEffect, useMemo, useRef, useState} from 'react';
import {AxiosResponse} from 'axios';
import http from '../utils/http';
import Endpoints from '../constants/Endpoints';
import {SCNotificationTopicType, SCNotificationTypologyType, SCPreferencesContextType, SCUserType} from '../types';
import {Logger} from '../utils/logger';
import {SCOPE_SC_CORE} from '../constants/Errors';
import {useSCPreferences} from '../components/provider/SCPreferencesProvider';
import {CONFIGURATIONS_FOLLOW_ENABLED} from '../constants/Preferences';
import useSCCachingManager from './useSCCachingManager';
import PubSub from 'pubsub-js';
import {SCNotificationMapping} from '../constants/Notification';

/**
 * Used on refresh and in status method
 * Check if the user status is 'connected', 'sent_connection_request'
 * 'received_connection_request', to update the cache and data
 */
const STATUS_CONNECTED = 'connected';
const STATUS_DISCONNECTED = 'disconnected';
const STATUS_CONNECTION_REQUEST_SENT = 'sent_connection_request';
const STATUS_CONNECTION_REQUEST_RECEIVED = 'received_connection_request';

/**
 * Custom hook 'useSCConnectionsManager'
 * Use this hook to manage friends:
 * 1. const scUserContext: SCUserContextType = useSCUser();
 * 2. const scConnectionsManager: SCConnectionsManagerType = scUserContext.manager.connections;
 * 3. scConnectionsManager.status(user)
 */
export default function useSCConnectionsManager(user?: SCUserType) {
  const {cache, updateCache, emptyCache, data, setData, loading, setLoading, isLoading} = useSCCachingManager();
  const scPreferencesContext: SCPreferencesContextType = useSCPreferences();
  const connectionsDisabled =
    CONFIGURATIONS_FOLLOW_ENABLED in scPreferencesContext.preferences && scPreferencesContext.preferences[CONFIGURATIONS_FOLLOW_ENABLED].value;
  const notificationConnAcceptSubscription = useRef(null);
  const notificationConnRequestSubscription = useRef(null);
  const notificationConnRemoveSubscription = useRef(null);

  /**
   * Notification subscriber only for FOLLOW
   * @param msg
   * @param data
   */
  const notificationSubscriber = (msg, data) => {
    if (data.connection && data.connection_id !== undefined) {
      updateCache([data.data.connection.id]);
      let _data = [];
      if (SCNotificationMapping[data.data.activity_type] === SCNotificationTypologyType.CONNECTION_REQUEST) {
        _data = data.map(([k, v]) => ({
          k: k === data.data.connection_id ? STATUS_CONNECTION_REQUEST_SENT : v,
        }));
      } else if (SCNotificationMapping[data.data.activity_type] === SCNotificationTypologyType.CONNECTION_ACCEPT) {
        _data = data.map(([k, v]) => ({
          k: k === data.data.connection_id ? STATUS_CONNECTED : v,
        }));
      } else if (SCNotificationMapping[data.data.activity_type] === SCNotificationTypologyType.CONNECTION_REMOVE) {
        _data = data.map(([k, v]) => ({
          k: k === data.data.connection_id ? STATUS_DISCONNECTED : v,
        }));
      }
      setData(_data);
    }
  };

  /**
   * Subscribe to notification types user_follow, user_unfollow
   */
  useEffect(() => {
    notificationConnAcceptSubscription.current = PubSub.subscribe(
      `${SCNotificationTopicType.INTERACTION}.${SCNotificationTypologyType.CONNECTION_ACCEPT}`,
      notificationSubscriber
    );
    notificationConnRequestSubscription.current = PubSub.subscribe(
      `${SCNotificationTopicType.INTERACTION}.${SCNotificationTypologyType.CONNECTION_REQUEST}`,
      notificationSubscriber
    );
    notificationConnRemoveSubscription.current = PubSub.subscribe(
      `${SCNotificationTopicType.INTERACTION}.${SCNotificationTypologyType.CONNECTION_REMOVE}`,
      notificationSubscriber
    );
    return () => {
      PubSub.unsubscribe(notificationConnAcceptSubscription.current);
      PubSub.unsubscribe(notificationConnRequestSubscription.current);
      PubSub.unsubscribe(notificationConnRemoveSubscription.current);
    };
  }, []);

  /**
   * Memoized refresh all connections
   * It makes a single request to the server and retrieves
   * all the users connected by the authenticated user in a single solution
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
                .filter(([k, v]) => v !== null)
                .map(([k, v]) => ({[parseInt(k)]: v}))
            );
            return Promise.resolve(res.data);
          })
          .catch((e) => {
            Logger.error(SCOPE_SC_CORE, 'Unable to refresh users Connections by the authenticated user.');
            Logger.error(SCOPE_SC_CORE, e);
          });
      }
    },
    [data, user, cache]
  );

  /**
   * Memoized Request connection
   */
  const requestConnection = useMemo(
    () =>
      (user: SCUserType): Promise<any> => {
        setLoading((prev) => [...prev, ...[user.id]]);
        if (getCurrentStatus(user) === STATUS_CONNECTION_REQUEST_RECEIVED) {
          return acceptConnection(user);
        }
        return http
          .request({
            url: Endpoints.UserRequestConnection.url({id: user.id}),
            method: Endpoints.UserRequestConnection.method,
          })
          .then((res: AxiosResponse<any>) => {
            if (res.status >= 300) {
              return Promise.reject(res);
            }
            updateCache([user.id]);
            const _data = data.map(([k, v]) => ({
              k: k === user.id ? STATUS_CONNECTION_REQUEST_SENT : v,
            }));
            setData(_data);
            setLoading((prev) => prev.filter((u) => u !== user.id));
            return Promise.resolve(res.data);
          });
      },
    [data, loading, cache]
  );

  /**
   * Memoized Accept Request connection
   */
  const acceptConnection = useMemo(
    () =>
      (user: SCUserType): Promise<any> => {
        setLoading((prev) => [...prev, ...[user.id]]);
        if (getCurrentStatus(user) === STATUS_CONNECTION_REQUEST_RECEIVED) {
          return http
            .request({
              url: Endpoints.UserAcceptRequestConnection.url({id: user.id}),
              method: Endpoints.UserAcceptRequestConnection.method,
            })
            .then((res: AxiosResponse<any>) => {
              if (res.status >= 300) {
                return Promise.reject(res);
              }
              updateCache([user.id]);
              const _data = data.map(([k, v]) => ({
                k: k === user.id ? STATUS_CONNECTED : v,
              }));
              setData(_data);
              setLoading((prev) => prev.filter((u) => u !== user.id));
              return Promise.resolve(res.data);
            });
        }
      },
    [data, loading, cache]
  );

  /**
   * Return current user status if exist,
   * otherwise return null
   */
  const getCurrentStatus = useMemo(
    () =>
      (user: SCUserType): string => {
        const d = data.filter(([id, v]) => id === user.id);
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
  const checkUserConnectionStatus = (user: SCUserType): void => {
    setLoading((prev) => (prev.includes(user.id) ? prev : [...prev, ...[user.id]]));
    http
      .request({
        url: Endpoints.UserCheckConnection.url({id: user.id}),
        method: Endpoints.UserCheckConnection.method,
      })
      .then((res: AxiosResponse<any>) => {
        if (res.status >= 300) {
          return Promise.reject(res);
        }
        updateCache([user.id]);
        setData((prev) => (res.data.is_connection ? [...prev, ...[{[user.id]: STATUS_CONNECTED}]] : prev.filter(([id, v]) => id !== user.id)));
        setLoading((prev) => prev.filter((u) => u !== user.id));
        return Promise.resolve(res.data);
      });
  };

  /**
   * Memoized status
   * If user is already in cache -> check data user statuses,
   * otherwise, check if auth user is connected with user
   */
  const status = useMemo(
    () =>
      (user: SCUserType): string => {
        if (cache.includes(user.id)) {
          return data.filter((k, v) => k === user.id)[0][user.id];
        }
        if (!loading.includes(user.id)) {
          checkUserConnectionStatus(user);
        }
        return null;
      },
    [data, loading, cache]
  );

  if (connectionsDisabled) {
    return null;
  }
  return {connections: data, loading, isLoading, status, requestConnection, acceptConnection, refresh, emptyCache};
}
