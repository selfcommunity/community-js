import React from 'react';
import {IconButton as MUIIconButton} from '@mui/material';
import Icon from '@mui/material/Icon';

export default (props: any): JSX.Element => {
  return (
    <MUIIconButton {...props} aria-label="upload image">
      <Icon>image</Icon>
    </MUIIconButton>
  );
};
