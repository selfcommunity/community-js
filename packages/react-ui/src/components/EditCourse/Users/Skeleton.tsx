import {Skeleton, Stack, styled} from '@mui/material';
import {PREFIX} from '../constants';
import {CourseUsersTableSkeleton} from '../../../shared/CourseUsersTable';

const classes = {
  root: `${PREFIX}-users-skeleton-root`,
  usersStatusWrapper: `${PREFIX}-users-status-wrapper`
};

const Root = styled(Stack, {
  name: PREFIX,
  slot: 'UsersSkeletonRoot',
  overridesResolver: (_props, styles) => styles.usersSkeletonRoot
})(() => ({}));

export default function UsersSkeleton() {
  return (
    <Root className={classes.root}>
      <Skeleton animation="wave" variant="text" width="136px" height="22px" />

      <Stack className={classes.usersStatusWrapper}>
        <Skeleton animation="wave" variant="rectangular" width="122px" height="32px" />
        <Skeleton animation="wave" variant="rounded" width="154px" height="29px" />
      </Stack>

      <CourseUsersTableSkeleton />
    </Root>
  );
}
