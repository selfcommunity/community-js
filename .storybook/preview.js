import defaultDecorators from './decorators';
/**
 * Add decorators:
 * 1. wrap the story with SCContextProvider
 * 2. register a service worker
 */
export const decorators = [defaultDecorators.withProvider, defaultDecorators.withServiceWorker];

/**
 * Parameters
 */
export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  options: {
    storySort: {
      order: ['General', 'Design System'],
    },
  },
  backgrounds: {
    default: 'light_grey',
    values: [
      {
        name: 'light_grey',
        value: '#F7F7F7',
      },
      {
        name: 'dark_grey',
        value: '#565656',
      },
    ],
  }
}

/**
 * Set Globals vars for storybook
 */
export const globalTypes = {
  portal: {
    name: 'Portal',
    description: 'Application Portal',
    defaultValue: process.env.STORYBOOK_PLATFORM_URL
  },
  locale: {
    name: 'Locale',
    description: 'Locale i18n',
    defaultValue: process.env.STORYBOOK_PLATFORM_LOCALE,
    toolbar: {
      icon: 'globe',
      items: [
        { value: 'en', right: '🇺🇸', title: 'English' },
        { value: 'it', right: '🇮🇹', title: 'Italian' }
      ],
    },
  },
  session: {
    name: 'Session Type',
    description: 'Type of session',
    defaultValue: process.env.STORYBOOK_PLATFORM_SESSION_TYPE
  },
  clientId: {
    name: 'Client Id',
    description: 'Client id OAuth2',
    defaultValue: process.env.STORYBOOK_PLATFORM_SESSION_CLIENT_ID
  },
  accessTokenJwtExpiresIn: {
    name: 'JWT Expires in',
    description: 'Expires in JWT',
    defaultValue: process.env.STORYBOOK_PLATFORM_ACCESS_JWT_TOKEN_EXPIRES_IN
  },
  accountUsername: {
    name: 'Account Username',
    description: 'Username of the logged user',
    defaultValue: process.env.STORYBOOK_PLATFORM_ACCOUNT_USERNAME
  },
  accountPassword: {
    name: 'Account Password',
    description: 'Password of the logged user',
    defaultValue: process.env.STORYBOOK_PLATFORM_ACCOUNT_PASSWORD
  }
};




