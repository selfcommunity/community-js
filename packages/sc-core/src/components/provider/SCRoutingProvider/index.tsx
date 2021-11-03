import React, {createContext, ReactNode, useState} from 'react';
import {SCContextType, SCRoutingContextType} from '../../../types';
import {useSCContext} from '../SCContextProvider';
import {defaultRoutes} from '../../../constants/Routes';

/**
 * Create Global Context
 * Consuming this context:
 *  1. <SCRoutingContext.Consumer>
 *       {(routes,) => (...)}
 *     </SCRoutingContext.Consumer>
 *  2. const scRouterContext: SCRoutingContext = useContext(SCRoutingContext);
 */
export const SCRoutingContext = createContext<SCRoutingContextType>({} as SCRoutingContextType);

export default function SCRoutingProvider({children = null}: {children: React.ReactNode}): JSX.Element {
  const scContext: SCContextType = useSCContext();
  const router: SCRoutingContextType = scContext.settings.router ? scContext.settings.router : {};
  const routerLink: React.ComponentClass<any> = router.routerLink ? router.routerLink : null;
  const routes: object = router.routes ? {...defaultRoutes, ...router.routes} : defaultRoutes;
  return <SCRoutingContext.Provider value={{routerLink, routes}}>{children}</SCRoutingContext.Provider>;
}
