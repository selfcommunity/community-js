import React from 'react';
import {IconButton as MUIIconButton} from '@mui/material';
import DocumentIcon from '@mui/icons-material/PictureAsPdfOutlined';

export default (props: any): JSX.Element => {
  return (
    <MUIIconButton {...props} aria-label="upload document">
      <DocumentIcon />
    </MUIIconButton>
  );
};
