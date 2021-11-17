import React, {useContext, useState} from 'react';
import {styled} from '@mui/material/styles';
import {Button} from '@mui/material';
import {Endpoints, http, SCUserType} from '@selfcommunity/core';
import {AxiosResponse} from 'axios';

const PREFIX = 'SCConnection';

const ConnectionButton = styled(Button, {
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

function Connection({user = null, followed = null}: {user?: SCUserType; followed?: boolean}): JSX.Element {
  function requestConnection() {
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
    console.log('connection');
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

  return (
    <React.Fragment>
      {followed ? (
        <ConnectionButton size="small" variant="outlined" onClick={() => removeConnection()}>
          Remove
        </ConnectionButton>
      ) : (
        <ConnectionButton size="small" variant="outlined" onClick={() => requestConnection()}>
          Connect
        </ConnectionButton>
      )}
    </React.Fragment>
  );
}

export default Connection;
