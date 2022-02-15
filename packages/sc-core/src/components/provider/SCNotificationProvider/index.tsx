import React, {createContext, useContext} from 'react';
import {SCNotificationContextType} from '../../../types';
import useSCWebSocket from '../../../hooks/useSCWebSocket';
import useSCWebPushMessaging from '../../../hooks/useSCWebPushMessaging';

/**
 * Create Global Context
 * Consuming this context in one of the following ways:
 *  1. `<SCNotificationContext.Consumer>
 *       {(wsInstance, wpSubscription,) => (...)}
 *     </SCNotificationContext.Consumer>`
 *  2. const scNotificationContext: SCNotificationContextType = useContext(SCNotificationContext);
 *  3. const scNotificationContext: SCNotificationContextType = useSCNotification();
 */
export const SCNotificationContext = createContext<SCNotificationContextType>({} as SCNotificationContextType);

/**
 * This component makes the notification context available down the React tree.
 */
export default function SCNotificationProvider({children = null}: {children: React.ReactNode}): JSX.Element {
  const {wsInstance} = useSCWebSocket();
  const {wpSubscription} = useSCWebPushMessaging();

  return <SCNotificationContext.Provider value={{wsInstance, wpSubscription}}>{children}</SCNotificationContext.Provider>;
}

/**
 * Let's only export the `useSCNotification` hook instead of the context.
 * We only want to use the hook directly and never the context component.
 */
export function useSCNotification(): SCNotificationContextType {
  return useContext(SCNotificationContext);
}
