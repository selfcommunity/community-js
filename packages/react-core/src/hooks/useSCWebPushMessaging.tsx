import React, {useContext, useEffect, useRef, useState} from 'react';
import {SCContextType, SCPreferencesContextType, SCUserContextType} from '../types';
import {SCTagType} from '@selfcommunity/types';
import {useSCContext} from '../components/provider/SCContextProvider';
import {useSCUser} from '../components/provider/SCUserProvider';
import {Logger} from '@selfcommunity/utils';
import Button from '@mui/material/Button';
import {loadVersionBrowser, urlB64ToUint8Array} from '@selfcommunity/utils';
import {SCOPE_SC_CORE} from '../constants/Errors';
import {http, Endpoints, HttpResponse} from '@selfcommunity/api-services';
import {WEB_PUSH_NOTIFICATION_DEVICE_TYPE} from '../constants/Device';
import {SCPreferencesContext} from '../components/provider/SCPreferencesProvider';
import {SnackbarKey, useSnackbar} from 'notistack';
import * as SCPreferences from '../constants/Preferences';
import {NOTIFICATIONS_WEB_PUSH_MESSAGING_DIALOG_COOKIE} from '../constants/Notifications';
import Cookies from 'js-cookie';
import {useIntl} from 'react-intl';
import {isWebPushMessagingEnabled} from '../utils/notification';

/**
 * Browser supported on backend
 */
export const CHROME_BROWSER_TYPE = 'chrome';
export const FIREFOX_BROWSER_TYPE = 'firefox';
export const OPERA_BROWSER_TYPE = 'opera';
export const EDGE_BROWSER_TYPE = 'edge';
export const DEFAULT_BROWSER_TYPE = CHROME_BROWSER_TYPE;
export const SUPPORTED_BROWSER_TYPES = [CHROME_BROWSER_TYPE, FIREFOX_BROWSER_TYPE, OPERA_BROWSER_TYPE, EDGE_BROWSER_TYPE];

/**
 :::info
 This custom hook is used to init web push messaging.
 :::
 */
export default function useSCWebPushMessaging() {
  // CONTEXT
  const scContext: SCContextType = useSCContext();
  const scUserContext: SCUserContextType = useSCUser();
  const scPreferencesContext: SCPreferencesContextType = useContext(SCPreferencesContext);
  const intl = useIntl();
  const {enqueueSnackbar, closeSnackbar} = useSnackbar();

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
  const webPushPreferenceEnabled =
    SCPreferences.PROVIDERS_WEB_PUSH_ENABLED in scPreferencesContext.preferences &&
    scPreferencesContext.preferences[SCPreferences.PROVIDERS_WEB_PUSH_ENABLED].value
      ? scPreferencesContext.preferences[SCPreferences.PROVIDERS_WEB_PUSH_ENABLED].value
      : false;

  /**
   * Show custom Snackbar dialog to request permission
   * User action required for some browser (ex. Safari)
   */
  const showCustomRequestNotificationSnackbar = () => {
    if (!Cookies.get(NOTIFICATIONS_WEB_PUSH_MESSAGING_DIALOG_COOKIE)) {
      enqueueSnackbar(
        intl.formatMessage({id: 'ui.webPushNotification.requestPermission', defaultMessage: 'ui.webPushNotification.requestPermission'}),
        {
          action: (snackbarId: SnackbarKey) => (
            <>
              <Button size="small" onClick={() => requestNotificationPermission(snackbarId)}>
                {intl.formatMessage({id: 'ui.webPushNotification.allow', defaultMessage: 'ui.webPushNotification.allow'})}
              </Button>
              <Button size="small" onClick={() => closeRequestNotificationSnackbar(snackbarId)}>
                {intl.formatMessage({id: 'ui.webPushNotification.block', defaultMessage: 'ui.webPushNotification.block'})}
              </Button>
            </>
          ),
          variant: 'default',
          anchorOrigin: {horizontal: 'center', vertical: 'bottom'},
          preventDuplicate: true,
        }
      );
    } else {
      Logger.info(SCOPE_SC_CORE, 'Skip show the dialog to request Web Push Notifications grant permission');
    }
  };

  /**
   * Close the SnackBar dialog if the request notification permission
   * came from the custom dialog
   * @param snackbarId
   */
  const closeRequestNotificationSnackbar = (snackbarId: SnackbarKey | null) => {
    if (snackbarId) {
      closeSnackbar(snackbarId);
      // To set expiration in minutes:
      // let inFifteenMinutes = new Date(new Date().getTime() + 15 * 60 * 1000);
      // {expires: inFifteenMinutes}
      Cookies.set(NOTIFICATIONS_WEB_PUSH_MESSAGING_DIALOG_COOKIE, '1', {expires: 1});
    }
  };

  /**
   * perform update the Subscription
   * @param data
   * @param remove
   */
  const performUpdateSubscription = (data, remove) => {
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
      .then((res: HttpResponse<SCTagType>) => {
        if (res.status >= 300) {
          return Promise.reject(res);
        }
        return Promise.resolve(res.data);
      });
  };

  /**
   * Return browser type
   * Fallback to DEFAULT_BROWSER_TYPE if the browser detected not in SUPPORTED_BROWSER_TYPES
   */
  const getBrowserType = (browser: {name: string; version: string}) => {
    if (SUPPORTED_BROWSER_TYPES.indexOf(browser.name) < 0) {
      return DEFAULT_BROWSER_TYPE;
    }
    return browser.name;
  };

  /**
   * Return registrationId based on browser type and subscription
   * Fallback to subscription.endpoint if the browser detected not in SUPPORTED_BROWSER_TYPES
   */
  const getRegistrationId = (browser: {name: string; version: string}, sub) => {
    if (SUPPORTED_BROWSER_TYPES.indexOf(browser.name) < 0) {
      return sub.endpoint;
    }
    try {
      const endpointParts = sub.endpoint.split('/');
      return endpointParts[endpointParts.length - 1];
    } catch (e) {
      return sub.endpoint;
    }
  };

  /**
   * updateSubscriptionOnServer to sync current subscription
   * @param sub
   * @param remove
   */
  const updateSubscriptionOnServer = (sub, remove) => {
    const browser = loadVersionBrowser();
    const data = {
      browser: getBrowserType(browser).toUpperCase(),
      p256dh: btoa(String.fromCharCode.apply(null, new Uint8Array(sub.getKey('p256dh')))),
      auth: btoa(String.fromCharCode.apply(null, new Uint8Array(sub.getKey('auth')))),
      user: scUserContext.user ? scUserContext.user.username : '',
      registration_id: getRegistrationId(browser, sub),
    };
    return performUpdateSubscription(data, remove)
      .then((res: any) => {
        if (remove) {
          setWpSubscription(null);
        } else {
          Logger.info(SCOPE_SC_CORE, 'Web Push Notifications subscription created successfully');
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
      if (serviceWorkerRegistration) {
        // To unsubscribe from push messaging, you need get the
        // subscription object, which you can call unsubscribe() on.
        serviceWorkerRegistration.pushManager
          .getSubscription()
          .then((pushSubscription) => {
            // Check we have a subscription to unsubscribe
            if (!pushSubscription) {
              // No subscription object, so set the state
              // to allow the user to subscribe to push
              return;
            }

            // We have a subscription, so call unsubscribe on it
            pushSubscription
              .unsubscribe()
              .then(() => {
                Logger.info(SCOPE_SC_CORE, 'Unsubscription successfully');
                // Request to server to remove
                // the users data from your data store so you
                // don't attempt to send them push messages anymore
                void updateSubscriptionOnServer(pushSubscription, true).then(() => {
                  callback && callback();
                });
              })
              .catch(function (e) {
                // We failed to unsubscribe, this can lead to
                // an unusual state, so may be best to remove
                // the subscription id from your data store and
                // inform the user that you disabled push
                Logger.info(SCOPE_SC_CORE, `Error on removing web push notification subscription.`);
                console.log(e);
              });
          })
          .catch(function (e) {
            Logger.info(SCOPE_SC_CORE, `Error thrown while unsubscribing from push messaging. ${e}`);
          });
      }
    });
  };

  /**
   * Get subscription
   */
  const subscribe = () => {
    navigator.serviceWorker.getRegistration().then(function (serviceWorkerRegistration) {
      if (serviceWorkerRegistration) {
        // service worker is registered
        serviceWorkerRegistration.pushManager
          .subscribe({userVisibleOnly: true, applicationServerKey: urlB64ToUint8Array(applicationServerKey)})
          .then(function (subscription) {
            if (!subscription) {
              Logger.info(SCOPE_SC_CORE, 'We aren’t subscribed to push.');
            } else {
              void updateSubscriptionOnServer(subscription, false);
            }
          })
          .catch(function (e) {
            console.log(e);
            if (Notification.permission === 'denied') {
              // The user denied the notification permission which
              // means we failed to subscribe and the user will need
              // to manually change the notification permission to
              // subscribe to push messages
              Logger.info(SCOPE_SC_CORE, 'Permission for Web Push Notifications was denied');
            } else {
              // A problem occurred with the subscription
              subAttempts.current += 1;
              Logger.info(SCOPE_SC_CORE, `Unable to subscribe(${subAttempts.current}) to push. ${e}`);
              if (subAttempts.current < 3) {
                unsubscribe(() => subscribe());
              } else {
                Logger.info(SCOPE_SC_CORE, `Unable to subscribe to Web Push Notification. ${e}`);
              }
            }
          });
      } else {
        Logger.info(SCOPE_SC_CORE, `To receive Web Push Notifications the service worker must be registered.`);
      }
    });
  };

  /**
   * Request web push notification permission
   * @type {(function(): void)|*}
   */
  const requestNotificationPermission = (snackbarId: SnackbarKey | null) => {
    if (Notification.permission !== 'granted') {
      Notification.requestPermission()
        .then(function (permission) {
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
                  void updateSubscriptionOnServer(subscription, false);
                })
                .catch((err) => {
                  Logger.info(SCOPE_SC_CORE, 'Error during getSubscription()');
                  console.log(err);
                });
            });
          } else {
            Logger.info(SCOPE_SC_CORE, 'Permission for Notifications was denied');
          }
        })
        .catch((err) => {
          console.log(err);
          Logger.info(SCOPE_SC_CORE, 'Request web push permission by a user generated gesture');
        });
    }
    closeRequestNotificationSnackbar(snackbarId);
  };

  /**
   * Initialize state
   */
  const initialiseState = () => {
    /**
     * Check if Notifications supported in the service worker
     */
    if (typeof ServiceWorkerRegistration === 'undefined') {
      Logger.info(SCOPE_SC_CORE, "Notifications aren't supported.");
      return;
    }

    /**
     * Features, such as service workers and push notifications, require HTTPS secure domains,
     * so your development environment must serve content over HTTPS to match a production environment.
     * Check if push messaging is supported.
     */
    if (!('PushManager' in window && 'serviceWorker' in navigator && 'Notification' in window)) {
      Logger.info(SCOPE_SC_CORE, "Service Worker or Push messaging aren't supported.");
      return;
    }

    /**
     * Check the current Notification permission.
     * If it's denied, it's a permanent block until the user changes the permission
     */
    if (Notification.permission === 'denied') {
      Logger.info(SCOPE_SC_CORE, 'The user has blocked Web Push Notifications.');
      return;
    } else {
      if (Notification.permission === 'default') {
        Logger.info(SCOPE_SC_CORE, 'Request permission');
        if (navigator.userAgent.includes('Safari') && !navigator.userAgent.includes('Chrome')) {
          showCustomRequestNotificationSnackbar();
        } else {
          requestNotificationPermission(null);
        }
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
    if (!wpSubscription && scUserContext.user) {
      if (!isWebPushMessagingEnabled()) {
        Logger.warn(SCOPE_SC_CORE, 'Mobile native notifications replace web push messages with this settings.');
      } else if (!webPushPreferenceEnabled || scContext.settings.notifications.webPushMessaging.disableToastMessage) {
        Logger.warn(SCOPE_SC_CORE, 'This instance is not configured to support web push notifications or they have been disabled.');
      } else if (!applicationServerKey) {
        Logger.warn(SCOPE_SC_CORE, 'Invalid or missing applicationServerKey. Check the configuration that is passed to the SCContextProvider.');
      } else {
        Logger.info(SCOPE_SC_CORE, 'Initialize web push notification.');
        initialiseState();
      }
    }
    if ((!scUserContext.user || !isWebPushMessagingEnabled()) && wpSubscription) {
      // Unsubscribe if user not in session
      unsubscribe(() => {
        if (navigator.userAgent.includes('Safari') && !navigator.userAgent.includes('Chrome')) {
          Cookies.remove(NOTIFICATIONS_WEB_PUSH_MESSAGING_DIALOG_COOKIE);
        }
      });
    }
  }, [scUserContext.user, scContext.settings.notifications.webPushMessaging, wpSubscription]);

  return {wpSubscription, requestNotificationPermission};
}
