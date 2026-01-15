import {Button, MenuItem, Select, SelectChangeEvent, Typography} from '@mui/material';
import {memo, useCallback, useEffect, useState} from 'react';
import {FormattedMessage} from 'react-intl';
import {SCCourseJoinStatusType, SCCourseType, SCUserType} from '@selfcommunity/types';
import {CourseService, CourseUserRoleParams} from '@selfcommunity/api-services';
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
    setValue(`ui.editCourse.tab.users.table.select.${user.join_status || 'joined'}`);
  }, [user, setValue]);

  // HANDLERS
  const handleChange = useCallback(
    (e: SelectChangeEvent) => {
      setLoading(true);

      const newValue = e.target.value;

      const data: CourseUserRoleParams = {
        joined: newValue.endsWith(SCCourseJoinStatusType.JOINED) ? [user.id] : undefined,
        managers: newValue.endsWith(SCCourseJoinStatusType.MANAGER) ? [user.id] : undefined
      };

      CourseService.changeCourseUserRole(course.id, data)
        .then(() => {
          setValue(newValue);
          setLoading(false);

          enqueueSnackbar(
            <FormattedMessage
              id="ui.courseUsersTable.changeStatus.snackbar.success"
              defaultMessage="ui.courseUsersTable.changeStatus.snackbar.success"
            />,
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
    },
    [course, user, setLoading, setValue]
  );

  return (
    <Select size="small" value={value} onChange={handleChange}>
      {OPTIONS.map((option, i) => (
        <MenuItem key={i} value={option}>
          <Button
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
          </Button>
        </MenuItem>
      ))}
    </Select>
  );
}

export default memo(ChangeUserStatus);
