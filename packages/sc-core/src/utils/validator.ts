import t, {addCustomTypes} from 'typy';
import {LOCALES} from '../constants/I18n';
import {isValidUrl} from './url';
import {sessionTypes} from '../constants/Session';
// import {routerSchema, tokenSchema} from '../constants/SchemaValidators';
import {
  InvalidLocaleError,
  InvalidPortalError,
  InvalidPreferencesError,
  InvalidRefreshTokenEndpointError,
  InvalidRouterError,
  InvalidSessionError,
  InvalidThemeError,
  InvalidTokenError,
} from './errors';

/**
 * Add to t CustomTypes before use in validator
 */
addCustomTypes({
  isRouter: (router) => {
    const history = router.history;
    const routes = router.routes;
    return (
      // t(router, routerSchema).isValid ||
      t(history).isBoolean &&
      history !== undefined &&
      t(routes).isObject &&
      (!routes.notification || (routes.notification && t(routes.notification).isString)) &&
      (!routes.post || (routes.post && t(routes.post).isString)) &&
      (!routes.discussion || (routes.discussion && t(routes.discussion).isString)) &&
      (!routes.profile || (routes.profile && t(routes.profile).isString)) &&
      (!routes.home || (routes.home && t(routes.home).isString))
    );
  },
  isToken: (token) => /* t(token, tokenSchema).isValid || */ token.access_token && t(token.access_token).isString,
  isRefreshTokenEndpoint: (endpoint) => {
    const httpMethod = ['GET', 'POST', 'PUT', 'PATCH'];
    return (
      endpoint['path'] &&
      t(endpoint.path).isString &&
      endpoint['method'] &&
      t(endpoint.path).isString &&
      httpMethod.includes(endpoint.method) &&
      (!endpoint['extra_data'] || (endpoint['extra_data'] && (t(endpoint.extra_data).isObject || t(endpoint.extra_data).isEmptyObject)))
    );
  },
});

/**
 * Validate session option
 * @param session
 * @return {session}
 */
export function validateSession(sessionType) {
  if (t(sessionType).isString && sessionTypes.includes(sessionType)) {
    return sessionType;
  }
  throw new InvalidSessionError();
}

/**
 * Validate token option
 * @param token
 * @return {token}
 */
export const validateToken = (token) => {
  if (t(token)['isToken']) {
    return token;
  }
  throw new InvalidTokenError();
};

/**
 * Validate portal option
 * @param portal
 * @return {portal}
 */
export const validatePortal = (portal) => {
  if (t(portal).isString && isValidUrl(portal)) {
    return portal;
  }
  throw new InvalidPortalError(portal);
};

/**
 * Validate locale option
 * @param locale
 * @return {locale}
 */
export const validateLocale = (locale) => {
  if (t(locale).isString && LOCALES.includes(locale)) {
    return locale;
  }
  throw new InvalidLocaleError(locale);
};

/**
 * Validate router option
 * @param router
 * @return {boolean}
 */
export const validateRouter = (router) => {
  if (t(router)['isRouter']) {
    return router;
  }
  throw new InvalidRouterError();
};

/**
 * Validate theme option
 * @param theme
 * @return {boolean}
 */
export const validateTheme = (theme) => {
  if (t(theme).isObject) {
    return theme;
  }
  throw new InvalidThemeError();
};

/**
 * Validate preferences option
 * @param preferences
 * @return {boolean}
 */
export const validatePreferences = (preferences) => {
  if (t(preferences).isObject) {
    return preferences;
  }
  throw new InvalidPreferencesError();
};

/**
 * Validate portal option
 * @param portal
 * @return {portal}
 */
export const validateRefreshTokenEndpoint = (endpoint) => {
  if (t(endpoint)['isRefreshTokenEndpoint']) {
    return endpoint;
  }
  throw new InvalidRefreshTokenEndpointError();
};

/**
 * Components Widget
 */
const PortalOption = {
  name: 'portal',
  validator: validatePortal,
};
const LocaleOption = {
  name: 'locale',
  validator: validateLocale,
};
const ThemeOption = {
  name: 'theme',
  validator: validateTheme,
};
const RouterOption = {
  name: 'router',
  validator: validateRouter,
};
const TokenOption = {
  name: 'token',
  validator: validateToken,
};
const SessionOption = {
  name: 'sessionType',
  validator: validateSession,
};
const RefreshTokenEndpointOption = {
  name: 'refreshTokenEndpoint',
  validator: validateRefreshTokenEndpoint,
};
const PreferencesOption = {
  name: 'preferences',
  validator: validatePreferences,
};

/**
 * Valid options
 * @type {{}}
 */
export const settingsOptions = {
  [PortalOption.name]: PortalOption,
  [LocaleOption.name]: LocaleOption,
  [ThemeOption.name]: ThemeOption,
  [RouterOption.name]: RouterOption,
  [PreferencesOption.name]: PreferencesOption,
};

export const sessionOptions = {
  [TokenOption.name]: TokenOption,
  [SessionOption.name]: SessionOption,
  [RefreshTokenEndpointOption.name]: RefreshTokenEndpointOption,
};

export const validOptions = {
  ...settingsOptions,
  ...sessionOptions,
};

/**
 * Validate all options by type before populate the store
 * @param options
 * @return {options hydrated}
 */
export const validateOptions = (values, options) => {
  const _options = Object.keys(options);
  return Object.keys(values)
    .filter((key) => _options.includes(key))
    .reduce((obj, key) => {
      obj[key] = options[key].validator(values[key]);
      return obj;
    }, {});
};
