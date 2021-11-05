import React, {createContext, useContext, useEffect, useState} from 'react';
import SCUserProvider from '../SCUserProvider';
import preferencesServices from '../../../services/preferences';
import SCLocaleProvider from '../SCLocaleProvider';
import SCRoutingProvider from '../SCRoutingProvider';
import SCThemeProvider from '../SCThemeProvider';
import {setBasePortal} from '../../../utils/http';
import {SCContextProviderType, SCContextType} from '../../../types';

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
 * List of all nested providers that are required to run
 */
const contextProviders = [SCThemeProvider, SCLocaleProvider, SCRoutingProvider, SCUserProvider];

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
      {!loading &&
        contextProviders.reduceRight((memo, ContextProvider) => {
          return <ContextProvider>{memo}</ContextProvider>;
        }, children)}
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
