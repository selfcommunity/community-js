import {PREFIX} from './constants';
import {Box, Skeleton, Stack, styled} from '@mui/material';
import LessonsSkeleton from './Lessons/Skeleton';
import UsersSkeleton from './Users/Skeleton';
import CourseFormSkeleton from '../CourseForm/Skeleton';
import OptionsSkeleton from './Options/Skeleton';
import {SCCourseEditTabType} from '../../types';
import {memo} from 'react';

const classes = {
  root: `${PREFIX}-skeleton-root`,
  header: `${PREFIX}-header`,
  tabList: `${PREFIX}-tab-list`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'SkeletonRoot',
  overridesResolver: (_props, styles) => styles.skeletonRoot
})(() => ({}));

interface EditCourseSkeletonProps {
  tab?: SCCourseEditTabType;
}

function EditCourseSkeleton(props: EditCourseSkeletonProps) {
  // PROPS
  const {tab} = props;

  return (
    <Root className={classes.root}>
      <Stack className={classes.header}>
        <Skeleton animation="wave" variant="rectangular" width="14px" height="14px" />
        <Skeleton animation="wave" variant="text" width="125px" height="21px" />
      </Stack>

      <Stack className={classes.tabList}>
        {Array.from(new Array(5)).map((_, i) => (
          <Skeleton key={i} animation="wave" variant="text" width="80px" height="21px" />
        ))}
      </Stack>

      {tab === SCCourseEditTabType.LESSONS && <LessonsSkeleton />}
      {tab === SCCourseEditTabType.CUSTOMIZE && <CourseFormSkeleton />}
      {tab === SCCourseEditTabType.USERS && <UsersSkeleton />}
      {tab === SCCourseEditTabType.REQUESTS && <UsersSkeleton />}
      {tab === SCCourseEditTabType.OPTIONS && <OptionsSkeleton />}
    </Root>
  );
}

export default memo(EditCourseSkeleton);
