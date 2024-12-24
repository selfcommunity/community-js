import {
  Icon,
  InputAdornment,
  Skeleton,
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
import {useCallback, useEffect, useState} from 'react';
import {SCUserType} from '@selfcommunity/types';
import {getUsersData, setUsersData} from './data';
import {Logger} from '@selfcommunity/utils';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {useSnackbar} from 'notistack';
import Status from './Status';
import Empty from './Empty';

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
  const [isUpdating, setIsUpdating] = useState(false);

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
      setIsUpdating(true);

      setUsersData(1, newUsers)
        .then((data) => {
          setUsers((oldUsers) => (oldUsers ? [...data, ...oldUsers] : [...data]));
          setIsUpdating(false);
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
    return <>Skeleton</>;
  }

  return (
    <>
      <Typography variant="h6" sx={{marginBottom: '7px'}}>
        <FormattedMessage id="ui.editCourse.tab.users.title" defaultMessage="ui.editCourse.tab.users.title" values={{usersNumber: users.length}} />
      </Typography>

      <Stack
        sx={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '5px',
          marginBottom: '16px'
        }}>
        <Status />

        <AddUsersButton
          label="ui.editCourse.tab.users.addUsersButton.label"
          endpoint={{
            url: () => '',
            method: 'GET'
          }}
          onConfirm={handleConfirm}
          isUpdating={isUpdating}
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
        fullWidth
        sx={{
          '& > div:first-of-type': {
            borderBottomLeftRadius: 'unset',
            borderBottomRightRadius: 'unset'
          }
        }}
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
            <TableRow>
              {Array.from(new Array(4)).map((_, i) => (
                <TableCell key={i}>
                  {i === 0 && (
                    <Stack
                      sx={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: '15px'
                      }}>
                      <Skeleton animation={false} variant="circular" width="30px" height="30px" />
                      <Skeleton animation={false} variant="text" width="118px" height="24px" />
                    </Stack>
                  )}
                  {i > 0 && <Skeleton animation={false} variant="text" width="78px" height="24px" />}
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      {users.length === 0 && (
        <Empty icon="face" title="ui.editCourse.tab.users.empty.title" description="ui.editCourse.tab.users.empty.description" />
      )}

      {users.length > 0 && (
        <Stack>
          {users.map((user, i) => (
            <Typography variant="body2" key={i}>
              {user.username || user.real_name}
            </Typography>
          ))}
        </Stack>
      )}
    </>
  );
}
