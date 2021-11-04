import {DEFAULT_LANGUAGE_UI, LOCALE_EN, LOCALE_IT, LOCALES} from '../constants/Locale';
import localeData from '../locale/locales';
import { createIntl, createIntlCache } from 'react-intl';

// This is optional but highly recommended since it prevents memory leak
const cache = createIntlCache();

// Load Locale Data
export function loadLocaleData(locale) {
  switch (locale) {
    case 'it':
      return localeData[LOCALE_IT];
    default:
      return localeData[LOCALE_EN];
  }
}

// Global intl object
let newIntl = (languageCode) => createIntl(
  {
    locale: languageCode,
    defaultLocale: DEFAULT_LANGUAGE_UI,
    messages: loadLocaleData(languageCode)
  },
  cache
);

export default createIntl;
