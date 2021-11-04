import React, {createContext, useContext, useMemo} from 'react';
import {SCContextType, SCRoutingContextType} from '../../../types';
import {useSCContext} from '../SCContextProvider';
import {defaultRoutes} from '../../../constants/Routes';

/**
 * Create Global Context
 * Consuming this context:
 *  1. <SCRoutingContext.Consumer>
 *       {(routerLink, routes, url) => (...)}
 *     </SCRoutingContext.Consumer>
 *  2. const scRoutingContext: SCRoutingContextType = useSCRouting();
 */
export const SCRoutingContext = createContext<SCRoutingContextType>({} as SCRoutingContextType);

export default function SCRoutingProvider({children = null}: {children: React.ReactNode}): JSX.Element {
  const scContext: SCContextType = useSCContext();
  const router: SCRoutingContextType = scContext.settings.router ? scContext.settings.router : {};
  const routerLink: React.ComponentClass<any> = router.routerLink ? router.routerLink : null;
  const routes: Record<string, any> = router.routes ? {...defaultRoutes, ...router.routes} : defaultRoutes;

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
