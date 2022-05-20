/**
 * Utility Url Replacer
 * @param path
 */
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

/**
 * Get domain
 * @param url
 */
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
 * @param url
 */
export const isValidUrl = (url: string): boolean => {
  const regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/;
  return regexp.test(url);
};

/**
 * Check a str is a valid list of urls separated by delimiter
 * @param value
 * @param delimiter
 */
export const isValidUrls = (value: string, delimiter: string): boolean => {
  const urls = value.trim().split(delimiter);
  return urls.every(isValidUrl);
};

/**
 * Append params
 * @param baseUrl
 * @param queryParams
 */
export function appendURLSearchParams(baseUrl: string, queryParams: Record<string, string | number>[]) {
  let _url = baseUrl;
  if (queryParams.length && _url) {
    const key = Object.keys(queryParams[0])[0];
    _url += (_url.split('?')[1] ? '&' : '?') + `${key}=${queryParams[0][key]}`;
    queryParams.slice(1).map((p) => {
      const key = Object.keys(p)[0];
      _url += `&${key}=${p[key]}`;
    });
  }
  return _url;
}

/**
 * Take the application server's public key, which is Base64 URL-safe encoded,
 * and convert it to a UInt8Array, because this is the expected input of the subscribe()
 */
export const urlB64ToUint8Array = (base64String) => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};
