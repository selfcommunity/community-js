/**
 * Types
 */
import {
  SCContextType,
  SCAuthTokenType,
  SCUserContextType,
  SCUserType,
  SCContextProviderType,
  SCTagType,
  SCSettingsType,
  SCSessionType,
  SCThemeContextType,
  SCRoutingContextType,
  SCLocaleContextType,
  SCPreferencesContextType,
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
 * Routing component
 */
import Link from './components/router';

/**
 * Http component
 */
import http from './utils/http';

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
  SCTagType,
  SCSettingsType,
  SCAuthTokenType,
  SCSessionType,
  SCContextType,
  SCUserContextType,
  SCThemeContextType,
  SCRoutingContextType,
  SCLocaleContextType,
  SCUserType,
  SCPreferencesContextType,
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
  Link,
  Endpoints,
  Logger,
  StringUtils,
  ObjectUtils,
  UrlUtils,
  Locale,
};
