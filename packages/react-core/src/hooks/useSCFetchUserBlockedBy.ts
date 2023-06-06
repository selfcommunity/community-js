import {useEffect, useMemo, useState} from 'react';
import {SCOPE_SC_CORE} from '../constants/Errors';
import {SCUserHiddenByStatusType, SCUserType} from '@selfcommunity/types';
import {UserService} from '@selfcommunity/api-services';
import {Logger} from '@selfcommunity/utils';
import {SCUserContextType, useSCUser} from '@selfcommunity/react-core';

/**
 :::info
 This custom hook is used to fetch if a user is blocked by another user.
 :::
 * @param user
 * @param blockedByUser
 */
export default function useSCFetchUserBlockedBy({user = null, blockedByUser = null}: {user: SCUserType; blockedByUser?: boolean | null}) {
  const [blockedBy, setBlockedBy] = useState<boolean>(blockedByUser);
  const [loading, setLoading] = useState(blockedByUser === null);
  const [error, setError] = useState<string>(null);

  // CONTEXT
  const scUserContext: SCUserContextType = useSCUser();
  const authUserId = scUserContext.user ? scUserContext.user.id : null;

  /**
   * Memoized fetchUserBlockedBy
   */
  const fetchUserBlockedBy = useMemo(
    () => (user) => {
      setLoading(true);
      return UserService.checkUserHiddenBy(user.id)
        .then((res: SCUserHiddenByStatusType) => {
          setLoading(false);
          setBlockedBy(res.is_hidden_by);
          return Promise.resolve(res.is_hidden_by);
        })
        .catch((e) => {
          setLoading(false);
          Logger.error(SCOPE_SC_CORE, 'Unable to load user blocked by.');
          Logger.error(SCOPE_SC_CORE, e);
          setError(e);
        });
    },
    [loading]
  );

  /**
   * If user attempt to get blocked by
   */
  useEffect(() => {
    if (authUserId && user && loading && blockedByUser === null) {
      if (authUserId !== user.id) {
        fetchUserBlockedBy(user);
      } else {
        setLoading(false);
      }
    }
  }, [authUserId, user, fetchUserBlockedBy]);

  return {blockedBy, loading, error};
}
