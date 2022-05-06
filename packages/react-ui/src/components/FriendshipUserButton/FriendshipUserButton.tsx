import React, {useContext, useState} from 'react';
import {styled} from '@mui/material/styles';
import {Button} from '@mui/material';
import {http, Endpoints} from '@selfcommunity/api-services';
import {SCContextType, SCUserContext, SCUserContextType, useSCContext, useSCFetchUser} from '@selfcommunity/react-core';
import {SCUserType} from '@selfcommunity/types';
import {AxiosResponse} from 'axios';
import classNames from 'classnames';
import useThemeProps from '@mui/material/styles/useThemeProps';

const PREFIX = 'SCFriendshipUserButton';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(Button, {
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
 * > API documentation for the Community-UI Friendship User Button component. Learn about the available props and the CSS API.

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
  const {className, userId, user, connected, ...rest} = props;

  // STATE
  const [status, setStatus] = useState<any>(connected ? 'Remove' : 'Connect');
  const {scUser, setSCUser} = useSCFetchUser({id: userId, user});

  // CONTEXT
  const scContext: SCContextType = useSCContext();
  const scUserContext: SCUserContextType = useContext(SCUserContext);

  function updateStatus(status) {
    if (status === 'Connect') {
      setStatus('Remove');
    } else {
      setStatus('Connect');
    }
  }

  function requestConnection() {
    updateStatus(status);
    http
      .request({
        url: Endpoints.RequestConnection.url({id: user.id}),
        method: Endpoints.RequestConnection.method
      })
      .then((res: AxiosResponse<any>) => {
        console.log(res);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function cancelConnectionRequest() {
    console.log('connection');
    http
      .request({
        url: Endpoints.CancelConnectionRequest.url({id: user.id}),
        method: Endpoints.CancelConnectionRequest.method
      })
      .then((res: AxiosResponse<any>) => {
        console.log(res);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function removeConnection() {
    http
      .request({
        url: Endpoints.RemoveConnection.url({id: user.id}),
        method: Endpoints.RemoveConnection.method
      })
      .then((res: AxiosResponse<any>) => {
        console.log(res);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function handleConnectionStatus() {
    if (!scUserContext.user) {
      scContext.settings.handleAnonymousAction();
    } else {
      connected ? removeConnection() : requestConnection();
    }
  }

  // same user
  if (scUserContext.user && scUserContext.user.id === scUser.id) {
    return null;
  }

  return (
    <Root size="small" variant="outlined" onClick={() => handleConnectionStatus()} className={classNames(classes.root, className)}>
      {status}
    </Root>
  );
}
