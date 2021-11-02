import axios from 'axios';

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
 * setSupportWithCredentials
 * Disable/enable withCredentials
 * Bypass cookie if disabled
 * @param enable
 */
export function setSupportWithCredentials(enable: boolean): void {
  http.defaults.withCredentials = enable;
}

/**
 * setBasePortal
 * Set base path of all http requests
 * @param portal
 */
export function setBasePortal(portal: string): void {
  http.defaults.baseURL = portal;
}

/**
 * setAuthorizeToken
 * Set authorization header for all http requests
 * @param token
 */
export function setAuthorizeToken(token: string): void {
  http.defaults.headers.common.Authorization = '';
  delete http.defaults.headers.common.Authorization;

  if (token) {
    http.defaults.headers.common.Authorization = `Bearer ${token}`;
  }
}

export function defaultError(error: {request?: any; message?: any}): void {
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
