import React from 'react';
import {styled} from '@mui/material/styles';
import {Box} from '@mui/material';
import {UserProfileHeader} from '@selfcommunity/ui';
import {useSCFetchUser} from '@selfcommunity/core';
import UserFeed from '../UserFeed';

const PREFIX = 'SCUserProfileTemplate';

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  marginTop: theme.spacing(2)
}));

export interface UserProfileProps {
  /**
   * Id of the feed object
   * @default 'feed'
   */
  id?: string;

  /**
   * Override or extend the styles applied to the component.
   * @default null
   */
  className?: string;

  /**
   * Id of the user for filter the feed
   * @default null
   */
  userId?: number;
}

export default function UserProfile(props: UserProfileProps): JSX.Element {
  // PROPS
  const {id = 'user', className, userId} = props;

  // CONTEXT
  const {scUser, setSCUser} = useSCFetchUser({id: userId});

  return (
    <Root id={id} className={className}>
      <UserProfileHeader userId={userId} user={scUser} />
      <UserFeed userId={userId} />
    </Root>
  );
}
