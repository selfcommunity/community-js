/* eslint-disable */
import axios, {Axios, AxiosRequestConfig, AxiosResponse} from 'axios';
import {SCAuthContextType, SCSessionType} from '@selfcommunity/core';
import {useSCAuth} from '../components/provider/SCAuthProvider';
import * as Session from '../constants/Session';
import {SCAuthTokenType, SCRefreshTokenEndpointType} from '../types/context';

/**
 * Define axios instance
 * @type {AxiosInstance}
 */
const http: Axios = axios.create({
  timeout: 100000,
  responseType: 'json',
});

/**
 * Default Content-Type header for all http requests
 */
http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

/**
 * Axios OAuth2 Interceptors instance
 */
let oauth2interceptorInstance;

export function addOauth2Interceptor(): void {
  oauth2interceptorInstance = http.interceptors.response.use(oauth2interceptorResponse, oauth2interceptorError);
}

export function ejectOauth2Interceptor(): void {
  http.interceptors.response.eject(oauth2interceptorInstance);
}

export function oauth2interceptorError(response) {
  return Promise.reject(response);
}

/**
 * Define Axios response interceptors
 * Renew the token only if session.type == OAUTH_SESSION
 */
export function oauth2interceptorResponse(response: AxiosResponse): AxiosResponse {
  /*
  const authContext: SCAuthContextType = useSCAuth();
  const session: SCSessionType = 'session' in authContext ? authContext.session : null;
  const authToken: SCAuthTokenType = 'session' in authContext && 'authToken' in authContext.session ? authContext.session.authToken : null;
  if (
    !session.isRefreshing &&
    authContext.user &&
    session &&
    session.type === Session.OAUTH_SESSION &&
    session.refreshTokenEndpoint &&
    authToken &&
    authToken.refreshToken &&
    authToken.expiresIn
  ) {
    const {path, method, extraHeadersData, extraPayloadData}: SCRefreshTokenEndpointType = session.refreshTokenEndpoint;
    http
      .request({
        url: path,
        method: method,
        headers: {...response.config.headers, ...extraHeadersData},
        data: {
          ...(extraPayloadData ? extraPayloadData : {}),
          refreshToken: session.authToken.refreshToken,
        },
      })
      .then((res: AxiosResponse) => {
        if (res) {
          const data: {access_token: string; refresh_token: string; expires_in: string; scope: string} = res.data['data'];
          const newSession: SCSessionType = Object.assign({}, session, {
            isRefreshing: false,
            authToken: {
              ...session.authToken,
              accessToken: data.access_token,
              ...(data.refresh_token ? {refreshToken: data.access_token} : {}),
              ...(data.expires_in ? {expiresIn: data.expires_in} : {}),
            },
          });
          // Update current config axios object
          setAuthorizeToken(newSession.authToken.accessToken);
          authContext.updateSession(newSession);
          return response;
        }
        console.log('Unable to refresh token. Invalid response data.');
      })
      .catch((error) => {
        console.log('Unable to refresh token.');
        console.log(error);
        return Promise.reject(error);
      });
    authContext.updateSession(Object.assign({}, session, {isRefreshing: true}));
  }
   */
  return response;
}

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
