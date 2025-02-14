import {MenuItem, Select, SelectChangeEvent, Typography} from '@mui/material';
import {memo, useCallback, useEffect, useState} from 'react';
import {FormattedMessage} from 'react-intl';
import {LoadingButton} from '@mui/lab';
import {SCCourseJoinStatusType, SCCourseType, SCUserType} from '@selfcommunity/types';
import {CourseService} from '@selfcommunity/api-services';
import {Logger} from '@selfcommunity/utils';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {useSnackbar} from 'notistack';

const OPTIONS = ['ui.editCourse.tab.users.table.select.joined', 'ui.editCourse.tab.users.table.select.manager'];

interface ChangeUserStatusProps {
  course: SCCourseType;
  user: SCUserType;
}

function ChangeUserStatus(props: ChangeUserStatusProps) {
  // PROPS
  const {course, user} = props;

  // STATES
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);

  // CONTEXTS
  const {enqueueSnackbar} = useSnackbar();

  // EFFECTS
  useEffect(() => {
    setValue(`ui.editCourse.tab.users.table.select.${user.join_status}`);
  }, [user, setValue]);

  // HANDLERS
  const handleAction = useCallback(
    (e: SelectChangeEvent) => {
      setLoading(true);

      const newValue = e.target.value;

      const data = {
        joined: newValue.includes(SCCourseJoinStatusType.JOINED) ? [user.id] : undefined,
        managers: newValue.includes(SCCourseJoinStatusType.MANAGER) ? [user.id] : undefined
      };

      CourseService.changeCourseUserRole(course.id, {...data})
        .then(() => {
          setValue(newValue);
          setLoading(false);
        })
        .catch((error) => {
          Logger.error(SCOPE_SC_UI, error);

          enqueueSnackbar(<FormattedMessage id="ui.common.error.action" defaultMessage="ui.common.error.action" />, {
            variant: 'error',
            autoHideDuration: 3000
          });
        });
    },
    [setLoading, setValue, user, course]
  );

  return (
    <Select size="small" value={value} onChange={handleAction}>
      {OPTIONS.map((option, i) => (
        <MenuItem key={i} value={option}>
          <LoadingButton
            size="small"
            color="inherit"
            loading={loading}
            disabled={loading}
            sx={{
              padding: 0,
              ':hover': {
                backgroundColor: 'unset'
              }
            }}>
            <Typography variant="body1">
              <FormattedMessage id={option} defaultMessage={option} />
            </Typography>
          </LoadingButton>
        </MenuItem>
      ))}
    </Select>
  );
}

export default memo(ChangeUserStatus);
