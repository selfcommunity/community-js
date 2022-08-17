import React from 'react';
import * as Locale from '../constants/Locale';
import {isValidUrl, isObject, isString} from '@selfcommunity/utils';
import * as Session from '../constants/Session';
import {
  SCNotificationsType,
  SCNotificationsWebPushMessagingType,
  SCNotificationsWebSocketType,
  SCPreferencesContextType,
  SCSessionType,
  SCSettingsType,
} from '../types/context';
import {SCOPE_SC_CORE} from '../constants/Errors';
import {isFunc, ValidationError, ValidationResult, ValidationWarnings} from './errors';
import {SCLocaleType} from '../types';
import {DEFAULT_CONTEXT_PROVIDERS, CONTEXT_PROVIDERS_OPTION} from '../constants/ContextProviders';
import {Logger} from '@selfcommunity/utils';
import * as Notifications from '../constants/Notifications';
import * as Theme from '../constants/Theme';
import {PORTAL_OPTION, ROUTER_OPTION} from '../constants/Routes';
import * as Actions from '../constants/Actions';
import * as Preferences from '../constants/Preferences';
import * as Features from '../constants/Features';
import {DEFAULT_FEATURES_OPTION} from '../constants/Features';

/**
 * Validate session option
 * @param session
 * @return {}
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
 * @return {}
 */
export const validateSessionType = (value, session) => {
  const errors = [];
  const warnings = [];
  if (!session[Session.SESSION_TYPE_OPTION] || !Session.sessionTypes.includes(session[Session.SESSION_TYPE_OPTION])) {
    errors.push(ValidationError.ERROR_INVALID_SESSION_TYPE);
  }
  return {errors, warnings, value};
};

/**
 * Validate session client id
 * @param value
 * @return {}
 */
export const validateSessionClientId = (value, session) => {
  const errors = [];
  const warnings = [];
  if (
    session[Session.SESSION_TYPE_OPTION] &&
    (session[Session.SESSION_TYPE_OPTION] === Session.OAUTH_SESSION || session[Session.SESSION_TYPE_OPTION] === Session.OAUTH_SESSION)
  ) {
    if (
      session[Session.SESSION_TYPE_OPTION] === Session.OAUTH_SESSION &&
      (!session[Session.SESSION_CLIENT_ID_OPTION] || !isString(session[Session.SESSION_CLIENT_ID_OPTION]))
    ) {
      errors.push(ValidationError.ERROR_INVALID_SESSION_CLIENT_ID);
    }
  }
  return {errors, warnings, value};
};

/**
 * Validate session auth token
 * @param value
 * @return {}
 */
export const validateSessionAuthTokenOption = (value, session) => {
  const errors = [];
  const warnings = [];
  if (
    session[Session.SESSION_TYPE_OPTION] &&
    (session[Session.SESSION_TYPE_OPTION] === Session.OAUTH_SESSION || session[Session.SESSION_TYPE_OPTION] === Session.JWT_SESSION)
  ) {
    if (session[Session.SESSION_AUTH_TOKEN_OPTION] && !isObject(session[Session.SESSION_AUTH_TOKEN_OPTION])) {
      errors.push(ValidationError.ERROR_INVALID_SESSION_AUTH_TOKEN);
    }
  }
  return {errors, warnings, value};
};

/**
 * Validate handleRefreshToken option
 * @param value
 * @return {}
 */
export const validateHandleRefreshToken = (value, session) => {
  const errors = [];
  const warnings = [];
  if (
    session[Session.SESSION_TYPE_OPTION] &&
    (session[Session.SESSION_TYPE_OPTION] === Session.OAUTH_SESSION || session[Session.SESSION_TYPE_OPTION] === Session.JWT_SESSION)
  ) {
    if (session.authToken && !session.handleRefreshToken) {
      warnings.push(ValidationWarnings.WARNING_SESSION_REFRESH_TOKEN_CALLBACK_NOT_FOUND);
    }
    if (session.handleRefreshToken && !isFunc(session.handleRefreshToken)) {
      errors.push(ValidationError.ERROR_INVALID_SESSION_REFRESH_TOKEN_CALLBACK);
    }
  }
  return {errors, warnings, value};
};

/**
 * Validate notifications option
 * @param notifications
 * @return {}
 */
export function validateNotifications(v: SCNotificationsType) {
  const errors = [];
  const warnings = [];
  if (!v || !isObject(v)) {
    return {errors, warnings, value: Notifications.DEFAULT_NOTIFICATIONS};
  }
  const _options = Object.keys(notificationsOptions);
  const value: SCNotificationsType = Object.keys(v)
    .filter((key) => _options.includes(key))
    .reduce((obj: SCNotificationsType, key) => {
      const res = notificationsOptions[key].validator(v[key], v);
      res.errors.map((error) => errors.push(error));
      res.warnings.map((warning) => warnings.push(warning));
      obj[key] = res.value;
      return obj;
    }, {} as SCNotificationsType);
  return {errors, warnings, value: {...Notifications.DEFAULT_NOTIFICATIONS, ...v}};
}

/**
 * Validate webSocket
 * @param value
 * @param {}
 */
export const validateWebSocket = (v) => {
  const errors = [];
  const warnings = [];
  if (v && !isObject(v)) {
    errors.push(ValidationError.ERROR_INVALID_NOTIFICATIONS_WEBSOCKET);
    return {errors, warnings, v};
  }
  const _options = Object.keys(notificationsWebSocketOptions);
  const value: SCNotificationsWebSocketType = Object.keys(v)
    .filter((key) => _options.includes(key))
    .reduce((obj, key) => {
      const res = notificationsWebSocketOptions[key].validator(v[key], v);
      res.errors.map((error) => errors.push(error));
      res.warnings.map((warning) => warnings.push(warning));
      obj[key] = res.value;
      return obj;
    }, {} as SCNotificationsWebSocketType);
  return {errors, warnings, value};
};

/**
 * Validate default disableToastMessage (webSocket)
 * @param value
 * @param {}
 */
export const validateWebSocketDisableToastMessage = (value, notifications) => {
  const errors = [];
  const warnings = [];
  if (value) {
    if (!(typeof value === 'boolean')) {
      errors.push(ValidationError.ERROR_INVALID_NOTIFICATIONS_WEBSOCKET_DISABLE_TOAST_MESSAGE);
    }
  } else {
    return {
      errors,
      warnings,
      value:
        Notifications.DEFAULT_NOTIFICATIONS[Notifications.NOTIFICATIONS_WEB_SOCKET_OPTION][Notifications.NOTIFICATIONS_DISABLE_TOAST_MESSAGE_OPTION],
    };
  }
  return {errors, warnings, value};
};

/**
 * Validate webPushMessaging
 * @param value
 * @param {}
 */
export const validateWebPushMessaging = (v) => {
  const errors = [];
  const warnings = [];
  if (v && !isObject(v)) {
    errors.push(ValidationError.ERROR_INVALID_NOTIFICATIONS_WEB_PUSH_MESSAGING);
    return {errors, warnings, v};
  }
  const _options = Object.keys(notificationsWebSPushMessagingOptions);
  const value: SCNotificationsWebPushMessagingType = Object.keys(v)
    .filter((key) => _options.includes(key))
    .reduce((obj, key) => {
      const res = notificationsWebSPushMessagingOptions[key].validator(v[key], v);
      res.errors.map((error) => errors.push(error));
      res.warnings.map((warning) => warnings.push(warning));
      obj[key] = res.value;
      return obj;
    }, {} as SCNotificationsWebPushMessagingType);
  return {errors, warnings, value};
};

/**
 * Validate default disableToastMessage (webPushMessaging)
 * @param value
 * @param {}
 */
export const validateWebPushMessagingDisableToastMessage = (value, notifications) => {
  const errors = [];
  const warnings = [];
  if (value !== undefined) {
    if (!(typeof value === 'boolean')) {
      errors.push(ValidationError.ERROR_INVALID_NOTIFICATIONS_WEB_PUSH_MESSAGING_DISABLE_TOAST_MESSAGE);
    }
  } else {
    return {
      errors,
      warnings,
      value:
        Notifications.DEFAULT_NOTIFICATIONS[Notifications.NOTIFICATIONS_WEB_PUSH_MESSAGING_OPTION][
          Notifications.NOTIFICATIONS_DISABLE_TOAST_MESSAGE_OPTION
        ],
    };
  }
  return {errors, warnings, value};
};

/**
 * Validate default applicationServerKey (webPushMessaging)
 * @param value
 * @param {}
 */
export const validateWebPushMessagingApplicationServerKey = (value, notifications) => {
  const errors = [];
  const warnings = [];
  if (value) {
    if (!isString(value)) {
      errors.push(ValidationError.ERROR_INVALID_NOTIFICATIONS_WEB_PUSH_MESSAGING_APPLICATION_SERVER_KEY);
    }
  }
  return {errors, warnings, value};
};

/**
 * Validate portal option
 * @param portal
 * @return {}
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
 * @param {}
 */
export const validateLocaleDefault = (value, locale) => {
  const errors = [];
  const warnings = [];
  if (locale.default) {
    if (!isString(value) || (!locale[Locale.LOCALE_MESSAGES_OPTION] && !Locale.LOCALES.includes(value))) {
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
 * @param {}
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
 * @return {}
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
 * @return {}
 */
export const validateRouter = (value) => {
  const errors = [];
  const warnings = [];
  if (value) {
    if (!isObject(value)) {
      errors.push(ValidationError.ERROR_INVALID_ROUTER);
    } else {
      if ((value.routes && !isObject(value.routes)) || (value.handleRoute && !isFunc(value.handleRoute))) {
        errors.push(ValidationError.ERROR_INVALID_ROUTER);
      }
    }
  } else {
    warnings.push(ValidationWarnings.WARNING_ROUTER_FALLBACK);
  }
  return {errors, warnings, value};
};

/**
 * Validate theme option
 * @param theme
 * @return {}
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
 * Validate handleAnonymousAction option
 * @param handleAnonymousAction
 * @return {}
 */
export const validateHandleAnonymousAction = (v) => {
  const errors = [];
  const warnings = [];
  if (v) {
    if (!isFunc(v)) {
      errors.push(ValidationError.ERROR_INVALID_HANDLE_ANONYMOUS_ACTION);
    }
  } else {
    warnings.push(ValidationWarnings.WARNING_HANDLE_ANONYMOUS_ACTION_FALLBACK);
    return {
      errors,
      warnings,
      value: () => {
        Logger.info(SCOPE_SC_CORE, 'Attempting to perform an action that requires a logged user.');
      },
    };
  }
  return {errors, warnings, value: v};
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
 * Validate global preferences
 * @param value
 * @param preferences
 */
export const validateGlobalPreferences = (value, preferences) => {
  const errors = [];
  const warnings = [];
  if (preferences[Preferences.GLOBAL_PREFERENCES_OPTION]) {
    if (!isObject(value)) {
      errors.push(ValidationError.ERROR_INVALID_GLOBAL_PREFERENCES);
    } else {
      const isValidKeys = Object.keys(value).every((key) => /[a-zA-Z]+.[a-zA-Z]+/g.test(key));
      if (!isValidKeys) {
        errors.push(ValidationError.ERROR_INVALID_GLOBAL_PREFERENCES);
      }
    }
  }
  return {errors, warnings, value};
};

/**
 * Validate features
 * @param value
 * @param preferences
 */
export const validateFeatures = (value, preferences) => {
  const errors = [];
  const warnings = [];
  if (preferences[Features.FEATURES_OPTION]) {
    if (!Array.isArray(value)) {
      errors.push(ValidationError.ERROR_INVALID_PREFERENCES_FEATURES);
    }
  }
  return {errors, warnings, value};
};

/**
 * Validate preferences option
 * @param v
 */
export function validatePreferences(v: Record<string, any>) {
  const errors = [];
  const warnings = [];
  const defaultValue = {
    [Preferences.GLOBAL_PREFERENCES_OPTION]: Preferences.DEFAULT_GLOBAL_PREFERENCES_OPTION,
    [Features.FEATURES_OPTION]: Features.DEFAULT_FEATURES_OPTION,
  };
  if (v) {
    if (!isObject(v)) {
      errors.push(ValidationError.ERROR_INVALID_PREFERENCES);
      return {errors, warnings, value: v};
    } else {
      const _options = Object.keys(preferencesOptions);
      const value: SCPreferencesContextType = Object.keys(v)
        .filter((key) => _options.includes(key))
        .reduce((obj, key) => {
          const res = preferencesOptions[key].validator(v[key], v);
          res.errors.map((error) => errors.push(error));
          res.warnings.map((warning) => warnings.push(warning));
          obj[key] = res.value;
          return obj;
        }, {} as SCPreferencesContextType);
      return {errors, warnings, value: {...defaultValue, ...value}};
    }
  }
  return {errors, warnings, value: defaultValue};
}

/**
 * Components Widget
 */
const PortalOption = {
  name: PORTAL_OPTION,
  validator: validatePortal,
};
const LocaleOption = {
  name: Locale.LOCALE_OPTION,
  validator: validateLocale,
};
const ThemeOption = {
  name: Theme.THEME_OPTION,
  validator: validateTheme,
};
const RouterOption = {
  name: ROUTER_OPTION,
  validator: validateRouter,
};
const NotificationsOption = {
  name: Notifications.NOTIFICATIONS_OPTION,
  validator: validateNotifications,
};
const SessionOption = {
  name: Session.SESSION_OPTION,
  validator: validateSession,
};
const HandleAnonymousActionOption = {
  name: Actions.HANDLE_ANONYMOUS_ACTION_OPTION,
  validator: validateHandleAnonymousAction,
};
const ContextProvidersOption = {
  name: CONTEXT_PROVIDERS_OPTION,
  validator: validateContextProviders,
};
const PreferencesOption = {
  name: Preferences.PREFERENCES_OPTION,
  validator: validatePreferences,
};

/**
 * Session options
 */
const SessionTypeOption = {
  name: Session.SESSION_TYPE_OPTION,
  validator: validateSessionType,
};
const SessionClientIdOption = {
  name: Session.SESSION_CLIENT_ID_OPTION,
  validator: validateSessionClientId,
};
const SessionAuthTokenOption = {
  name: Session.SESSION_AUTH_TOKEN_OPTION,
  validator: validateSessionAuthTokenOption,
};
const SessionHandleRefreshTokenOption = {
  name: Session.SESSION_HANDLE_REFRESH_TOKEN_OPTION,
  validator: validateHandleRefreshToken,
};
const LocaleDefaultOption = {
  name: Locale.LOCALE_DEFAULT_OPTION,
  validator: validateLocaleDefault,
};
const LocaleMessagesOption = {
  name: Locale.LOCALE_MESSAGES_OPTION,
  validator: validateLocaleMessages,
};
const GlobalPreferencesOption = {
  name: Preferences.GLOBAL_PREFERENCES_OPTION,
  validator: validateGlobalPreferences,
};
const FeaturesOption = {
  name: Features.FEATURES_OPTION,
  validator: validateFeatures,
};
const NotificationsWebSocketOption = {
  name: Notifications.NOTIFICATIONS_WEB_SOCKET_OPTION,
  validator: validateWebSocket,
};
const NotificationsWebPushMessagingOption = {
  name: Notifications.NOTIFICATIONS_WEB_PUSH_MESSAGING_OPTION,
  validator: validateWebPushMessaging,
};
const NotificationsWebSocketDisableToastMessageOption = {
  name: Notifications.NOTIFICATIONS_DISABLE_TOAST_MESSAGE_OPTION,
  validator: validateWebSocketDisableToastMessage,
};
const NotificationsWebPushMessagingDisableToastMessageOption = {
  name: Notifications.NOTIFICATIONS_DISABLE_TOAST_MESSAGE_OPTION,
  validator: validateWebPushMessagingDisableToastMessage,
};
const NotificationsWebPushMessagingApplicationServerKeyOption = {
  name: Notifications.NOTIFICATIONS_APPLICATION_SERVER_KEY_OPTION,
  validator: validateWebPushMessagingApplicationServerKey,
};

/**
 * Valid options
 * @type {{}}
 */
export const settingsOptions: Record<string, any> = {
  [PortalOption.name]: PortalOption,
  [LocaleOption.name]: LocaleOption,
  [ThemeOption.name]: ThemeOption,
  [NotificationsOption.name]: NotificationsOption,
  [RouterOption.name]: RouterOption,
  [SessionOption.name]: SessionOption,
  [HandleAnonymousActionOption.name]: HandleAnonymousActionOption,
  [ContextProvidersOption.name]: ContextProvidersOption,
  [PreferencesOption.name]: PreferencesOption,
};
export const sessionOptions: Record<string, any> = {
  [SessionTypeOption.name]: SessionTypeOption,
  [SessionClientIdOption.name]: SessionClientIdOption,
  [SessionAuthTokenOption.name]: SessionAuthTokenOption,
  [SessionHandleRefreshTokenOption.name]: SessionHandleRefreshTokenOption,
};
export const localeOptions: Record<string, any> = {
  [LocaleDefaultOption.name]: LocaleDefaultOption,
  [LocaleMessagesOption.name]: LocaleMessagesOption,
};
export const notificationsOptions: Record<string, any> = {
  [NotificationsWebSocketOption.name]: NotificationsWebSocketOption,
  [NotificationsWebPushMessagingOption.name]: NotificationsWebPushMessagingOption,
};
export const notificationsWebSocketOptions: Record<string, any> = {
  [NotificationsWebSocketDisableToastMessageOption.name]: NotificationsWebSocketDisableToastMessageOption,
};
export const notificationsWebSPushMessagingOptions: Record<string, any> = {
  [NotificationsWebPushMessagingDisableToastMessageOption.name]: NotificationsWebPushMessagingDisableToastMessageOption,
  [NotificationsWebPushMessagingApplicationServerKeyOption.name]: NotificationsWebPushMessagingApplicationServerKeyOption,
};
export const preferencesOptions: Record<string, any> = {
  [GlobalPreferencesOption.name]: GlobalPreferencesOption,
  [FeaturesOption.name]: FeaturesOption,
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
