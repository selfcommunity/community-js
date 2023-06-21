import React, {createContext, useContext} from 'react';
import {SCNotificationContextType} from '../../../types';
import useSCWebSocket from '../../../hooks/useSCWebSocket';
import useSCWebPushMessaging from '../../../hooks/useSCWebPushMessaging';
import useSCMobileNativePushMessaging from '../../../hooks/useSCMobileNativePushMessaging';

/**
 * Creates Global Context
 *
 :::tipContext can be consumed in one of the following ways:

 ```jsx
 1. <SCNotificationContext.Consumer>{(wsInstance, subscribe,) => (...)}</SCNotificationContext.Consumer>
 ```
 ```jsx
 2. const scNotificationContext: SCNotificationContextType = useContext(SCNotificationContext);
 ```
 ```jsx
 3. const scNotificationContext: SCNotificationContextType = useSCNotification();
 ````
 :::
 */
export const SCNotificationContext = createContext<SCNotificationContextType>({} as SCNotificationContextType);

/**
 * #### Description:
 * This component makes the notification context available down the React tree.
 * @param children
 * @return
 * ```jsx
 * <SCNotificationContext.Provider value={{wsInstance}}>{children}</SCNotificationContext.Provider>
 * ```
 */
export default function SCNotificationProvider({children = null}: {children: React.ReactNode}): JSX.Element {
  const {wsInstance} = useSCWebSocket();
  const {wpSubscription} = useSCWebPushMessaging();
  const {mnpmInstance} = useSCMobileNativePushMessaging();

  return <SCNotificationContext.Provider value={{wsInstance, wpSubscription, mnpmInstance}}>{children}</SCNotificationContext.Provider>;
}

/**
 * Let's only export the `useSCNotification` hook instead of the context.
 * We only want to use the hook directly and never the context component.
 */
export function useSCNotification(): SCNotificationContextType {
  return useContext(SCNotificationContext);
}
