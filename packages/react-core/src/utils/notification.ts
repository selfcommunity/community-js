import {PLATFORM, PLATFORM_KEY, PLATFORMS} from '../constants/Device';
import {isClientSideRendering, LocalStorageDB} from '@selfcommunity/utils';

/**
 * Check if mobile native push notification is enabled
 */
export function isMobileNativeNotificationEnabled() {
  return (
    (isClientSideRendering() && window[PLATFORM_KEY] && window[PLATFORM_KEY] in PLATFORM) ||
    (LocalStorageDB.checkifSupport() && LocalStorageDB.get(PLATFORM_KEY) && PLATFORMS.includes(LocalStorageDB.get(PLATFORM_KEY)))
  );
}

/**
 * Check if web push messaging is enabled
 */
export function isWebPushMessagingEnabled() {
  return !isMobileNativeNotificationEnabled();
}
