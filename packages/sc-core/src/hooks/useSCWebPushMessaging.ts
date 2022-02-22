import {useContext, useEffect, useMemo, useRef, useState} from 'react';
import {SCContextType, SCPreferencesContextType, SCTagType, SCUserContextType} from '../types';
import {useSCContext} from '../components/provider/SCContextProvider';
import {useSCUser} from '../components/provider/SCUserProvider';
import {Logger} from '../utils/logger';
import {loadVersionBrowser, urlB64ToUint8Array} from '../utils/webPushMessaging';
import {SCOPE_SC_CORE} from '../constants/Errors';
import http from '../utils/http';
import Endpoints from '../constants/Endpoints';
import {AxiosResponse} from 'axios';
import {WEB_PUSH_NOTIFICATION_DEVICE_TYPE} from '../constants/Device';
import {SCPreferencesContext} from '@selfcommunity/core';
import * as SCPreferences from '../constants/Preferences';

/**
 :::info
 This custom hook is used to to init web push messaging.
 :::
 */
export default function useSCWebPushMessaging() {
  // CONTEXT
  const scContext: SCContextType = useSCContext();
  const scUserContext: SCUserContextType = useSCUser();
  const scPreferencesContext: SCPreferencesContextType = useContext(SCPreferencesContext);

  // STATE
  const [wpSubscription, setWpSubscription] = useState(null);

  // REFS
  const subAttempts = useRef(0);

  // CONST
  const applicationServerKey =
    scContext.settings.notifications.webPushMessaging.applicationServerKey !== undefined
      ? scContext.settings.notifications.webPushMessaging.applicationServerKey
      : SCPreferences.PROVIDERS_WEB_PUSH_PUBLIC_KEY in scPreferencesContext.preferences
      ? scPreferencesContext.preferences[SCPreferences.PROVIDERS_WEB_PUSH_PUBLIC_KEY].value
      : null;
  const webPushEnabled =
    SCPreferences.PROVIDERS_WEB_PUSH_ENABLED in scPreferencesContext.preferences &&
    scPreferencesContext.preferences[SCPreferences.PROVIDERS_WEB_PUSH_ENABLED].value
      ? scPreferencesContext.preferences[SCPreferences.PROVIDERS_WEB_PUSH_ENABLED].value
      : false;

  /**
   * perform update the Subscription
   * @param data
   * @param remove
   */
  const performUpdateSubscription = (data, remove) => {
    const url = remove
      ? Endpoints.DeleteDevice.url({type: WEB_PUSH_NOTIFICATION_DEVICE_TYPE, id: wpSubscription.registration_id})
      : Endpoints.NewDevice.url({type: WEB_PUSH_NOTIFICATION_DEVICE_TYPE});
    const method = remove ? Endpoints.DeleteDevice.method : Endpoints.NewDevice.method;
    return http
      .request({
        url,
        method,
        ...(remove ? {} : {data: data}),
      })
      .then((res: AxiosResponse<SCTagType>) => {
        if (res.status >= 300) {
          return Promise.reject(res);
        }
        return Promise.resolve(res.data);
      });
  };

  /**
   * updateSubscriptionOnServer to sync current subscription
   * @param sub
   */
  const updateSubscriptionOnServer = (sub, remove) => {
    const browser = loadVersionBrowser();
    const endpointParts = sub.endpoint.split('/');
    const registration_id = endpointParts[endpointParts.length - 1];
    const data = {
      browser: browser.name.toUpperCase(),
      p256dh: btoa(String.fromCharCode.apply(null, new Uint8Array(sub.getKey('p256dh')))),
      auth: btoa(String.fromCharCode.apply(null, new Uint8Array(sub.getKey('auth')))),
      user: scUserContext.user.username,
      registration_id: registration_id,
    };
    return performUpdateSubscription(data, remove)
      .then((res: any) => {
        if (remove) {
          setWpSubscription(null);
        } else {
          setWpSubscription(res);
        }
      })
      .catch((e) => {
        Logger.error(SCOPE_SC_CORE, e);
      });
  };

  /**
   * Unsubscribe
   * @param callback
   */
  const unsubscribe = (callback = null) => {
    navigator.serviceWorker.ready.then(function (serviceWorkerRegistration) {
      // To unsubscribe from push messaging, you need get the
      // subcription object, which you can call unsubscribe() on.
      serviceWorkerRegistration.pushManager
        .getSubscription()
        .then((pushSubscription) => {
          // Check we have a subscription to unsubscribe
          if (!pushSubscription) {
            // No subscription object, so set the state
            // to allow the user to subscribe to push
            return;
          }

          // We have a subcription, so call unsubscribe on it
          pushSubscription
            .unsubscribe()
            .then(() => {
              Logger.info(SCOPE_SC_CORE, 'Unsubscription successfully');
              // Request to server to remove
              // the users data from your data store so you
              // don't attempt to send them push messages anymore
              updateSubscriptionOnServer(pushSubscription, true).then(() => {
                callback && callback();
              });
            })
            .catch(function (e) {
              // We failed to unsubscribe, this can lead to
              // an unusual state, so may be best to remove
              // the subscription id from your data store and
              // inform the user that you disabled push
              Logger.info(SCOPE_SC_CORE, `Unsubscription error.`);
              console.log(e);
            });
        })
        .catch(function (e) {
          Logger.info(SCOPE_SC_CORE, `Error thrown while unsubscribing from push messaging. ${e}`);
        });
    });
  };

  /**
   * Get subscription
   */
  const subscribe = () => {
    navigator.serviceWorker.ready.then(function (serviceWorkerRegistration) {
      serviceWorkerRegistration.pushManager
        .subscribe({userVisibleOnly: true, applicationServerKey: urlB64ToUint8Array(applicationServerKey)})
        .then(function (subscription) {
          if (!subscription) {
            Logger.info(SCOPE_SC_CORE, 'We aren’t subscribed to push.');
          } else {
            updateSubscriptionOnServer(subscription, false);
          }
        })
        .catch(function (e) {
          if (Notification.permission === 'denied') {
            // The user denied the notification permission which
            // means we failed to subscribe and the user will need
            // to manually change the notification permission to
            // subscribe to push messages
            Logger.info(SCOPE_SC_CORE, 'Permission for Notifications was denied');
          } else {
            // A problem occurred with the subscription
            subAttempts.current += 1;
            Logger.info(SCOPE_SC_CORE, `Unable to subscribe(${subAttempts.current}) to push. ${e}`);
            if (subAttempts.current < 3) {
              unsubscribe(() => subscribe());
            } else {
              Logger.info(SCOPE_SC_CORE, `Unable to subscribe to push. ${e}`);
            }
          }
        });
    });
  };

  /**
   * Request web push notification permission
   * @type {(function(): void)|*}
   */
  const requestNotificationPermission = () => {
    if (Notification.permission !== 'granted') {
      Notification.requestPermission().then(function (permission) {
        if (permission === 'granted') {
          navigator.serviceWorker.ready.then((serviceWorkerRegistration) => {
            // Do we already have a push message subscription?
            serviceWorkerRegistration.pushManager
              .getSubscription()
              .then(function (subscription) {
                // Enable any UI which subscribes / unsubscribes from
                // push messages.
                if (!subscription) {
                  subscribe();
                  return;
                }

                // Keep your server in sync with the latest subscription
                updateSubscriptionOnServer(subscription, false);
              })
              .catch((err) => {
                Logger.info(SCOPE_SC_CORE, 'Error during getSubscription()');
                console.log(err);
              });
          });
        } else {
          Logger.info(SCOPE_SC_CORE, 'Permission for Notifications was denied');
        }
      });
    }
  };

  /**
   * Initialize state
   */
  const initialiseState = () => {
    /**
     * Check if Notifications supported in the service worker
     */
    if (!('showNotification' in ServiceWorkerRegistration.prototype)) {
      Logger.info(SCOPE_SC_CORE, "Notifications aren't supported.");
      return;
    }

    /**
     * Features, such as service workers and push notifications, require HTTPS secure domains,
     * so your development environment must serve content over HTTPS to match a production environment.
     * Check if push messaging is supported.
     */
    if (!('PushManager' in window && 'serviceWorker' in navigator)) {
      Logger.info(SCOPE_SC_CORE, "Service Worker or Push messaging aren't supported.");
      return;
    }

    /**
     * Check the current Notification permission.
     * If its denied, it's a permanent block until the user changes the permission
     */
    if (Notification.permission === 'denied') {
      Logger.info(SCOPE_SC_CORE, 'The user has blocked notifications.');
      return;
    } else {
      if (Notification.permission === 'default') {
        Logger.info(SCOPE_SC_CORE, 'Request permission.');
        requestNotificationPermission();
      } else if (Notification.permission === 'granted') {
        subscribe();
      }
    }
  };

  /**
   * Init state web push subscription
   * If web push enabled, applicationServerKey and user is logged, check subscription
   */
  useEffect(() => {
    if (!wpSubscription && !scContext.settings.notifications.webPushMessaging.disableToastMessage && scUserContext.user) {
      if (!webPushEnabled) {
        Logger.warn(SCOPE_SC_CORE, 'This instance is not configured to support notifications. Enable this feature.');
      } else if (!applicationServerKey) {
        Logger.warn(SCOPE_SC_CORE, 'Invalid or missing applicationServerKey. Check the configuration that is passed to the SCContextProvider.');
      } else {
        initialiseState();
      }
    }
  }, [scUserContext.user, scContext.settings.notifications.webPushMessaging, wpSubscription]);

  return {wpSubscription};
}
