import React, {createContext, useContext, useEffect, useMemo} from 'react';
import sessionServices from '../../../services/session';
import {SCUserContextType, SCContextType, SCSessionType, SCUserType, SCCategoriesManagerType, SCFollowedManagerType} from '../../../types';
import {SCContext} from '../SCContextProvider';
import useSCAuth, {authActionTypes} from '../../../hooks/useSCAuth';
import {Logger} from '../../../utils/logger';
import {SCOPE_SC_CORE} from '../../../constants/Errors';
import useSCCategoriesManager from '../../../hooks/useSCCategoriesManager';
import useSCFollowedManager from '../../../hooks/useSCFollowersManager';

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

  /**
   * Manage user session
   * Refresh token if necessary
   */
  const initialSession: SCSessionType = scContext.settings.session;
  const {state, dispatch} = useSCAuth(initialSession);

  /**
   * Managers followed, categories
   */
  const followedManager: SCFollowedManagerType = useSCFollowedManager(state.user);
  const categoriesManager: SCCategoriesManagerType = useSCCategoriesManager(state.user);

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
   * Controls caching of follow categories, users, etc...
   * To avoid multi-tab problems, on visibility change and document
   * is in foreground refresh the cache
   */
  useEffect(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  });

  /**
   * handler handleVisibilityChange for this provider
   * Refresh followed categories, users, etc..
   */
  function handleVisibilityChange() {
    if (!document.hidden) {
      console.log('aaa');
      categoriesManager.refresh();
      followedManager.refresh();
    }
  }

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
      managers: {
        categories: categoriesManager,
        followed: followedManager,
      },
    }),
    [state, categoriesManager.loading, categoriesManager.categories, followedManager.loading, followedManager.followed]
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
