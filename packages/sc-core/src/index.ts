/* eslint-disable global-require */

/**
 * ContextStateProvider component
 */
import {SCContext, SCContextType} from './components/provider/SCContextProvider';
import SCContextProvider from './components/provider/SCContextProvider';

/**
 * AuthStateProvider component
 */
import {SCAuthContext, SCAuthContextType, SCUserType} from './components/provider/SCAuthProvider';
import SCAuthProvider from './components/provider/SCAuthProvider';

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
export {SCContextProvider, SCContext, SCContextType, SCAuthProvider, SCAuthContext, SCAuthContextType, SCUserType, SCPreferences, http, Endpoints};
