import React, {useContext, useState} from 'react';
import {styled} from '@mui/material/styles';
import {Button} from '@mui/material';
import {Endpoints, http, SCUserType} from '@selfcommunity/core';
import {AxiosResponse} from 'axios';

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
function FriendshipUserButton({userId = null, user = null, connected = null}: FriendshipButtonProps): JSX.Element {
  const [status, setStatus] = useState<any>(connected ? 'Remove' : 'Connect');

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
    {
      connected ? removeConnection() : requestConnection();
    }
  }

  return (
    <Root size="small" variant="outlined" onClick={() => handleConnectionStatus()} className={classes.root}>
      {status}
    </Root>
  );
}

export default FriendshipUserButton;
