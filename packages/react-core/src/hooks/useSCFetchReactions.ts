import {useEffect, useState} from 'react';
import {SCOPE_SC_CORE} from '../constants/Errors';
import {SCReactionType} from '@selfcommunity/types';
import {Endpoints, http} from '@selfcommunity/api-services';
import {CacheStrategies, Logger, LRUCache} from '@selfcommunity/utils';
import {getReactionsObjectCacheKey, getReactionObjectCacheKey} from '../constants/Cache';
import {useSCPreferences, useSCUser} from '@selfcommunity/react-core';
import * as SCFeatures from '../constants/Features';

const init = {reactions: [], isLoading: true};

// HYDRATE the cache
const hydrate = (ids: number[]) => {
  if (!ids) {
    return null;
  }
  const reactions: SCReactionType[] = ids.map((id) => {
    const __categoryCacheKey = getReactionObjectCacheKey(id);
    return LRUCache.get(__categoryCacheKey);
  });

  if (reactions.filter((c) => !c).length > 0) {
    // REVALIDATE CACHE
    return null;
  }

  return reactions;
};

/**
 :::info
 This custom hook is used to fetch reactions.
 @param object.cacheStrategy

 :::tipContext can be consumed in this way:

 ```jsx
 const {reactions, isLoading} = useSCFetchReactions();
 ```
 :::
 * @param props
 */
const useSCFetchReactions = (props?: {cacheStrategy?: CacheStrategies}) => {
  // HOOKS
  const scPreferences = useSCPreferences();

  // PROPS
  const {cacheStrategy = CacheStrategies.CACHE_FIRST} = props || {};

  // CACHE
  const __categoriesCacheKey = getReactionsObjectCacheKey();

  // STATE
  const reactions = cacheStrategy !== CacheStrategies.NETWORK_ONLY ? hydrate(LRUCache.get(__categoriesCacheKey, null)) : null;
  const [data, setData] = useState<{reactions: SCReactionType[]; isLoading: boolean}>(reactions !== null ? {reactions, isLoading: false} : init);

  /**
   * Fetch reactions
   */
  const fetchReactions = async (next: string = Endpoints.GetReactions.url()): Promise<[]> => {
    const response = await http.request({
      url: next,
      method: Endpoints.GetReactions.method,
    });
    const data: any = response.data;
    if (data.next) {
      return data.results.concat(await fetchReactions(data.next));
    }
    return data.results;
  };

  /**
   * Get reactions
   */
  useEffect(() => {
    if (cacheStrategy === CacheStrategies.CACHE_FIRST && reactions) {
      return;
    }
    if (!scPreferences.features.includes(SCFeatures.REACTION)) {
      return;
    }
    fetchReactions()
      .then((data) => {
        setData({reactions: data, isLoading: false});
        LRUCache.set(
          __categoriesCacheKey,
          data.map((r: SCReactionType) => {
            const __categoryCacheKey = getReactionObjectCacheKey(r.id);
            LRUCache.set(__categoryCacheKey, r);
            return r.id;
          })
        );
      })
      .catch((error) => {
        console.log(error);
        Logger.error(SCOPE_SC_CORE, 'Unable to retrieve reactions');
      });
  }, []);

  return data;
};

export default useSCFetchReactions;
