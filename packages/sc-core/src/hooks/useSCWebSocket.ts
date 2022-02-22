import {useEffect, useState} from 'react';
import {SCContextType, SCNotificationTopicType, SCUserContextType} from '../types';
import {useSCContext} from '../components/provider/SCContextProvider';
import {useSCUser} from '../components/provider/SCUserProvider';
import {WSClientType} from '../utils/websocket';
import WSClient from '../utils/websocket';
import {SCNotificationMapping, SCNotificationTopics} from '../constants/Notification';
import {WS_FACILITY_NOTIFY, WS_PROTOCOL_PREFIX, WS_HEARTBEAT_MESSAGE} from '../constants/WebSocket';
import PubSub from 'pubsub-js';

/**
 :::info
 This custom hook is used to to init web socket.
 :::
 */
export default function useSCWebSocket() {
  const scContext: SCContextType = useSCContext();
  const scUserContext: SCUserContextType = useSCUser();
  const [wsInstance, setWsInstance] = useState<WSClientType>(null);

  // Websocket uri and protocols
  const _wsUri = `wss://${new URL(scContext.settings.portal).hostname}/ws/${WS_FACILITY_NOTIFY}?subscribe-user`;
  const _wsProtocol =
    scContext.settings.session.authToken && scContext.settings.session.authToken.accessToken
      ? `${WS_PROTOCOL_PREFIX}${scContext.settings.session.authToken.accessToken}`
      : null;

  /**
   * Before document unload handler
   * Close webSocket
   */
  const handleBeforeUnload = () => {
    wsInstance && wsInstance.close();
  };

  /**
   * Check if there is a currently active session and a
   * wsInstance connection when the provider is mounted for the first time.
   * If there is an error, it means there is no session.
   */
  useEffect(() => {
    if (scUserContext.user && !wsInstance && _wsUri && _wsProtocol) {
      setWsInstance(
        WSClient.getInstance({
          uri: _wsUri,
          heartbeatMsg: WS_HEARTBEAT_MESSAGE,
          protocols: [_wsProtocol],
          receiveMessage: receiveMessage,
        })
      );
      // Close the socket channel before window unload
      window.addEventListener('beforeunload', handleBeforeUnload);
    }
    // Disconnect the socket
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      wsInstance && wsInstance.close();
    };
  }, [scUserContext.user]);

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

  return {wsInstance, setWsInstance};
}
