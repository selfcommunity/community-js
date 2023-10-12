import React, { ReactElement } from 'react';
import {IconButton as MUIIconButton} from '@mui/material';
import Icon from '@mui/material/Icon';

export default (props: any): ReactElement => {
  return (
    <MUIIconButton {...props} aria-label="add multimedia">
      <Icon>image</Icon>
    </MUIIconButton>
  );
};
