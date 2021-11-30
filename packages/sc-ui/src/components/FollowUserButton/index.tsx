import React, {useContext, useEffect, useState} from 'react';
import {styled} from '@mui/material/styles';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {LoadingButton} from '@mui/lab';
import {FormattedMessage} from 'react-intl';
import {Logger, SCFollowedManagerType, SCUserContext, SCUserContextType, SCUserType, useSCFetchUser} from '@selfcommunity/core';

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

export default function FollowUserButton({
  userId = null,
  user = null,
  onFollow = null,
  ...rest
}: {
  userId?: number;
  user?: SCUserType;
  onFollow?: (user: SCUserType, followed: boolean) => any;
  [p: string]: any;
}): JSX.Element {
  const {scUser, setSCUser} = useSCFetchUser({id: userId, user});
  const [followed, setFollowed] = useState<boolean>(null);
  const scUserContext: SCUserContextType = useContext(SCUserContext);
  const scFollowedManager: SCFollowedManagerType = scUserContext.managers.followed;

  useEffect(() => {
    /**
     * Call scFollowedManager.isFollowed inside an effect
     * to avoid warning rendering child during update parent state
     */
    setFollowed(scFollowedManager.isFollowed(scUser));
  });

  const followCUser = () => {
    scFollowedManager
      .follow(scUser)
      .then(() => {
        onFollow && onFollow(scUser, !followed);
      })
      .catch((e) => {
        Logger.error(SCOPE_SC_UI, e);
      });
  };

  return (
    <FollowButton size="small" variant="outlined" onClick={followCUser} loading={followed === null || scFollowedManager.isLoading(scUser)} {...rest}>
      {followed ? (
        <FormattedMessage defaultMessage="ui.followUserButton.unfollow" id="ui.followUserButton.unfollow" />
      ) : (
        <FormattedMessage defaultMessage="ui.followUserButton.follow" id="ui.followUserButton.follow" />
      )}
    </FollowButton>
  );
}
