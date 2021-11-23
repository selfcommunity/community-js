/**
 * Types
 */
import {
  SCContextType,
  SCAuthTokenType,
  SCUserContextType,
  SCContextProviderType,
  SCSettingsType,
  SCSessionType,
  SCThemeContextType,
  SCRoutingContextType,
  SCLocaleContextType,
  SCPreferencesContextType,
  SCUserType,
  SCTagType,
  SCEmbedType,
  SCMediaType,
  SCContributeLocation,
  SCLocalityType,
  SCPollChoiceType,
  SCPollType,
  SCFeedUnitType,
  SCFeedUnitActivityType,
  SCFeedObjectType,
  SCFeedPostType,
  SCFeedDiscussionType,
  SCFeedStatusType,
  SCFeedObjectTypologyType,
  SCFeedUnitActivityTypologyType,
  SCCommentType,
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
 * PreferencesProvider component
 */
import SCPreferencesProvider, {SCPreferencesContext} from './components/provider/SCPreferencesProvider';
import * as SCPreferences from './constants/Preferences';

/**
 * Custom Hooks
 */
import useSCFetchUser from './hooks/useSCFetchUser';
import useSCFetchFeedObject from './hooks/useSCFetchFeedObject';
import useSCFetchCommentObject from './hooks/useSCFetchCommentObject';
import useSCFetchTag from './hooks/useSCFetchTag';
import useSCFetchCategory from './hooks/useSCFetchCategory';

/**
 * Routing component
 */
import Link from './components/router';

/**
 * Http component
 */
import http, {formatHttpError} from './utils/http';

/**
 * Endpoint component
 */
import Endpoints from './constants/Endpoints';

/**
 * Utilities:
 * logger, string, url, object
 */
import {Logger} from './utils/logger';
import * as StringUtils from './utils/string';
import * as ObjectUtils from './utils/object';
import * as UrlUtils from './utils/url';

/**
 * Constants:
 * Locale
 */
import * as Locale from './constants/Locale';

/**
 * List all exports
 */
export {
  SCContextProviderType,
  SCSettingsType,
  SCAuthTokenType,
  SCSessionType,
  SCContextType,
  SCUserContextType,
  SCThemeContextType,
  SCRoutingContextType,
  SCLocaleContextType,
  SCPreferencesContextType,
  SCUserType,
  SCTagType,
  SCEmbedType,
  SCMediaType,
  SCContributeLocation,
  SCLocalityType,
  SCPollChoiceType,
  SCPollType,
  SCFeedUnitType,
  SCFeedUnitActivityType,
  SCFeedObjectType,
  SCFeedPostType,
  SCFeedDiscussionType,
  SCFeedStatusType,
  SCFeedObjectTypologyType,
  SCFeedUnitActivityTypologyType,
  SCCommentType,
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
  http,
  formatHttpError,
  Link,
  Endpoints,
  Logger,
  StringUtils,
  ObjectUtils,
  UrlUtils,
  Locale,
  useSCFetchUser,
  useSCFetchFeedObject,
  useSCFetchCommentObject,
  useSCFetchTag,
  useSCFetchCategory,
};
