import React, {useContext, useEffect, useState} from 'react';
import {styled} from '@mui/material/styles';
import {SCConnectionStatus, SCUserType} from '@selfcommunity/types';
import classNames from 'classnames';
import {useThemeProps} from '@mui/system';
import {useSnackbar} from 'notistack';
import {FormattedMessage} from 'react-intl';
import {LoadingButton} from '@mui/lab';
import {
  SCConnectionsManagerType,
  SCContextType,
  SCUserContext,
  SCUserContextType,
  UserUtils,
  useSCContext,
  useSCFetchUser
} from '@selfcommunity/react-core';

const PREFIX = 'SCFriendshipUserButton';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(LoadingButton, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(() => ({}));

export interface FriendshipButtonProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
  /**
   * Id of the user
   * @default null
   */
  userId?: number;

  /**
   * User
   * @default null
   */
  user?: SCUserType;

  /**
   * onChangeConnectionStatus callback
   * @param user
   * @param status
   */
  onChangeConnectionStatus?: (user: SCUserType, status: string) => any;

  /**
   * Others properties
   */
  [p: string]: any;
}

// TODO: fix component
/**
 * > API documentation for the Community-JS Friendship User Button component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {FriendshipUserButton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCFriendshipUserButton` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCFriendshipUserButton-root|Styles applied to the root element.|

 * @param inProps
 */
export default function FriendshipUserButton(inProps: FriendshipButtonProps): JSX.Element {
  // PROPS
  const props: FriendshipButtonProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className, userId, user, ...rest} = props;

  // CONTEXT
  const scContext: SCContextType = useSCContext();
  const scUserContext: SCUserContextType = useContext(SCUserContext);
  const scConnectionsManager: SCConnectionsManagerType = scUserContext.managers.connections;
  const {enqueueSnackbar} = useSnackbar();

  // STATE
  const {scUser} = useSCFetchUser({id: userId, user});
  const [status, setStatus] = useState<string>(null);

  // CONST
  const authUserId = scUserContext.user ? scUserContext.user.id : null;

  /**
   * Handle actions
   */
  const handleConnectionStatus = (): void => {
    if (!scUserContext.user) {
      scContext.settings.handleAnonymousAction();
    } else if (UserUtils.isBlocked(scUserContext.user)) {
      enqueueSnackbar(<FormattedMessage id="ui.common.userBlocked" defaultMessage="ui.common.userBlocked" />, {
        variant: 'warning',
        autoHideDuration: 3000
      });
    } else {
      if (status === SCConnectionStatus.CONNECTED) {
        scConnectionsManager.removeConnection(scUser);
      } else if (status === SCConnectionStatus.CONNECTION_REQUEST_SENT) {
        scConnectionsManager.cancelRequestConnection(scUser);
      } else if (status === SCConnectionStatus.CONNECTION_REQUEST_RECEIVED) {
        scConnectionsManager.acceptConnection(scUser);
      } else if (status === null) {
        scConnectionsManager.requestConnection(scUser);
      }
    }
  };

  /**
   * Get current translated status
   */
  const getStatus = (): void => {
    let _status;
    switch (status) {
      case SCConnectionStatus.CONNECTED:
        _status = <FormattedMessage defaultMessage="ui.friendshipUserButton.removeConnection" id="ui.friendshipUserButton.removeConnection" />;
        break;
      case SCConnectionStatus.CONNECTION_REQUEST_SENT:
        _status = (
          <FormattedMessage defaultMessage="ui.friendshipUserButton.cancelConnectionRequest" id="ui.friendshipUserButton.cancelConnectionRequest" />
        );
        break;
      case SCConnectionStatus.CONNECTION_REQUEST_RECEIVED:
        _status = <FormattedMessage defaultMessage="ui.friendshipUserButton.acceptConnection" id="ui.friendshipUserButton.acceptConnection" />;
        break;
      default:
        _status = <FormattedMessage defaultMessage="ui.friendshipUserButton.requestConnection" id="ui.friendshipUserButton.requestConnection" />;
        break;
    }
    return _status;
  };

  useEffect(() => {
    /**
     * Call scConnectionsManager.isFollowed inside an effect
     * to avoid warning rendering child during update parent state
     */
    if (authUserId && authUserId !== scUser.id) {
      const _status = scConnectionsManager.status(scUser);
      setStatus(_status);
    }
  }, [authUserId, scConnectionsManager.status]);

  // same user
  if (scUserContext.user && scUserContext.user.id === scUser.id) {
    return null;
  }

  return (
    <Root
      size="small"
      variant="outlined"
      loading={scUserContext.user ? scConnectionsManager.isLoading(scUser) : null}
      onClick={handleConnectionStatus}
      className={classNames(classes.root, className)}
      {...rest}>
      {getStatus()}
    </Root>
  );
}
