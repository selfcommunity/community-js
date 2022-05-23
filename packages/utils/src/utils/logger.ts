/**
 * Emit styled message
 */
export class Logger {
  static info(scope, message) {
    console.info(`%c[${scope}]`, 'color:#008080', ` ${message}`);
  }

  static warn(scope, message) {
    console.warn(`%c[${scope}]`, 'color:#008080', ` ${message}`);
  }

  static error(scope, message) {
    console.error(`%c[${scope}]`, 'color:#008080', ` ${message}`);
  }

  static log(scope, message) {
    console.log(`%c[${scope}]`, 'color:#008080', ` ${message}`);
  }

  static debug(scope, message) {
    console.debug(`%c[${scope}]`, 'color:#008080', ` ${message}`);
  }
}
