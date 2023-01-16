import React, {ReactNode} from 'react';
import {SCAuthTokenType, SCIncubatorType, SCCategoryType, SCUserType} from '@selfcommunity/types';

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
  router?: SCRoutingType;

  /**
   * Object conf of preferences.
   */
  preferences?: SCPreferencesContextType;

  /**
   * Object conf of notification.
   */
  notifications?: SCNotificationsType;

  /**
   * Callback to handle anonymous action
   * Ex. an anonymous user attempt to post a comment
   */
  handleAnonymousAction?: () => void;

  /**
   * List of SC context providers to override the default value
   * Default context providers:
   * SCPreferencesProvider, SCRoutingProvider, SCUserProvider,
   * SCNotificationProvider, SCThemeProvider, SCLocaleProvider,
   * SCPreferencesProvider,
   */
  contextProviders?: ((children) => JSX.Element)[];
}

/**
 * Interface SCLocaleType
 */
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
   * Triggered when logout is performed.
   */
  logout: () => void;

  /**
   * Triggered when call a refresh session.
   */
  refreshSession: () => Promise<any>;

  /**
   * Handle change user info
   */
  updateUser: (info: Record<string, any>) => void;

  /**
   * Handle change unseen interactions counter
   */
  setUnseenInteractionsCounter: (counter: number) => void;

  /**
   * Handle change unseen notification banner counter
   */
  setUnseenNotificationBannersCounter: (counter: number) => void;

  /**
   * Handle refresh user notification counters
   * Interactions, BroadcastMessages
   */
  refreshNotificationCounters: () => Promise<any>;

  /**
   * Managers: followed, connections, categories, incubators, etc...
   */
  managers: {
    followed?: SCFollowedManagerType;
    followers?: SCFollowersManagerType;
    connections?: SCConnectionsManagerType;
    categories: SCFollowedCategoriesManagerType;
    incubators?: SCSubscribedIncubatorsManagerType;
  };
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

export interface SCFollowersManagerType {
  /**
   * List of all user ids that follow the authenticated user
   */
  followers: number[];

  /**
   * List of all users in loading state
   */
  loading: number[];

  /**
   * List of current users in loading state
   */
  isLoading: (user: SCUserType) => boolean;

  /**
   * Handle check if a user is a followers, caching data
   */
  isFollower?: (user: SCUserType) => boolean;

  /**
   * Empty cache to revalidate all followers
   */
  emptyCache?: () => void;
}

export interface SCFollowedCategoriesManagerType {
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

export interface SCSubscribedIncubatorsManagerType {
  /**
   * List of all incubators ids subscribed by the authenticated user
   */
  incubators: number[];

  /**
   * List of all incubators in loading state
   */
  loading: number[];

  /**
   * List of current incubators in loading state
   */
  isLoading: (incubator: SCIncubatorType) => boolean;

  /**
   * Handle incubator subscribe/unsubscribe
   */
  subscribe?: (incubator: SCIncubatorType) => Promise<any>;

  /**
   * Handle check if a user has subscribed to an incubator, caching data
   */
  isSubscribed?: (incubator: SCIncubatorType) => boolean;

  /**
   * Refresh subscribed
   */
  refresh?: () => void;

  /**
   * Empty cache to revalidate all subscribed
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
   */
  clientId?: string;

  /**
   * Access Token.
   */
  authToken?: SCAuthTokenType;

  /**
   * Callback to refresh the token.
   */
  handleRefreshToken?: (currentSession) => Promise<SCAuthTokenType>;
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
 * Interface SCRoutingType
 */
export interface SCRoutingType {
  /**
   * Component
   */
  routerLink?: React.ComponentClass<any>;

  /**
   * Routes
   */
  routes?: Record<string, string>;

  /**
   * Handle override routes path
   * @param name
   * @param defaultUrl
   * @param data
   * @param templateUrl
   * @return string
   */
  handleRoute?: (name, defaultUrl, data, templateUrl) => string;
}

/**
 * Interface SCNotificationsType
 */
export interface SCNotificationsType {
  /**
   * Web socket notification
   */
  webSocket?: SCNotificationsWebSocketType;
  /**
   * Web push messaging notification
   */
  webPushMessaging?: SCNotificationsWebPushMessagingType;
}

/**
 * Interface SCNotificationsWebSocketType
 */
export interface SCNotificationsWebSocketType {
  /**
   * Disable toast message
   */
  disableToastMessage?: boolean;
  /**
   * Set websocket protocol: wss or ws.
   * Default: wss
   */
  secure?: boolean;
}

/**
 * Interface SCNotificationsWebPushMessagingType
 */
export interface SCNotificationsWebPushMessagingType {
  /**
   * Disable toast message
   */
  disableToastMessage?: boolean;

  /**
   * applicationServerKey - Public key
   */
  applicationServerKey?: boolean;
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
   * Generate default path
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

  /**
   * wp subscription
   */
  wpSubscription: any;
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
  options: Record<string, any>;

  /**
   * Set options
   */
  setOptions: (options) => void;
}
