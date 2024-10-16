import {useEffect, useState} from 'react';
import {SCContextType, SCUserContextType} from '../types';
import {SCNotificationTopicType, SCNotificationTypologyType} from '@selfcommunity/types';
import {useSCContext} from '../components/provider/SCContextProvider';
import {useSCUser} from '../components/provider/SCUserProvider';
import {WSClientType} from '@selfcommunity/utils';
import {WSClient} from '@selfcommunity/utils';
import {SCNotificationMapping, SCNotificationTopics} from '../constants/Notification';
import {
  WS_FACILITY_NOTIFY,
  WS_SUB_PROTOCOL_PREFIX,
  WS_HEARTBEAT_MESSAGE,
  WS_PROTOCOL_SECURE,
  WS_PROTOCOL_INSECURE,
  WS_PREFIX_PATH,
} from '../constants/WebSocket';
import PubSub from 'pubsub-js';

/**
 :::info
 This custom hook is used to init web socket.
 :::
 */
export default function useSCWebSocket() {
  const scContext: SCContextType = useSCContext();
  const scUserContext: SCUserContextType = useSCUser();
  const [wsInstance, setWsInstance] = useState<WSClientType>(null);

  // Websocket uri, prefixPath, protocols and sub-protocols
  const _wsProtocol = scContext.settings.notifications.webSocket.secure ? WS_PROTOCOL_SECURE : WS_PROTOCOL_INSECURE;
  const _wsPrefixPath = scContext.settings.notifications.webSocket.prefixPath || WS_PREFIX_PATH;
  const _wsUri = `${_wsProtocol}://${new URL(scContext.settings.portal).hostname}/${_wsPrefixPath}/${WS_FACILITY_NOTIFY}?subscribe-user`;
  const _wsSubProtocol =
    scContext.settings.session.authToken && scContext.settings.session.authToken.accessToken
      ? `${WS_SUB_PROTOCOL_PREFIX}${scContext.settings.session.authToken.accessToken}`
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
    if (scUserContext.user && !wsInstance && _wsUri && _wsSubProtocol) {
      setWsInstance(
        WSClient.getInstance({
          uri: _wsUri,
          heartbeatMsg: WS_HEARTBEAT_MESSAGE,
          protocols: [_wsSubProtocol],
          receiveMessage: receiveMessage,
        })
      );
      // Close the socket channel before window unload
      window.addEventListener('beforeunload', handleBeforeUnload);
    }
    if (!scUserContext.user && wsInstance) {
      // Disconnect the socket
      window.removeEventListener('beforeunload', handleBeforeUnload);
      wsInstance && wsInstance.close();
    }
  }, [scUserContext.user]);

  /**
   * Receive a message from wsInstance.
   */
  const receiveMessage = (data) => {
    // receive a message though the websocket from the server
    let _data = JSON.parse(data);
    if (_data && _data.type && SCNotificationTopics.includes(_data.type)) {
      if (_data.type === SCNotificationTopicType.INTERACTION) {
        /**
         * With topic interaction there are two types of notifications group:
         *  - notification_banner
         *  - comment, nested_comment, follow, etc..
         */
        if (_data.data.activity_type === SCNotificationTypologyType.NOTIFICATION_BANNER) {
          /**
           * Notification of type 'notification_banner'
           * It is a special case of notifications with topic 'interaction'
           */
          PubSub.publish(`${_data.type}.${SCNotificationTypologyType.NOTIFICATION_BANNER}`, _data);
        } else if (SCNotificationMapping[_data.data.activity_type]) {
          /**
           * Notification of type 'comment', 'nested_comment', etc...
           */
          PubSub.publish(`${_data.type}.${SCNotificationMapping[_data.data.activity_type]}`, _data);
        }
        setNotificationCounters(_data.data);
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
    /**
     * The counter count_interactions includes pure interactions and notification banners,
     * so unseen_interactions_counter = payload.count_interactions - payload.count_notification_banners
     * if payload.count_notification_banners exists (was added later in the payload of the message ws)
     */
    let unseen_interactions_counter = 0;
    if (payload.count_interactions !== undefined) {
      unseen_interactions_counter = payload.count_interactions;
    }
    if (payload.count_notification_banners !== undefined) {
      unseen_interactions_counter = Math.max(unseen_interactions_counter - payload.count_notification_banners, 0);
      scUserContext.setUnseenInteractionsCounter(payload.count_notification_banners);
    }
    payload.count_interactions !== undefined && scUserContext.setUnseenInteractionsCounter(unseen_interactions_counter);
  };

  return {wsInstance, setWsInstance};
}
