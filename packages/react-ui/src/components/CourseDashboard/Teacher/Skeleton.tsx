import {PREFIX} from '../constants';
import {Box, Skeleton, Stack, styled} from '@mui/material';
import HeaderSkeleton from '../Header/Skeleton';
import {CourseUsersTableSkeleton} from '../../../shared/CourseUsersTable';
import classNames from 'classnames';

const classes = {
  root: `${PREFIX}-skeleton-root`,
  teacher: `${PREFIX}-teacher`,
  infoWrapper: `${PREFIX}-info-wrapper`,
  info: `${PREFIX}-info`,
  tabList: `${PREFIX}-tab-list`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'SkeletonRoot',
  overridesResolver: (_props, styles) => styles.skeletonRoot
})(() => ({}));

export default function TeacherSkeleton() {
  return (
    <Root className={classNames(classes.root, classes.teacher)}>
      <HeaderSkeleton />

      <Stack className={classes.infoWrapper}>
        {Array.from(new Array(2)).map((_, i) => (
          <Stack key={i} className={classes.info}>
            <Skeleton animation="wave" variant="text" width="100px" height="21px" />
            <Skeleton animation="wave" variant="text" width="100px" height="21px" />
          </Stack>
        ))}
      </Stack>

      <Stack className={classes.tabList}>
        {Array.from(new Array(2)).map((_, i) => (
          <Skeleton key={i} animation="wave" variant="text" width="80px" height="21px" />
        ))}
      </Stack>

      <CourseUsersTableSkeleton />
    </Root>
  );
}
