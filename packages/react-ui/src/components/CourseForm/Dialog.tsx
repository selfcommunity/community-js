import {Button, Typography} from '@mui/material';
import BaseDialog from '../../shared/BaseDialog';
import {FormattedMessage} from 'react-intl';
import {memo, useCallback} from 'react';

interface CoursePublicationDialogProps {
  onSubmit: () => void;
  onClose: () => void;
}

function CoursePublicationDialog(props: CoursePublicationDialogProps) {
  // PROPS
  const {onSubmit, onClose} = props;

  // HANDLERS
  const handleSubmit = useCallback(() => {
    onSubmit();
    onClose();
  }, [onSubmit, onClose]);

  return (
    <BaseDialog
      open
      DialogContentProps={{dividers: false}}
      onClose={onClose}
      title={
        <Typography variant="h5">
          <FormattedMessage id="ui.courseForm.edit.dialog.title" defaultMessage="ui.courseForm.edit.dialog.title" />
        </Typography>
      }
      actions={
        <Button size="small" color="primary" variant="contained" onClick={handleSubmit}>
          <Typography variant="body1">
            <FormattedMessage id="ui.courseForm.edit.dialog.btn" defaultMessage="ui.courseForm.edit.dialog.btn" />
          </Typography>
        </Button>
      }>
      <Typography variant="body1">
        <FormattedMessage id="ui.courseForm.edit.dialog.description" defaultMessage="ui.courseForm.edit.dialog.description" />
      </Typography>
    </BaseDialog>
  );
}

export default memo(CoursePublicationDialog);
