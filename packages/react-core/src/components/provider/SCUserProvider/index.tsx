import React, {createContext, useContext, useEffect, useMemo, useRef} from 'react';
import {UserService} from '@selfcommunity/api-services';
import {SCContext} from '../SCContextProvider';
import useSCAuth, {userActionTypes} from '../../../hooks/useSCAuth';
import {isClientSideRendering, Logger} from '@selfcommunity/utils';
import PubSub from 'pubsub-js';
import {SCOPE_SC_CORE} from '../../../constants/Errors';
import {useDeepCompareEffectNoCheck} from 'use-deep-compare-effect';
import useSCFollowedCategoriesManager from '../../../hooks/useSCFollowedCategoriesManager';
import useSCFollowedManager from '../../../hooks/useSCFollowedManager';
import useSCFollowersManager from '../../../hooks/useSCFollowersManager';
import useSCConnectionsManager from '../../../hooks/useSCConnectionsManager';
import {
  SCUserContextType,
  SCContextType,
  SCSessionType,
  SCFollowedCategoriesManagerType,
  SCFollowedManagerType,
  SCFollowersManagerType,
  SCConnectionsManagerType,
  SCSubscribedIncubatorsManagerType,
} from '../../../types';
import {SCUserType, SCNotificationTopicType, SCNotificationTypologyType, SCUserStatus} from '@selfcommunity/types';
import useSCSubscribedIncubatorsManager from '../../../hooks/useSCSubscribedIncubatorsManager';

/**
 * SCUserContext (Authentication Context)
 *
 :::tipContext can be consumed in one of the following ways:


 ```jsx
 1. <SCUserContext.Consumer>{(user, session, error, loading, logout) => (...)}</SCUserContext.Consumer>
 ```
 ```jsx
 2. const scUserContext: SCUserContextType = useContext(SCUserContext);
 ```
 ```jsx
 3. const scUserContext: SCUserContextType = useSCUser();
 ````
 :::
 */
export const SCUserContext = createContext<SCUserContextType>({} as SCUserContextType);

/**
 * #### Description:
 * This component keeps current user logged and session; it is exported as we need to wrap the entire app with it
 * @param children
 * @return
 * ```jsx
 * <SCUserContext.Provider value={contextValue}>{!state.loading && children}</SCUserContext.Provider>
 * ```
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
   * Helper handle change user
   */
  function updateUser(info): void {
    dispatch({type: userActionTypes.UPDATE_USER, payload: info});
  }

  /**
   * Managers followed, categories
   */
  const followedManager: SCFollowedManagerType = useSCFollowedManager(state.user);
  const followersManager: SCFollowersManagerType = useSCFollowersManager(state.user);
  const subscribedIncubatorsManager: SCSubscribedIncubatorsManagerType = useSCSubscribedIncubatorsManager(state.user);
  const connectionsManager: SCConnectionsManagerType = useSCConnectionsManager(state.user);
  const categoriesManager: SCFollowedCategoriesManagerType = useSCFollowedCategoriesManager(state.user, updateUser);

  /**
   * Ref notifications subscribers: BLOCKED_USER, UNBLOCKED_USER
   */
  const notificationUserBlockedSubscription = useRef(null);
  const notificationUserUnBlockedSubscription = useRef(null);

  /**
   * Check if there is a currently active session
   * when the provider is mounted for the first time.
   * If there is an error, it means there is no session.
   */
  useDeepCompareEffectNoCheck(() => {
    if (state.session.authToken && state.session.authToken.accessToken) {
      dispatch({type: userActionTypes.LOGIN_LOADING});
      UserService.getCurrentUser()
        .then((user: SCUserType) => {
          dispatch({type: userActionTypes.LOGIN_SUCCESS, payload: {user}});
        })
        .catch((error) => {
          Logger.error(SCOPE_SC_CORE, 'Unable to retrieve the authenticated user.');
          dispatch({type: userActionTypes.LOGIN_FAILURE, payload: {error}});
        });
    }
  }, [state.session]);

  /**
   * Controls caching of follow categories, users, etc...
   * To avoid multi-tab problems (only for client side), on visibility change
   * and document is in foreground refresh the cache
   */
  useEffect(() => {
    typeof window !== 'undefined' && document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      typeof window !== 'undefined' && document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  });

  /**
   * handler handleVisibilityChange for this provider
   * Refresh followed categories, users, etc..
   */
  function handleVisibilityChange() {
    if (isClientSideRendering() && !window.document.hidden && state.user) {
      categoriesManager.refresh && categoriesManager.refresh();
      followedManager.refresh && followedManager.refresh();
      connectionsManager.refresh && connectionsManager.refresh();
      subscribedIncubatorsManager.refresh && subscribedIncubatorsManager.refresh();
    }
  }

  /**
   * Subscribes to handle notifications of type BLOCKED_USER, UNBLOCKED_USER.
   * When receive this type of notifications, the user.status must be update.
   */
  useEffect(() => {
    notificationUserBlockedSubscription.current = PubSub.subscribe(
      `${SCNotificationTopicType.INTERACTION}.${SCNotificationTypologyType.BLOCKED_USER}`,
      () => {
        dispatch({type: userActionTypes.UPDATE_USER, payload: {status: SCUserStatus.BLOCKED}});
      }
    );
    notificationUserUnBlockedSubscription.current = PubSub.subscribe(
      `${SCNotificationTopicType.INTERACTION}.${SCNotificationTypologyType.UNBLOCKED_USER}`,
      () => {
        dispatch({type: userActionTypes.UPDATE_USER, payload: {status: SCUserStatus.APPROVED}});
      }
    );
    return () => {
      PubSub.unsubscribe(notificationUserBlockedSubscription.current);
      PubSub.unsubscribe(notificationUserUnBlockedSubscription.current);
    };
  }, []);

  /**
   * Handle change unseen interactions counter
   */
  function setUnseenInteractionsCounter(counter): void {
    dispatch({type: userActionTypes.UPDATE_USER, payload: {unseen_interactions_counter: counter}});
  }

  /**
   * Handle change unseen notification banners counter
   */
  function setUnseenNotificationBannersCounter(counter): void {
    dispatch({type: userActionTypes.UPDATE_USER, payload: {unseen_notification_banners_counter: counter}});
  }

  /**
   * Helper to refresh the session
   */
  function refreshSession(): Promise<any> {
    return helpers.refreshSession();
  }

  /**
   * Helper to refresh the notification counter
   * Use getCurrentUser service since the notification counters
   * have been inserted into the serialized user object
   */
  const refreshNotificationCounters = useMemo(
    () => () => {
      if (state.user) {
        return UserService.getCurrentUser()
          .then((user: SCUserType) => {
            dispatch({
              type: userActionTypes.UPDATE_USER,
              payload: {
                unseen_interactions_counter: user.unseen_interactions_counter,
                unseen_notification_banners_counter: user.unseen_notification_banners_counter,
              },
            });
          })
          .catch((error) => {
            Logger.error(SCOPE_SC_CORE, `Unable to refresh notification counters. Error: ${error.response.toString()}`);
          });
      }
      return Promise.reject();
    },
    [state.user]
  );

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
      updateUser,
      setUnseenInteractionsCounter,
      setUnseenNotificationBannersCounter,
      refreshNotificationCounters,
      logout,
      refreshSession,
      managers: {
        categories: categoriesManager,
        followed: followedManager,
        followers: followersManager,
        connections: connectionsManager,
        incubators: subscribedIncubatorsManager,
      },
    }),
    [
      state,
      categoriesManager.loading,
      categoriesManager.categories,
      followedManager.loading,
      followedManager.followed,
      followersManager.loading,
      followersManager.followers,
      connectionsManager.loading,
      connectionsManager.connections,
      subscribedIncubatorsManager.loading,
      subscribedIncubatorsManager.incubators,
    ]
  );

  /**
   * We only want to render the underlying app after we
   * assert for the presence of a current user.
   */
  return <SCUserContext.Provider value={contextValue}>{children}</SCUserContext.Provider>;
}

/**
 * Let's only export the `useSCUser` hook instead of the context.
 * We only want to use the hook directly and never the context component.
 */
export function useSCUser(): SCUserContextType {
  return useContext(SCUserContext);
}
