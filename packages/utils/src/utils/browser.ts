/**
 * Get browser version to track on backend
 * @return {{name: string, version: null}|{name: string, version: string}|{name: *, version: *}|{name: string, version}}
 */
export const loadVersionBrowser = () => {
  if ('userAgentData' in navigator) {
    // navigator.userAgentData is not available in
    // Firefox and Safari
    // @ts-ignore
    const uaData: Array<any> = navigator['userAgentData'];
    // Outputs of navigator.userAgentData.brands[n].brand are e.g.
    // Chrome: 'Google Chrome'
    // Edge: 'Microsoft Edge'
    // Opera: 'Opera'
    let browsername;
    let browserversion;
    let chromeVersion = null;
    for (let i = 0; i < uaData['brands'].length; i++) {
      const brand = uaData['brands'][i].brand;
      browserversion = uaData['brands'][i].version;
      if (brand.match(/opera|chrome|edge|safari|firefox|msie|trident/i) !== null) {
        // If we have a chrome match, save the match, but try to find another match
        // E.g. Edge can also produce a false Chrome match.
        if (brand.match(/chrome/i) !== null) {
          chromeVersion = browserversion;
        }
        // If this is not a chrome match return immediately
        else {
          browsername = brand.substr(brand.indexOf(' ') + 1);
          return {
            name: browsername,
            version: browserversion
          };
        }
      }
    }
    // No non-Chrome match was found. If we have a chrome match, return it.
    if (chromeVersion !== null) {
      return {
        name: 'chrome',
        version: chromeVersion
      };
    }
  }
  // If no userAgentData is not present, or if no match via userAgentData was found,
  // try to extract the browser name and version from userAgent
  const userAgent = navigator.userAgent;
  let ua = userAgent;
  let tem;
  let M: any = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
  if (/trident/i.test(M[1])) {
    tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
    return {name: 'IE', version: tem[1] || ''};
  }
  if (M[1] === 'Chrome') {
    tem = ua.match(/\bOPR\/(\d+)/);
    if (tem != null) {
      return {name: 'Opera', version: tem[1]};
    }
  }
  M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
  // eslint-disable-next-line @typescript-eslint/prefer-regexp-exec
  if ((tem = ua.match(/version\/(\d+)/i)) != null) {
    M.splice(1, 1, tem[1]);
  }
  return {
    name: M[0],
    version: M[1]
  };
};

export const iOS = () => {
  return (
    ['iPad Simulator', 'iPhone Simulator', 'iPod Simulator', 'iPad', 'iPhone', 'iPod'].includes(navigator.platform) ||
    // iPad on iOS 13 detection
    (navigator.userAgent.includes('Mac') && 'ontouchend' in document)
  );
};
