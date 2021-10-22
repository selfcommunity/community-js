import {SCUserType} from './user';
import {ReactNode} from 'react';

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

  /**
   * Callback to update session
   */
  updateSession: (session: SCSessionType) => void
}

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
  locale: string;
  /**
   * Object conf of session.
   */
  session: SCSessionType;
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
   * Access Token.
   */
  authToken?: SCAuthTokenType;

  /**
   * Endpoint to refresh the token.
   */
  refreshTokenEndpoint?: SCRefreshTokenEndpointType;

  /**
   * Indicates whether the session is updating
   */
  isRefreshing: boolean;
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
  expiresIn?: string;

  /**
   * Token scopes;
   */
  scope?: Array<string>;
}

/**
 * Interface SCRefreshTokenEndpointType
 */
export interface SCRefreshTokenEndpointType {
  /**
   * Path of the endpoint.
   * If it is relative path, the endpoint prefix will be settings.portal
   */
  path: string;

  /**
   * Method: POST or GET
   */
  method: Method;

  /**
   * Extra data to include in the request payload during refresh token action
   */
  extraHeadersData?: object;

  /**
   * Extra data to include in the request payload during refresh token action
   */
  extraPayloadData?: object;
}

/**
 * Request methods
 */
export type Method =
  | 'get'
  | 'GET'
  | 'delete'
  | 'DELETE'
  | 'head'
  | 'HEAD'
  | 'options'
  | 'OPTIONS'
  | 'post'
  | 'POST'
  | 'put'
  | 'PUT'
  | 'patch'
  | 'PATCH'
  | 'purge'
  | 'PURGE'
  | 'link'
  | 'LINK'
  | 'unlink'
  | 'UNLINK';

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
