import {useEffect, useState} from 'react';
import {SCContextType, SCUserContextType} from '../types';
import {SCDeviceType, SCTagType} from '@selfcommunity/types';
import {useSCContext} from '../components/provider/SCContextProvider';
import {useSCUser} from '../components/provider/SCUserProvider';
import {LocalStorageDB, Logger} from '@selfcommunity/utils';
import {SCOPE_SC_CORE} from '../constants/Errors';
import {http, Endpoints, HttpResponse} from '@selfcommunity/api-services';
import {
  PLATFORM,
  ANDROID_PUSH_NOTIFICATION_FCM_DEVICE_TYPE,
  ANDROID_PUSH_NOTIFICATION_GCM_DEVICE_TYPE,
  IOS_PUSH_NOTIFICATION_IOS_DEVICE_TYPE,
  PLATFORM_KEY,
  REGISTRATION_ID_KEY,
  NOTIFICATION_SERVICE_KEY,
  DEVICE_ID_KEY,
} from '../constants/Device';

/**
 :::info
 This custom hook is used to manage native push notification:
 - register device (Android/iOS)
 - unregister device (Android/iOS)
 !important: the device is registered only if exist in the global window
             object (or as keys in the localstorage) the follow:
             - _platform: <android|iOS>
             - _notification_service: <gcm:fcm:apns>
             - _registration_id: <registration_id>
             - _device_id: <device_id>
 :::
 */
export default function useSCMobileNativePushMessaging() {
  const scContext: SCContextType = useSCContext();
  const scUserContext: SCUserContextType = useSCUser();
  const [mnpmInstance, setMnpmInstance] = useState<SCDeviceType>(null);
  const [isLoading, setLoading] = useState<boolean>(false);

  /**
   * Check if enabled push notification
   */
  const isNotificationEnabled = () => {
    return (
      window &&
      (window[REGISTRATION_ID_KEY] ||
        (LocalStorageDB.get(NOTIFICATION_SERVICE_KEY) && !scContext.settings.notifications.mobileNativePushMessaging.disable))
    );
  };

  /**
   * Validate notification service
   * @param data
   */
  const isValid = (data) => {
    return (
      (data.platform === PLATFORM.ANDROID && data.notification_service === ANDROID_PUSH_NOTIFICATION_GCM_DEVICE_TYPE) ||
      data.notification_service === ANDROID_PUSH_NOTIFICATION_FCM_DEVICE_TYPE ||
      (data.platform === PLATFORM.IOS && data.notification_service === IOS_PUSH_NOTIFICATION_IOS_DEVICE_TYPE)
    );
  };

  /**
   * Perform device registration
   * @param data
   * @param remove
   */
  const performUpdateDevice = (data, remove = false) => {
    const url = remove
      ? Endpoints.DeleteDevice.url({type: data.notification_service, id: data.id})
      : Endpoints.NewDevice.url({type: data.notification_service});
    const method = remove ? Endpoints.DeleteDevice.method : Endpoints.NewDevice.method;
    setLoading(true);
    return http
      .request({
        url,
        method,
        ...(remove
          ? {}
          : {
              data: {
                registration_id: data.registration_id,
                ...(data.device_id ? {device_id: data.device_id} : {}),
              },
            }),
      })
      .then((res: HttpResponse<SCTagType>) => {
        if (res.status >= 300) {
          return Promise.reject(res);
        }
        setLoading(false);
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        setLoading(false);
        return Promise.reject(e);
      });
  };

  /**
   * Collect data
   */
  const getDataInstance = () => {
    if (window && window[PLATFORM_KEY] && window[REGISTRATION_ID_KEY] && window[NOTIFICATION_SERVICE_KEY]) {
      return {
        platform: window[PLATFORM_KEY],
        registration_id: window[REGISTRATION_ID_KEY],
        notification_service: window[NOTIFICATION_SERVICE_KEY],
        ...(window[DEVICE_ID_KEY] ? {device_id: window[DEVICE_ID_KEY]} : {}),
      };
    } else if (
      LocalStorageDB.checkifSupport() &&
      LocalStorageDB.get(PLATFORM_KEY) &&
      LocalStorageDB.get(PLATFORM_KEY) &&
      LocalStorageDB.get(NOTIFICATION_SERVICE_KEY)
    ) {
      return {
        platform: LocalStorageDB.get(PLATFORM_KEY),
        registration_id: LocalStorageDB.get(PLATFORM_KEY),
        notification_service: LocalStorageDB.get(NOTIFICATION_SERVICE_KEY),
        ...(window[DEVICE_ID_KEY] ? {device_id: window[DEVICE_ID_KEY]} : {}),
      };
    } else {
      return null;
    }
  };

  /**
   * Check if there is a currently active session and a
   * instance when the provider is mounted for the first time.
   */
  useEffect(() => {
    if (scUserContext.user && isNotificationEnabled()) {
      if (!mnpmInstance && !isLoading) {
        // Register the device only if _platform and _registration_id and _notification_service
        // exists in window/localStorage
        const _data = getDataInstance();
        if (isValid(_data)) {
          performUpdateDevice(_data).then((res) => {
            setMnpmInstance({..._data, id: res.id});
          });
        } else {
          Logger.warn(SCOPE_SC_CORE, 'Invalid data. Unable to register the device for native push notification.');
        }
      }
    } else {
      if (mnpmInstance) {
        performUpdateDevice(mnpmInstance, true).then(() => {
          setMnpmInstance(null);
        });
      }
    }
  }, [scUserContext.user, isLoading, mnpmInstance]);

  return {mnpmInstance, setMnpmInstance};
}
