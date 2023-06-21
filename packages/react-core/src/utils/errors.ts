import {DEFAULT_LANGUAGE_UI, LOCALES} from '../constants/Locale';
import * as Session from '../constants/Session';
import {Logger} from '@selfcommunity/utils';

/**
 * Manage Validation Error
 * Used to check the initial configurations
 */
export class ValidationError {
  static ERROR_INVALID_CONF = 3100;
  static ERROR_INVALID_SESSION = 4100;
  static ERROR_INVALID_SESSION_TYPE = 4101;
  static ERROR_INVALID_SESSION_AUTH_TOKEN = 4102;
  static ERROR_INVALID_SESSION_CLIENT_ID = 4103;
  static ERROR_INVALID_SESSION_REFRESH_TOKEN_CALLBACK = 4104;
  static ERROR_INVALID_SESSION_LOGOUT_CALLBACK = 4105;
  static ERROR_INVALID_PORTAL = 4200;
  static ERROR_INVALID_LOCALE = 4300;
  static ERROR_INVALID_TRANSLATIONS = 4400;
  static ERROR_INVALID_THEME = 4500;
  static ERROR_INVALID_ROUTER = 4600;
  static ERROR_INVALID_PROVIDERS = 4700;
  static ERROR_INVALID_HANDLE_ANONYMOUS_ACTION = 4800;
  static ERROR_INVALID_NOTIFICATIONS = 4900;
  static ERROR_INVALID_NOTIFICATIONS_WEBSOCKET = 4901;
  static ERROR_INVALID_NOTIFICATIONS_WEBSOCKET_DISABLE_TOAST_MESSAGE = 4902;
  static ERROR_INVALID_NOTIFICATIONS_WEBSOCKET_SECURE = 4903;
  static ERROR_INVALID_NOTIFICATIONS_WEB_PUSH_MESSAGING = 4921;
  static ERROR_INVALID_NOTIFICATIONS_WEB_PUSH_MESSAGING_DISABLE_TOAST_MESSAGE = 4922;
  static ERROR_INVALID_NOTIFICATIONS_WEB_PUSH_MESSAGING_APPLICATION_SERVER_KEY = 4923;
  static ERROR_INVALID_NOTIFICATIONS_MOBILE_PUSH_MESSAGING_DISABLE = 4924;
  static ERROR_INVALID_NOTIFICATIONS_MOBILE_NATIVE_PUSH_MESSAGING = 4931;
  static ERROR_INVALID_PREFERENCES = 5000;
  static ERROR_INVALID_GLOBAL_PREFERENCES = 5001;
  static ERROR_INVALID_PREFERENCES_FEATURES = 5002;
  static ERROR_INVALID_VOTE = 6000;
  static ERROR_INVALID_VOTE_REACTIONS = 6001;
  static ERROR_INVALID_VOTE_REACTIONS_STRUCTURE = 6002;
  static defaultErrorMessageMap = {
    [ValidationError.ERROR_INVALID_CONF]:
      'Invalid or missing library configuration. Check the configuration that is passed to the SCContextProvider.',
    [ValidationError.ERROR_INVALID_SESSION]: 'Invalid session format.',
    [ValidationError.ERROR_INVALID_SESSION_TYPE]: `Invalid sessionType. Available options are ${Session.sessionTypes.join(', ')}.`,
    [ValidationError.ERROR_INVALID_SESSION_AUTH_TOKEN]: 'Invalid auth token format',
    [ValidationError.ERROR_INVALID_SESSION_CLIENT_ID]: 'Invalid clientId in the initial configuration.',
    [ValidationError.ERROR_INVALID_SESSION_REFRESH_TOKEN_CALLBACK]: 'Invalid refresh token callback',
    [ValidationError.ERROR_INVALID_SESSION_LOGOUT_CALLBACK]: 'Invalid logout callback',
    [ValidationError.ERROR_INVALID_PORTAL]: `Invalid portal. Check if the url format is valid.`,
    [ValidationError.ERROR_INVALID_LOCALE]: `Invalid locale. Available options are ${LOCALES.join(', ')}.`,
    [ValidationError.ERROR_INVALID_TRANSLATIONS]: `Invalid locale messages(translations) options.`,
    [ValidationError.ERROR_INVALID_THEME]: 'Invalid theme options.',
    [ValidationError.ERROR_INVALID_ROUTER]: 'Invalid router configuration',
    [ValidationError.ERROR_INVALID_PROVIDERS]: `Invalid providers. Check if the list of providers is valid.`,
    [ValidationError.ERROR_INVALID_HANDLE_ANONYMOUS_ACTION]: 'Invalid handle anonymous action callback',
    [ValidationError.ERROR_INVALID_NOTIFICATIONS]: 'Invalid notifications conf.',
    [ValidationError.ERROR_INVALID_NOTIFICATIONS_WEBSOCKET]: 'Invalid notifications (websocket) option.',
    [ValidationError.ERROR_INVALID_NOTIFICATIONS_WEBSOCKET_DISABLE_TOAST_MESSAGE]:
      'Invalid notifications websocket conf: disableToastMessage must be a boolean value.',
    [ValidationError.ERROR_INVALID_NOTIFICATIONS_WEBSOCKET_SECURE]: 'Invalid notifications websocket conf: secure must be a boolean value.',
    [ValidationError.ERROR_INVALID_NOTIFICATIONS_WEB_PUSH_MESSAGING]: 'Invalid notifications (web push messaging) option.',
    [ValidationError.ERROR_INVALID_NOTIFICATIONS_WEB_PUSH_MESSAGING_DISABLE_TOAST_MESSAGE]:
      "Invalid notifications web push messaging option. 'disableToastMessage' must be a boolean value.",
    [ValidationError.ERROR_INVALID_NOTIFICATIONS_WEB_PUSH_MESSAGING_APPLICATION_SERVER_KEY]:
      "Invalid notifications web push messaging option. 'applicationServerKey' must be a string value.",
    [ValidationError.ERROR_INVALID_NOTIFICATIONS_MOBILE_NATIVE_PUSH_MESSAGING]: 'Invalid notifications (mobile native push messaging) option.',
    [ValidationError.ERROR_INVALID_NOTIFICATIONS_MOBILE_PUSH_MESSAGING_DISABLE]:
      "Invalid notifications mobile native push messaging option. 'disable' must be a boolean value.",
    [ValidationError.ERROR_INVALID_PREFERENCES]: 'Invalid preferences option.',
    [ValidationError.ERROR_INVALID_GLOBAL_PREFERENCES]:
      "Invalid preferences option. 'preferences' inside preferences must be a valid array of global preferences.",
    [ValidationError.ERROR_INVALID_PREFERENCES_FEATURES]: "Invalid preferences option. 'features' must be a valid array of features.",
    [ValidationError.ERROR_INVALID_VOTE]: 'Invalid vote option.',
    [ValidationError.ERROR_INVALID_VOTE_REACTIONS]: "Invalid vote option. 'reactions' must be a valid array of reaction objects.",
    [ValidationError.ERROR_INVALID_VOTE_REACTIONS_STRUCTURE]:
      "Invalid vote option. 'reactions' must be a valid array of reaction with attributes (id, label, sentiment, image, active).",
  };

  errorCode = null;
  errorData = null;
  errorMessage = null;

  constructor(errorCode, errorData, errorMessage = ValidationError.defaultErrorMessageMap[errorCode]) {
    this.errorCode = errorCode;
    this.errorData = errorData;
    this.errorMessage = errorMessage;
  }
}

/**
 * Manage Validation Warnings
 * Used to check the initial configurations
 */
export class ValidationWarnings {
  static WARNING_SESSION_REFRESH_TOKEN_CALLBACK_NOT_FOUND = 3100;
  static WARNING_LOCALE_FALLBACK = 3300;
  static WARNING_ROUTER_FALLBACK = 3500;
  static WARNING_HANDLE_ANONYMOUS_ACTION_FALLBACK = 3700;

  static defaultErrorMessageMap = {
    [ValidationWarnings.WARNING_SESSION_REFRESH_TOKEN_CALLBACK_NOT_FOUND]:
      "The 'handleRefreshToken' is not defined in initial conf. When the token expires it will not be renewed and the user session will be lost.",
    [ValidationWarnings.WARNING_LOCALE_FALLBACK]: `The 'locale' is not defined in initial conf, fallback to the default ${DEFAULT_LANGUAGE_UI}.`,
    [ValidationWarnings.WARNING_ROUTER_FALLBACK]: "The 'router' is not defined in initial conf, fallback to the default configurations.",
    [ValidationWarnings.WARNING_HANDLE_ANONYMOUS_ACTION_FALLBACK]:
      "The 'handleAnonymousAction' is not defined in initial conf, fallback to the default configurations.",
  };

  warningCode = null;
  warningData = null;
  warningMessage = null;

  constructor(warningCode, warningData, warningMessage = ValidationWarnings.defaultErrorMessageMap[warningCode]) {
    this.warningCode = warningCode;
    this.warningData = warningData;
    this.warningMessage = warningMessage;
  }
}

/**
 * /**
 * Manage Validation Error/Warnings
 * of the initial configuration
 */
export class ValidationResult {
  errors = [];
  warnings = [];
  scope = '';

  constructor(scope = '[Report Error]') {
    this.scope = scope;
  }

  /**
   * Add an error
   * @param errorCode
   * @param errorData
   */
  addError(errorCode, errorData) {
    this.errors.push(new ValidationError(errorCode, errorData));
    return this.errors;
  }

  /**
   * Add a warning
   * @param errorCode
   * @param errorData
   */
  addWarnings(warningCode, warningData) {
    this.warnings.push(new ValidationWarnings(warningCode, warningData));
    return this.errors;
  }

  /**
   * Check if contains errors
   */
  hasErrors() {
    return this.errors.length > 0;
  }

  /**
   * Check if contains warnings
   */
  hasWarnings() {
    return this.warnings.length > 0;
  }

  /**
   * Emit in console all the errors
   */
  emitErrors() {
    if (this.hasErrors()) {
      this.errors.map((e) => Logger.error(this.scope, e.errorMessage));
    }
  }

  /**
   * Emit in console all the warnings
   */
  emitWarnings() {
    if (this.hasWarnings()) {
      this.warnings.map((w) => Logger.warn(this.scope, w.warningMessage));
    }
  }

  /**
   * Emit in console errors/warnings
   */
  emit() {
    this.emitErrors();
    this.emitWarnings();
  }
}
