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

/**
 * Const to enable native push notification
 */
export const PLATFORM_KEY = '_platform';
export const REGISTRATION_ID_KEY = '_registration_id';
export const NOTIFICATION_SERVICE_KEY = '_notification_service';
export const DEVICE_ID_KEY = '_device_id';
