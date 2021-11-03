/**
 * Types
 */
import {
  SCContextType,
  SCAuthContextType,
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
import SCContextProvider, {SCContext} from './components/provider/SCContextProvider';

/**
 * AuthProvider component
 */
import SCAuthProvider, {SCAuthContext} from './components/provider/SCAuthProvider';

/**
 * ThemeProvider component
 */
import SCThemeProvider, {withSCTheme} from './components/provider/SCThemeProvider';

/**
 * RoutingProvider component
 */
import SCRoutingProvider, {SCRoutingContext} from './components/provider/SCRoutingProvider';

/**
 * AuthStateProvider component
 */
import * as SCPreferences from './constants/Preferences';

/**
 * Routing component
 */
import Link from './components/router';
import {url} from './utils/url';

/**
 * Http component
 */
import http from './utils/http';

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
  SCAuthContextType,
  SCUserType,
  SCContext,
  SCAuthContext,
  SCContextProvider,
  SCAuthProvider,
  SCThemeProvider,
  SCThemeContextType,
  withSCTheme,
  SCRoutingProvider,
  SCRoutingContext,
  SCRoutingContextType,
  SCPreferences,
  http,
  Link,
  url,
  Endpoints,
};
