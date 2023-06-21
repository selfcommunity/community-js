import { useEffect, useState } from 'react';
import { ThemeProvider as EmotionThemeProvider } from 'emotion-theming';
import { getJWTSession, getOAuthSession, refreshToken } from '../sessionHelpers';
import { Box, Button } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import {SCContextProvider, SCThemeType} from '../../packages/react-core/src';
import defaultSCTheme from '../../packages/react-theme-default/src';
import {mergeDeep} from '../../packages/utils/src';
import {Image, Link} from '../../packages/react-ui/src';
import '../media/header.css';
// import Logo from '../media/selfcommunity.png';

/**
 * Fix Storybook v6.3.10 with mui v5
 * Wrap stories with EmotionThemeProvider, to fix problem of storybook 6.4.19 with mui_v5
 * Check this issue to resolve mui problems in DOCs tab of storybook
 * https://github.com/mui-org/material-ui/issues/28716
 */
const defaultTheme = createTheme();

const withProvider = (Story, context) => {
  const [authToken, setAuthToken] = useState(undefined);

  /**
   * Get auth token
   */
  const getToken = () => {
    if (context.globals.session === 'OAuth') {
      getOAuthSession(context)
        .then((res) => {
          setAuthToken(res);
        })
        .catch(() => {
          console.log('Unable to get user session. Check username & password.');
        });
    } else if (context.globals.session === 'JWT') {
      getJWTSession(context)
        .then((res) => {
          setAuthToken(res);
        })
        .catch(() => {
          console.log('Unable to get user session. Check username & password.');
        });
    } else {
      setAuthToken({});
    }
  };

  /**
   * Get initial session for testing
   * OAuth2 and JWT create initial session
   */
  useEffect(() => {
    getToken();
  }, []);

  /**
   * Auth session
   */
  let session;
  if (authToken) {
    session = {
      type: context.globals.session,
      clientId: context.globals.clientId,
      authToken: authToken,
      handleRefreshToken:
        context.globals.session !== 'Cookie' ? refreshToken(context) : null,
      handleLogout: () => {
        changeCommunityConf(false);
      }
    };
  } else {
    session = {
      type: context.globals.session,
      clientId: context.globals.clientId,
      handleLogout: () => {
        changeCommunityConf(false);
      }
    };
  }

  const _conf = {
    portal: context.globals.portal,
    locale: { default: context.globals.locale },
    session: session,
    notifications: {
      webSocket: {
        disableToastMessage: false,
      },
      webPushMessaging: {
        disableToastMessage: true,
        // applicationServerKey: 'BD9Ic3IqC5Uom1NiC46fjOFYCvQcDPA2emgmyBx25oTXySeA25C0cJsWfK1Dxr4zDYeQ-MUwV9vOqz8aIGMeLAI',
      },
      mobileNativePushMessaging: {
        disable: false
      },
    },
    /* preferences: {
      preferences: {
        'addons.affinity_enabled': {
          id: 81,
          section: 'addons',
          name: 'affinity_enabled',
          value: true
        }
      }, features: ['addons', 'advertising']
    }, */
    theme: mergeDeep(defaultSCTheme, {
      components: {
        /* MuiIcon: {
          defaultProps: {
            // Replace the `material-icons` default value.
            baseClassName: 'material-icons-outlined',
          },
        }, */
        SCInlineComposer: {
          defaultProps: {
            mediaObjectTypes: [Image, Link]
          }
        }
      },
    }) as SCThemeType,
    handleAnonymousAction: () => {
      alert('Anonymous action');
    },
    // router: {
    //   routes: {
    //     'comment': '/community/:contribution_type/:contribution_id/:contribution_slug?comment=:id#comment_object_:id',
    //     'post': '/community/:contribution_type/:contribution_id/:contribution_slug',
    //     'discussion': '/community/:contribution_type/:contribution_id/:contribution_slug',
    //     'status': '/community/:contribution_type/:contribution_id/:contribution_slug'
    //   },
    // },
    // contextProviders: [
    //   SCPreferencesProvider,
    //   SCRoutingProvider,
    //   SCUserProvider,
    //   SCLocaleProvider,
    //   SCAlertMessagesProvider
    // ]
  };

  // Handle to test
  const changeCommunityConf = (logged) => {
    if (logged) {
      getToken();
    } else {
      setAuthToken(null);
    }
  };

  return (
    <EmotionThemeProvider theme={defaultTheme}>
      <header>
        <Box className="storybook-header">
          <div>
            {/*
            <img src={Logo} alt="Logo" width="32" />
            <h1>Story: {title[title.length-1]}</h1>
            */}
          </div>
          <div>
            {!authToken && (
              <Button
                variant="contained"
                onClick={() => changeCommunityConf(true)}
              >
                Login
              </Button>
            )}
            {authToken && (
              <Button
                variant="contained"
                onClick={() => changeCommunityConf(false)}
              >
                Logout
              </Button>
            )}
          </div>
        </Box>
      </header>
      <SCContextProvider conf={_conf}>
        <Story {...context} />
      </SCContextProvider>
    </EmotionThemeProvider>
  );
};

export default withProvider;