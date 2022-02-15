import React, { useEffect, useState } from 'react';
import {SCContextProvider} from '../packages/sc-core/src';
import { getJWTSession, getOAuthSession, refreshToken } from './sessionHelpers';

const withProvider = (Story, context) => {
    const [authToken, setAuthToken] = useState(undefined);

    /**
     * Get initial session for testing
     * OAuth2 and JWT create initial session
     */
    useEffect(() => {
      if (context.globals.session === 'OAuth') {
        getOAuthSession(context).then((res) => {
          setAuthToken(res);
        });
      } else if (context.globals.session === 'JWT') {
        getJWTSession(context).then((res) => {
          setAuthToken(res);
        });
      } else {
        setAuthToken({});
      }
    }, []);

    if (!authToken) return null;

    const _conf = {
      portal: context.globals.portal,
      locale: {default: context.globals.locale},
      session: {
        type: context.globals.session,
        clientId: context.globals.clientId,
        authToken: authToken, // Comment this line to test anonymous session
        handleRefreshToken: context.globals.session !== 'Cookie' ? refreshToken(context) : null,
      },
      notifications: {
        webSocket: {
          disableToastMessage: false
        },
        webPushMessaging: {
          disableToastMessage: false,
          // applicationServerKey: 'BKFRsTZZdL-xO5q8gZumLY5u2ceXM1-1GYZlkMIeXdp7COZ6r1Y28TmpfBFm3rMf9t3lLQZWn4dfDSEoiRWLM8c',
        }
      },
      theme: {
        palette: {
          primary: {
            main: '#7baa5d'
          },
          secondary: {
            main: '#4a8f62'
          }
        }
      },
      handleAnonymousAction: () => {
        alert('Anonymous action');
      },
      /* contextProviders: [
        SCPreferencesProvider,
        SCRoutingProvider,
        SCUserProvider,
        SCLocaleProvider,
        SCAlertMessagesProvider
      ] */
    };

    return (
        <SCContextProvider conf={_conf}>
          <Story {...context} />
        </SCContextProvider>
    );
};

const withServiceWorker = (Story, context) => {

  /**
   * Register a sw
   */
  if (navigator && navigator.serviceWorker) {
    navigator.serviceWorker.register('sw.js')
      .then(r => console.log('Service worker registered!'))
      .catch(e=>console.log(e));
  }

  return (
    <Story {...context} />
  );
};

export default {
  withProvider,
  withServiceWorker,
};
