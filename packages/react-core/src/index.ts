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
  SCFollowersManagerType,
  SCSettingsManagerType,
  SCConnectionsManagerType,
  SCSubscribedIncubatorsManagerType,
  SCLocaleType,
  SCNotificationContextType,
  SCPreferencesContextType,
  SCThemeContextType,
  SCRoutingContextType,
  SCLocaleContextType,
  SCAlertMessagesContextType,
  SCThemeAvatarVariableType,
  SCThemeCategoryIconVariableType,
  SCThemeCategoryVariableType,
  SCThemeVariablesType,
  SCThemeType,
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
import useSCFetchUserProviders from './hooks/useSCFetchUserProviders';
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
import useSCFetchReactions from './hooks/useSCFetchReactions';

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
import {useIsComponentMountedRef, usePreviousValue, useIsomorphicLayoutEffect, useEffectOnce, useNoInitialEffect} from './utils/hooks';

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
  SCSettingsManagerType,
  SCFollowedManagerType,
  SCFollowersManagerType,
  SCConnectionsManagerType,
  SCSubscribedIncubatorsManagerType,
  SCLocaleType,
  SCNotificationContextType,
  SCPreferencesContextType,
  SCThemeContextType,
  SCRoutingContextType,
  SCLocaleContextType,
  SCAlertMessagesContextType,
  SCThemeAvatarVariableType,
  SCThemeCategoryIconVariableType,
  SCThemeCategoryVariableType,
  SCThemeVariablesType,
  SCThemeType,
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
  useSCFetchUserProviders,
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
  usePreviousValue,
  useIsomorphicLayoutEffect,
  useEffectOnce,
  useNoInitialEffect,
  useSCFetchReactions,
};
