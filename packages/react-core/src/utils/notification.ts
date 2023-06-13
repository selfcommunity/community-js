import {NOTIFICATION_SERVICE_KEY, PLATFORM, PLATFORM_KEY, REGISTRATION_ID_KEY} from '../constants/Device';
import {LocalStorageDB} from '@selfcommunity/utils';
import {SCContextType} from '@selfcommunity/react-core';

/**
 * Check if mobile native push notification is enabled
 * @param context
 */
export function isMobileNativeNotificationEnabled(context: SCContextType) {
  return (
    (typeof window !== 'undefined' && window[REGISTRATION_ID_KEY] && window[PLATFORM_KEY] && window[PLATFORM_KEY] in PLATFORM) ||
    (LocalStorageDB.get(NOTIFICATION_SERVICE_KEY) &&
      LocalStorageDB.get(PLATFORM_KEY) &&
      LocalStorageDB.get(PLATFORM_KEY) in PLATFORM &&
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
