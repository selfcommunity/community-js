import React from 'react';
import {styled} from '@mui/material/styles';
import {Button} from '@mui/material';
import {Endpoints, http, SCUserType} from '@selfcommunity/core';
import {AxiosResponse} from 'axios';

const PREFIX = 'SCFollow';

const FollowButton = styled(Button, {
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

function Follow({user = null, followed = null}: {user?: SCUserType; followed?: boolean}): JSX.Element {
  const status = followed ? 'Unfollow' : 'Follow';

  function followUser() {
    http
      .request({
        url: Endpoints.FollowUser.url({id: user.id}),
        method: Endpoints.FollowUser.method
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
      <FollowButton size="small" variant="outlined" onClick={() => followUser()}>
        {status}
      </FollowButton>
    </React.Fragment>
  );
}

export default Follow;
