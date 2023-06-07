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
export default function useSCFetchUserBlockedBy({
  user = null,
  blockedByUser = null,
  sync = true,
}: {
  user: SCUserType;
  blockedByUser?: boolean | null;
  sync?: boolean;
}) {
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
    () =>
      (user: SCUserType, setLoadingStatus = true) => {
        setLoadingStatus && setLoading(true);
        return UserService.checkUserHiddenBy(user.id)
          .then((res: SCUserHiddenByStatusType) => {
            setLoadingStatus && setLoading(false);
            setBlockedBy(res.is_hidden_by);
            return Promise.resolve(res.is_hidden_by);
          })
          .catch((e) => {
            setLoadingStatus && setLoading(false);
            Logger.error(SCOPE_SC_CORE, 'Unable to load user blocked by.');
            Logger.error(SCOPE_SC_CORE, e);
            setError(e);
          });
      },
    [loading, setBlockedBy]
  );

  /**
   * If user attempt to get blocked by
   */
  useEffect(() => {
    if (authUserId && user && loading && blockedBy === null) {
      if (authUserId !== user.id) {
        fetchUserBlockedBy(user);
      } else {
        setLoading(false);
      }
    }
  }, [authUserId, user, fetchUserBlockedBy, blockedBy]);

  /**
   * If sync enabled pull the remote status every 5sec
   */
  useEffect(() => {
    let interval;
    if (authUserId && blockedBy !== null && sync) {
      interval = setInterval(() => {
        fetchUserBlockedBy(user, false);
      }, 5000);
      return () => {
        interval && clearInterval(interval);
      };
    }
  }, [authUserId, user, fetchUserBlockedBy, blockedBy]);

  return {blockedBy, loading, error};
}
