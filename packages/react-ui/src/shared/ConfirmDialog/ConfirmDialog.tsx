import { LoadingButton } from '@mui/lab';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import React from 'react';
import { FormattedMessage } from 'react-intl';

const PREFIX = 'SCConfirmDialog';

const Root = styled(Card, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({ theme }) => ({
  maxWidth: 800,
  marginBottom: theme.spacing(2)
}));

export interface ConfirmDialogProps {
  /**
   * Handles confirm dialog opening
   */
  open: boolean;
  /**
   * Confirm dialog title
   */
  title?: React.ReactNode;
  /**
   * Confirm dialog content
   * @default null
   */
  content?: React.ReactNode;
  /**
   * Handles confirm button click
   * @default null
   */
  btnConfirm?: React.ReactNode;
  /**
   * Handles cancel button click
   * @default null
   */
  btnCancel?: React.ReactNode;
  /**
   * Handles component update
   * @default false
   */
  isUpdating?: boolean;
  /**
   * Handles dialog closing
   * @default null
   */
  onClose?: () => void;
  /**
   * Handles dialog confirm
   * @default null
   */
  onConfirm?: () => void;
  /**
   * Handles backdrop disable on click
   * @default false
   */
  disableBackdropClick?: boolean;
  /**
   * Any other properties
   */
  [p: string]: any;
}
export default function ConfirmDialog(props: ConfirmDialogProps): JSX.Element {
  // PROPS
  const {
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
  } = props;

  /**
   * Handles dialog closing
   * @param reason
   */
  function handleClose(reason) {
    if (disableBackdropClick && (reason === 'backdropClick' || reason === 'escapeKeyDown')) {
      return false;
    }

    if (!isUpdating) {
      onClose?.();
    }
  }

  /**
   * Handles action confirm
   */
  function handleConfirm() {
    onConfirm?.();
  }

  /**
   * Renders root object
   */
  return (
    <Root>
      <Dialog open={open} onClose={handleClose} {...rest}>
        <DialogTitle>{title || <FormattedMessage id="ui.confirmDialog.title" defaultMessage="ui.confirmDialog.title" />}</DialogTitle>
        {content && (
          <DialogContent>
            <DialogContentText component="div">{content}</DialogContentText>
          </DialogContent>
        )}
        <DialogActions>
          <Button onClick={handleClose}>
            {btnCancel || <FormattedMessage id="ui.confirmDialog.btnCancel" defaultMessage="ui.confirmDialog.btnCancel" />}
          </Button>
          <LoadingButton onClick={handleConfirm} variant="contained" autoFocus loading={isUpdating}>
            {btnConfirm || <FormattedMessage id="ui.confirmDialog.btnConfirm" defaultMessage="ui.confirmDialog.btnConfirm" />}
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </Root>
  );
}
