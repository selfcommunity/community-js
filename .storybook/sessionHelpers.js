/**
 * Helper send request
 * @param url
 * @param data
 * @returns {Promise<Response>}
 */
function postData(url = '', data = {}) {
  const formBody = Object.keys(data).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key])).join('&');
  return fetch(url, {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'content-type': 'application/x-www-form-urlencoded',
    },
    body: formBody,
  });
}

/**
 * Helper refreshToken
 * @param context
 * @returns {(function(*): (Promise<Promise<{expiresIn: *, accessToken: *, tokenType: string | undefined, expiresAt, refreshToken: *}> | Promise<never>>|undefined))|*}
 */
export function refreshToken(context) {
  return (session) => {
    if (context.globals.session === 'OAuth') {
      const data = {
        'refresh_token': session.authToken.refreshToken,
        'client_id': session.clientId,
        'grant_type': 'refresh_token',
      };
      return postData(`${context.globals.portal}/oauth/token/`, data)
        .then(res => res.json())
        .then(res => {
          return {
            'accessToken': res.access_token,
            'refreshToken': res.refresh_token,
            'tokenType': res.token_type,
            'expiresIn': res.expires_in
          };
        }).catch((error) => {
          return Promise.reject(error);
        });
    } else if (context.globals.session === 'JWT') {
      const data = {
        'username': context.globals.user,
        'password': context.globals.password,
      };
      return postData(`${context.globals.portal}/oauth/token/`, data)
        .then(res => res.json())
        .then(res => {
          return {
            'accessToken': res.access,
            'refreshToken': res.refresh,
            'tokenType': context.globals.session,
            'expiresIn': parseInt(context.globals.accessTokenJwtExpiresIn)
          };
        }).catch((error) => {
          return Promise.reject(error);
        });
    }
  };
};

/**
 * Helper getOAuthSession
 * @param context
 * @returns {Promise<T>}
 */
export function getOAuthSession(context) {
  const data = {
    'username': context.globals.accountUsername,
    'password': context.globals.accountPassword,
    'client_id': context.globals.clientId,
    'grant_type': 'password',
  };
  return postData(`${context.globals.portal}/oauth/token/`, data)
    .then(res => res.json())
    .then(res => {
      return {
        'accessToken': res.access_token,
        'refreshToken': res.refresh_token,
        'tokenType': res.token_type,
        'expiresIn': res.expires_in
      };
    }).catch((error) => {
      console.log('Unable to get an access token.');
    });
}

/**
 * Helper getJWTSession
 * @param context
 * @returns {Promise<T>}
 */
export function getJWTSession(context) {
  const data = {
    'username': context.globals.accountUsername,
    'password': context.globals.accountPassword,
  };
  return postData(`${context.globals.portal}/api/v2/jwt/token/`, data)
    .then(res => res.json())
    .then(res => {
      return {
        'accessToken': res.access,
        'refreshToken': res.refresh,
        'tokenType': context.globals.session,
        'expiresIn': parseInt(context.globals.accessTokenJwtExpiresIn)
      };
    }).catch((error) => {
      console.log('Error initialize session in storybook');
      return Promise.reject(error);
    });
}

