import React, { createContext, ReactNode, useEffect, useState } from 'react'
import SCAuthProvider from '../SCAuthProvider';
import preferencesServices from '../../../services/preferences';
import SCLocalizationProvider from '../SCLocalizationProvider'
import SCRoutingProvider from '../SCRoutingProvider'
import SCThemeProvider from '../SCThemeProvider';
import {setBasePortal} from '../../../utils/http';

/**
 * Interface SCSettingsType
 */
export interface SCSettingsType {
  portal: string;
  locale: string;
  session: any;
}

/**
 * Interface SCContextType
 */
export interface SCContextType {
  settings: SCSettingsType;
  preferences?: any;
}

/**
 * Interface SCContextProviderType
 */
export interface SCContextProviderType {
  settings: SCSettingsType;
  children: ReactNode;
}

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
export function SCContextProvider({settings, children}: SCContextProviderType): JSX.Element {
    const [preferences, setPreferences] = useState<any[]>([]);
    const [, setError] = useState<any>();
    const [loading, setLoading] = useState<boolean>(false);
    setBasePortal(settings.portal);

    useEffect(() => {
      preferencesServices.loadPreferences()
        .then((res) => {
          setPreferences(res.results)
        })
        .catch((_error) => {
          setError(_error)
          console.log(_error);
        })
        .finally(() => setLoading(false));
    }, []);

    return (
      <SCContext.Provider value={{settings, preferences}}>
        {!loading && <SCThemeProvider>
          <SCAuthProvider>
            <SCRoutingProvider>
                <SCLocalizationProvider>
                  {children}
                </SCLocalizationProvider>
            </SCRoutingProvider>
          </SCAuthProvider>
        </SCThemeProvider>}
      </SCContext.Provider>
    );
  }
export default SCContextProvider;
