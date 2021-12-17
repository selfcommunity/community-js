import React, {useContext} from 'react';
import {styled} from '@mui/material/styles';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import {Dialog, DialogTitle, DialogActions, DialogContentText, DialogContent} from '@mui/material';
import {SCUserContext, SCUserContextType} from '@selfcommunity/core';
import {FormattedMessage} from 'react-intl';
import {LoadingButton} from '@mui/lab';

const PREFIX = 'SCConfirmDialog';

const Root = styled(Card, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  maxWidth: 800,
  marginBottom: theme.spacing(2)
}));

export default function ConfirmDialog({
  open,
  title,
  content = null,
  btnConfirm = null,
  btnCancel = null,
  isUpdating = false,
  onClose = null,
  onConfirm = null,
  disableBackdropClick = false,
  ...rest
}: {
  open: boolean;
  title: React.ReactNode;
  content?: React.ReactNode;
  btnConfirm?: React.ReactNode;
  btnCancel?: React.ReactNode;
  isUpdating?: boolean;
  onClose?: () => void;
  onConfirm?: () => void;
  disableBackdropClick?: boolean;
  [p: string]: any;
}): JSX.Element {
  const scUser: SCUserContextType = useContext(SCUserContext);

  /**
   * Handle close dialog
   * @param reason
   */
  function handleClose(reason) {
    if (disableBackdropClick && (reason === 'backdropClick' || reason === 'escapeKeyDown')) {
      return false;
    }
    if (!isUpdating) {
      onClose && onClose();
    }
  }

  /**
   * Handle confirm action
   */
  function handleConfirm() {
    onConfirm && onConfirm();
  }

  return (
    <Root>
      <Dialog open={open} onClose={handleClose} {...rest}>
        <DialogTitle>{title}</DialogTitle>
        {content && (
          <DialogContent>
            <DialogContentText component="div">{content}</DialogContentText>
          </DialogContent>
        )}
        <DialogActions>
          <Button onClick={handleClose}>
            {btnCancel ? btnCancel : <FormattedMessage id="ui.confirmDialog.btnCancel" defaultMessage="ui.confirmDialog.btnCancel" />}
          </Button>
          <LoadingButton onClick={handleConfirm} variant="contained" autoFocus loading={isUpdating}>
            {btnConfirm ? btnConfirm : <FormattedMessage id="ui.confirmDialog.btnConfirm" defaultMessage="ui.confirmDialog.btnConfirm" />}
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </Root>
  );
}
