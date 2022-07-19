/**
 * Types
 */
import {
  SCUserContextType,
  SCFollowedCategoriesManagerType,
  SCContextProviderType,
  SCContextType,
  SCSettingsType,
  SCSessionType,
  SCFollowedManagerType,
  SCConnectionsManagerType,
  SCSubscribedIncubatorsManagerType,
  SCLocaleType,
  SCNotificationContextType,
  SCPreferencesContextType,
  SCThemeContextType,
  SCRoutingContextType,
  SCLocaleContextType,
  SCAlertMessagesContextType,
} from './types';

/**
 * ContextProvider component
 */
import SCContextProvider, {SCContext, useSCContext} from './components/provider/SCContextProvider';

/**
 * AuthProvider component
 */
import SCUserProvider, {SCUserContext, useSCUser} from './components/provider/SCUserProvider';

/**
 * ThemeProvider component
 */
import SCThemeProvider, {SCThemeContext, useSCTheme, withSCTheme} from './components/provider/SCThemeProvider';

/**
 * RoutingProvider component
 */
import SCRoutingProvider, {SCRoutingContext, useSCRouting} from './components/provider/SCRoutingProvider';

/**
 * LocaleProvider component
 */
import SCLocaleProvider, {SCLocaleContext, useSCLocale, withSCLocale} from './components/provider/SCLocaleProvider';

/**
 * NotificationProvider component
 */
import SCNotificationProvider, {SCNotificationContext, useSCNotification} from './components/provider/SCNotificationProvider';

/**
 * AlertMessagesProvider component
 */
import SCAlertMessagesProvider, {SCAlertMessagesContext, useSCAlertMessages} from './components/provider/SCAlertMessagesProvider';

/**
 * PreferencesProvider component
 */
import SCPreferencesProvider, {SCPreferencesContext, useSCPreferences} from './components/provider/SCPreferencesProvider';
import * as SCPreferences from './constants/Preferences';
import * as SCFeatures from './constants/Features';
import * as SCNotification from './constants/Notification';
import * as SCCache from './constants/Cache';

/**
 * Custom Hooks
 */
import useSCFetchUser from './hooks/useSCFetchUser';
import useSCFetchFeedObject from './hooks/useSCFetchFeedObject';
import useSCFetchCommentObject from './hooks/useSCFetchCommentObject';
import useSCFetchCommentObjects from './hooks/useSCFetchCommentObjects';
import useSCFetchCustomAdv from './hooks/useSCFetchCustomAdv';
import useSCFetchTag from './hooks/useSCFetchTag';
import useSCFetchAddressingTagList from './hooks/useSCFetchAddressingTagList';
import useSCFetchCategory from './hooks/useSCFetchCategory';
import useSCFetchCategories from './hooks/useSCFetchCategories';
import useSCFetchIncubator from './hooks/useSCFetchIncubator';
import useSCMediaClick from './hooks/useSCMediaClick';
import useSCFetchContributors from './hooks/useSCFetchContributors';
import useSCFetchFeed from './hooks/useSCFetchFeed';

/**
 * Routing component
 */
import Link from './components/router';
import * as SCRoutes from './constants/Routes';

/**
 * Utilities:
 * User, hooks (useIsComponentMountedRef)
 */
import * as UserUtils from './utils/user';
import useIsComponentMountedRef from './utils/hooks/useIsComponentMountedRef';

/**
 * Constants:
 * Locale
 */
import * as Locale from './constants/Locale';

/**
 * List all exports
 */
export {
  SCUserContextType,
  SCFollowedCategoriesManagerType,
  SCContextProviderType,
  SCContextType,
  SCSettingsType,
  SCSessionType,
  SCFollowedManagerType,
  SCConnectionsManagerType,
  SCSubscribedIncubatorsManagerType,
  SCLocaleType,
  SCNotificationContextType,
  SCPreferencesContextType,
  SCThemeContextType,
  SCRoutingContextType,
  SCLocaleContextType,
  SCAlertMessagesContextType,
  SCContext,
  SCUserContext,
  SCThemeContext,
  SCRoutingContext,
  SCLocaleContext,
  SCPreferencesContext,
  useSCContext,
  SCContextProvider,
  SCUserProvider,
  useSCUser,
  useSCPreferences,
  SCThemeProvider,
  useSCTheme,
  withSCTheme,
  SCRoutingProvider,
  useSCRouting,
  SCLocaleProvider,
  useSCLocale,
  withSCLocale,
  SCPreferencesProvider,
  SCPreferences,
  SCFeatures,
  SCNotification,
  SCNotificationProvider,
  SCNotificationContext,
  useSCNotification,
  SCAlertMessagesProvider,
  SCAlertMessagesContext,
  useSCAlertMessages,
  Link,
  SCRoutes,
  SCCache,
  UserUtils,
  Locale,
  useSCFetchUser,
  useSCFetchFeedObject,
  useSCFetchCommentObject,
  useSCFetchCommentObjects,
  useSCFetchCustomAdv,
  useSCFetchTag,
  useSCFetchAddressingTagList,
  useSCFetchCategory,
  useSCFetchCategories,
  useSCFetchIncubator,
  useSCMediaClick,
  useSCFetchContributors,
  useSCFetchFeed,
  useIsComponentMountedRef,
};
