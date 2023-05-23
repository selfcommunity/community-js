import SCPreferencesProvider from '../components/provider/SCPreferencesProvider';
import SCVoteProvider from '../components/provider/SCVoteProvider';
import SCRoutingProvider from '../components/provider/SCRoutingProvider';
import SCUserProvider from '../components/provider/SCUserProvider';
import SCNotificationProvider from '../components/provider/SCNotificationProvider';
import SCThemeProvider from '../components/provider/SCThemeProvider';
import SCLocaleProvider from '../components/provider/SCLocaleProvider';
import SCAlertMessagesProvider from '../components/provider/SCAlertMessagesProvider';

export const CONTEXT_PROVIDERS_OPTION = 'contextProviders';

/**
 * List of all nested providers that are required to run
 */
export const DEFAULT_CONTEXT_PROVIDERS: ((children) => JSX.Element)[] = [
  SCPreferencesProvider,
  SCVoteProvider,
  SCRoutingProvider,
  SCUserProvider,
  SCLocaleProvider,
  SCThemeProvider,
  SCAlertMessagesProvider,
  SCNotificationProvider,
];
