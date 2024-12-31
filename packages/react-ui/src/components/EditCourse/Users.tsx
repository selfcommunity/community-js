import {Box, Stack, Typography} from '@mui/material';
import {FormattedMessage} from 'react-intl';
import AddUsersButton from '../../shared/AddUsersButton';
import {ChangeEvent, useCallback, useEffect, useState} from 'react';
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

const USERS_TO_SHOW = 6;

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

function filteredUsers(users: SCUserType[], value: string): SCUserType[] {
  return users.filter((user) => (user.username || user.real_name).includes(value));
}

export default function Users() {
  // STATES
  const [users, setUsers] = useState<SCUserType[] | null>(null);
  const [tempUsers, setTempUsers] = useState<SCUserType[] | null>(null);
  const [usersToShow, setUsersToShow] = useState(USERS_TO_SHOW);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [value, setValue] = useState('');

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

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const _value = e.target.value;

      if (_value.length > 0) {
        if (!tempUsers) {
          setTempUsers(users);
          setUsers((prevUsers) => filteredUsers(prevUsers, _value));
        } else {
          setUsers(filteredUsers(tempUsers, _value));
        }
      } else {
        setUsers(tempUsers);
        setTempUsers(null);
      }

      setValue(_value);
    },
    [users, tempUsers, setUsers, setValue]
  );

  const handleSeeMore = useCallback(() => {
    setIsLoadingUsers(true);

    setTimeout(() => {
      setUsersToShow((prev) => prev + USERS_TO_SHOW);
      setIsLoadingUsers(false);
    }, 300);
  }, [setIsLoadingUsers, setUsersToShow]);

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

      <CourseUsersTable
        users={users}
        headerCells={headerCells}
        value={value}
        isLoadingUsers={isLoadingUsers}
        usersToShow={usersToShow}
        handleChange={handleChange}
        handleSeeMore={handleSeeMore}
      />

      {users.length === 0 && (
        <Empty icon="face" title="ui.editCourse.tab.users.empty.title" description="ui.editCourse.tab.users.empty.description" />
      )}
    </Box>
  );
}
