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
import useSCSettingsManager from '../../../hooks/useSCSettingsManager';
import useSCFollowersManager from '../../../hooks/useSCFollowersManager';
import useSCConnectionsManager from '../../../hooks/useSCConnectionsManager';
import {SCUserType, SCNotificationTopicType, SCNotificationTypologyType, SCUserStatus} from '@selfcommunity/types';
import useSCSubscribedIncubatorsManager from '../../../hooks/useSCSubscribedIncubatorsManager';
import useSCBlockedUsersManager from '../../../hooks/useSCBlockedUsersManager';
import * as Session from '../../../constants/Session';
import {
  SCUserContextType,
  SCContextType,
  SCSessionType,
  SCSettingsManagerType,
  SCFollowedCategoriesManagerType,
  SCFollowedManagerType,
  SCFollowersManagerType,
  SCConnectionsManagerType,
  SCSubscribedIncubatorsManagerType,
  SCBlockedUsersManagerType,
  SCSubscribedGroupsManagerType,
} from '../../../types';
import useSCSubscribedGroupsManager from '../../../hooks/useSCSubscribedGroupsManager';

/**
 * SCUserContext (Authentication Context)
 *
 :::tip Context can be consumed in one of the following ways:


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
   * Managers followed, connections, blocked users, categories, incubators, settings
   */
  const settingsManager: SCSettingsManagerType = useSCSettingsManager(state.user);
  const followedManager: SCFollowedManagerType = useSCFollowedManager(state.user);
  const followersManager: SCFollowersManagerType = useSCFollowersManager(state.user);
  const subscribedIncubatorsManager: SCSubscribedIncubatorsManagerType = useSCSubscribedIncubatorsManager(state.user);
  const connectionsManager: SCConnectionsManagerType = useSCConnectionsManager(state.user);
  const categoriesManager: SCFollowedCategoriesManagerType = useSCFollowedCategoriesManager(state.user, updateUser);
  const blockedUsersManager: SCBlockedUsersManagerType = useSCBlockedUsersManager(state.user);
  const subscribedGroupsManager: SCSubscribedGroupsManagerType = useSCSubscribedGroupsManager(state.user);
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
    if ((state.session.authToken && state.session.authToken.accessToken) || state.session.type === Session.COOKIE_SESSION) {
      dispatch({type: userActionTypes.LOGIN_LOADING});
      UserService.getCurrentUser()
        .then((user: SCUserType) => {
          dispatch({type: userActionTypes.LOGIN_SUCCESS, payload: {user}});
        })
        .catch((error) => {
          Logger.error(SCOPE_SC_CORE, 'Unable to retrieve the authenticated user.');
          dispatch({type: userActionTypes.LOGIN_FAILURE, payload: {error}});
        });
    } else {
      dispatch({type: userActionTypes.LOGIN_FAILURE});
    }
  }, [state.session]);

  /**
   * Controls caching of follow categories, users, etc...
   * To avoid multi-tab problems (only for client side), on visibility change
   * and document is in foreground refresh the cache
   */
  useEffect(() => {
    typeof window !== 'undefined' && window.document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      typeof window !== 'undefined' && window.document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  });

  /**
   * handler handleVisibilityChange for this provider
   * Refresh followed categories, users, etc..
   */
  function handleVisibilityChange() {
    if (isClientSideRendering() && !window.document.hidden && state.user) {
      settingsManager.refresh && settingsManager.refresh();
      refreshCounters();
      categoriesManager.refresh && categoriesManager.refresh();
      followedManager.refresh && followedManager.refresh();
      connectionsManager.refresh && connectionsManager.refresh();
      subscribedIncubatorsManager.refresh && subscribedIncubatorsManager.refresh();
      blockedUsersManager.refresh && blockedUsersManager.refresh();
      subscribedGroupsManager.refresh && subscribedGroupsManager.refresh();
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
    dispatch({type: userActionTypes.UPDATE_USER, payload: {unseen_interactions_counter: Math.max(counter, 0)}});
  }

  /**
   * Handle change unseen notification banners counter
   */
  function setUnseenNotificationBannersCounter(counter): void {
    dispatch({type: userActionTypes.UPDATE_USER, payload: {unseen_notification_banners_counter: Math.max(counter, 0)}});
  }

  /**
   * Helper to refresh the session
   */
  function refreshSession(): Promise<any> {
    return helpers.refreshSession();
  }

  /**
   * Helper to refresh counters
   * Use getCurrentUser service since the counters
   * have been inserted into the serialized user object
   */
  const refreshCounters = useMemo(
    () => () => {
      if (state.user) {
        return UserService.getCurrentUser()
          .then((user: SCUserType) => {
            dispatch({
              type: userActionTypes.UPDATE_USER,
              payload: {
                unseen_interactions_counter: user.unseen_interactions_counter,
                unseen_notification_banners_counter: user.unseen_notification_banners_counter,
                ...(user.followers_counter ? {followers_counter: user.followers_counter} : {}),
                ...(user.followings_counter ? {followings_counter: user.followings_counter} : {}),
                ...(user.categories_counter ? {categories_counter: user.categories_counter} : {}),
                ...(user.discussions_counter ? {discussions_counter: user.discussions_counter} : {}),
                ...(user.posts_counter ? {posts_counter: user.posts_counter} : {}),
                ...(user.statuses_counter ? {status_counter: user.statuses_counter} : {}),
                ...(user.polls_counter ? {polls_counter: user.polls_counter} : {}),
                ...(user.connections_counter ? {connections_counter: user.connections_counter} : {}),
                ...(user.connection_requests_sent_counter ? {connection_requests_sent_counter: user.connection_requests_sent_counter} : {}),
                ...(user.connection_requests_received_counter
                  ? {connection_requests_received_counter: user.connection_requests_received_counter}
                  : {}),
              },
            });
          })
          .catch((error) => {
            Logger.error(SCOPE_SC_CORE, `Unable to refresh counters. Error: ${error.response.toString()}`);
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
    helpers.logoutSession();
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
      refreshCounters,
      logout,
      refreshSession,
      managers: {
        settings: settingsManager,
        categories: categoriesManager,
        followed: followedManager,
        followers: followersManager,
        connections: connectionsManager,
        incubators: subscribedIncubatorsManager,
        blockedUsers: blockedUsersManager,
        groups: subscribedGroupsManager,
      },
    }),
    [
      state,
      settingsManager.all,
      settingsManager.isLoading,
      categoriesManager.loading,
      categoriesManager.categories,
      followedManager.loading,
      followedManager.followed,
      followersManager.loading,
      followersManager.followers,
      connectionsManager.loading,
      connectionsManager.connections,
      blockedUsersManager.blocked,
      subscribedIncubatorsManager.loading,
      subscribedIncubatorsManager.incubators,
      subscribedGroupsManager.loading,
      subscribedGroupsManager.groups,
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
