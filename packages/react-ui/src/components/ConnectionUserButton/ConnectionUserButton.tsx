import React, {useContext} from 'react';
import {styled} from '@mui/material/styles';
import {SCPreferences, SCPreferencesContext, SCPreferencesContextType} from '@selfcommunity/react-core';
import {SCUserType} from '@selfcommunity/types';
import {Box} from '@mui/material';
import FollowUserButton, {FollowUserButtonProps} from '../FollowUserButton';
import FriendshipUserButton, {FriendshipButtonProps} from '../FriendshipUserButton';
import useThemeProps from '@mui/material/styles/useThemeProps';

const PREFIX = 'SCConnectionUserButton';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));

export interface ConnectionUserButtonProps {
  /**
   * User Object
   * @default null
   */
  user?: SCUserType;
  /**
   * Props to spread to follow/friendship button
   * @default {}
   */
  followConnectUserButtonProps?: FollowUserButtonProps | FriendshipButtonProps;

  /**
   * Any other properties
   */
  [p: string]: any;
}

/**
 > API documentation for the Community-JS Connection User Button component. Learn about the available props and the CSS API.
 *
 #### Import
 ```jsx
 import {ConnectionUserButton} from '@selfcommunity/react-ui';
 ```
 #### Component Name
 The name `SCConnectionUserButton` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCConnectionUserButton-root|Styles applied to the root element.|

 * @param inProps
 */
export default function ConnectionUserButton(inProps: ConnectionUserButtonProps): JSX.Element {
  // PROPS
  const props: ConnectionUserButtonProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
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
