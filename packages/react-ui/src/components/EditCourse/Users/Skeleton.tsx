import {Skeleton, Stack} from '@mui/material';
import {PREFIX} from '../constants';
import {CourseUsersTableSkeleton} from '../../../shared/CourseUsersTable';
import {Fragment} from 'react';

const classes = {
  root: `${PREFIX}-skeleton-root`,
  usersStatusWrapper: `${PREFIX}-users-status-wrapper`
};

export default function UsersSkeleton() {
  return (
    <Fragment>
      <Skeleton animation="wave" variant="text" width="136px" height="22px" />

      <Stack className={classes.usersStatusWrapper}>
        <Skeleton animation="wave" variant="rectangular" width="122px" height="32px" />
        <Skeleton animation="wave" variant="rounded" width="154px" height="29px" />
      </Stack>

      <CourseUsersTableSkeleton />
    </Fragment>
  );
}
