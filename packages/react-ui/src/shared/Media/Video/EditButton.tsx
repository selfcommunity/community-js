import React from 'react';
import {IconButton as MUIIconButton} from '@mui/material';
import Icon from '@mui/material/Icon';

export default (props: any): JSX.Element => {
  return (
    <MUIIconButton {...props} aria-label="upload video">
      <Icon>play_circle_outline</Icon>
    </MUIIconButton>
  );
};
