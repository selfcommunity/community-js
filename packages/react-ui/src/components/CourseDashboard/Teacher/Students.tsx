import {SCUserType} from '@selfcommunity/types';
import {useSnackbar} from 'notistack';
import {useEffect, useState} from 'react';
import {getUsersData} from '../../EditCourse/data';
import {SCOPE_SC_UI} from '../../../constants/Errors';
import {Logger} from '@selfcommunity/utils';
import {FormattedMessage} from 'react-intl';
import CourseUsersTable from '../../../shared/CourseUsersTable';

const headerCells = [
  {
    id: 'ui.course.dashboard.teacher.tab.students.table.header.name'
  },
  {
    id: 'ui.course.dashboard.teacher.tab.students.table.header.progress'
  },
  {
    id: 'ui.course.dashboard.teacher.tab.students.table.header.registration'
  },
  {
    id: 'ui.course.dashboard.teacher.tab.students.table.header.latestActivity'
  },
  {}
];

export default function Students() {
  // STATES
  const [users, setUsers] = useState<SCUserType[] | null>(null);

  // HOOKS
  const {enqueueSnackbar} = useSnackbar();

  // EFFECTS
  useEffect(() => {
    getUsersData(1)
      .then((data) => {
        if (data) {
          setUsers(data);
        }
      })
      .catch((error) => {
        Logger.error(SCOPE_SC_UI, error);

        enqueueSnackbar(<FormattedMessage id="ui.common.error.action" defaultMessage="ui.common.error.action" />, {
          variant: 'error',
          autoHideDuration: 3000
        });
      });
  }, []);

  if (!users) {
    return <>Skeleton</>;
  }

  return <CourseUsersTable users={users} setUsers={setUsers} headerCells={headerCells} />;
}
