import {
  SCLocaleProvider,
  SCPreferencesProvider,
  SCRoutingProvider,
  SCThemeProvider,
  SCUserProvider,
  SCNotificationProvider,
  SCAlertMessagesProvider,
} from '@selfcommunity/core';

/**
 * List of all nested providers that are required to run
 */
export const DEFAULT_CONTEXT_PROVIDERS: ((children) => JSX.Element)[] = [
  SCPreferencesProvider,
  SCRoutingProvider,
  SCUserProvider,
  SCNotificationProvider,
  SCThemeProvider,
  SCLocaleProvider,
  SCAlertMessagesProvider,
];
