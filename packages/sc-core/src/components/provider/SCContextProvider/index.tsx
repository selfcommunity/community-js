import React, {createContext, ReactNode, useContext, useEffect, useState} from 'react';
import SCAuthProvider, {SCAuthContext} from '../SCAuthProvider';
import preferencesServices from '../../../services/preferences';
import SCLocalizationProvider from '../SCLocalizationProvider';
import SCRoutingProvider from '../SCRoutingProvider';
import SCThemeProvider from '../SCThemeProvider';
import {setBasePortal} from '../../../utils/http';
import {SCAuthContextType, SCContextProviderType, SCContextType} from '../../../types';

/**
 * Create Global Context
 * Consuming this context:
 *  1. <SCContext.Consumer>
 *       {settings => (...)}
 *     </SCContext.Consumer>
 *  2. const settings: SCSettingsType = useContext(SCContext);
 */
export const SCContext = createContext<SCContextType>({} as SCContextType);

/**
 * SCContextProvider
 * This import all providers
 */
export default function SCContextProvider({settings, children}: SCContextProviderType): JSX.Element {
  const [preferences, setPreferences] = useState<any[]>([]);
  const [, setError] = useState<any>();
  const [loading, setLoading] = useState<boolean>(true);

  /**
   * Set the base path on the http objects
   */
  setBasePortal(settings.portal);

  /**
   * Export the provider as we need to wrap the entire app with it
   * This provider keeps current user logged and session
   */
  useEffect(() => {
    preferencesServices
      .loadPreferences()
      .then((res) => {
        setPreferences(res.results);
      })
      .catch((_error) => {
        setError(_error);
      })
      .finally(() => setLoading(false));
  }, []);

  /**
   * Nesting all necessary providers
   * All child components will use help contexts to works
   */
  return (
    <SCContext.Provider value={{settings, preferences}}>
      {!loading && (
        <SCThemeProvider>
          <SCLocalizationProvider>
            <SCRoutingProvider>
              <SCAuthProvider>{children}</SCAuthProvider>
            </SCRoutingProvider>
          </SCLocalizationProvider>
        </SCThemeProvider>
      )}
    </SCContext.Provider>
  );
}

/**
 * Let's only export the `useAuth` hook instead of the context.
 * We only want to use the hook directly and never the context component.
 */
export function useSCContext(): SCContextType {
  return useContext(SCContext);
}
