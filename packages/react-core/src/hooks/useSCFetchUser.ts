import {useEffect, useMemo, useState} from 'react';
import {SCOPE_SC_CORE} from '../constants/Errors';
import {SCUserType} from '@selfcommunity/types';
import {http, Endpoints, HttpResponse} from '@selfcommunity/api-services';
import {Logger} from '../utils/logger';

/**
 :::info
 This custom hook is used to fetch a user object.
 :::
 * @param object
 * @param object.id
 * @param object.user
 */
export default function useSCFetchUser({id = null, user = null}: {id?: number; user?: SCUserType}) {
  const [scUser, setSCUser] = useState<SCUserType>(user);
  const [error, setError] = useState<string>(null);

  /**
   * Memoized fetchUser
   */
  const fetchUser = useMemo(
    () => () => {
      return http
        .request({
          url: Endpoints.User.url({id: id}),
          method: Endpoints.User.method,
        })
        .then((res: HttpResponse<SCUserType>) => {
          if (res.status >= 300) {
            return Promise.reject(res);
          }
          return Promise.resolve(res.data);
        });
    },
    [id]
  );

  /**
   * If id resolve the obj
   */
  useEffect(() => {
    if (id) {
      fetchUser()
        .then((obj: SCUserType) => {
          setSCUser(obj);
        })
        .catch((err) => {
          setError(`User with id ${id} not found`);
          Logger.error(SCOPE_SC_CORE, `User with id ${id} not found`);
          Logger.error(SCOPE_SC_CORE, err.message);
        });
    }
  }, [id]);

  return {scUser, setSCUser, error};
}
