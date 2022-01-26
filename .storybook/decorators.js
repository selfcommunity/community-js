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
        authToken: authToken,
        refreshTokenCallback:
          context.globals.session !== 'Cookie' ? refreshToken(context) : null,
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
