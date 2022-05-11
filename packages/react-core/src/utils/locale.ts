import {DEFAULT_LANGUAGE_UI, LOCALE_EN} from '../constants/Locale';
import localeData from '@selfcommunity/react-i18n';
import {createIntl} from 'react-intl';
import {Logger} from './logger';
import {SCOPE_SC_CORE} from '../constants/Errors';

/**
 * Load Locale Data
 */
export function loadLocaleData(locale, settings) {
  let _locale = locale;
  let locales = settings.locale && settings.locale.messages ? settings.locale.messages : localeData;
  if (!locales[_locale]) {
    _locale = DEFAULT_LANGUAGE_UI;
    if (settings.messages) {
      Logger.warn(SCOPE_SC_CORE, `Locale ${_locale} not found in messages configuration. Fallback to 'en'.`);
    } else {
      Logger.warn(SCOPE_SC_CORE, `Locale ${_locale} not found in sc-i18n package. Fallback to 'en'.`);
    }
  }
  try {
    return {messages: locales[_locale], locale: _locale};
  } catch (e) {
    if (settings.messages) {
      locales = localeData;
      Logger.error(SCOPE_SC_CORE, `Configuration Locale.messages doesn't contains ${_locale}. Fallback to 'en' of 'sc-i18n'`);
    }
    return {messages: locales[LOCALE_EN], locale: DEFAULT_LANGUAGE_UI};
  }
}

export default createIntl;
