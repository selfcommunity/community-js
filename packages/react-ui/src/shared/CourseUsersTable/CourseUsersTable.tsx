import {
  Avatar,
  Box,
  Icon,
  InputAdornment,
  Stack,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@mui/material';
import {ChangeEvent, Dispatch, SetStateAction, useCallback, useState} from 'react';
import {FormattedMessage, useIntl} from 'react-intl';
import RowSkeleton from './RowSkeleton';
import {LoadingButton} from '@mui/lab';
import {SCUserType} from '@selfcommunity/types';
import {PREFIX} from './constants';
import EmptyStatus from '../EmptyStatus';

const USERS_TO_SHOW = 6;

const classes = {
  search: `${PREFIX}-search`,
  avatarWrapper: `${PREFIX}-avatar-wrapper`,
  loadingButton: `${PREFIX}-loading-button`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (_props, styles) => styles.root
})(() => ({}));

type HeaderCellsType = {
  id: string;
};

export interface CourseUsersTableProps {
  users: SCUserType[];
  setUsers: Dispatch<SetStateAction<SCUserType[]>>;
  headerCells: HeaderCellsType[];
}

function filteredUsers(users: SCUserType[], value: string): SCUserType[] {
  return users.filter((user) => (user.username || user.real_name).includes(value));
}

export default function CourseUsersTable(props: CourseUsersTableProps) {
  // PROPS
  const {users, setUsers, headerCells} = props;

  // STATES
  const [usersToShow, setUsersToShow] = useState(USERS_TO_SHOW);
  const [tempUsers, setTempUsers] = useState<SCUserType[] | null>(null);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [value, setValue] = useState('');

  // HOOKS
  const intl = useIntl();

  // HANDLERS
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

  return (
    <Root>
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
        className={classes.search}
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
                    <Stack className={classes.avatarWrapper}>
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

      {users.length > 0 && (
        <LoadingButton
          size="small"
          variant="outlined"
          color="inherit"
          loading={isLoadingUsers}
          disabled={users.length <= usersToShow}
          className={classes.loadingButton}
          onClick={handleSeeMore}>
          <Typography variant="body2">
            <FormattedMessage id="ui.courseUsersTable.button.label" defaultMessage="ui.courseUsersTable.button.label" />
          </Typography>
        </LoadingButton>
      )}

      {users.length === 0 && <EmptyStatus icon="face" title="ui.courseUsersTable.empty.title" description="ui.courseUsersTable.empty.description" />}
    </Root>
  );
}
