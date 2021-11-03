import {SCUserType} from './user';
import React, {ReactNode} from 'react';

/**
 * Interface SCSettingsType
 */
export interface SCSettingsType {
  /**
   * Portal.
   */
  portal: string;
  /**
   * i18n. Locale: it, en, etc...
   */
  locale?: string;
  /**
   * Object conf of session.
   */
  session: SCSessionType;
  /**
   * Object conf of session.
   */
  theme?: object;
  /**
   * Object conf of router.
   */
  router?: SCRoutingContextType;
}

/**
 * Interface SCAuthContextType
 */
export interface SCAuthContextType {
  /**
   * Authenticated User.
   */
  user?: SCUserType;

  /**
   * Current Session.
   */
  session?: SCSessionType;

  /**
   * Authentication is loading.
   */
  loading: boolean;

  /**
   * Error that occurred during authentication.
   */
  error?: any;

  /**
   * Triggered when the a user logout is performed.
   */
  logout: () => void;
}

/**
 * Interface SCSessionType
 */
export interface SCSessionType {
  /**
   * Session types: OAuth, JWT, Cookies.
   */
  type: string;

  /**
   * ClientID: only for OAuth.
   * It will be passed to refreshTokenCallback
   */
  clientId: string;

  /**
   * Access Token.
   */
  authToken?: SCAuthTokenType;

  /**
   * Callback to refresh the token.
   */
  refreshTokenCallback?: (currentSession) => Promise<SCAuthTokenType>;
}

/**
 * Interface SCAuthTokenType
 */
export interface SCAuthTokenType {
  /**
   * Access token.
   */
  accessToken: string;

  /**
   * Refresh token.
   */
  refreshToken?: string;

  /**
   * Token Type.
   */
  tokenType?: string;

  /**
   * Expire in.
   */
  expiresIn?: number;

  /**
   * Token scopes;
   */
  scope?: Array<string>;
}

/**
 * Interface SCContextType
 */
export interface SCContextType {
  /**
   * Settings
   */
  settings: SCSettingsType;

  /**
   * Preferences
   */
  preferences?: any;
}

/**
 * Interface SCContextProviderType
 */
export interface SCContextProviderType {
  /**
   * Settings
   */
  settings: SCSettingsType;

  /**
   * Nested children
   */
  children: ReactNode;
}

/**
 * Interface SCThemeContextType
 */
export interface SCThemeContextType {
  /**
   * Theme
   */
  theme: object;

  /**
   * Change theme
   * @param theme
   */
  setTheme: (theme) => void;
}

export interface SCRoutingContextType {
  /**
   * Component
   */
  routerLink?: React.ComponentClass<any>;

  /**
   * Routes
   */
  routes?: object;
}
