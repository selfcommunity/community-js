import React, {createContext, useContext, useEffect, useMemo, useState} from 'react';
import {ReactionService} from '@selfcommunity/api-services';
import {SCContextType, SCPreferencesContextType, SCVoteContextType} from '../../../types/context';
import {Logger, LRUCache} from '@selfcommunity/utils';
import {SCOPE_SC_CORE} from '../../../constants/Errors';
import {useSCContext} from '../SCContextProvider';
import {SCFeatureName, SCReactionType} from '@selfcommunity/types';
import {getReactionObjectCacheKey, getReactionsObjectCacheKey} from '../../../constants/Cache';
import {SCPreferencesContext} from '@selfcommunity/react-core';

/**
 * Creates Vote Context
 *
 :::tipContext can be consumed in one of the following ways:


 ```jsx
 1. <SCVoteContext.Consumer>{(reactions) => (...)}</SCVoteContext.Consumer>
 ```
 ```jsx
 2. const scVoteContext: SCVoteContextType = useContext(SCVoteContext);
 ```
 ```jsx
 3. const scVoteContext: SCVoteContextType = useSCVote();
 ````
 :::
 */
export const SCVoteContext = createContext<SCVoteContextType>({} as SCVoteContextType);

/**
 * #### Description:
 * This component imports all reactions if the feature 'reaction' is enabled.
 * @param children
 * @return
 *  ```jsx
 *  <SCVoteContext.Provider value={{reactions}}>{!loading && children}</SCVoteContext.Provider>
 *  ```
 */
export default function SCVoteProvider({children = null}: {children: React.ReactNode}): JSX.Element {
  const scContext: SCContextType = useSCContext();
  const scPreferencesContext: SCPreferencesContextType = useContext(SCPreferencesContext);
  const [reactions] = useState<SCReactionType[]>(scContext.settings.vote.reactions);
  const [, setError] = useState<any>();
  const [initialized, setInitialized] = useState<boolean>(scContext.settings.vote.reactions !== null);
  const [loading, setLoading] = useState<boolean>(scContext.settings.vote.reactions === null);

  /**
   * Hydrate reactions cache
   * @param data
   */
  const hydrateCache = (data: SCReactionType[]): SCReactionType[] => {
    if (data && Array.isArray(data) && data.length) {
      LRUCache.set(
        getReactionsObjectCacheKey(),
        data.map((r: SCReactionType) => {
          const __reactionCacheKey = getReactionObjectCacheKey(r.id);
          LRUCache.set(__reactionCacheKey, r);
          return r.id;
        })
      );
    }
    return data;
  };

  /**
   * Helper to refresh reactions list
   */
  const refreshReactions = useMemo(
    () => () =>
      ReactionService.getAllReactionsList().then((data: SCReactionType[]) => {
        return hydrateCache(data);
      }),
    []
  );

  /**
   * Initialize component
   * Load all reactions if the feature 'reaction' is enabled
   */
  const _initComponent = useMemo(
    () => (): void => {
      if (!initialized) {
        setInitialized(true);
        setLoading(true);
        refreshReactions()
          .then(() => {
            setLoading(false);
          })
          .catch((_error) => {
            Logger.error(SCOPE_SC_CORE, _error);
            setError(_error);
          });
      } else {
        hydrateCache(reactions);
      }
    },
    [loading, reactions, initialized]
  );

  // EFFECTS
  useEffect(() => {
    let _t;
    if (scPreferencesContext.features && scPreferencesContext.features.includes(SCFeatureName.REACTION)) {
      _t = setTimeout(_initComponent);
      return (): void => {
        _t && clearTimeout(_t);
      };
    }
  }, [scPreferencesContext.features]);

  /**
   * Nesting all necessary providers
   * All child components will use help contexts to works
   */
  return <SCVoteContext.Provider value={{reactions, refreshReactions}}>{initialized && children}</SCVoteContext.Provider>;
}

/**
 * Let's only export the `useSCPreferences` hook instead of the context.
 * We only want to use the hook directly and never the context component.
 */
export function useSCVote(): SCVoteContextType {
  return useContext(SCVoteContext);
}
