import React from 'react';
import {IconButton as MUIIconButton} from '@mui/material';
import ImageIcon from '@mui/icons-material/ImageOutlined';

export default (props: any): JSX.Element => {
  return (
    <MUIIconButton {...props} aria-label="upload image">
      <ImageIcon />
    </MUIIconButton>
  );
};
