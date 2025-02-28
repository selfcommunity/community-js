import {PREFIX} from '../constants';
import {Box, Divider, Skeleton, Stack, styled} from '@mui/material';
import HeaderSkeleton from '../Header/Skeleton';
import classNames from 'classnames';
import {AccordionLessonsSkeleton} from '../../../shared/AccordionLessons';

const classes = {
  root: `${PREFIX}-skeleton-root`,
  student: `${PREFIX}-student`,
  userWrapper: `${PREFIX}-user-wrapper`,
  user: `${PREFIX}-user`,
  avatar: `${PREFIX}-avatar`,
  margin: `${PREFIX}-margin`,
  box: `${PREFIX}-box`,
  percentageWrapper: `${PREFIX}-percentage-wrapper`,
  lessonsSections: `${PREFIX}-lessons-sections`,
  circle: `${PREFIX}-circle`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'SkeletonRoot',
  overridesResolver: (_props, styles) => styles.skeletonRoot
})(() => ({}));

export default function StudentSkeleton() {
  return (
    <Root className={classNames(classes.root, classes.student)}>
      <HeaderSkeleton />

      <Divider />

      <Stack className={classes.userWrapper}>
        <Stack className={classes.user}>
          <Skeleton animation="wave" variant="circular" className={classes.avatar} />

          <Box>
            <Skeleton animation="wave" variant="text" width="105px" height="21px" />
            <Skeleton animation="wave" variant="text" width="74px" height="21px" />
          </Box>
        </Stack>

        <Skeleton animation="wave" variant="rounded" width="160px" height="28px" />
      </Stack>

      <Divider />

      <Skeleton animation="wave" variant="text" width="200px" height="21px" className={classes.margin} />

      <Stack className={classes.box}>
        <Skeleton animation="wave" variant="text" height="30px" />
      </Stack>

      <Skeleton animation="wave" variant="text" width="200px" height="21px" className={classes.margin} />

      <Stack className={classes.box}>
        <Stack className={classes.percentageWrapper}>
          <Skeleton animation="wave" variant="text" width="168px" height="21px" />
          <Skeleton animation="wave" variant="text" width="108px" height="21px" />
        </Stack>

        <Skeleton animation="wave" variant="rectangular" height="4px" />
      </Stack>

      <Skeleton animation="wave" variant="text" width="200px" height="21px" className={classes.margin} />

      <Stack className={classes.lessonsSections}>
        <Skeleton animation="wave" variant="text" width="58px" height="21px" />

        <Skeleton animation="wave" variant="circular" className={classes.circle} />

        <Skeleton animation="wave" variant="text" width="58px" height="21px" />
      </Stack>
      <AccordionLessonsSkeleton />
    </Root>
  );
}
