import {useEffect, useMemo, useState} from 'react';
import {SCOPE_SC_CORE} from '../constants/Errors';
import {SCEventPrivacyType, SCEventSubscriptionStatusType, SCEventType} from '@selfcommunity/types';
import {Endpoints, EventService, http, HttpResponse} from '@selfcommunity/api-services';
import {CacheStrategies, Logger, LRUCache, objectWithoutProperties} from '@selfcommunity/utils';
import {getEventObjectCacheKey} from '../constants/Cache';
import {useDeepCompareEffectNoCheck} from 'use-deep-compare-effect';
import {useSCUser} from '../components/provider/SCUserProvider';
import {SCUserContextType} from '../types/context';

/**
 :::info
 This custom hook is used to fetch an event object.
 :::
 * @param object
 * @param object.id
 * @param object.event
 * @param object.autosubscribe
 * @param object.cacheStrategy
 */
export default function useSCFetchEvent({
  id = null,
  event = null,
  autoSubscribe = true,
  cacheStrategy = CacheStrategies.CACHE_FIRST,
}: {
  id?: number | string;
  event?: SCEventType;
  autoSubscribe?: boolean;
  cacheStrategy?: CacheStrategies;
}) {
  console.log('Params: ', event, id);
  const __eventId = event ? event.id : id;

  // CONTEXT
  const scUserContext: SCUserContextType = useSCUser();
  const authUserId = scUserContext.user ? scUserContext.user.id : null;

  // CACHE
  const __eventCacheKey = getEventObjectCacheKey(__eventId);
  const __event = authUserId ? event : objectWithoutProperties<SCEventType>(event, ['subscription_status']);

  const [scEvent, setScEvent] = useState<SCEventType>(cacheStrategy !== CacheStrategies.NETWORK_ONLY ? LRUCache.get(__eventCacheKey, __event) : null);
  const [error, setError] = useState<string>(null);

  /**
   * Memoized setSCEvent (auto-subscription if need it)
   */
  const setSCEvent = useMemo(
    () => (e: SCEventType) => {
      if (
        autoSubscribe &&
        authUserId !== null &&
        ((e.privacy === SCEventPrivacyType.PUBLIC && !e.subscription_status) || e.subscription_status === SCEventSubscriptionStatusType.INVITED)
      ) {
        // Auto subscribe to the event
        EventService.subscribeToEvent(e.id).then(() => {
          const updatedEvent = {...e, subscription_status: SCEventSubscriptionStatusType.SUBSCRIBED};
          console.log('Update event', updatedEvent.id);
          setScEvent(updatedEvent);
          LRUCache.set(__eventCacheKey, updatedEvent);
        });
      } else {
        const updatedEvent: SCEventType = authUserId ? e : objectWithoutProperties<SCEventType>(e, ['subscription_status']);
        setScEvent(updatedEvent);
        LRUCache.set(__eventCacheKey, updatedEvent);
      }
    },
    [autoSubscribe, authUserId, setScEvent]
  );

  /**
   * Memoized fetchTag
   */
  const fetchEvent = useMemo(
    () => () => {
      return http
        .request({
          url: Endpoints.GetEventInfo.url({id: __eventId}),
          method: Endpoints.GetEventInfo.method,
        })
        .then((res: HttpResponse<SCEventType>) => {
          if (res.status >= 300) {
            return Promise.reject(res);
          }
          return Promise.resolve(res.data);
        });
    },
    [__eventId]
  );

  /**
   * If id attempt to get the event by id
   */
  useEffect(() => {
    if (__eventId?.toString() !== undefined && !event) {
      fetchEvent()
        .then((e: SCEventType) => {
          setSCEvent(e);
        })
        .catch((err) => {
          LRUCache.delete(__eventCacheKey);
          setError(`Event with id ${id} not found`);
          Logger.error(SCOPE_SC_CORE, `Event with id ${id} not found`);
          Logger.error(SCOPE_SC_CORE, err.message);
        });
    }
  }, [__eventId, event]);

  useDeepCompareEffectNoCheck(() => {
    if (event) {
      setSCEvent(event);
    }
  }, [event, authUserId]);

  return {scEvent, setSCEvent, error};
}
