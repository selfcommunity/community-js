import {useContext, useEffect, useMemo, useState} from 'react';
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
import * as Notifications from '../constants/Notifications';
import {ValidationError} from '../utils/errors';

/**
 * Custom hook 'useSCWebPushMessaging'
 * Use this hook to init web push messaging
 */
export default function useSCWebPushMessaging() {
  // CONTEXT
  const scContext: SCContextType = useSCContext();
  const scUserContext: SCUserContextType = useSCUser();
  const scPreferencesContext: SCPreferencesContextType = useContext(SCPreferencesContext);

  // STATE
  const [wpSubscription, setWpSubscription] = useState(null);

  // CONST
  const applicationServerKey = scContext.settings.notifications.webPushMessaging.applicationServerKey
    ? scContext.settings.notifications.webPushMessaging.applicationServerKey
    : scPreferencesContext.preferences[SCPreferences.PROVIDERS_WEB_PUSH_PUBLIC_KEY].value;
  console.log(applicationServerKey);

  const performUpdateSubscription = useMemo(
    () => (data, remove) => {
      const url = remove
        ? Endpoints.DeleteDevice.url({type: WEB_PUSH_NOTIFICATION_DEVICE_TYPE, id: data.registration_id})
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
    },
    []
  );

  /**
   * updateSubscriptionOnServer to sync current subscription
   * @param sub
   */
  const updateSubscriptionOnServer = (sub, remove) => {
    Logger.info(SCOPE_SC_CORE, 'Subscription');
    Logger.info(SCOPE_SC_CORE, sub);
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
    console.log(data);
    performUpdateSubscription(data, remove).then((r: any) => {
      if (remove) {
        Logger.info(SCOPE_SC_CORE, 'Subscription remove to server');
        setWpSubscription(null);
      } else {
        Logger.info(SCOPE_SC_CORE, 'Added subscription to server');
      }
    });
  };

  /**
   * Unsubscribe
   */
  const unsubscribe = () => {
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
              updateSubscriptionOnServer(wpSubscription, true);
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const subscribe = () => {
    navigator.serviceWorker.ready.then(function (serviceWorkerRegistration) {
      serviceWorkerRegistration.pushManager
        .subscribe({userVisibleOnly: true, applicationServerKey: urlB64ToUint8Array(applicationServerKey)})
        .then(function (subscription) {
          if (!subscription) {
            Logger.info(SCOPE_SC_CORE, 'We aren’t subscribed to push.');
          } else {
            setWpSubscription(subscription);
            updateSubscriptionOnServer(subscription, false);
          }
        })
        .catch(function (e) {
          Logger.info(SCOPE_SC_CORE, `Error during getSubscription() ${e}`);
          if (Notification.permission === 'denied') {
            // The user denied the notification permission which
            // means we failed to subscribe and the user will need
            // to manually change the notification permission to
            // subscribe to push messages
            Logger.info(SCOPE_SC_CORE, 'Permission for Notifications was denied');
          } else {
            // A problem occurred with the subscription, this can
            // often be down to an issue or lack of the gcm_sender_id
            // and / or gcm_user_visible_only
            Logger.info(SCOPE_SC_CORE, `Unable to subscribe to push. ${e}`);
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
                setWpSubscription(subscription);
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
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      if (Notification.permission === 'default' || Notification.permission === 'prompt') {
        Logger.info(SCOPE_SC_CORE, 'Request permission.');
        requestNotificationPermission();
      } else if (Notification.permission === 'granted') {
        navigator.serviceWorker.ready.then(function (serviceWorkerRegistration) {
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
              setWpSubscription(subscription);
              updateSubscriptionOnServer(subscription, false);
            })
            .catch((err) => {
              Logger.info(SCOPE_SC_CORE, 'Error during getSubscription()');
              console.log(err);
            });
        });
      }
    }
  };

  useEffect(() => {
    if (!scContext.settings.notifications.webPushMessaging.disableToastMessage && !applicationServerKey) {
      Logger.warn(SCOPE_SC_CORE, 'Invalid or missing applicationServerKey. Check the configuration that is passed to the SCContextProvider.');
    } else if (scUserContext.user && !scContext.settings.notifications.webPushMessaging.disableToastMessage && applicationServerKey) {
      initialiseState();
    }
    // Remove subscription
    return () => {
      wpSubscription && unsubscribe();
    };
  }, [scUserContext.user, scContext.settings.notifications.webPushMessaging]);

  return {wpSubscription};
}
