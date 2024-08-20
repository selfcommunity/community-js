import { FeatureService, PreferenceService } from '@selfcommunity/api-services';
import { Logger } from '@selfcommunity/utils';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { SCOPE_SC_CORE } from '../../../constants/Errors';
import { SCContextType, SCPreferencesContextType } from '../../../types/context';
import { useSCContext } from '../SCContextProvider';

/**
 * Creates Preferences/Features Context
 *
 :::tip Context can be consumed in one of the following ways:


 ```jsx
 1. <SCPreferencesContext.Consumer>{(preferences) => (...)}</SCPreferencesContext.Consumer>
 ```
 ```jsx
 2. const scPreferences: SCPreferencesType = useContext(SCPreferencesContext);
 ```
 ```jsx
 3. const scPreferences: SCPreferencesType = useSCPreferences();
 ````
 :::
 */
export const SCPreferencesContext = createContext<SCPreferencesContextType>({} as SCPreferencesContextType);

/**
 * #### Description:
 * This component imports all preferences and features enabled.
 * @param children
 * @return
 *  ```jsx
 *  <SCPreferencesContext.Provider value={{preferences, features}}>{!loading && children}</SCPreferencesContext.Provider>
 *  ```
 */
export default function SCPreferencesProvider({ children = null }: { children: React.ReactNode }): JSX.Element {
  const scContext: SCContextType = useSCContext();
  const [preferences, setPreferences] = useState<Record<string, any>>(scContext.settings.preferences.preferences);
  const [features, setFeatures] = useState<string[]>(scContext.settings.preferences.features);
  const [, setError] = useState<any>();
  const [loading, setLoading] = useState<boolean>(
    !(Object.keys(scContext.settings.preferences.preferences).length && scContext.settings.preferences.features.length)
  );

  /**
   * Load all dynamic preferences and features enabled
   * to manages configurations of the project
   */
  useEffect(() => {
    Promise.all([PreferenceService.getAllPreferences(), FeatureService.getAllFeatures()])
      .then(function ([preferences, features]) {
        setPreferences(preferences['results'].reduce((obj, p) => ({ ...obj, [`${p.section}.${p.name}`]: p }), {}));
        setFeatures(features['results'].filter((f) => f.enabled).map((f) => f.name));
        setLoading(false);
      })
      .catch((_error) => {
        Logger.error(SCOPE_SC_CORE, _error);
        setError(_error);
        // setLoading(false);
      });
  }, []);

  /**
   * Nesting all necessary providers
   * All child components will use help contexts to works
   */
  return <SCPreferencesContext.Provider value={{ preferences, features }}>{!loading && children}</SCPreferencesContext.Provider>;
}

/**
 * Let's only export the `useSCPreferences` hook instead of the context.
 * We only want to use the hook directly and never the context component.
 */
export function useSCPreferences(): SCPreferencesContextType {
  return useContext(SCPreferencesContext);
}
