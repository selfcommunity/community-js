import {useEffect, useMemo, useState} from 'react';
import {AxiosResponse} from 'axios';
import {SCOPE_SC_CORE} from '../constants/Errors';
import {http, Endpoints, Logger, SCUserType} from '@selfcommunity/core';

/**
 * Custom hook 'useSCFetchUser'
 * Use this hook to fetch a user object
 * @param initialSession
 */
export default function useSCFetchUser({id = null, user = null}: {id?: string; user?: SCUserType}) {
  const [scUser, setSCUser] = useState<SCUserType>(user);

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
        .then((res: AxiosResponse<SCUserType>) => {
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
          Logger.error(SCOPE_SC_CORE, `User with id ${id} not found`);
          Logger.error(SCOPE_SC_CORE, err.message);
        });
    }
  }, [id]);

  return {scUser, setSCUser};
}
