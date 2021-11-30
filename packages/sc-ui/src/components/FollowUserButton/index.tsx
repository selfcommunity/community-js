import React, {useContext, useEffect, useState} from 'react';
import {styled} from '@mui/material/styles';
import {Logger, SCFollowedManagerType, SCUserContext, SCUserContextType, SCUserType, useSCFetchUser} from '@selfcommunity/core';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {LoadingButton} from '@mui/lab';

const PREFIX = 'SCFollowUserButton';

const FollowButton = styled(LoadingButton, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  border: '0px',
  color: 'black',
  borderRadius: 20,
  backgroundColor: '#e2e2e2',
  paddingTop: '4px',
  paddingRight: '16px',
  paddingBottom: '4px',
  paddingLeft: '16px'
}));

export default function FollowUserButton({userId = null, user = null, ...rest}: {userId?: number; user?: SCUserType; [p: string]: any}): JSX.Element {
  const {scUser, setSCUser} = useSCFetchUser({id: userId, user});
  const [followed, setFollowed] = useState<boolean>(true);
  const scUserContext: SCUserContextType = useContext(SCUserContext);
  const scFollowedManager: SCFollowedManagerType = scUserContext.managers.followed;

  useEffect(() => {
    setFollowed(scFollowedManager.isFollowed(scUser));
  });

  const followCUser = () => {
    scFollowedManager.follow(scUser).catch((e) => {
      Logger.error(SCOPE_SC_UI, e);
    });
  };

  return (
    <FollowButton size="small" variant="outlined" onClick={followCUser} loading={scFollowedManager.isLoading(scUser)} {...rest}>
      {followed ? 'Unfollow' : 'Follow'}
    </FollowButton>
  );
}
