import React, {createContext, useContext, useEffect, useState} from 'react';
import SCUserProvider from '../SCUserProvider';
import SCLocaleProvider from '../SCLocaleProvider';
import SCRoutingProvider from '../SCRoutingProvider';
import SCThemeProvider from '../SCThemeProvider';
import {setBasePortal} from '../../../utils/http';
import {validateOptions, validOptions} from '../../../utils/validator';
import {SCContextProviderType, SCContextType, SCSettingsType} from '../../../types';
import SCPreferencesProvider from '../SCPreferencesProvider';

/**
 * Create Global Context
 * Consuming this context in one of the following ways:
 *  1. <SCContext.Consumer>
 *       {settings => (...)}
 *     </SCContext.Consumer>
 *  2. const scSettings: SCSettingsType = useContext(SCContext);
 *  3. const scSettings: SCSettingsType = useSCContext();
 */
export const SCContext = createContext<SCContextType>({} as SCContextType);

/**
 * List of all nested providers that are required to run
 */
const contextProviders = [SCPreferencesProvider, SCThemeProvider, SCLocaleProvider, SCRoutingProvider, SCUserProvider];

/**
 * SCContextProvider
 * This import all providers
 */
export default function SCContextProvider({conf, children}: SCContextProviderType): JSX.Element {
  const [settings, setSettings] = useState<SCSettingsType>(null);

  /**
   * Export the provider as we need to wrap the entire app with it
   * This provider keeps current user logged and session
   */
  useEffect(() => {
    /**
     * Validate initial settings
     */
    const {validationResult, settings} = validateOptions(conf, validOptions);

    /**
     * Init provider
     */
    if (validationResult.hasErrors()) {
      /**
       * Exist errors in initial conf
       */
      validationResult.emit();
    } else {
      /**
       * Emit warnings if exist
       */
      validationResult.emitWarnings();

      /**
       * Set the base path on the http objects
       */
      setBasePortal(settings.portal);

      /**
       * Render all Providers
       */
      setSettings(settings);
    }
  }, []);

  /**
   * Nesting all necessary providers
   * All child components will use help contexts to works
   */
  return (
    <SCContext.Provider value={{settings}}>
      {settings &&
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
