import React, {createContext, useContext, useMemo} from 'react';
import {SCContextType, SCPreferencesContextType, SCRoutingContextType, SCUserContextType} from '../../../types';
import {useSCContext} from '../SCContextProvider';
import {defaultRoutes} from '../../../constants/Routes';
import {SCPreferencesContext} from '../SCPreferencesProvider';
import * as SCPreferences from '../../../constants/Preferences';

/**
 * Create Global Context
 * Consuming this context in one of the following ways:
 *  1. <SCRoutingContext.Consumer>
 *       {(routerLink, routes, url) => (...)}
 *     </SCRoutingContext.Consumer>
 *  2. const scRoutingContext: SCRoutingContextType = useContext(SCRoutingContext);
 *  3. const scRoutingContext: SCRoutingContextType = useSCRouting();
 */
export const SCRoutingContext = createContext<SCRoutingContextType>({} as SCRoutingContextType);

export default function SCRoutingProvider({children = null}: {children: React.ReactNode}): JSX.Element {
  const scPreferencesContext: SCPreferencesContextType = useContext(SCPreferencesContext);
  const scContext: SCContextType = useSCContext();
  const router: SCRoutingContextType = scContext.settings.router ? scContext.settings.router : {};
  const routerLink: React.ComponentClass<any> = router.routerLink ? router.routerLink : null;
  const _routes = Object.assign(getPreferencesRoutes(), defaultRoutes);
  const routes: Record<string, any> = router.routes ? {..._routes, ...router.routes} : defaultRoutes;

  /**
   * Normalize template url (preferences)
   */
  function normalizeUrl(url) {
    let tpl = url;
    const re = /\{([^/]+)?\}/g;
    let match = re.exec(url);
    while (match) {
      tpl = tpl.replace(match[0], `:${match[1]}`);
      re.lastIndex = 0;
      match = re.exec(tpl);
    }
    return tpl;
  }

  /**
   * Get override routes from community preferences
   */
  function getPreferencesRoutes() {
    return {
      post: normalizeUrl(scPreferencesContext.preferences[SCPreferences.CONFIGURATIONS_URL_TEMPLATE_POST].value),
      discussion: normalizeUrl(scPreferencesContext.preferences[SCPreferences.CONFIGURATIONS_URL_TEMPLATE_DISCUSSION].value),
      status: normalizeUrl(scPreferencesContext.preferences[SCPreferences.CONFIGURATIONS_URL_TEMPLATE_STATUS].value),
      comment: normalizeUrl(scPreferencesContext.preferences[SCPreferences.CONFIGURATIONS_URL_TEMPLATE_COMMENT].value),
      category: normalizeUrl(scPreferencesContext.preferences[SCPreferences.CONFIGURATIONS_URL_TEMPLATE_CATEGORY].value),
      categories_list: normalizeUrl(scPreferencesContext.preferences[SCPreferences.CONFIGURATIONS_URL_TEMPLATE_CATEGORIES_LIST].value),
      user_profile: normalizeUrl(scPreferencesContext.preferences[SCPreferences.CONFIGURATIONS_URL_TEMPLATE_USER_PROFILE].value),
      user_profile_settings: normalizeUrl(scPreferencesContext.preferences[SCPreferences.CONFIGURATIONS_URL_TEMPLATE_USER_PROFILE_SETTINGS].value),
      user_notifications: normalizeUrl(scPreferencesContext.preferences[SCPreferences.CONFIGURATIONS_URL_TEMPLATE_USER_NOTIFICATIONS].value),
      user_private_messages: normalizeUrl(scPreferencesContext.preferences[SCPreferences.CONFIGURATIONS_URL_TEMPLATE_USER_PRIVATE_MESSAGES].value),
      incubator: normalizeUrl(scPreferencesContext.preferences[SCPreferences.CONFIGURATIONS_URL_TEMPLATE_INCUBATOR].value),
    };
  }

  /**
   * Generate path
   */
  function url(name = '', params = {}) {
    const replacer = (tpl: string, data: Record<string, any>) => {
      const re = /:([^/]+)?/g;
      let match = re.exec(tpl);
      while (match) {
        tpl = tpl.replace(match[0], data[match[1]]);
        re.lastIndex = 0;
        match = re.exec(tpl);
      }
      return tpl;
    };
    return replacer(routes[name], params);
  }

  const contextValue = useMemo(
    () => ({
      routerLink,
      routes,
      url,
    }),
    [routerLink, routes]
  );

  return <SCRoutingContext.Provider value={contextValue}>{children}</SCRoutingContext.Provider>;
}

/**
 * Let's only export the `useSCTheme` hook instead of the context.
 * We only want to use the hook directly and never the context component.
 */
export function useSCRouting(): SCRoutingContextType {
  return useContext(SCRoutingContext);
}
