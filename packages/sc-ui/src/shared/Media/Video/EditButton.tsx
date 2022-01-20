import React from 'react';
import {IconButton as MUIIconButton} from '@mui/material';
import VideoIcon from '@mui/icons-material/PlayCircleOutlineOutlined';

export default (props: any): JSX.Element => {
  return (
    <MUIIconButton {...props} aria-label="upload video">
      <VideoIcon />
    </MUIIconButton>
  );
};
