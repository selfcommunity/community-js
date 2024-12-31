import {Box, Stack, Typography} from '@mui/material';
import {FormattedMessage} from 'react-intl';
import AddUsersButton from '../../shared/AddUsersButton';
import {useCallback, useEffect, useState} from 'react';
import {SCUserType} from '@selfcommunity/types';
import {getUsersData, setUsersData} from './data';
import {Logger} from '@selfcommunity/utils';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {useSnackbar} from 'notistack';
import Status from './Status';
import Empty from './Empty';
import UsersSkeleton from './Users/Skeleton';
import {PREFIX} from './constants';
import CourseUsersTable from '../../shared/CourseUsersTable';

const classes = {
  usersStatusWrapper: `${PREFIX}-users-status-wrapper`
};

const headerCells = [
  {
    id: 'ui.editCourse.tab.users.table.header.name'
  },
  {
    id: 'ui.editCourse.tab.users.table.header.role'
  },
  {
    id: 'ui.editCourse.tab.users.table.header.registration'
  },
  {
    id: 'ui.editCourse.tab.users.table.header.latestActivity'
  }
];

export default function Users() {
  // STATES
  const [users, setUsers] = useState<SCUserType[] | null>(null);
  const [isAddingUser, setIsAddingUser] = useState(false);

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

  // HANDLERS
  const handleConfirm = useCallback(
    (newUsers: SCUserType[]) => {
      setIsAddingUser(true);

      setUsersData(1, newUsers)
        .then((data) => {
          setUsers((oldUsers) => (oldUsers ? [...data, ...oldUsers] : [...data]));
          setIsAddingUser(false);
        })
        .catch((error) => {
          Logger.error(SCOPE_SC_UI, error);

          enqueueSnackbar(<FormattedMessage id="ui.common.error.action" defaultMessage="ui.common.error.action" />, {
            variant: 'error',
            autoHideDuration: 3000
          });
        });
    },
    [setUsers]
  );

  if (!users) {
    return <UsersSkeleton />;
  }

  return (
    <Box>
      <Typography variant="h6">
        <FormattedMessage id="ui.editCourse.tab.users.title" defaultMessage="ui.editCourse.tab.users.title" values={{usersNumber: users.length}} />
      </Typography>

      <Stack className={classes.usersStatusWrapper}>
        <Status />

        <AddUsersButton
          label="ui.editCourse.tab.users.addUsersButton.label"
          endpoint={{
            url: () => '',
            method: 'GET'
          }}
          onConfirm={handleConfirm}
          isUpdating={isAddingUser}
        />
      </Stack>

      <CourseUsersTable users={users} setUsers={setUsers} headerCells={headerCells} />

      {users.length === 0 && (
        <Empty icon="face" title="ui.editCourse.tab.users.empty.title" description="ui.editCourse.tab.users.empty.description" />
      )}
    </Box>
  );
}
