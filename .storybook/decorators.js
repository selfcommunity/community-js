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
          applicationServerKey: 'BOB3nhpXABPWI5sKDs86gA79GXE3pqclgxODGhItbYxKLhWuiXV44E641d-KWYJFsdpPJF4ufRetWEio7PmqJH8',
        }
      },
      theme: {
        palette: {
          primary: {
            main: '#5e625e'
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
  }
;

export default {
  withProvider,
};
