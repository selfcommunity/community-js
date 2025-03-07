import {LoadingButton} from '@mui/lab';
import {debounce, Icon, IconButton, Stack, TextField, Typography} from '@mui/material';
import {ChangeEvent, Fragment, memo, useCallback, useState} from 'react';
import {PREFIX} from '../constants';
import {Logger} from '@selfcommunity/utils';
import {SCOPE_SC_UI} from '../../../constants/Errors';
import {FormattedMessage} from 'react-intl';
import {useSnackbar} from 'notistack';
import {SCCourseLessonTypologyType, SCCourseSectionType, SCCourseType} from '@selfcommunity/types';
import {EndpointType, http} from '@selfcommunity/api-services';
import {AxiosResponse} from 'axios';
import {ActionLessonType} from '../types';
import PubSub from 'pubsub-js';
import {SCGroupEventType, SCTopicType} from '../../../constants/PubSub';

const classes = {
  editModeWrapper: `${PREFIX}-edit-mode-wrapper`,
  editModeSaveButton: `${PREFIX}-edit-mode-save-button`,
  editModeCloseButton: `${PREFIX}-edit-mode-close-button`
};

interface FieldNameProps<T> {
  endpoint: EndpointType;
  row: T;
  isNewRow: boolean;
  handleManageRow: (section: SCCourseSectionType, type: ActionLessonType, newRow?: boolean) => void;
  editMode: boolean;
  handleDisableEditMode: () => void;
}

function FieldName<T extends SCCourseSectionType>(props: FieldNameProps<T>) {
  // PROPS
  const {endpoint, row, isNewRow, handleManageRow, editMode, handleDisableEditMode} = props;

  // STATES
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState<string | null>(null);

  // HOOKS
  const {enqueueSnackbar} = useSnackbar();

  // DEBOUNCE
  const debounceSetData = debounce((name: string) => {
    setName(name);
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

    http
      .request({
        url: endpoint.url(),
        method: endpoint.method,
        data: {
          name,
          type: SCCourseLessonTypologyType.LESSON
        }
      })
      .then((response: AxiosResponse<SCCourseType>) => {
        handleManageRow(response.data, isNewRow ? ActionLessonType.ADD : ActionLessonType.RENAME);
        setName(null);
        setLoading(false);
        handleDisableEditMode();

        if (isNewRow) {
          PubSub.publish(`${SCTopicType.COURSE}.${SCGroupEventType.UPDATE}`, false);
        }

        enqueueSnackbar(
          <FormattedMessage id="ui.editCourse.tab.lessons.table.snackbar.save" defaultMessage="ui.editCourse.tab.lessons.table.snackbar.save" />,
          {
            variant: 'success',
            autoHideDuration: 3000
          }
        );
      })
      .catch((error) => {
        Logger.error(SCOPE_SC_UI, error);

        enqueueSnackbar(<FormattedMessage id="ui.common.error.action" defaultMessage="ui.common.error.action" />, {
          variant: 'error',
          autoHideDuration: 3000
        });
      });
  }, [isNewRow, name, endpoint, setLoading, handleDisableEditMode, handleManageRow]);

  const handleClose = useCallback(() => {
    if (isNewRow) {
      handleManageRow(row, ActionLessonType.DELETE, true);
      PubSub.publish(`${SCTopicType.COURSE}.${SCGroupEventType.UPDATE}`, false);
    } else {
      setName(null);
      handleDisableEditMode();
    }
  }, [row, isNewRow, handleManageRow, setName, handleDisableEditMode]);

  return (
    <Fragment>
      {isNewRow || editMode ? (
        <Stack className={classes.editModeWrapper}>
          <TextField type="text" variant="outlined" size="small" focused autoFocus defaultValue={row.name} onChange={handleChange} />

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

export default memo(FieldName);
