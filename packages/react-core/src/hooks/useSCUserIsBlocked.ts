import {SCUserType} from '@selfcommunity/types';
import {useMemo} from 'react';
import useSCFetchUserBlockedBy from './useSCFetchUserBlockedBy';
import {useSCUser} from '../components/provider/SCUserProvider';

/**
 :::info
 This custom hook is used to check if the user is blocked by me or I am blocked by him.
 :::
 :::tipHow to use it:

 Follow these steps:
 ```jsx
 1. import useUserIsBlocked from '@selfcommunity/react-core';
 2.	const {blocked, loading: loadingBlockedBy} = useUserIsBlocked(user);
 ```
 :::
 */
export default function useSCUserIsBlocked(user: SCUserType) {
  // CONTEXT
  const scUserContext = useSCUser();

  // HOOKS
  const {blockedBy, loading: loadingBlockedBy} = useSCFetchUserBlockedBy({user});

  // CONST
  const isMe = useMemo(() => scUserContext.user && user.id === scUserContext.user.id, [scUserContext.user, user]);

  // Status blocked
  const blocked = !isMe && user && Boolean((scUserContext.user && scUserContext.managers.blockedUsers.isBlocked(user)) || blockedBy);
  // Status loading
  const loading = scUserContext.user && (scUserContext.managers.blockedUsers.isLoading() || loadingBlockedBy);

  return {blocked, loading};
}
