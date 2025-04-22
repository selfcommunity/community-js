import {Endpoints, http, HttpResponse} from '@selfcommunity/api-services';
import {
  SCEventSubscriptionStatusType,
  SCEventType,
  SCFeatureName,
  SCNotificationTopicType,
  SCNotificationTypologyType,
  SCUserType,
} from '@selfcommunity/types';
import {isClientSideRendering, Logger} from '@selfcommunity/utils';
import PubSub from 'pubsub-js';
import {useContext, useEffect, useMemo, useRef} from 'react';
import {useDeepCompareEffectNoCheck} from 'use-deep-compare-effect';
import {useSCPreferences} from '../components/provider/SCPreferencesProvider';
import {SCOPE_SC_CORE} from '../constants/Errors';
import {SCNotificationMapping} from '../constants/Notification';
import {CONFIGURATIONS_EVENTS_ENABLED} from '../constants/Preferences';
import {getEventStatus} from '../utils/event';
import useSCCachingManager from './useSCCachingManager';
import {SCRoutingContextType} from '../types/context';
import {SCRoutingContext} from '../components/provider/SCRoutingProvider';
import * as SCRoutes from '../constants/Routes';

/**
 :::info
 This custom hook is used to manage the events followed.
 :::

 :::tip How to use it:
 Follow these steps:
 ```jsx
 1. const scUserContext: SCUserContextType = useSCUser();
 2. const scSubscribedEventsManager: SCSubscribedEventsManagerType = scUserContext.manager.events;
 3. scSubscribedEventsManager.isSubscribed(event)
 ```
 :::
 */
export default function useSCSubscribedEventsManager(user?: SCUserType) {
  const {cache, updateCache, emptyCache, data, setData, loading, setLoading, setUnLoading, isLoading} = useSCCachingManager();
  const {preferences, features} = useSCPreferences();
  const scRoutingContext: SCRoutingContextType = useContext(SCRoutingContext);
  const authUserId = user ? user.id : null;
  const eventsEnabled = useMemo(
    () =>
      preferences &&
      features &&
      features.includes(SCFeatureName.TAGGING) &&
      CONFIGURATIONS_EVENTS_ENABLED in preferences &&
      preferences[CONFIGURATIONS_EVENTS_ENABLED].value,
    [preferences, features]
  );

  const notificationInvitedToJoinEvent = useRef(null);
  const notificationRequestedToJoinEvent = useRef(null);
  const notificationAcceptedToJoinEvent = useRef(null);
  const notificationAddedToEvent = useRef(null);

  /**
   * Subscribe to notification types user_follow, user_unfollow
   */
  useDeepCompareEffectNoCheck(() => {
    notificationInvitedToJoinEvent.current = PubSub.subscribe(
      `${SCNotificationTopicType.INTERACTION}.${SCNotificationTypologyType.USER_INVITED_TO_JOIN_EVENT}`,
      notificationSubscriber
    );
    notificationRequestedToJoinEvent.current = PubSub.subscribe(
      `${SCNotificationTopicType.INTERACTION}.${SCNotificationTypologyType.USER_REQUESTED_TO_JOIN_EVENT}`,
      notificationSubscriber
    );
    notificationAcceptedToJoinEvent.current = PubSub.subscribe(
      `${SCNotificationTopicType.INTERACTION}.${SCNotificationTypologyType.USER_ACCEPTED_TO_JOIN_EVENT}`,
      notificationSubscriber
    );
    notificationAddedToEvent.current = PubSub.subscribe(
      `${SCNotificationTopicType.INTERACTION}.${SCNotificationTypologyType.USER_ADDED_TO_EVENT}`,
      notificationSubscriber
    );
    return () => {
      PubSub.unsubscribe(notificationInvitedToJoinEvent.current);
      PubSub.unsubscribe(notificationRequestedToJoinEvent.current);
      PubSub.unsubscribe(notificationAcceptedToJoinEvent.current);
      PubSub.unsubscribe(notificationAddedToEvent.current);
    };
  }, [data]);

  /**
   * Notification subscriber handler
   * @param msg
   * @param dataMsg
   */
  const notificationSubscriber = (msg, dataMsg) => {
    if (dataMsg.data.event !== undefined) {
      let _status: SCEventSubscriptionStatusType;
      switch (SCNotificationMapping[dataMsg.data.activity_type]) {
        case SCNotificationTypologyType.USER_INVITED_TO_JOIN_EVENT:
          _status = SCEventSubscriptionStatusType.INVITED;
          if (
            isClientSideRendering() &&
            window.document.location.href.indexOf(scRoutingContext.url(SCRoutes.EVENT_ROUTE_NAME, dataMsg.data.notification_obj.event)) > -1
          ) {
            checkEventSubscriptionStatus(dataMsg.data.notification_obj.event);
          }
          break;
        /* case SCNotificationTypologyType.USER_REQUESTED_TO_JOIN_EVENT:
          _status = SCEventSubscriptionStatusType.REQUESTED;
          break;
        case SCNotificationTypologyType.USER_ACCEPTED_TO_JOIN_EVENT:
          _status = SCEventSubscriptionStatusType.SUBSCRIBED;
          break; */
        case SCNotificationTypologyType.USER_ADDED_TO_EVENT:
          _status = SCEventSubscriptionStatusType.SUBSCRIBED;
          break;
      }
      updateCache([dataMsg.data.event]);
      setData((prev) => getDataUpdated(prev, dataMsg.data.event, _status));
    }
  };
  /**
   * Memoized refresh all events
   * It makes a single request to the server and retrieves
   * all the events followed by the user in a single solution
   * It might be useful for multi-tab sync
   */
  const refresh = useMemo(
    () => (): void => {
      emptyCache();
      if (user) {
        // Only if user is authenticated
        http
          .request({
            url: Endpoints.GetUserSubscribedEvents.url({id: user.id}),
            method: Endpoints.GetUserSubscribedEvents.method,
          })
          .then((res: HttpResponse<any>) => {
            if (res.status >= 300) {
              return Promise.reject(res);
            }
            const eventsIds = res.data.results.map((e: SCEventType) => e.id);
            updateCache(eventsIds);
            setData(res.data.results.map((e: SCEventType) => ({[e.id]: e.subscription_status})));
            return Promise.resolve(res.data);
          })
          .catch((e) => {
            Logger.error(SCOPE_SC_CORE, 'Unable to refresh the authenticated user events.');
            Logger.error(SCOPE_SC_CORE, e);
          });
      }
    },
    [data, user, cache]
  );

  /**
   * Memoized toggleEventAttendance Event
   * Toggle action
   */
  const toggleEventAttendance = useMemo(
    () =>
      (event: SCEventType): Promise<any> => {
        setLoading(event.id);

        const requestConfig =
          !event.subscription_status || event.subscription_status === SCEventSubscriptionStatusType.INVITED
            ? {
                url: Endpoints.SubscribeToEvent.url({id: event.id}),
                method: Endpoints.SubscribeToEvent.method,
              }
            : event.subscription_status === SCEventSubscriptionStatusType.GOING
            ? {
                url: Endpoints.RemoveGoingToEvent.url({id: event.id}),
                method: Endpoints.RemoveGoingToEvent.method,
              }
            : {
                url: Endpoints.GoToEvent.url({id: event.id}),
                method: Endpoints.GoToEvent.method,
              };

        return http.request(requestConfig).then((res: HttpResponse<any>) => {
          if (res.status >= 300) {
            return Promise.reject(res);
          }

          let newStatus = getEventStatus(event, true);

          if (event.subscription_status === SCEventSubscriptionStatusType.NOT_GOING) {
            newStatus = getEventStatus(Object.assign({}, event, {subscription_status: SCEventSubscriptionStatusType.SUBSCRIBED}), true);
          }

          setData((prev) => getDataUpdated(prev, event.id, newStatus));
          updateCache([event.id]);
          setUnLoading(event.id);

          return Promise.resolve(Object.assign({}, event, {subscription_status: newStatus}));
        });
      },
    [data, loading, cache]
  );

  /**
   * Memoized toggleEventNonattendance Event
   * Toggle action
   */
  const toggleEventNonattendance = useMemo(
    () =>
      (event: SCEventType): Promise<any> => {
        if (event.subscription_status !== SCEventSubscriptionStatusType.REQUESTED) {
          setLoading(event.id);
          const requestConfig =
            event.subscription_status === SCEventSubscriptionStatusType.NOT_GOING
              ? {
                  url: Endpoints.RemoveNotGoingToEvent.url({id: event.id}),
                  method: Endpoints.RemoveNotGoingToEvent.method,
                }
              : {
                  url: Endpoints.NotGoingToEvent.url({id: event.id}),
                  method: Endpoints.NotGoingToEvent.method,
                };

          return http.request(requestConfig).then((res: HttpResponse<any>) => {
            if (res.status >= 300) {
              return Promise.reject(res);
            }

            let newStatus = getEventStatus(event, false);

            if (event.subscription_status === SCEventSubscriptionStatusType.GOING) {
              newStatus = getEventStatus(Object.assign({}, event, {subscription_status: SCEventSubscriptionStatusType.SUBSCRIBED}), false);
            }

            setData((prev) => getDataUpdated(prev, event.id, newStatus));
            updateCache([event.id]);
            setUnLoading(event.id);

            return Promise.resolve(Object.assign({}, event, {subscription_status: newStatus}));
          });
        } else {
          setLoading(event.id);

          return http
            .request({url: Endpoints.UnsubscribeFromEvent.url({id: event.id}), method: Endpoints.UnsubscribeFromEvent.method})
            .then((res: HttpResponse<any>) => {
              if (res.status >= 300) {
                return Promise.reject(res);
              }

              updateCache([event.id]);
              setData((prev) => getDataUpdated(prev, event.id, null));
              setUnLoading(event.id);

              return Promise.resolve(Object.assign({}, event, {subscription_status: null}));
            });
        }
      },
    [data, loading, cache]
  );

  /**
   * Check the authenticated user subscription status to the event
   * Update the events cached
   * Update events subscription statuses
   * @param event
   */
  const checkEventSubscriptionStatus = (event: SCEventType): Promise<any> => {
    setLoading(event.id);
    return http
      .request({
        url: Endpoints.GetEventSubscriptionStatus.url({id: event.id}),
        method: Endpoints.GetEventSubscriptionStatus.method,
      })
      .then((res: HttpResponse<any>) => {
        if (res.status >= 300) {
          return Promise.reject(res);
        }
        setData((prev) => getDataUpdated(prev, event.id, res.data.status));
        updateCache([event.id]);
        setUnLoading(event.id);
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        setUnLoading(event.id);
        return Promise.reject(e);
      });
  };

  /**
   * Get updated data
   * @param data
   * @param eventId
   * @param subscriptionStatus
   */
  const getDataUpdated = (data, eventId: number, subscriptionStatus: SCEventSubscriptionStatusType) => {
    const _index = data.findIndex((k) => parseInt(Object.keys(k)[0]) === eventId);
    let _data;
    if (_index < 0) {
      _data = [...data, ...[{[eventId]: subscriptionStatus}]];
    } else {
      _data = data.map((k, i) => {
        if (parseInt(Object.keys(k)[0]) === eventId) {
          return {[Object.keys(k)[0]]: subscriptionStatus};
        }
        return {[Object.keys(k)[0]]: data[i][Object.keys(k)[0]]};
      });
    }
    return _data;
  };

  /**
   * Return current event subscription status if exists,
   * otherwise return null
   */
  const getCurrentEventCacheStatus = useMemo(
    () =>
      (event: SCEventType): string => {
        const d = data.filter((k) => parseInt(Object.keys(k)[0]) === event.id);
        return d.length ? d[0][event.id] : !data.length ? event.subscription_status : null;
      },
    [data]
  );

  /**
   * Bypass remote check if the event is subscribed
   */
  const getSubscriptionStatus = useMemo(
    () => (event: SCEventType) => {
      updateCache([event.id]);
      setData((prev) => getDataUpdated(prev, event.id, event.subscription_status));
      return event.subscription_status;
    },
    [data, cache]
  );

  /**
   * Memoized subscriptionStatus
   * If event is already in cache -> check if the event is in events,
   * otherwise, check if user toggleEventAttendance the event
   */
  const subscriptionStatus = useMemo(
    () =>
      (event?: SCEventType): string => {
        // Cache is valid also for anonymous user
        if (cache.includes(event?.id)) {
          return getCurrentEventCacheStatus(event);
        }

        if (authUserId && event) {
          if ('subscription_status' in event) {
            return getSubscriptionStatus(event);
          }

          if (!isLoading(event)) {
            checkEventSubscriptionStatus(event);
          }
        }

        return null;
      },
    [loading, cache, authUserId, getSubscriptionStatus, getCurrentEventCacheStatus]
  );

  /**
   * Empty cache on logout
   */
  useEffect(() => {
    if (!authUserId) {
      emptyCache();
    }
  }, [authUserId]);

  if (!eventsEnabled || !user) {
    return {events: data, loading, isLoading};
  }
  return {events: data, loading, isLoading, toggleEventAttendance, toggleEventNonattendance, subscriptionStatus, refresh, emptyCache};
}
