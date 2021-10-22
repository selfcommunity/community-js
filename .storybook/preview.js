import {addDecorator} from '@storybook/react'
import decorators from './decorators'
addDecorator(decorators.withProvider);

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
    description: 'Internationalization locale',
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
  authToken: {
    name: 'OAuth Token',
    description: 'OAuth Token',
    defaultValue: {
      "accessToken": process.env.STORYBOOK_PLATFORM_ACCESS_TOKEN,
      "refreshToken": process.env.STORYBOOK_PLATFORM_REFRESH_TOKEN,
      "tokenType": process.env.STORYBOOK_PLATFORM_ACCESS_TOKEN_TYPE,
      "expiresIn": process.env.STORYBOOK_PLATFORM_ACCESS_TOKEN_EXPIRES_IN,
      "scope": process.env.STORYBOOK_PLATFORM_ACCESS_TOKEN_SCOPE,
    }
  },
  authRefreshTokenEndpoint: {
    name: 'Refresh Token Endpoint',
    description: 'Endpoint config to refresh token',
    defaultValue: process.env.STORYBOOK_PLATFORM_REFRESH_TOKEN_ENDPOINT
  }
};




