import React from 'react';
import {styled} from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Icon from '@mui/material/Icon';
import DialogTitle from '@mui/material/DialogTitle';
import {useTheme} from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';

const PREFIX = 'SCBaseDialogTitle';

const Root = styled(DialogTitle, {
  name: PREFIX,
  slot: 'Root',
  shouldForwardProp: (prop) => prop !== 'onClose',
  overridesResolver: (props, styles) => [styles.root]
})(({theme}) => ({
  display: 'flex',
  alignItems: 'center',
  padding: '9px 10px 9px 15px'
}));

const Mobile = styled(DialogTitle, {
  name: PREFIX,
  slot: 'Root',
  shouldForwardProp: (prop) => prop !== 'onClose',
  overridesResolver: (props, styles) => [styles.root]
})(({theme}) => ({
  fontSize: '1rem',
  display: 'flex',
  alignItems: 'center',
  padding: '9px 10px 9px 0px'
}));

export default function ({children = null, onClose = null}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  return (
    <>
      {isMobile ? (
        <Mobile>
          {onClose ? (
            <IconButton aria-label="close" onClick={onClose} sx={{color: (theme) => theme.palette.grey[500]}}>
              <Icon>arrow_back</Icon>
            </IconButton>
          ) : null}
          {children}
        </Mobile>
      ) : (
        <Root>
          {children}
          {onClose ? (
            <IconButton
              aria-label="close"
              onClick={onClose}
              sx={{
                position: 'absolute',
                right: 8,
                top: 5,
                color: (theme) => theme.palette.grey[500]
              }}>
              <Icon>close</Icon>
            </IconButton>
          ) : null}
        </Root>
      )}
    </>
  );
}
