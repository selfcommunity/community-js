import {http} from '@selfcommunity/api-services';
import {useEffect, useMemo, useReducer, useRef} from 'react';
import {SCSessionType} from '../types';
import {SCAuthTokenType} from '@selfcommunity/types';
import * as Session from '../constants/Session';
import useDeepCompareEffect from 'use-deep-compare-effect';
import {Logger} from '../utils/logger';
import {SCOPE_SC_CORE} from '../constants/Errors';

/**
 * @hidden
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
  REFRESH_SESSION: '_refresh_token',
  UPDATE_USER: '_change_user',
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
      const newAuthToken = Object.assign({}, state.session.authToken, {
        ...state.session.authToken,
        accessToken: action.payload.token.accessToken,
        ...(action.payload.token.refreshToken ? {refreshToken: action.payload.token.refreshToken} : {}),
        ...(action.payload.token.expiresIn ? {expiresIn: action.payload.token.expiresIn} : {}),
      });
      const newSession: SCSessionType = Object.assign({}, state.session, {
        authToken: newAuthToken,
      });
      // Update current client config
      http.setAuthorizeToken(newAuthToken.accessToken);
      return {...state, session: newSession, error: null, loading: false};

    case userActionTypes.REFRESH_TOKEN_FAILURE:
      return {user: null, session: Object.assign({}, state.session), loading: null, error: action.payload.error};

    case userActionTypes.LOGOUT:
      return {user: null, session: null, error: null, loading: null};

    case userActionTypes.UPDATE_USER:
      return {...state, user: {...state.user, ...action.payload}};

    case userActionTypes.REFRESH_SESSION:
      return {...state, ...action.payload.conf};

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
  let _isLoading = false;
  /**
   * Set http authorization if session type is OAuth or JWT
   * Configure http object (Authorization, etc...)
   */
  if ([Session.OAUTH_SESSION, Session.JWT_SESSION].includes(_session.type) && _session.authToken && _session.authToken.accessToken) {
    http.setAuthorizeToken(_session.authToken.accessToken);
    _isLoading = true;
  }
  http.setSupportWithCredentials(_session.type === Session.COOKIE_SESSION);
  return {user: null, session: _session, error: null, loading: _isLoading, isSessionRefreshing: false, refreshSession: false};
}

/**
 :::info
 This component is used to navigate through the application.
 :::

 #### Usage

 In order to use router you need to import this components first:

 ```jsx
 import {SCRoutingContextType, useSCRouting, Link, SCRoutes} from '@selfcommunity/react-core';
 ````

 :::tipUsage Example:

 ```jsx
 const scRoutingContext: SCRoutingContextType = useSCRouting();
 <Button component={Link} to={scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, {id: user.id})>Go to profile</Button>
````
or

```jsx
const scRoutingContext: SCRoutingContextType = useSCRouting();
<Link to={scRoutingContext.url('profile', {id: user.id})}>Go to profile</Link>
````
:::
 * @param initialSession
 */
export default function useAuth(initialSession: SCSessionType) {
  const [state, dispatch] = useReducer(userReducer, {}, () => stateInitializer(initialSession));
  let authInterceptor = useRef(null);
  let isSessionRefreshing = useRef(false);
  let failedQueue = useRef([]);

  // CONST
  const userId = state.user ? state.user.id : null;
  const accessToken = state.session.authToken && state.session.authToken.accessToken ? state.session.authToken.accessToken : null;

  /**
   * Refresh session
   */
  const refreshSession = useMemo(
    () => () => {
      const session: SCSessionType = state.session;
      if (!isSessionRefreshing.current && session.handleRefreshToken) {
        isSessionRefreshing.current = true;
        return session
          .handleRefreshToken(state.session)
          .then((res: SCAuthTokenType) => {
            isSessionRefreshing.current = false;
            dispatch({type: userActionTypes.REFRESH_TOKEN_SUCCESS, payload: {token: res}});
            return Promise.resolve(res);
          })
          .catch((error) => {
            Logger.error(SCOPE_SC_CORE, 'Unable to refresh user session.');
            if (error.response && error.response.data) {
              dispatch({type: userActionTypes.REFRESH_TOKEN_FAILURE, payload: {error: error.response.toString()}});
            }
            return Promise.reject(error);
          });
      }
      return Promise.reject(new Error('Unable to refresh session. Unauthenticated user.'));
    },
    [accessToken]
  );

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
    if (userId !== null) {
      authInterceptor.current = http.getClientInstance().interceptors.response.use(
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
                    return http.request(originalConfig);
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
                session.handleRefreshToken &&
                Boolean(authToken && authToken.refreshToken)
              ) {
                /**
                 * set refreshing mode,
                 * save all concurrent request in the meantime
                 */
                try {
                  const res = await refreshSession();
                  originalConfig.headers.Authorization = `Bearer ${res['accessToken']}`;
                  processQueue(null, res['accessToken']);
                  return Promise.resolve(http.request(originalConfig));
                } catch (_error) {
                  if (_error.response && _error.response.data) {
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
        http.getClientInstance().interceptors.response.eject(authInterceptor.current);
      }
    };
  }, [userId, accessToken]);

  /**
   * Reset session if initial conf changed
   */
  useDeepCompareEffect(() => {
    dispatch({type: userActionTypes.REFRESH_SESSION, payload: {conf: stateInitializer(initialSession)}});
  }, [initialSession]);

  return {state, dispatch, helpers: {refreshSession}};
}
