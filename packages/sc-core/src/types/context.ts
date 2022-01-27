import {SCUserType} from './user';
import React, {ReactNode} from 'react';
import {SCCategoryType} from './category';

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
  locale?: SCLocaleType;

  /**
   * Object conf of session.
   */
  session: SCSessionType;

  /**
   * Object conf of session.
   */
  theme?: Record<string, any>;

  /**
   * Object conf of router.
   */
  router?: SCRoutingContextType;

  /**
   * List of SC context providers to override the default value
   * Default context providers:
   * SCPreferencesProvider, SCRoutingProvider, SCUserProvider,
   * SCNotificationProvider, SCThemeProvider, SCLocaleProvider,
   * SCPreferencesProvider,
   */
  contextProviders?: ((children) => JSX.Element)[];
}

export interface SCLocaleType {
  /**
   * Default locale.
   */
  default?: string;

  /**
   * Overrides default messages.
   */
  messages?: Record<string, any>;
}

/**
 * Interface SCUserContextType
 */
export interface SCUserContextType {
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
   * Handle change avatar
   */
  setAvatar: (avatar: string) => void;

  /**
   * Handle change cover
   */
  setCover: (cover: string) => void;

  /**
   * Handle change unseen interactions counter
   */
  setUnseenInteractionsCounter: (counter: number) => void;

  /**
   * Handle change unseen notification banner counter
   */
  setUnseenNotificationBannersCounter: (counter: number) => void;

  /**
   * Managers: followed, connections, categories, etc...
   */
  managers: {followed?: SCFollowedManagerType; connections?: SCConnectionsManagerType; categories: SCCategoriesManagerType};
}

export interface SCFollowedManagerType {
  /**
   * List of all user ids followed by the authenticated user
   */
  followed: number[];

  /**
   * List of all users in loading state
   */
  loading: number[];

  /**
   * List of current users in loading state
   */
  isLoading: (user: SCUserType) => boolean;

  /**
   * Handle user follow/unfollow user
   */
  follow?: (user: SCUserType) => Promise<any>;

  /**
   * Handle check if a user follow a user, caching data
   */
  isFollowed?: (user: SCUserType) => boolean;

  /**
   * Refresh followed
   */
  refresh?: () => void;

  /**
   * Empty cache to revalidate all followed
   */
  emptyCache?: () => void;
}

export interface SCCategoriesManagerType {
  /**
   * List of all categories ids followed by the authenticated user
   */
  categories: number[];

  /**
   * List of all categories in loading state
   */
  loading: number[];

  /**
   * List of current categories in loading state
   */
  isLoading: (category: SCCategoryType) => boolean;

  /**
   * Handle user follow/unfollow category
   */
  follow?: (category: SCCategoryType) => Promise<any>;

  /**
   * Handle check if a user follow a category, caching data
   */
  isFollowed?: (category: SCCategoryType) => boolean;

  /**
   * Refresh categories
   */
  refresh?: () => void;

  /**
   * Empty cache to revalidate all categories
   */
  emptyCache?: () => void;
}

export interface SCConnectionsManagerType {
  /**
   * List of all users in relations(social graph) with authenticated user
   */
  connections: number[];

  /**
   * List of all users in loading state
   */
  loading: number[];

  /**
   * List of current users in loading state
   */
  isLoading: (user: SCUserType) => boolean;

  /**
   * Handle request connection
   */
  requestConnection?: (user: SCUserType) => Promise<any>;

  /**
   * Handle accept connection
   */
  acceptConnection?: (user: SCUserType) => Promise<any>;

  /**
   * Check user status
   */
  status?: (user: SCUserType) => string;

  /**
   * Refresh connections status
   */
  refresh?: () => void;

  /**
   * Empty cache to revalidate all categories
   */
  emptyCache?: () => void;
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
}

/**
 * Interface SCContextProviderType
 */
export interface SCContextProviderType {
  /**
   * Settings
   */
  conf: SCSettingsType;

  /**
   * Providers
   */
  contextProviders?: ((children) => JSX.Element)[];

  /**
   * Nested children
   */
  children: ReactNode;
}

/**
 * Interface SCPreferencesType
 */
export interface SCPreferencesContextType {
  /**
   * List of all community preferences
   */
  preferences: Record<string, any>;

  /**
   * List of all community enabled features
   */
  features: string[];
}

/**
 * Interface SCThemeContextType
 */
export interface SCThemeContextType {
  /**
   * Theme
   */
  theme: Record<string, any>;

  /**
   * Change theme
   * @param theme
   */
  setTheme: (theme) => void;
}

/**
 * Interface SCRoutingContextType
 */
export interface SCRoutingContextType {
  /**
   * Component
   */
  routerLink?: React.ComponentClass<any>;

  /**
   * Routes
   */
  routes?: Record<string, string>;

  /**
   * Routes
   */
  url?: (string, object) => string;
}

/**
 * Interface SCNotificationContextType
 */
export interface SCNotificationContextType {
  /**
   * ws instance
   */
  wsInstance: any;
}

/**
 * Interface SCLocaleContextType
 */
export interface SCLocaleContextType {
  /**
   * Locale: en, it, etc.
   */
  locale: string;

  /**
   * Locale messages
   */
  messages: Record<any, any>;

  /**
   * Change locale
   */
  selectLocale: (l: string) => void;
}

/**
 * Interface SCAlertMessagesContextType
 */
export interface SCAlertMessagesContextType {
  /**
   * Options
   */
  [p: string]: any;
}
