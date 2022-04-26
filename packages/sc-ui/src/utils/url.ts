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
