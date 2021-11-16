import React from 'react';
import {IconButton as MUIIconButton} from '@mui/material';
import LinkIcon from '@mui/icons-material/LinkOutlined';

export default (props: any): JSX.Element => {
  return (
    <MUIIconButton {...props} aria-label="add link">
      <LinkIcon />
    </MUIIconButton>
  );
};
