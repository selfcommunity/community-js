import React from 'react';
import {styled} from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';

const PREFIX = 'SCBaseDialogTitle';

const Root = styled(DialogTitle, {
  name: PREFIX,
  slot: 'Root',
  shouldForwardProp: (prop) => prop !== 'onClose',
  overridesResolver: (props, styles) => [styles.root]
})(({theme}) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing()
}));

export default function ({children = null, onClose = null}) {
  return (
    <Root>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500]
          }}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </Root>
  );
}
