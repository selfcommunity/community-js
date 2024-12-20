import {LoadingButton} from '@mui/lab';
import {debounce, Icon, IconButton, Stack, TextField, Typography} from '@mui/material';
import {ChangeEvent, Dispatch, Fragment, SetStateAction, useCallback, useState} from 'react';
import {setRowName} from '../data';
import {LessonRowInterface} from '../types';
import {PREFIX} from '../constants';
import {Logger} from '@selfcommunity/utils';
import {SCOPE_SC_UI} from '../../../constants/Errors';
import {FormattedMessage} from 'react-intl';
import {useSnackbar} from 'notistack';

const classes = {
  editModeWrapper: `${PREFIX}-edit-mode-wrapper`,
  editModeSaveButton: `${PREFIX}-edit-mode-save-button`,
  editModeCloseButton: `${PREFIX}-edit-mode-close-button`
};

interface FieldNameProps<T> {
  row: T;
  handleRenameRow: (oldId: number, newName: string) => void;
  editMode: boolean;
  setEditMode: Dispatch<SetStateAction<boolean>>;
}

export default function FieldName<T extends LessonRowInterface>(props: FieldNameProps<T>) {
  // PROPS
  const {row, handleRenameRow, editMode, setEditMode} = props;

  // STATES
  const [loading, setLoading] = useState(false);
  const [rename, setRename] = useState<string | null>(null);

  // HOOKS
  const {enqueueSnackbar} = useSnackbar();

  // DEBOUNCE
  const debounceSetData = debounce((name: string) => {
    setRename(name);
  }, 300);

  // HANDLERS
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      debounceSetData(e.target.value);
    },
    [debounceSetData]
  );

  const handleSubmit = useCallback(() => {
    setLoading(true);
    setRowName(rename)
      .then(() => {
        handleRenameRow(row.id, rename);
        setRename(null);
        setLoading(false);
        setEditMode(false);
      })
      .catch((error) => {
        Logger.error(SCOPE_SC_UI, error);

        enqueueSnackbar(<FormattedMessage id="ui.common.error.action" defaultMessage="ui.common.error.action" />, {
          variant: 'error',
          autoHideDuration: 3000
        });
      });
  }, [row, rename, setLoading, setEditMode, handleRenameRow]);

  const handleClose = useCallback(() => {
    setRename(null);
    setEditMode(false);
  }, [setRename, setEditMode]);

  return (
    <Fragment>
      {editMode ? (
        <Stack className={classes.editModeWrapper}>
          <TextField type="text" variant="outlined" size="small" focused defaultValue={row.name} onChange={handleChange} />

          <LoadingButton
            size="small"
            color="primary"
            variant="outlined"
            onClick={handleSubmit}
            loading={loading}
            disabled={loading}
            className={classes.editModeSaveButton}>
            <Icon>check</Icon>
          </LoadingButton>

          <IconButton color="default" size="small" onClick={handleClose} className={classes.editModeCloseButton}>
            <Icon>close</Icon>
          </IconButton>
        </Stack>
      ) : (
        <Typography variant="body1">{row.name}</Typography>
      )}
    </Fragment>
  );
}
