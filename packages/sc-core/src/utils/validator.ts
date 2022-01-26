import {LOCALES} from '../constants/Locale';
import {isValidUrl} from './url';
import * as Session from '../constants/Session';
import {
  SCLocaleProvider,
  SCPreferencesProvider,
  SCRoutingProvider,
  SCSessionType,
  SCSettingsType,
  SCThemeProvider,
  SCUserProvider,
} from '@selfcommunity/core';
import {SCOPE_SC_CORE} from '../constants/Errors';
import {isFunc, ValidationError, ValidationResult, ValidationWarnings} from './errors';
import {isObject} from './object';
import {isString} from './string';
import {SCLocaleType} from '../types';
import SCNotificationProvider from '../components/provider/SCNotificationProvider';
import {DEFAULT_CONTEXT_PROVIDERS} from '../constants/ContextProviders';

/**
 * Validate session option
 * @param session
 * @return {session}
 */
export function validateSession(v: Record<string, any>) {
  const errors = [];
  const warnings = [];
  if (!v || !isObject(v)) {
    errors.push(ValidationError.ERROR_INVALID_SESSION);
    return {errors, warnings, value: v};
  }
  const _options = Object.keys(sessionOptions);
  const value: SCSessionType = Object.keys(v)
    .filter((key) => _options.includes(key))
    .reduce((obj, key) => {
      const res = sessionOptions[key].validator(v[key], v);
      res.errors.map((error) => errors.push(error));
      res.warnings.map((warning) => warnings.push(warning));
      obj[key] = res.value;
      return obj;
    }, {} as SCSessionType);
  return {errors, warnings, value};
}

/**
 * Validate session type
 * @param value
 */
export const validateSessionType = (value, session) => {
  const errors = [];
  const warnings = [];
  if (!session.type || !Session.sessionTypes.includes(session.type)) {
    errors.push(ValidationError.ERROR_INVALID_SESSION_TYPE);
  }
  return {errors, warnings, value};
};

/**
 * Validate session client id
 * @param value
 */
export const validateSessionClientId = (value, session) => {
  const errors = [];
  const warnings = [];
  if (session.type && (session.type === Session.OAUTH_SESSION || session.type === Session.OAUTH_SESSION)) {
    if (session.type === Session.OAUTH_SESSION && (!session.clientId || !isString(session.clientId))) {
      errors.push(ValidationError.ERROR_INVALID_SESSION_CLIENT_ID);
    }
  }
  return {errors, warnings, value};
};

/**
 * Validate session auth token
 * @param value
 */
export const validateSessionAuthTokenOption = (value, session) => {
  const errors = [];
  const warnings = [];
  if (session.type && (session.type === Session.OAUTH_SESSION || session.type === Session.JWT_SESSION)) {
    if (!session.authToken || !isObject(session.authToken)) {
      errors.push(ValidationError.ERROR_INVALID_SESSION_AUTH_TOKEN);
    }
  }
  return {errors, warnings, value};
};

export const validateRefreshTokenCallback = (value, session) => {
  const errors = [];
  const warnings = [];
  if (session.type && (session.type === Session.OAUTH_SESSION || session.type === Session.JWT_SESSION)) {
    if (!session.refreshTokenCallback) {
      warnings.push(ValidationWarnings.WARNING_SESSION_REFRESH_TOKEN_CALLBACK_NOT_FOUND);
    }
    if (session.refreshTokenCallback && !isFunc(session.refreshTokenCallback)) {
      errors.push(ValidationError.ERROR_INVALID_SESSION_REFRESH_TOKEN_CALLBACK);
    }
  }
  return {errors, warnings, value};
};

/**
 * Validate portal option
 * @param portal
 * @return {portal}
 */
export const validatePortal = (value) => {
  const errors = [];
  const warnings = [];
  if (!value || !isString(value) || !isValidUrl(value)) {
    errors.push(ValidationError.ERROR_INVALID_PORTAL);
  }
  return {errors, warnings, value};
};

/**
 * Validate default locale
 * @param value
 * @param locale
 */
export const validateLocaleDefault = (value, locale) => {
  const errors = [];
  const warnings = [];
  if (locale.default) {
    if (!isString(value) || (!locale.messages && !LOCALES.includes(value))) {
      errors.push(ValidationError.ERROR_INVALID_LOCALE);
    }
  } else {
    warnings.push(ValidationWarnings.WARNING_LOCALE_FALLBACK);
  }
  return {errors, warnings, value};
};

/**
 * Validate default locale
 * @param value
 * @param locale
 */
export const validateLocaleMessages = (value) => {
  const errors = [];
  const warnings = [];
  if (value.messages && !isObject(value.messages)) {
    errors.push(ValidationError.ERROR_INVALID_TRANSLATIONS);
  }
  return {errors, warnings, value};
};

/**
 * Validate locale option
 * @param locale
 * @return {locale}
 */
export const validateLocale = (v) => {
  const errors = [];
  const warnings = [];
  if (!v || !isObject(v) || (isObject(v) && !v.messages && !v.default)) {
    warnings.push(ValidationWarnings.WARNING_LOCALE_FALLBACK);
    return {errors, warnings, v};
  }
  const _options = Object.keys(localeOptions);
  const value: SCLocaleType = Object.keys(v)
    .filter((key) => _options.includes(key))
    .reduce((obj, key) => {
      const res = localeOptions[key].validator(v[key], v);
      res.errors.map((error) => errors.push(error));
      res.warnings.map((warning) => warnings.push(warning));
      obj[key] = res.value;
      return obj;
    }, {} as SCLocaleType);
  return {errors, warnings, value};
};

/**
 * Validate router option
 * @param router
 * @return {boolean}
 */
export const validateRouter = (value) => {
  const errors = [];
  const warnings = [];
  if (value && !isObject(value)) {
    errors.push(ValidationError.ERROR_INVALID_ROUTER);
  } else {
    warnings.push(ValidationWarnings.WARNING_ROUTER_FALLBACK);
  }
  return {errors, warnings, value};
};

/**
 * Validate theme option
 * @param theme
 * @return {boolean}
 */
export const validateTheme = (value) => {
  const errors = [];
  const warnings = [];
  if (value && !isObject(value)) {
    errors.push(ValidationError.ERROR_INVALID_THEME);
  }
  return {errors, warnings, value};
};

/**
 * Validate contextProviders option
 * @param contextProviders
 * @return [...contextProviders]
 */
export const validateContextProviders = (value) => {
  const errors = [];
  const warnings = [];
  if (value) {
    if (!Array.isArray(value)) {
      errors.push(ValidationError.ERROR_INVALID_PROVIDERS);
    } else {
      const _providers = value.filter((c) => !DEFAULT_CONTEXT_PROVIDERS.includes(c));
      if (_providers.length > 0) {
        errors.push(ValidationError.ERROR_INVALID_PROVIDERS);
      }
    }
  } else {
    return {errors, warnings, value: DEFAULT_CONTEXT_PROVIDERS};
  }
  return {errors, warnings, value};
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
const SessionOption = {
  name: 'session',
  validator: validateSession,
};
const ContextProvidersOption = {
  name: 'contextProviders',
  validator: validateContextProviders,
};

/**
 * Session options
 */
const SessionTypeOption = {
  name: 'type',
  validator: validateSessionType,
};
const SessionClientIdOption = {
  name: 'clientId',
  validator: validateSessionClientId,
};
const SessionAuthTokenOption = {
  name: 'authToken',
  validator: validateSessionAuthTokenOption,
};
const SessionRefreshTokenCallbackOption = {
  name: 'refreshTokenCallback',
  validator: validateRefreshTokenCallback,
};
const LocaleDefaultOption = {
  name: 'default',
  validator: validateLocaleDefault,
};
const LocaleMessagesOption = {
  name: 'messages',
  validator: validateLocaleMessages,
};

/**
 * Valid options
 * @type {{}}
 */
export const settingsOptions: Record<string, any> = {
  [PortalOption.name]: PortalOption,
  [LocaleOption.name]: LocaleOption,
  [ThemeOption.name]: ThemeOption,
  [RouterOption.name]: RouterOption,
  [SessionOption.name]: SessionOption,
  [ContextProvidersOption.name]: ContextProvidersOption,
};
export const sessionOptions: Record<string, any> = {
  [SessionTypeOption.name]: SessionTypeOption,
  [SessionClientIdOption.name]: SessionClientIdOption,
  [SessionAuthTokenOption.name]: SessionAuthTokenOption,
  [SessionRefreshTokenCallbackOption.name]: SessionRefreshTokenCallbackOption,
};
export const localeOptions: Record<string, any> = {
  [LocaleDefaultOption.name]: LocaleDefaultOption,
  [LocaleMessagesOption.name]: LocaleMessagesOption,
};

export const validOptions = {
  ...settingsOptions,
};

/**
 * Validate all options by type
 * @param options
 * @return {options hydrated}
 */
export const validateOptions = (values: SCSettingsType, schemaOptions: Record<string, any>) => {
  const validationResult = new ValidationResult(SCOPE_SC_CORE);
  if (!values) {
    validationResult.addError(ValidationError.ERROR_INVALID_CONF, values);
    return {validationResult, values};
  }
  const _options = Object.keys(schemaOptions);
  const _data = {
    ...values,
    ...Object.keys(schemaOptions).reduce((obj, key) => {
      obj[key] = null;
      return obj;
    }, {}),
  };
  const settings: SCSettingsType = Object.keys(_data)
    .filter((key) => _options.includes(key))
    .reduce((obj, key) => {
      const res: {errors: ValidationError[]; warnings: ValidationWarnings[]; value: any} = schemaOptions[key].validator(values[key]);
      res.errors.map((error: ValidationError) => validationResult.addError(error, res.value));
      res.warnings.map((warning) => validationResult.addWarnings(warning, res.value));
      obj[key] = res.value;
      return obj;
    }, {} as SCSettingsType);
  return {validationResult, settings};
};
