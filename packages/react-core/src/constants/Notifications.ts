/**
 * Notifications conf
 */
import {SCNotificationsType} from '../types/context';

export const NOTIFICATIONS_OPTION = 'notifications';
export const NOTIFICATIONS_WEB_SOCKET_OPTION = 'webSocket';
export const NOTIFICATIONS_WEB_PUSH_MESSAGING_OPTION = 'webPushMessaging';
export const NOTIFICATIONS_WEB_PUSH_MESSAGING_DIALOG_COOKIE = 'wpndEnable';
export const NOTIFICATIONS_DISABLE_TOAST_MESSAGE_OPTION = 'disableToastMessage';
export const NOTIFICATIONS_SECURE_OPTION = 'secure';
export const NOTIFICATIONS_APPLICATION_SERVER_KEY_OPTION = 'applicationServerKey';
export const DEFAULT_NOTIFICATIONS: SCNotificationsType = {
  [NOTIFICATIONS_WEB_SOCKET_OPTION]: {
    [NOTIFICATIONS_DISABLE_TOAST_MESSAGE_OPTION]: false,
    [NOTIFICATIONS_SECURE_OPTION]: true,
  },
  [NOTIFICATIONS_WEB_PUSH_MESSAGING_OPTION]: {
    [NOTIFICATIONS_DISABLE_TOAST_MESSAGE_OPTION]: true,
  },
};
