import React, {useContext} from 'react';
import {styled} from '@mui/material/styles';
import {SCPreferences, SCPreferencesContext, SCPreferencesContextType} from '@selfcommunity/core';
import {Box} from '@mui/material';
import FollowUserButton from '../FollowUserButton';
import FriendshipUserButton from '../FriendshipUserButton';

const PREFIX = 'SCConnectionUserButton';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));

export default function ConnectionUserButton(props): JSX.Element {
  // PROPS
  const {user = null, followConnectUserButtonProps = {}, ...rest} = props;

  // CONTEXT
  const scPreferencesContext: SCPreferencesContextType = useContext(SCPreferencesContext);
  const followEnabled =
    SCPreferences.CONFIGURATIONS_FOLLOW_ENABLED in scPreferencesContext.preferences &&
    scPreferencesContext.preferences[SCPreferences.CONFIGURATIONS_FOLLOW_ENABLED].value;

  return (
    <React.Fragment>
      {followEnabled ? (
        <FollowUserButton user={user} {...followConnectUserButtonProps} {...rest} />
      ) : (
        <FriendshipUserButton user={user} {...followConnectUserButtonProps} {...rest} />
      )}
    </React.Fragment>
  );
}
