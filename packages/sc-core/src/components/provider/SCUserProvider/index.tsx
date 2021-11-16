import React, {createContext, useContext, useEffect, useMemo} from 'react';
import sessionServices from '../../../services/session';
import {SCUserContextType, SCContextType, SCSessionType, SCUserType} from '../../../types';
import {SCContext} from '../SCContextProvider';
import useSCAuth, {authActionTypes} from '../../../hooks/useSCAuth';
import {Logger} from '../../../utils/logger';
import {SCOPE_SC_CORE} from '../../../constants/Errors';

/**
 * SCUserContext (Authentication Context)
 * Consuming this context in one of the following ways:
 *  1. <SCUserContext.Consumer>
 *       {(user, session, error, loading, logout) => (...)}
 *     </SCUserContext.Consumer>
 *  2. const scUserContext: SCUserContextType = useContext(SCUserContext);
 *  3. const scUserContext: SCUserContextType = useSCUser();
 */
export const SCUserContext = createContext<SCUserContextType>({} as SCUserContextType);

/**
 * Export the provider as we need to wrap the entire app with it
 * This provider keeps current user logged and session
 */
export default function SCUserProvider({children}: {children: React.ReactNode}): JSX.Element {
  const scContext: SCContextType = useContext(SCContext);
  const initialSession: SCSessionType = scContext.settings.session;
  const {state, dispatch} = useSCAuth(initialSession);

  /**
   * Check if there is a currently active session
   * when the provider is mounted for the first time.
   * If there is an error, it means there is no session.
   */
  useEffect(() => {
    dispatch({type: authActionTypes.LOGIN_LOADING});
    sessionServices
      .getCurrentUser()
      .then((user: SCUserType) => {
        dispatch({type: authActionTypes.LOGIN_SUCCESS, payload: {user}});
      })
      .catch((error) => {
        Logger.error(SCOPE_SC_CORE, 'Unable to retrieve the authenticated user.');
        dispatch({type: authActionTypes.LOGIN_FAILURE, payload: {error}});
      });
  }, []);

  /**
   * Call the logout endpoint and then remove the user
   * from the state.
   */
  function logout(): void {
    dispatch({type: authActionTypes.LOGOUT});
  }

  /**
   * Make the provider update only when it should.
   * We only want to force re-renders if the user, session,
   * loading or error states change.
   *
   * Whenever the `value` passed into a provider changes,
   * the whole tree under the provider re-renders, and
   * that can be very costly! Even in this case, where
   * you only get re-renders when logging in and out
   * we want to keep things very performant.
   */
  const contextValue = useMemo(
    () => ({
      user: state.user,
      session: state.session,
      loading: state.loading,
      error: state.loading,
      logout,
    }),
    [state]
  );

  /**
   * We only want to render the underlying app after we
   * assert for the presence of a current user.
   */
  return <SCUserContext.Provider value={contextValue}>{!state.loading && children}</SCUserContext.Provider>;
}

/**
 * Let's only export the `useSCUser` hook instead of the context.
 * We only want to use the hook directly and never the context component.
 */
export function useSCUser(): SCUserContextType {
  return useContext(SCUserContext);
}
