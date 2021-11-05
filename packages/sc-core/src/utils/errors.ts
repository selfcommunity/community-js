import {DEFAULT_LANGUAGE_UI, LOCALES} from '../constants/Locale';
import * as Session from '../constants/Session';

/**
 * Manage Validation Error
 * Used to check the initial configurations
 */
export class ValidationError {
  static ERROR_INVALID_SESSION = 4100;
  static ERROR_INVALID_SESSION_TYPE = 4101;
  static ERROR_INVALID_SESSION_AUTH_TOKEN = 4102;
  static ERROR_INVALID_SESSION_CLIENT_ID = 4103;
  static ERROR_INVALID_SESSION_REFRESH_TOKEN_CALLBACK = 4103;
  static ERROR_INVALID_PORTAL = 4203;
  static ERROR_INVALID_LOCALE = 4303;
  static ERROR_INVALID_THEME = 4403;
  static ERROR_INVALID_ROUTER = 4503;
  static defaultErrorMessageMap = {
    [ValidationError.ERROR_INVALID_SESSION]: 'Invalid session format.',
    [ValidationError.ERROR_INVALID_SESSION_TYPE]: `Invalid sessionType. Available options are ${Session.sessionTypes.join(', ')}.`,
    [ValidationError.ERROR_INVALID_SESSION_AUTH_TOKEN]: 'Invalid auth token format',
    [ValidationError.ERROR_INVALID_SESSION_CLIENT_ID]: 'Invalid clientId in the initial configuration.',
    [ValidationError.ERROR_INVALID_SESSION_REFRESH_TOKEN_CALLBACK]: 'Invalid refresh token callback',
    [ValidationError.ERROR_INVALID_PORTAL]: `Invalid portal. Check if the url format is valid.`,
    [ValidationError.ERROR_INVALID_LOCALE]: `Invalid locale. Available options are ${LOCALES.join(', ')}.`,
    [ValidationError.ERROR_INVALID_THEME]: 'Invalid theme options.',
    [ValidationError.ERROR_INVALID_ROUTER]: 'Invalid router configuration',
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
  static WARNING_LOCALE_FALLBACK = 3303;
  static WARNING_ROUTER_FALLBACK = 3500;

  static defaultErrorMessageMap = {
    [ValidationWarnings.WARNING_SESSION_REFRESH_TOKEN_CALLBACK_NOT_FOUND]:
      "The 'refreshTokenCallback' is not defined in initial conf. When the token expires it will not be renewed and the user session will be lost.",
    [ValidationWarnings.WARNING_LOCALE_FALLBACK]: `The 'locale' is not defined in initial conf, fallback to the default ${DEFAULT_LANGUAGE_UI}.`,
    [ValidationWarnings.WARNING_ROUTER_FALLBACK]: "The 'router' is not defined in initial conf, fallback to the default configurations.",
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
      this.errors.map((e) => console.error(`%c[${this.scope}]`, 'color:#008080', ` ${e.errorMessage}`));
    }
  }

  /**
   * Emit in console all the warnings
   */
  emitWarnings() {
    if (this.hasWarnings()) {
      this.warnings.map((w) => console.warn(`%c[${this.scope}]`, 'color:#008080', ` ${w.warningMessage}`));
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

/**
 * Check if v is a func
 * @param v
 */
export function isFunc(v) {
  return typeof v === 'function';
}
