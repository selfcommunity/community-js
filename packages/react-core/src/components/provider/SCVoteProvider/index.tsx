import React, {createContext, useCallback, useContext, useEffect, useState} from 'react';
import {ReactionService} from '@selfcommunity/api-services';
import {SCContextType, SCPreferencesContextType, SCVoteContextType} from '../../../types/context';
import {Logger} from '@selfcommunity/utils';
import {SCOPE_SC_CORE} from '../../../constants/Errors';
import {useSCContext} from '../SCContextProvider';
import {SCFeatureName, SCReactionType} from '@selfcommunity/types';
import {SCPreferencesContext} from '../SCPreferencesProvider';

/**
 * Creates Vote Context
 *
 :::tip Context can be consumed in one of the following ways:


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
 *  <SCVoteContext.Provider value={{reactions}}>{!isLoading && children}</SCVoteContext.Provider>
 *  ```
 */
export default function SCVoteProvider({children = null}: {children: React.ReactNode}): JSX.Element {
  const scContext: SCContextType = useSCContext();
  const scPreferencesContext: SCPreferencesContextType = useContext(SCPreferencesContext);
  const [reactions, setReactions] = useState<SCReactionType[]>(scContext.settings.vote.reactions);
  const [, setError] = useState<any>();
  const [initialized, setInitialized] = useState<boolean>(
    (scPreferencesContext.features && !scPreferencesContext.features.includes(SCFeatureName.REACTION)) || scContext.settings.vote.reactions !== null
  );
  const [isLoading, setIsLoading] = useState<boolean>(
    scPreferencesContext.features && scPreferencesContext.features.includes(SCFeatureName.REACTION) && scContext.settings.vote.reactions === null
  );

  /**
   * Helper to refresh reactions list
   */
  const refreshReactions = useCallback(
    () =>
      ReactionService.getAllReactionsList().then((data: SCReactionType[]) => {
        setReactions(data);
        return data;
      }),
    []
  );

  /**
   * Initialize component
   * Load all reactions if the feature 'reaction' is enabled
   */
  const _initComponent = useCallback((): void => {
    if (!initialized) {
      setInitialized(true);
      setIsLoading(true);
      refreshReactions()
        .then(() => {
          setIsLoading(false);
        })
        .catch((_error) => {
          Logger.error(SCOPE_SC_CORE, _error);
          setError(_error);
        });
    }
  }, [isLoading, initialized]);

  // EFFECTS
  useEffect(() => {
    let _t;
    if (scPreferencesContext.features && scPreferencesContext.features.includes(SCFeatureName.REACTION) && !reactions) {
      _t = setTimeout(_initComponent);
      return (): void => {
        _t && clearTimeout(_t);
      };
    }
  }, [scPreferencesContext.features, reactions]);

  /**
   * Nesting all necessary providers
   * All child components will use help contexts to works
   */
  return <SCVoteContext.Provider value={{reactions, isLoading, refreshReactions}}>{initialized && children}</SCVoteContext.Provider>;
}

/**
 * Let's only export the `useSCPreferences` hook instead of the context.
 * We only want to use the hook directly and never the context component.
 */
export function useSCVote(): SCVoteContextType {
  return useContext(SCVoteContext);
}
