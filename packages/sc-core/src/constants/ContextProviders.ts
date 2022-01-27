import SCPreferencesProvider from '../components/provider/SCPreferencesProvider';
import SCRoutingProvider from '../components/provider/SCRoutingProvider';
import SCUserProvider from '../components/provider/SCUserProvider';
import SCNotificationProvider from '../components/provider/SCNotificationProvider';
import SCThemeProvider from '../components/provider/SCThemeProvider';
import SCLocaleProvider from '../components/provider/SCLocaleProvider';
import SCAlertMessagesProvider from '../components/provider/SCAlertMessagesProvider';

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
