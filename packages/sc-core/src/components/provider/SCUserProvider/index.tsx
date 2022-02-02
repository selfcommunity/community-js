import React, {createContext, useContext, useEffect, useMemo} from 'react';
import sessionServices from '../../../services/session';
import {SCContext} from '../SCContextProvider';
import useSCAuth, {userActionTypes} from '../../../hooks/useSCAuth';
import {Logger} from '../../../utils/logger';
import {SCOPE_SC_CORE} from '../../../constants/Errors';
import useSCCategoriesManager from '../../../hooks/useSCCategoriesManager';
import useSCFollowedManager from '../../../hooks/useSCFollowersManager';
import useSCConnectionsManager from '../../../hooks/useSCConnectionsManager';
import {
  SCUserContextType,
  SCContextType,
  SCSessionType,
  SCUserType,
  SCCategoriesManagerType,
  SCFollowedManagerType,
  SCConnectionsManagerType,
} from '../../../types';

/**
 * SCUserContext (Authentication Context)
 * Consuming this context in one of the following ways:
 *  1. <SCUserContext.Consumer>
 *       {(user, session, error, loading, logout, ...) => (...)}
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
  const {state, dispatch, helpers} = useSCAuth(initialSession);

  /**
   * Managers followed, categories
   */
  const followedManager: SCFollowedManagerType = useSCFollowedManager(state.user);
  const connectionsManager: SCConnectionsManagerType = useSCConnectionsManager(state.user);
  const categoriesManager: SCCategoriesManagerType = useSCCategoriesManager(state.user);

  /**
   * Check if there is a currently active session
   * when the provider is mounted for the first time.
   * If there is an error, it means there is no session.
   */
  useEffect(() => {
    if (state.session.authToken && state.session.authToken.accessToken) {
      dispatch({type: userActionTypes.LOGIN_LOADING});
      sessionServices
        .getCurrentUser()
        .then((user: SCUserType) => {
          dispatch({type: userActionTypes.LOGIN_SUCCESS, payload: {user}});
        })
        .catch((error) => {
          Logger.error(SCOPE_SC_CORE, 'Unable to retrieve the authenticated user.');
          dispatch({type: userActionTypes.LOGIN_FAILURE, payload: {error}});
        });
    }
  }, [state.session.accessToken]);

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
    if (!document.hidden && state.user) {
      categoriesManager.refresh && categoriesManager.refresh();
      followedManager.refresh && followedManager.refresh();
      connectionsManager.refresh && connectionsManager.refresh();
    }
  }

  /**
   * Handle change avatar
   */
  function setAvatar(avatar): void {
    dispatch({type: userActionTypes.CHANGE_AVATAR, payload: {avatar}});
  }

  /**
   * Handle change cover
   */
  function setCover(cover): void {
    dispatch({type: userActionTypes.CHANGE_COVER, payload: {cover}});
  }

  /**
   * Handle change unseen interactions counter
   */
  function setUnseenInteractionsCounter(counter): void {
    dispatch({type: userActionTypes.CHANGE_UNSEEN_INTERACTIONS_COUNTER, payload: {counter}});
  }

  /**
   * Handle change unseen notification banners counter
   */
  function setUnseenNotificationBannersCounter(counter): void {
    dispatch({type: userActionTypes.CHANGE_UNSEEN_NOTIFICATION_BANNERS_COUNTER, payload: {counter}});
  }

  /**
   * Helper to refresh the session
   */
  function refreshSession(): Promise<any> {
    return helpers.refreshSession();
  }

  /**
   * Call the logout endpoint and then remove the user
   * from the state.
   */
  function logout(): void {
    dispatch({type: userActionTypes.LOGOUT});
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
      error: state.error,
      setAvatar,
      setCover,
      setUnseenInteractionsCounter,
      setUnseenNotificationBannersCounter,
      logout,
      refreshSession,
      managers: {
        categories: categoriesManager,
        followed: followedManager,
        connections: connectionsManager,
      },
    }),
    [
      state,
      categoriesManager.loading,
      categoriesManager.categories,
      followedManager.loading,
      followedManager.followed,
      connectionsManager.loading,
      connectionsManager.connections,
    ]
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
