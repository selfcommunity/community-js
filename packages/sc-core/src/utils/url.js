import t from 'typy';
import {ValidationError} from '../utils/errors';
import {LOCALES} from '../constants/I18n';

export const urlReplacer = (path) => {
  const replacer = function (tpl, data) {
    const re = /\$\(([^)]+)?\)/g;
    let match = re.exec(tpl);
    while (match) {
      tpl = tpl.replace(match[0], data[match[1]]);
      re.lastIndex = 0;
      match = re.exec(tpl);
    }
    return tpl;
  };
  return (params) => replacer(path, params);
};

export const getDomain = (url) => {
  // eslint-disable-next-line no-useless-escape
  const matches = url.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
  if (matches && matches[1]) {
    return matches[1];
  }
  return '';
};

/**
 * Check a str is a valid url pattern
 */
export const isValidUrl = (url) => {
  const regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/;
  return regexp.test(url);
};

/**
 * Check a str is a valid list of urls separated by delimiter
 */
export const isValidUrls = (value, delimiter) => {
  const urls = value.trim().split(delimiter);
  return urls.every(isValidUrl);
};

/**
 * Validate locale option
 * @param locale
 * @return {locale}
 */
export const validateLocale = (locale) => {
  if (t(locale).isString && LOCALES.indexOf(locale) >= -1) {
    return locale;
  }
  throw new ValidationError(locale);
};
