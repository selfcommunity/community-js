import React from 'react';
import {styled} from '@mui/material/styles';
import {SCUserType, useSCFetchUser} from '@selfcommunity/core';
import {LoadingButton} from '@mui/lab';

const PREFIX = 'SCUserFollowButton';

const SCButton = styled(LoadingButton, {
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

function UserFollowButton({
  children = null,
  userId = null,
  user = null,
  followed = false,
  loading = true,
  ...rest
}: {
  children?: React.ReactNode;
  userId?: number;
  user?: SCUserType;
  followed?: boolean;
  [p: string]: any;
}): JSX.Element {
  const {scUser, setSCUser} = useSCFetchUser({id: userId, user});
  const buttonText = followed ? 'Unfollow' : 'Follow';

  const followUser = () => {};

  return (
    <SCButton size="small" onClick={followUser} loading={loading} {...rest}>
      {buttonText}
    </SCButton>
  );
}

export default UserFollowButton;
