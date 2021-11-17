import React, {useContext, useState} from 'react';
import {styled} from '@mui/material/styles';
import {SCPreferences, SCPreferencesContext, SCPreferencesContextType, SCUserType} from '@selfcommunity/core';
import Follow from '../Follow';
import Connection from '../Connection';

const PREFIX = 'SCFollowConnect';

// const Root = styled(div, {
//   name: PREFIX,
//   slot: 'Root',
//   overridesResolver: (props, styles) => styles.root
// })(({theme}) => ({}));

function FollowConnect({user = null, followed = null}: {user?: SCUserType; followed?: boolean}): JSX.Element {
  const scPreferencesContext: SCPreferencesContextType = useContext(SCPreferencesContext);
  const followEnabled =
    SCPreferences.CONFIGURATIONS_FOLLOW_ENABLED in scPreferencesContext.preferences &&
    scPreferencesContext.preferences[SCPreferences.CONFIGURATIONS_FOLLOW_ENABLED].value;
  const connectionEnabled = !followEnabled;

  return (
    <React.Fragment>{followEnabled ? <Follow user={user} followed={followed} /> : <Connection user={user} followed={followed} />}</React.Fragment>
  );
}

export default FollowConnect;
