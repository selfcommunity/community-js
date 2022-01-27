import http, {setAuthorizeToken, setSupportWithCredentials} from '../utils/http';
import {useEffect, useMemo, useReducer, useRef} from 'react';
import {SCAuthTokenType, SCSessionType} from '../types';
import * as Session from '../constants/Session';
import {Logger} from '../utils/logger';
import {SCOPE_SC_CORE} from '../constants/Errors';

/**
 * We have complex state logic that involves multiple sub-values,
 * so useReducer is preferable to useState.
 * Define all possible auth action types label
 * Use this to export actions and dispatch an action
 */
export const userActionTypes = {
  LOGIN_LOADING: '_login_loading',
  LOGIN_SUCCESS: '_login_success',
  LOGIN_FAILURE: '_login_failure',
  LOGOUT: '_logout',
  REFRESH_TOKEN_SUCCESS: '_refresh_token_success',
  REFRESH_TOKEN_FAILURE: '_invalid_token_failure',
  CHANGE_AVATAR: '_change_avatar',
  CHANGE_COVER: '_change_cover',
  CHANGE_UNSEEN_INTERACTIONS_COUNTER: '_change_unseen_interactions',
  CHANGE_UNSEEN_NOTIFICATION_BANNERS_COUNTER: '_change_unseen_notification_banners',
};

/**
 * userReducer:
 *  - manage the state of authentication
 *  - update the state base on action type
 * @param state
 * @param action
 */
function userReducer(state, action) {
  switch (action.type) {
    case userActionTypes.LOGIN_LOADING:
      return {user: null, session: Object.assign({}, state.session), error: null, loading: true};

    case userActionTypes.LOGIN_SUCCESS:
      return {user: action.payload.user, error: null, session: Object.assign({}, state.session), loading: false};

    case userActionTypes.LOGIN_FAILURE:
      return {user: null, session: Object.assign({}, state.session), error: action.payload.error, loading: false};

    case userActionTypes.REFRESH_TOKEN_SUCCESS:
      const newSession: SCSessionType = Object.assign({}, state.session, {
        authToken: {
          ...state.session.authToken,
          accessToken: action.payload.token.accessToken,
          ...(action.payload.token.refreshToken ? {refreshToken: action.payload.token.refreshToken} : {}),
          ...(action.payload.token.expiresIn ? {expiresIn: action.payload.token.expiresIn} : {}),
        },
      });
      // Update current config axios object
      setAuthorizeToken(newSession.authToken.accessToken);
      return {user: state.user, session: newSession, error: null, loading: false};

    case userActionTypes.REFRESH_TOKEN_FAILURE:
      return {user: null, session: Object.assign({}, state.session), loading: null, error: action.payload.error};

    case userActionTypes.LOGOUT:
      return {user: null, session: null, error: null, loading: null};

    case userActionTypes.CHANGE_AVATAR:
      return {...state, user: {...state.user, ...{avatar: action.payload.avatar}}};

    case userActionTypes.CHANGE_COVER:
      return {...state, user: {...state.user, ...{cover: action.payload.cover}}};

    case userActionTypes.CHANGE_UNSEEN_INTERACTIONS_COUNTER:
      return {...state, user: {...state.user, ...{unseen_interactions_counter: action.payload.counter}}};

    case userActionTypes.CHANGE_UNSEEN_NOTIFICATION_BANNERS_COUNTER:
      return {...state, user: {...state.user, ...{unseen_notification_banners_counter: action.payload.counter}}};

    default:
      throw new Error(`Unhandled type: ${action.type}`);
  }
}

/**
 * Define initial context auth session
 * @param session
 */
function stateInitializer(session: SCSessionType): any {
  let _session: SCSessionType = Object.assign({}, session);
  /**
   * Set http authorization if session type is OAuth or JWT
   * Configure http object (Authorization, etc...)
   */
  if ([Session.OAUTH_SESSION, Session.JWT_SESSION].includes(_session.type)) {
    setAuthorizeToken(_session.authToken.accessToken);
  }
  setSupportWithCredentials(_session.type === Session.COOKIE_SESSION);
  return {user: null, session: _session, error: null, loading: true, isSessionRefreshing: false};
}

/**
 * Custom hook 'useAuth'
 * Use this hook to manage the session in AuthContextProvider
 * @param initialSession
 */
export default function useAuth(initialSession: SCSessionType) {
  const [state, dispatch] = useReducer(userReducer, {}, () => stateInitializer(initialSession));
  let authInterceptor = useRef(null);
  let isSessionRefreshing = useRef(false);
  let failedQueue = useRef([]);

  /**
   * Manages multiple request during refresh session
   * Save concurrent requests and retry them again
   * at the end of refreshing session
   */
  const processQueue = useMemo(
    () =>
      (error, token = null) => {
        failedQueue.current.forEach((prom) => {
          if (error) {
            prom.reject(error);
          } else {
            prom.resolve(token);
          }
        });
        failedQueue.current = [];
      },
    [failedQueue.current]
  );

  /**
   * Add/remove an http request interceptor.
   * When the component unmounted the interceptor will be detached
   * The interceptor check if the token is expiring
   */
  useEffect(() => {
    if (state.user) {
      authInterceptor.current = http.interceptors.response.use(
        (response) => {
          return response;
        },
        async (error) => {
          let originalConfig = error.config;
          if (error.response) {
            if (error.response.status === 401) {
              /**
               * if other requests arrive at the same time
               * as the token refresh, we save them for later
               */
              if (isSessionRefreshing.current) {
                return new Promise(function (resolve, reject) {
                  failedQueue.current.push({resolve, reject});
                })
                  .then((token) => {
                    originalConfig.headers['Authorization'] = 'Bearer ' + token;
                    return http(originalConfig);
                  })
                  .catch((err) => {
                    Logger.error(SCOPE_SC_CORE, 'Unable to resolve promises in failedQueue.');
                    return Promise.reject(err);
                  });
              }

              /**
               * we mark the request as retried,
               * we avoid doing it again
               */
              const session: SCSessionType = state.session;
              const authToken: SCAuthTokenType = session && 'authToken' in session ? session.authToken : null;
              if (
                session.type !== Session.COOKIE_SESSION &&
                !isSessionRefreshing.current &&
                state.user &&
                session &&
                session.refreshTokenCallback &&
                Boolean(authToken && authToken.refreshToken)
              ) {
                /**
                 * set refreshing mode,
                 * save all concurrent request in the meantime
                 */
                isSessionRefreshing.current = true;
                try {
                  const res = await session.refreshTokenCallback(session);
                  originalConfig.headers.Authorization = `Bearer ${res['accessToken']}`;
                  dispatch({type: userActionTypes.REFRESH_TOKEN_SUCCESS, payload: {token: res}});
                  isSessionRefreshing.current = false;
                  // return a request
                  processQueue(null, res['accessToken']);
                  return Promise.resolve(http(originalConfig));
                } catch (_error) {
                  Logger.error(SCOPE_SC_CORE, 'Unable to refresh user session.');
                  isSessionRefreshing.current = false;
                  if (_error.response && _error.response.data) {
                    dispatch({type: userActionTypes.REFRESH_TOKEN_FAILURE, payload: {error: _error.response.toString()}});
                    processQueue(_error, null);
                    return Promise.reject(_error.response.data);
                  }
                }
              }
            }
            return Promise.reject(error);
          }
        }
      );
    }
    return (): void => {
      if (authInterceptor.current !== null) {
        http.interceptors.response.eject(authInterceptor.current);
      }
    };
  }, [state.user, state.session.authToken.accessToken]);

  return {state, dispatch};
}
