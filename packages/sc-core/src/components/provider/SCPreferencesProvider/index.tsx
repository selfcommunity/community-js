import React, {createContext, ReactNode, useContext, useEffect, useState} from 'react';
import preferencesServices from '../../../services/preferences';
import featuresServices from '../../../services/features';
import {SCPreferencesContextType} from '../../../types/context';
import {Logger} from '../../../utils/logger';
import {SCOPE_SC_CORE} from '../../../constants/Errors';

/**
 * Create Preferences/Features Context
 * Consuming this context in one of the following ways:
 *  1. <SCPreferencesContext.Consumer>
 *       {(preferences) => (...)}
 *     </SCPreferencesContext.Consumer>
 *  2. const scPreferences: SCPreferencesType = usePreferencesContext(SCPreferencesContext);
 *  3. const scPreferences: SCPreferencesType = useSCPreferences();
 */
export const SCPreferencesContext = createContext<SCPreferencesContextType>({} as SCPreferencesContextType);

/**
 * SCPreferencesProvider
 * This import all preferences and features enabled
 */
export default function SCPreferencesProvider({children = null}: {children: React.ReactNode}): JSX.Element {
  const [preferences, setPreferences] = useState<Record<string, any>>({});
  const [features, setFeatures] = useState<string[]>([]);
  const [, setError] = useState<any>();
  const [loading, setLoading] = useState<boolean>(true);

  /**
   * Load all dynamic preferences and features enabled
   * to manages configurations of the project
   */
  useEffect(() => {
    Promise.all([preferencesServices.loadPreferences(), featuresServices.loadFeatures()])
      .then(function (results) {
        setPreferences(results[0]);
        setFeatures(results[1]);
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
  return <SCPreferencesContext.Provider value={{preferences, features}}>{!loading && children}</SCPreferencesContext.Provider>;
}

/**
 * Let's only export the `useSCPreferences` hook instead of the context.
 * We only want to use the hook directly and never the context component.
 */
export function useSCPreferences(): SCPreferencesContextType {
  return useContext(SCPreferencesContext);
}
