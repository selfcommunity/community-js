import {useState} from 'react';
import {SCBroadcastMessageType} from '@selfcommunity/types';
import {Endpoints, http, SCPaginatedResponse} from '@selfcommunity/api-services';
import {CacheStrategies, Logger, LRUCache} from '@selfcommunity/utils';
import {getBroadcastMessagesObjectCacheKey} from '../constants/Cache';
import {SCOPE_SC_CORE} from '../constants/Errors';

/**
 * Initial base url to fetch the broadcast messages
 */
const broadcastMessagesRefreshUrl = `${Endpoints.BroadcastMessagesList.url()}?limit=3`;

/**
 * Define the key to cache results
 */
const broadcastMessagesCacheKey = getBroadcastMessagesObjectCacheKey();

/**
 * Initial state
 */
const initialData: SCPaginatedResponse = {results: [], next: broadcastMessagesRefreshUrl, previous: null, count: 0};

/**
 :::info
 This custom hook is used to fetch broadcast messages.
 @param object
 @param object.cacheStrategy

 :::tipContext can be consumed in this way:

 ```jsx
 const {messages, isLoading} = useSCFetchBroadcastMessages();
 ```
 :::
 */
const useSCFetchBroadcastMessages = (props?: {cacheStrategy?: CacheStrategies}) => {
  // PROPS
  const {cacheStrategy = CacheStrategies.CACHE_FIRST} = props || {};

  // STATE
  const cachedData = cacheStrategy !== CacheStrategies.NETWORK_ONLY ? LRUCache.get(broadcastMessagesCacheKey, null) : null;
  const [data, setData] = useState<SCPaginatedResponse<SCBroadcastMessageType>>(cachedData !== null ? cachedData : initialData);
  const [loading, setLoading] = useState<boolean>(cachedData ? false : null);

  /**
   * Fetch broadcast messages
   * Loads until the messages are already seen
   */
  const performFetchMessages = async (next: string): Promise<SCPaginatedResponse<SCBroadcastMessageType>> => {
    const response = await http.request({
      url: next,
      method: Endpoints.BroadcastMessagesList.method,
    });
    const data: any = response.data;
    if (data.next && !data.results[data.results.length - 1]['viewed_at']) {
      const _data: SCPaginatedResponse<SCBroadcastMessageType> = await performFetchMessages(data.next);
      return {results: data.results.concat(_data.results), next: _data.next, previous: null, count: _data.count};
    }
    return data;
  };

  /**
   * Fetch broadcast messages
   */
  const fetchMessages = async (refresh = false): Promise<SCPaginatedResponse<SCBroadcastMessageType>> => {
    setLoading(true);
    return performFetchMessages(refresh ? broadcastMessagesRefreshUrl : data.next)
      .then((res: SCPaginatedResponse<SCBroadcastMessageType>): Promise<SCPaginatedResponse<SCBroadcastMessageType>> => {
        const _data = refresh ? res : {results: [...data.results, ...res.results], next: res.next, count: res.count, previous: res.previous};
        setData(_data);
        setLoading(false);
        LRUCache.set(broadcastMessagesCacheKey, _data);
        return Promise.resolve(res);
      })
      .catch((error) => {
        Logger.error(SCOPE_SC_CORE, error);
        return Promise.reject();
      });
  };

  /**
   * Set broadcast messages
   */
  const setMessages = (messages: SCBroadcastMessageType[]) => {
    let _data = {
      results: [...messages],
      next: data.next,
      count: Math.max(data.count - (data.results.length - messages.length), 0),
      previous: data.previous,
    };
    setData(_data);
    LRUCache.set(broadcastMessagesCacheKey, _data);
    return _data;
  };

  return {data, loading, fetchMessages, setMessages};
};

export default useSCFetchBroadcastMessages;
