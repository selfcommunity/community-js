import React from 'react';
import {styled} from '@mui/material/styles';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import {FormattedMessage} from 'react-intl';
import useMediaQuery from '@mui/material/useMediaQuery';
import Title from './title';

const PREFIX = 'SCBaseDialog';

const Root = styled(Dialog, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  [theme.breakpoints.down(500)]: {
    minWidth: 300
  },
  minWidth: 500
}));

export default function BaseDialog({
  title = '',
  open = false,
  onClose = null,
  ...rest
}: {
  title: any;
  open: boolean;
  onClose: () => any;
  [p: string]: any;
}) {
  const {children} = rest;
  const fullScreen = useMediaQuery((theme) => theme['breakpoints'].down('sm'));
  return (
    <Root fullScreen={fullScreen} fullWidth open={open} onClose={onClose} maxWidth={rest.maxWidth ? rest.maxWidth : 'sm'} scroll="body">
      <Title onClose={onClose}>{title}</Title>
      <DialogContent dividers>{children}</DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" autoFocus variant={'outlined'}>
          <FormattedMessage id="ui.baseDialog.button.close" defaultMessage="ui.baseDialog.button.close" />
        </Button>
      </DialogActions>
    </Root>
  );
}
