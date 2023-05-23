import {useEffect, useState} from 'react';
import {SCOPE_SC_CORE} from '../constants/Errors';
import {SCFeatureName, SCReactionType} from '@selfcommunity/types';
import {ReactionService} from '@selfcommunity/api-services';
import {CacheStrategies, Logger, LRUCache} from '@selfcommunity/utils';
import {getReactionObjectCacheKey, getReactionsObjectCacheKey} from '../constants/Cache';
import {useSCPreferences} from '../components/provider/SCPreferencesProvider';

const init = {default: null, reactions: [], isLoading: true};

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
  const __reactionsCacheKey = getReactionsObjectCacheKey();

  // STATE
  const reactions = cacheStrategy !== CacheStrategies.NETWORK_ONLY ? hydrate(LRUCache.get(__reactionsCacheKey, null)) : null;
  const [data, setData] = useState<{default: SCReactionType; reactions: SCReactionType[]; isLoading: boolean}>(
    reactions !== null ? {default: reactions.find((reaction) => reaction.id === 1), reactions, isLoading: false} : init
  );

  /**
   * Get reactions
   */
  useEffect(() => {
    if (cacheStrategy === CacheStrategies.CACHE_FIRST && reactions) {
      return;
    }
    if (!scPreferences.features || !scPreferences.features.includes(SCFeatureName.REACTION)) {
      return;
    }
    ReactionService.getAllReactionsList()
      .then((data: SCReactionType[]) => {
        setData({reactions: data, isLoading: false, default: data.find((reaction: SCReactionType) => reaction.id === 1)});
        LRUCache.set(
          __reactionsCacheKey,
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
