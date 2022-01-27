import React, {createContext, useContext, useEffect, useState} from 'react';
import {SCContextType, SCNotificationTopicType, SCUserContextType} from '../../../types';
import {useSCContext} from '../SCContextProvider';
import {SCNotificationContextType} from '../../../types';
import {useSCUser} from '../SCUserProvider';
import WSClient from '../../../utils/websocket';
import PubSub from 'pubsub-js';
import {WS_FACILITY_NOTIFY, WS_PROTOCOL_PREFIX, WS_HEARTBEAT_MESSAGE} from '../../../constants/WebSocket';
import {SCNotificationMapping, SCNotificationTopics} from '../../../constants/Notification';

/**
 * Create Global Context
 * Consuming this context in one of the following ways:
 *  1. <SCNotificationContext.Consumer>
 *       {(wsInstance, subscribe,) => (...)}
 *     </SCNotificationContext.Consumer>
 *  2. const scNotificationContext: SCNotificationContextType = useContext(SCNotificationContext);
 *  3. const scNotificationContext: SCNotificationContextType = useSCNotification();
 */
export const SCNotificationContext = createContext<SCNotificationContextType>({} as SCNotificationContextType);

/**
 * This component makes the notification context available down the React tree.
 */
export default function SCNotificationProvider({children = null}: {children: React.ReactNode}): JSX.Element {
  const scContext: SCContextType = useSCContext();
  const scUserContext: SCUserContextType = useSCUser();
  const [wsInstance, setWsInstance] = useState(null);

  // Websocket uri and protocols
  const _wsUri = `wss://${new URL(scContext.settings.portal).hostname}/ws/${WS_FACILITY_NOTIFY}?subscribe-user`;
  const _wsProtocol = `${WS_PROTOCOL_PREFIX}${scContext.settings.session.authToken.accessToken}`;

  /**
   * Check if there is a currently active session and a
   * wsInstance connection when the provider is mounted for the first time.
   * If there is an error, it means there is no session.
   */
  useEffect(() => {
    if (scUserContext.user && !wsInstance) {
      setWsInstance(
        WSClient({
          uri: _wsUri,
          heartbeatMsg: WS_HEARTBEAT_MESSAGE,
          protocols: [_wsProtocol],
          receiveMessage: receiveMessage,
        })
      );
      // Close the socket channel before window unload
      window.addEventListener('beforeunload', function (event) {
        wsInstance && wsInstance.close();
      });
    }
    // Disconnect the socket
    return () => {
      wsInstance && wsInstance.close();
    };
  }, [scContext.settings.session.authToken]);

  /**
   * Receive a message from wsInstance.
   */
  const receiveMessage = (data) => {
    // receive a message though the websocket from the server
    let _data = JSON.parse(data);
    if (_data && _data.type && SCNotificationTopics.includes(_data.type)) {
      if (_data.type === SCNotificationTopicType.INTERACTION && SCNotificationMapping[_data.data.activity_type]) {
        setNotificationCounters(_data.data);
        PubSub.publish(`${_data.type}.${SCNotificationMapping[_data.data.activity_type]}`, _data);
      } else {
        PubSub.publish(`${_data.type}`, _data);
      }
    }
  };

  /**
   * Update user context counters
   * @param payload
   */
  const setNotificationCounters = (payload) => {
    payload.count_interactions !== undefined && scUserContext.setUnseenInteractionsCounter(payload.count_interactions);
    payload.count_notification_banners !== undefined && scUserContext.setUnseenInteractionsCounter(payload.count_notification_banners);
  };

  return <SCNotificationContext.Provider value={{wsInstance}}>{children}</SCNotificationContext.Provider>;
}

/**
 * Let's only export the `useSCNotification` hook instead of the context.
 * We only want to use the hook directly and never the context component.
 */
export function useSCNotification(): SCNotificationContextType {
  return useContext(SCNotificationContext);
}
