import {useEffect, useState} from 'react';
import {SCOPE_SC_CORE} from '../constants/Errors';
import {SCEventType} from '@selfcommunity/types';
import {Endpoints, http} from '@selfcommunity/api-services';
import {CacheStrategies, Logger, LRUCache} from '@selfcommunity/utils';
import {getEventObjectCacheKey, getEventsObjectCacheKey} from '../constants/Cache';

const init = {events: [], isLoading: true};

// HYDRATE the cache
const hydrate = (ids: number[]) => {
  if (!ids) {
    return null;
  }
  const events: SCEventType[] = ids.map((id) => {
    const __eventCacheKey = getEventObjectCacheKey(id);
    return LRUCache.get(__eventCacheKey);
  });

  if (events.filter((c) => !c).length > 0) {
    // REVALIDATE CACHE
    return null;
  }

  return events;
};

/**
 :::info
 This custom hook is used to fetch events.
 @param object.cacheStrategy

 :::tip Context can be consumed in this way:

 ```jsx
 const {events, isLoading} = useSCFetchEvents();
 ```
 :::
 * @param props
 */
const useSCFetchEvents = (props?: {cacheStrategy?: CacheStrategies}) => {
  // PROPS
  const {cacheStrategy = CacheStrategies.CACHE_FIRST} = props || {};

  // CACHE
  const __eventsCacheKey = getEventsObjectCacheKey();

  // STATE
  const events = cacheStrategy !== CacheStrategies.NETWORK_ONLY ? hydrate(LRUCache.get(__eventsCacheKey, null)) : null;
  const [data, setData] = useState<{events: SCEventType[]; isLoading: boolean}>(events !== null ? {events, isLoading: false} : init);

  /**
   * Fetch events
   */
  const fetchEvents = async (next: string = Endpoints.GetUserEvents.url()): Promise<[]> => {
    const response = await http.request({
      url: next,
      method: Endpoints.GetUserEvents.method,
    });
    const data: any = response.data;
    if (data.next) {
      return data.results.concat(await fetchEvents(data.next));
    }
    return data.results;
  };

  /**
   * Get events
   */
  useEffect(() => {
    if (cacheStrategy === CacheStrategies.CACHE_FIRST && events) {
      return;
    }
    fetchEvents()
      .then((data) => {
        setData({events: data, isLoading: false});
        LRUCache.set(
          __eventsCacheKey,
          data.map((event: SCEventType) => {
            const __eventCacheKey = getEventObjectCacheKey(event.id);
            LRUCache.set(__eventCacheKey, event);
            return event.id;
          })
        );
      })
      .catch((error) => {
        console.log(error);
        Logger.error(SCOPE_SC_CORE, 'Unable to retrieve events');
      });
  }, []);

  return data;
};

export default useSCFetchEvents;
