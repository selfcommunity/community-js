import React, {createContext, useContext, useMemo, useState} from 'react';
import {http} from '@selfcommunity/api-services';
import {useDeepCompareEffectNoCheck} from 'use-deep-compare-effect';
import {validateOptions, validOptions} from '../../../utils/validator';
import {SCContextProviderType, SCContextType, SCSettingsType} from '../../../types';
import useIsComponentMountedRef from '../../../utils/hooks/useIsComponentMountedRef';

/**
 * Creates Global Context
 *
 :::tip Context can be consumed in one of the following ways:
 ```jsx
 1. <SCContext.Consumer>{settings => (...)}</SCContext.Consumer>
 ```
 ```jsx
 2. const scContext: SCContextType = useContext(SCContext);
 ```
 ```jsx
 3. const scContext: SCContextType = useSCContext();
 ````
 :::
 */
export const SCContext = createContext<SCContextType>({} as SCContextType);

/**
 * This component imports all providers
 * @param conf
 * @param children
 * @return
 * ```jsx
 * <SCContext.Provider value={{settings}}>
 * ```
 */
export default function SCContextProvider({conf, children}: SCContextProviderType): JSX.Element {
  /**
   * Check initial conf and validates settings
   * If the conf change update settings
   */
  const _settings: SCSettingsType = useMemo(() => {
    /**
     * Validate initial settings
     */
    const {validationResult, settings} = validateOptions(conf, validOptions);

    if (validationResult.hasErrors()) {
      /**
       * Exist errors in initial conf
       */
      validationResult.emit();
      return null;
    }
    /**
     * Emit warnings if exist
     */
    validationResult.emitWarnings();

    /**
     * Set the base path on the http objects
     */
    http.setBasePortal(settings.portal);

    /**
     * Render all Providers
     */
    return settings;
  }, [conf]);

  /**
   * Settings
   */
  const [settings, setSettings] = useState<SCSettingsType>(_settings);

  /**
   * Export the provider as we need to wrap the entire app with it
   * This provider keeps current user logged and session
   */
  useDeepCompareEffectNoCheck(() => {
    if (!isMountedRef.current) return;
    setSettings(_settings);
  }, [_settings]);

  /**
   * Track component initialization
   */
  const isMountedRef = useIsComponentMountedRef();

  /**
   * Nesting all necessary providers
   * All child components will use help contexts to works
   */
  return (
    <SCContext.Provider value={{settings}}>
      {settings &&
        settings.contextProviders.reduceRight((memo, ContextProvider) => {
          return <ContextProvider>{memo}</ContextProvider>;
        }, children)}
    </SCContext.Provider>
  );
}

/**
 * Let's only export the `useSCContext` hook instead of the context.
 * We only want to use the hook directly and never the context component.
 */
export function useSCContext(): SCContextType {
  return useContext(SCContext);
}
