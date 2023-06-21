/**
 * Web push notification device type
 * Used in Endpoint (Device)
 */
export const WEB_PUSH_NOTIFICATION_DEVICE_TYPE = 'wp';
export const ANDROID_PUSH_NOTIFICATION_GCM_DEVICE_TYPE = 'gcm';
export const ANDROID_PUSH_NOTIFICATION_FCM_DEVICE_TYPE = 'fcm';
export const IOS_PUSH_NOTIFICATION_IOS_DEVICE_TYPE = 'apns';

/**
 * Platform
 */
export const PLATFORM = {
  ANDROID: 'Android',
  IOS: 'iOS',
};
export const PLATFORMS = Object.keys(PLATFORM).map((k: string) => PLATFORM[k]);

/**
 * Notifications service
 */
export const NOTIFICATIONS_SERVICES = [
  ANDROID_PUSH_NOTIFICATION_GCM_DEVICE_TYPE,
  ANDROID_PUSH_NOTIFICATION_FCM_DEVICE_TYPE,
  IOS_PUSH_NOTIFICATION_IOS_DEVICE_TYPE,
];

/**
 * Const to enable native push notification
 */
export const PLATFORM_KEY = 'app-platform';
export const REGISTRATION_ID_KEY = 'app-registrationId';
export const NOTIFICATION_SERVICE_KEY = 'app-notificationService';
export const DEVICE_ID_KEY = 'app-deviceId';
