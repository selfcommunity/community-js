import React, {createContext, ReactNode, useContext, useEffect, useState} from 'react';
import preferencesServices from '../../../services/preferences';
import {SCPreferencesType} from '../../../types/context';
import {Logger} from '../../../utils/logger';
import {SCOPE_SC_CORE} from '../../../constants/Errors';

/**
 * Create Preferences Context
 * Consuming this context in one of the following ways:
 *  1. <SCPreferencesContext.Consumer>
 *       {(preferences) => (...)}
 *     </SCPreferencesContext.Consumer>
 *  2. const settings: SCPreferencesType = usePreferencesContext(SCPreferencesContext);
 *  3. const settings: SCPreferencesType = useSCPreferencesContext();
 */
export const SCPreferencesContext = createContext<SCPreferencesType>({} as SCPreferencesType);

/**
 * SCPreferencesProvider
 * This import all preferences
 */
export default function SCPreferencesProvider({children = null}: {children: React.ReactNode}): JSX.Element {
  const [preferences, setPreferences] = useState<Record<string, any>>({});
  const [, setError] = useState<any>();
  const [loading, setLoading] = useState<boolean>(true);

  /**
   * Load all dynamic preferences to manages
   * configurations of the project
   */
  useEffect(() => {
    preferencesServices
      .loadPreferences()
      .then((res) => {
        setPreferences(res);
      })
      .catch((_error) => {
        Logger.error(SCOPE_SC_CORE, _error);
        setError(_error);
      })
      .finally(() => setLoading(false));
  }, []);

  /**
   * Nesting all necessary providers
   * All child components will use help contexts to works
   */
  return <SCPreferencesContext.Provider value={{preferences}}>{!loading && children}</SCPreferencesContext.Provider>;
}

/**
 * Let's only export the `useSCPreferencesContext` hook instead of the context.
 * We only want to use the hook directly and never the context component.
 */
export function useSCPreferencesContext(): SCPreferencesType {
  return useContext(SCPreferencesContext);
}
