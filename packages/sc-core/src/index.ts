/**
 * Types
 */
import {
  SCContextType,
  SCUserContextType,
  SCUserType,
  SCContextProviderType,
  SCTagType,
  SCSettingsType,
  SCSessionType,
  SCThemeContextType,
  SCRoutingContextType,
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
import SCThemeProvider, {SCThemeContext, useSCTheme} from './components/provider/SCThemeProvider';

/**
 * RoutingProvider component
 */
import SCRoutingProvider, {SCRoutingContext, useSCRouting} from './components/provider/SCRoutingProvider';

/**
 * LocaleProvider component
 */
import SCLocaleProvider, {SCLocaleContext} from './components/provider/SCLocaleProvider';

/**
 * AuthStateProvider component
 */
import * as SCPreferences from './constants/Preferences';

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
 * List all exports
 */
export {
  SCContextProviderType,
  SCTagType,
  SCSettingsType,
  SCSessionType,
  SCContextType,
  SCUserContextType,
  SCThemeContextType,
  SCRoutingContextType,
  SCUserType,
  SCContext,
  SCUserContext,
  SCThemeContext,
  SCRoutingContext,
  SCLocaleContext,
  useSCContext,
  SCContextProvider,
  SCUserProvider,
  useSCUser,
  SCThemeProvider,
  useSCTheme,
  SCRoutingProvider,
  useSCRouting,
  SCLocaleProvider,
  SCPreferences,
  http,
  formatHttpError,
  Link,
  Endpoints,
};
