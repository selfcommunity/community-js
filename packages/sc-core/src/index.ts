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
} from './types';

/**
 * ContextStateProvider component
 */
import SCContextProvider, {SCContext} from './components/provider/SCContextProvider';

/**
 * AuthStateProvider component
 */
import SCAuthProvider, {SCAuthContext} from './components/provider/SCAuthProvider';

/**
 * AuthStateProvider component
 */
import SCThemeProvider, {withSCTheme} from './components/provider/SCThemeProvider';

/**
 * AuthStateProvider component
 */
import * as SCPreferences from './constants/Preferences';

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
  SCPreferences,
  http,
  Endpoints,
};
