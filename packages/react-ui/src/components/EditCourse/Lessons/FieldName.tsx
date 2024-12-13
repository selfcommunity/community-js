import {LoadingButton} from '@mui/lab';
import {ButtonGroup, debounce, Icon, IconButton, Stack, TextField, Typography} from '@mui/material';
import {ChangeEvent, Dispatch, Fragment, SetStateAction, useCallback, useState} from 'react';
import {setRowName} from '../data';
import {LessonRowInterface} from '../types';

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

  // DEBOUNCE
  const debounceSetData = debounce((name: string) => {
    setRename(name);
  }, 300);

  // HANDLERS
  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    debounceSetData(e.target.value);
  }, []);

  const handleSubmit = useCallback(async () => {
    setLoading(true);
    const response = await setRowName();

    if (response) {
      handleRenameRow(row.id, rename);
      setRename(null);
      setLoading(false);
      setEditMode(false);
    }
  }, [row, rename, setLoading, setLoading, setEditMode, handleRenameRow]);

  const handleClose = useCallback(() => {
    setRename(null);
    setEditMode(false);
  }, [setRename, setEditMode]);

  return (
    <Fragment>
      {editMode ? (
        <Stack
          sx={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: '5px'
          }}>
          <TextField type="text" variant="outlined" size="small" focused defaultValue={row.name} onChange={handleChange} />

          <ButtonGroup variant="outlined">
            <LoadingButton size="small" color="primary" variant="contained" onClick={handleSubmit} loading={loading} disabled={loading}>
              <Icon>check</Icon>
            </LoadingButton>

            <IconButton color="default" size="small" onClick={handleClose}>
              <Icon>close</Icon>
            </IconButton>
          </ButtonGroup>
        </Stack>
      ) : (
        <Typography variant="body1">{row.name}</Typography>
      )}
    </Fragment>
  );
}
