export const urlReplacer = (path: string) => {
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
  return (params: object) => replacer(path, params);
};

export const getDomain = (url: string): string => {
  // eslint-disable-next-line no-useless-escape,@typescript-eslint/prefer-regexp-exec
  const matches = url.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
  if (matches && matches[1]) {
    return matches[1];
  }
  return '';
};

/**
 * Check a str is a valid url pattern
 */
export const isValidUrl = (url: string): boolean => {
  const regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/;
  return regexp.test(url);
};

/**
 * Check a str is a valid list of urls separated by delimiter
 */
export const isValidUrls = (value: string, delimiter: string): boolean => {
  const urls = value.trim().split(delimiter);
  return urls.every(isValidUrl);
};
