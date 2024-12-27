import {
  Avatar,
  Box,
  Icon,
  InputAdornment,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@mui/material';
import {FormattedMessage, useIntl} from 'react-intl';
import AddUsersButton from '../../shared/AddUsersButton';
import {ChangeEvent, useCallback, useEffect, useState} from 'react';
import {SCUserType} from '@selfcommunity/types';
import {getUsersData, setUsersData} from './data';
import {Logger} from '@selfcommunity/utils';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {useSnackbar} from 'notistack';
import Status from './Status';
import Empty from './Empty';
import RowSkeleton from './Users/RowSkeleton';
import UsersSkeleton from './Users/Skeleton';
import {PREFIX} from './constants';
import {LoadingButton} from '@mui/lab';

const USERS_TO_SHOW = 6;

const classes = {
  usersStatusWrapper: `${PREFIX}-users-status-wrapper`,
  usersSearch: `${PREFIX}-users-search`,
  usersAvatarWrapper: `${PREFIX}-users-avatar-wrapper`,
  usersLoadingButton: `${PREFIX}-users-loading-button`
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
  const intl = useIntl();

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

      <TextField
        placeholder={intl.formatMessage({
          id: 'ui.editCourse.tab.users.searchBar.placeholder',
          defaultMessage: 'ui.editCourse.tab.users.searchBar.placeholder'
        })}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Icon>search</Icon>
            </InputAdornment>
          )
        }}
        value={value}
        onChange={handleChange}
        disabled={users.length === 0 && value.length === 0}
        fullWidth
        className={classes.usersSearch}
      />

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {headerCells.map((cell, i) => (
                <TableCell width="25%" key={i}>
                  <Typography variant="body2">
                    <FormattedMessage id={cell.id} defaultMessage={cell.id} />
                  </Typography>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {users.length === 0 && <RowSkeleton animation={false} />}
            {users.length > 0 &&
              users.slice(0, usersToShow).map((user, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Stack className={classes.usersAvatarWrapper}>
                      <Avatar alt={user.username} src={user.avatar} />
                      <Typography variant="body2">{user.username}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{user.role}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{user.date_joined.toDateString()}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{user.date_joined.toDateString()}</Typography>
                  </TableCell>
                </TableRow>
              ))}
            {isLoadingUsers && <RowSkeleton />}
          </TableBody>
        </Table>
      </TableContainer>

      <LoadingButton
        size="small"
        variant="outlined"
        color="inherit"
        loading={isLoadingUsers}
        disabled={users.length <= usersToShow}
        className={classes.usersLoadingButton}
        onClick={handleSeeMore}>
        <Typography variant="body2">
          <FormattedMessage id="ui.editCourse.tab.users.table.button.label" defaultMessage="ui.editCourse.tab.users.table.button.label" />
        </Typography>
      </LoadingButton>

      {users.length === 0 && (
        <Empty icon="face" title="ui.editCourse.tab.users.empty.title" description="ui.editCourse.tab.users.empty.description" />
      )}
    </Box>
  );
}
