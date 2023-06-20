import {NOTIFICATIONS_SERVICE_KEY, NOTIFICATIONS_SERVICES, PLATFORM, PLATFORM_KEY, REGISTRATION_ID_KEY} from '../constants/Device';
import {LocalStorageDB} from '@selfcommunity/utils';
import {SCContextType} from '@selfcommunity/react-core';

/**
 * Check if mobile native push notification is enabled
 * @param context
 */
export function isMobileNativeNotificationEnabled(context: SCContextType) {
  return (
    (typeof window !== 'undefined' &&
      window[PLATFORM_KEY] &&
      window[PLATFORM_KEY] in PLATFORM &&
      window[REGISTRATION_ID_KEY] &&
      window[NOTIFICATIONS_SERVICE_KEY] &&
      window[NOTIFICATIONS_SERVICE_KEY] in NOTIFICATIONS_SERVICES) ||
    (LocalStorageDB.get(PLATFORM_KEY) &&
      LocalStorageDB.get(PLATFORM_KEY) in PLATFORM &&
      LocalStorageDB.get(REGISTRATION_ID_KEY) &&
      LocalStorageDB.get(NOTIFICATIONS_SERVICE_KEY) &&
      LocalStorageDB.get(NOTIFICATIONS_SERVICE_KEY) in NOTIFICATIONS_SERVICES &&
      !context.settings.notifications.mobileNativePushMessaging.disable)
  );
}

/**
 * Check if web push messaging is enabled
 * @param context
 */
export function isWebPushMessagingEnabled(context) {
  return !isMobileNativeNotificationEnabled(context) && !context.settings.notifications.webPushMessaging.disableToastMessage;
}
