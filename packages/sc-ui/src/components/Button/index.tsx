import React, {useState} from 'react';
import {styled} from '@mui/material/styles';
import {Button} from '@mui/material';
import {SCCategoryType} from '@selfcommunity/core/src/types';
import {Endpoints, http} from '@selfcommunity/core';
import {AxiosResponse} from 'axios';

const PREFIX = 'SCFollowButton';

const SCButton = styled(Button, {
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

function FollowButton({
  onClick,
  children,
  scCategoryId
}: {
  onClick?: () => void | undefined;
  children?: React.ReactNode;
  scCategoryId?: number;
}): JSX.Element {
  function followCategory() {
    http
      .request({
        url: Endpoints.FollowCategory.url({id: scCategoryId}),
        method: Endpoints.FollowCategory.method
      })
      .then((res: AxiosResponse<any>) => {
        console.log(res);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <SCButton size="small" onClick={() => followCategory()}>
      {children}
    </SCButton>
  );
}

export default FollowButton;
