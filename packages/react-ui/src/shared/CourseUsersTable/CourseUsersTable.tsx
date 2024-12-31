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
import {ChangeEvent} from 'react';
import {FormattedMessage, useIntl} from 'react-intl';
import RowSkeleton from './RowSkeleton';
import {LoadingButton} from '@mui/lab';
import {SCUserType} from '@selfcommunity/types';
import {PREFIX} from './constants';

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
  headerCells: HeaderCellsType[];
  value: string;
  isLoadingUsers: boolean;
  usersToShow: number;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleSeeMore: () => void;
}

export default function CourseUsersTable(props: CourseUsersTableProps) {
  // PROPS
  const {users, headerCells, value, isLoadingUsers, usersToShow, handleChange, handleSeeMore} = props;

  // HOOKS
  const intl = useIntl();

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
            <FormattedMessage id="ui.editCourse.tab.users.table.button.label" defaultMessage="ui.editCourse.tab.users.table.button.label" />
          </Typography>
        </LoadingButton>
      )}
    </Root>
  );
}
