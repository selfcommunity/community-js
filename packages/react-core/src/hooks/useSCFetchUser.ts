import {useEffect, useMemo, useState} from 'react';
import {SCOPE_SC_CORE} from '../constants/Errors';
import {SCUserType} from '@selfcommunity/types';
import {http, Endpoints, HttpResponse} from '@selfcommunity/api-services';
import {Logger, objectWithoutProperties} from '@selfcommunity/utils';
import {useSCUser} from '../components/provider/SCUserProvider';
import {SCUserContextType} from '../types/context';

/**
 :::info
 This custom hook is used to fetch a user object.
 :::
 * @param object
 * @param object.id
 * @param object.user
 */
export default function useSCFetchUser({id = null, user = null}: {id?: number | string; user?: SCUserType}) {
  // CONTEXT
  const scUserContext: SCUserContextType = useSCUser();
  const authUserId = scUserContext.user ? scUserContext.user.id : null;

  const __user = useMemo(() => (authUserId ? user : objectWithoutProperties<SCUserType>(user, ['connection_status'])), [user]);

  const [scUser, setSCUser] = useState<SCUserType>(__user);
  const [error, setError] = useState<string>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  /**
   * Memoized fetchUser
   */
  const fetchUser = useMemo(
    () => () => {
      return http
        .request({
          url: Endpoints.User.url({id: user ? user.id : id}),
          method: Endpoints.User.method,
        })
        .then((res: HttpResponse<SCUserType>) => {
          if (res.status >= 300) {
            return Promise.reject(res);
          }
          return Promise.resolve(res.data);
        });
    },
    [id, user]
  );

  /**
   * Memoized refresh
   */
  const refresh = useMemo(
    () => () => {
      if (!refreshing) {
        setRefreshing(true);
        return fetchUser()
          .then((obj: SCUserType) => {
            setRefreshing(false);
            setSCUser(authUserId ? obj : objectWithoutProperties<SCUserType>(obj, ['connection_status']));
          })
          .catch((err) => {
            setRefreshing(false);
            setError(`Unable to refresh user with id ${id}`);
            Logger.error(SCOPE_SC_CORE, `Unable to refresh user with id ${id}`);
            Logger.error(SCOPE_SC_CORE, err.message);
          });
      }
      return Promise.reject();
    },
    [fetchUser, refreshing]
  );

  /**
   * If id resolve the obj
   */
  useEffect(() => {
    if (id) {
      fetchUser()
        .then((obj: SCUserType) => {
          setSCUser(authUserId ? obj : objectWithoutProperties<SCUserType>(obj, ['connection_status']));
        })
        .catch((err) => {
          setError(`User with id ${id} not found`);
          Logger.error(SCOPE_SC_CORE, `User with id ${id} not found`);
          Logger.error(SCOPE_SC_CORE, err.message);
        });
    } else {
      setSCUser(__user);
    }
  }, [id, __user]);

  return {scUser, setSCUser, refresh, refreshing, error};
}
