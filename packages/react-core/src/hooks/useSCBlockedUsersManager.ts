import {useEffect, useMemo, useState} from 'react';
import {http, Endpoints, HttpResponse} from '@selfcommunity/api-services';
import {SCUserType} from '@selfcommunity/types';
import {Logger} from '@selfcommunity/utils';
import {SCOPE_SC_CORE} from '../constants/Errors';
import {UserService} from '@selfcommunity/api-services';

/**
 :::info
 This custom hook is used to manage blocked users.
 :::
 :::tipHow to use it:

 Follow these steps:
 ```jsx
 1. const scUserContext: SCUserContextType = useSCUser();
 2. const scBlockedUsersManager: SCBlockedUsersManagerType = scUserContext.manager.blockedUsers;
 3. scBlockedUsersManager.isBlocked(user)
 ```
 :::
 */
export default function useSCBlockedUsersManager(user?: SCUserType) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<number[]>([]);

  // CONST
  const authUserId = user ? user.id : null;

  /**
   * Memoized isLoading
   */
  const isLoading = useMemo(
    () => (): boolean => {
      return loading;
    },
    [loading]
  );

  /**
   * Memoized refresh all blocked users
   * It makes a single request to the server and retrieves
   * all blocked users by the authenticated user in a single solution
   * It might be useful for multi-tab sync
   */
  const refresh = useMemo(
    () =>
      (setLoadingStatus = false): Promise<number[]> => {
        if (user) {
          setLoadingStatus && setLoading(true);
          // Only if user is authenticated
          return UserService.getHiddenUsersId()
            .then((res) => {
              setData(res);
              setLoadingStatus && setLoading(false);
              return Promise.resolve(res);
            })
            .catch((e) => {
              Logger.error(SCOPE_SC_CORE, 'Unable to load blocked users.');
              Logger.error(SCOPE_SC_CORE, e);
              setLoadingStatus && setLoading(false);
              return Promise.reject(e);
            });
        }
        return Promise.reject();
      },
    [data, user]
  );

  /**
   * Memoized block/unblock User
   * Toggle action
   */
  const block = useMemo(
    () =>
      (user: SCUserType): Promise<any> => {
        setLoading(true);
        return http
          .request({
            url: Endpoints.UserShowHide.url({id: user.id}),
            method: Endpoints.UserShowHide.method,
          })
          .then((res: HttpResponse<any>) => {
            if (res.status >= 300) {
              return Promise.reject(res);
            }
            const isBlocked = data.includes(user.id);
            const _data = isBlocked ? [...data.filter((id) => id !== user.id)] : [...[user.id], ...data];
            setData(_data);
            setLoading(false);
            return Promise.resolve(!isBlocked);
          });
      },
    [loading, data.length, setLoading]
  );

  /**
   * Memoized isBlocked
   * If user is already in cache -> check if the user is blocked,
   * otherwise, check if authenticathed user has block the user
   */
  const isBlocked = useMemo(
    () =>
      (user: SCUserType): boolean => {
        if (authUserId) {
          return data.includes(user.id);
        }
        return false;
      },
    [data]
  );

  /**
   * Refresh cache on login
   * Empty cache on logout
   */
  useEffect(() => {
    if (authUserId) {
      refresh(true);
    } else {
      setData([]);
    }
  }, [authUserId]);

  if (!user) {
    return {blocked: data, loading, isLoading};
  }
  return {blocked: data, loading, isLoading, block, isBlocked, refresh};
}
