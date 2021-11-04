import {LOCALES} from '../constants/Locale';
import {sessionTypes} from '../constants/Session';

/**
 * Errors types
 */
const _InitializationErrorType = 'InitializationError';
const _ValidationErrorType = 'ValidationError';

/**
 * General ValidationError
 */
const InitializationError = class extends Error {
  constructor() {
    super('Initialization error. The library must first be initialized by calling the init.');
    this.name = _InitializationErrorType;
  }
};

/**
 * General ValidationError
 */
const ValidationError = class extends Error {
  constructor(message) {
    super(message ? message : 'Validation error. Invalid value for a parameter.');
    this.name = _ValidationErrorType;
  }
};

/**
 * InvalidPortalError
 */
const InvalidPortalError = class extends ValidationError {
  constructor(portal) {
    super(`Invalid portal '${portal}'. Check if the url format is valid.`);
  }
};

/**
 * InvalidTokenError
 */
const InvalidTokenError = class extends ValidationError {
  constructor() {
    super(`Invalid token.`);
  }
};

/**
 * InvalidSessionError
 */
const InvalidSessionError = class extends ValidationError {
  constructor() {
    super(`Invalid sessionType. Available options are ${sessionTypes.join(', ')}.`);
  }
};

/**
 * InvalidLocaleError
 */
const InvalidLocaleError = class extends ValidationError {
  constructor(locale) {
    super(`Invalid locale '${locale}'. Available options are ${LOCALES.join(', ')}.`);
  }
};

/**
 * InvalidRouterError
 */
const InvalidRouterError = class extends ValidationError {
  constructor() {
    super(`Invalid router options. It must be a dict in this format {history: true|false, routes: {...}}`);
  }
};

/**
 * InvalidThemeError
 */
const InvalidThemeError = class extends ValidationError {
  constructor() {
    super(`Invalid theme options.`);
  }
};

/**
 * InvalidRefreshTokenEndpointError
 */
const InvalidRefreshTokenEndpointError = class extends ValidationError {
  constructor() {
    super(`Unable to refresh current session.`);
  }
};

/**
 * InvalidPreferencesError
 */
const InvalidPreferencesError = class extends ValidationError {
  constructor() {
    super(`Invalid preferences options.`);
  }
};

export {
  InitializationError,
  ValidationError,
  InvalidPortalError,
  InvalidTokenError,
  InvalidLocaleError,
  InvalidSessionError,
  InvalidRouterError,
  InvalidThemeError,
  InvalidRefreshTokenEndpointError,
  InvalidPreferencesError,
};
