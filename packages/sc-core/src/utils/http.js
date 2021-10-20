import axios from 'axios';
// import {OAUTH_SESSION} from '../constants/Session';

/**
 * Define axios instance
 * @type {AxiosInstance}
 */
const http = axios.create({
  timeout: 100000,
  responseType: 'json',
});

/**
 * Default Content-Type header for all http requests
 */
http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

/**
 * Define Axios response interceptors
 * Renew the token if sessionsType == OAUTH_SESSION
 */
/*http.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.log(error);
    const {
      config,
      response: {status}
    } = error;
    if (status === 401) {
      if (session.type === OAUTH_SESSION && session.token && session.refreshTokenEndpoint) {
        return http
          .request({
            url: session.refreshTokenEndpoint.path,
            method: session.refreshTokenEndpoint.method,
            data: {
              ...(session.refreshTokenEndpoint.extra_data ? {...session.refreshTokenEndpoint.extra_data} : {}),
              ...(session.token.refresh_token ? {refresh_token: session.token.refresh_token} : {})
            }
          })
          .then((res) => {
            if (res) {
              // Update current config axios object to rerun request with token updated
              const newConfig = Object.assign(config, {
                headers: {Authorization: 'Bearer ' + res.data.data.access_token}
              });
              return http.request(newConfig);
            }
            console.log('Unable to refresh token. Invalid response data.');
          })
          .catch((error) => {
            console.log('Unable to refresh token.');
            console.log(error);
            return Promise.reject(error);
          });
      }
      console.log('Unable to refresh token. Check refreshTokenEndpoint options.');
      return Promise.reject(error);
    }
  }
);*/

/**
 * setSupportWithCredentials
 * Disable/enable withCredentials
 * Bypass cookie
 * @param enable
 */
export function setSupportWithCredentials(enable) {
  http.defaults.withCredentials = enable;
}

/**
 * setBasePortal
 * Set base path of all http requests
 * @param portal
 */
export function setBasePortal(portal) {
  http.defaults.baseURL = portal;
}

/**
 * setAuthorizeToken
 * Set authorization header for all http requests
 * @param token
 */
export function setAuthorizeToken(token) {
  http.defaults.headers.common.Authorization = '';
  delete http.defaults.headers.common.Authorization;

  if (token) {
    http.defaults.headers.common.Authorization = `Bearer ${token}`;
  }
}

export function defaultError(error) {
  if (error.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    console.log(error.request);
  } else {
    // Something happened in setting up the request that triggered an Error
    console.log('Error', error.message);
  }
}

export default http;
