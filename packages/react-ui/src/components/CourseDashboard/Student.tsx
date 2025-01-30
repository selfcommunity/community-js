import {Fragment, HTMLAttributes, memo, useEffect, useMemo, useState} from 'react';
import {PREFIX} from './constants';
import {Avatar, Box, Divider, LinearProgress, Skeleton, Stack, styled, Typography, useThemeProps} from '@mui/material';
import classNames from 'classnames';
import HeaderCourseDashboard from './Header';
import {SCCourseLessonType, SCCourseSectionType, SCCourseType} from '@selfcommunity/types';
import {Logger} from '@selfcommunity/utils';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {FormattedMessage, useIntl} from 'react-intl';
import ActionButton from './Student/ActionButton';
import AccordionLessons from '../../shared/AccordionLessons';
import {CLAPPING} from '../../assets/courses/clapping';
import {useSCFetchCourse} from '@selfcommunity/react-core';
import {CourseService} from '@selfcommunity/api-services';

const messages = {
  request: 'ui.course.dashboard.student.button.request',
  start: 'ui.course.dashboard.student.button.start',
  continue: 'ui.course.dashboard.student.button.continue'
};

const classes = {
  root: `${PREFIX}-root`,
  studentContainer: `${PREFIX}-student-container`,
  userWrapper: `${PREFIX}-user-wrapper`,
  user: `${PREFIX}-user`,
  avatar: `${PREFIX}-avatar`,
  progress: `${PREFIX}-progress`,
  lessonsSections: `${PREFIX}-lessons-sections`,
  circle: `${PREFIX}-circle`,
  accordion: `${PREFIX}-accordion`,
  margin: `${PREFIX}-margin`,
  box: `${PREFIX}-box`,
  percentageWrapper: `${PREFIX}-percentage-wrapper`,
  completedWrapper: `${PREFIX}-completed-wrapper`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (_props, styles) => styles.root
})(() => ({}));

export interface StudentCourseDashboardProps {
  courseId?: number;
  course?: SCCourseType;
  className?: HTMLAttributes<HTMLDivElement>['className'];
  [p: string]: any;
}

function Student(inProps: StudentCourseDashboardProps) {
  // PROPS
  const props: StudentCourseDashboardProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });

  const {courseId, course, className, ...rest} = props;

  // STATES
  const [sections, setSections] = useState<SCCourseSectionType[] | null>(null);
  const [lessons, setLessons] = useState<SCCourseLessonType[] | null>(null);
  const [hasLessonsCalled, setHasLessonsCalled] = useState(false);

  // HOOKS
  const {scCourse} = useSCFetchCourse({id: courseId, course});
  const intl = useIntl();

  // EFFECTS
  useEffect(() => {
    if (scCourse && !sections) {
      CourseService.getCourseSections(scCourse.id)
        .then((data) => setSections(data))
        .catch((error) => Logger.error(SCOPE_SC_UI, error));
    }

    if (scCourse && sections && sections.length > 0 && !lessons && !hasLessonsCalled) {
      sections.forEach((section) => {
        if (section.lessons_order.length > 0) {
          setHasLessonsCalled(true);

          CourseService.getCourseLessons(scCourse.id, section.id)
            .then((data) => setLessons((prev) => (prev ? [...prev, ...data] : data)))
            .catch((error) => {
              Logger.error(SCOPE_SC_UI, error);
              setHasLessonsCalled(false);
            });
        }
      });
    }
  }, [scCourse, sections, lessons, hasLessonsCalled]);

  // MEMOS
  const actionButton = useMemo(() => {
    // TODO - manage different buttons

    if (!scCourse) {
      return <Skeleton animation="wave" variant="rounded" width="160px" height="28px" />;
    }

    return <ActionButton labelId={messages.start} />;
  }, [scCourse]);

  return (
    <Root className={classNames(classes.root, classes.studentContainer, className)} {...rest}>
      <HeaderCourseDashboard course={scCourse} />

      <Divider />

      <Stack className={classes.userWrapper}>
        <Stack className={classes.user}>
          {scCourse ? (
            <Avatar className={classes.avatar} src={scCourse.created_by.avatar} alt={scCourse.created_by.username} />
          ) : (
            <Skeleton animation="wave" variant="circular" className={classes.avatar} />
          )}

          <Box>
            {scCourse ? (
              <Fragment>
                <Typography variant="body1">{scCourse.created_by.username}</Typography>
                <Typography variant="body1">{scCourse.created_by.role}</Typography>
              </Fragment>
            ) : (
              <Fragment>
                <Skeleton animation="wave" variant="text" width="105px" height="21px" />
                <Skeleton animation="wave" variant="text" width="74px" height="21px" />
              </Fragment>
            )}
          </Box>
        </Stack>

        {actionButton}
      </Stack>

      <Divider />

      <Typography variant="h6" className={classes.margin}>
        <FormattedMessage id="ui.course.dashboard.student.description" defaultMessage="ui.course.dashboard.student.description" />
      </Typography>

      <Stack className={classes.box}>
        {scCourse ? <Typography variant="body1">{scCourse.description}</Typography> : <Skeleton animation="wave" variant="text" height="130px" />}
      </Stack>

      <Typography variant="h6" className={classes.margin}>
        <FormattedMessage id="ui.course.dashboard.student.progress" defaultMessage="ui.course.dashboard.student.description" />
      </Typography>

      <Stack className={classes.box}>
        <Stack className={classes.percentageWrapper}>
          {scCourse ? (
            <Fragment>
              <Typography variant="body1">
                <FormattedMessage
                  id="ui.course.dashboard.student.progress.described"
                  defaultMessage="ui.course.dashboard.student.progress.described"
                  values={{progress: scCourse.num_lessons_completed, end: scCourse.num_lessons}}
                />
              </Typography>

              <Typography variant="body1">
                <FormattedMessage
                  id="ui.course.dashboard.student.progress.percentage"
                  defaultMessage="ui.course.dashboard.student.progress.percentage"
                  values={{percentage: scCourse.user_completion_rate}}
                />
              </Typography>
            </Fragment>
          ) : (
            <Fragment>
              <Skeleton animation="wave" variant="text" width="168px" height="19px" />
              <Skeleton animation="wave" variant="text" width="108px" height="19px" />
            </Fragment>
          )}
        </Stack>

        <LinearProgress className={classes.progress} variant="determinate" value={scCourse.user_completion_rate} />
      </Stack>

      {scCourse.user_completion_rate === 100 && (
        <Stack className={classNames(classes.completedWrapper, classes.margin)}>
          <Typography variant="h3">
            <FormattedMessage id="ui.course.dashboard.student.completed" defaultMessage="ui.course.dashboard.student.completed" />
          </Typography>

          <img
            src={CLAPPING}
            alt={intl.formatMessage({id: 'ui.course.dashboard.student.completed', defaultMessage: 'ui.course.dashboard.student.completed'})}
            width={32}
            height={32}
          />
        </Stack>
      )}

      <Typography variant="h6" className={classes.margin}>
        <FormattedMessage id="ui.course.dashboard.student.contents" defaultMessage="ui.course.dashboard.student.contents" />
      </Typography>

      <Stack className={classes.lessonsSections}>
        <Typography variant="h5">
          <FormattedMessage
            id="ui.course.table.sections.title"
            defaultMessage="ui.course.table.sections.title"
            values={{
              sectionsNumber: sections?.length || 0
            }}
          />
        </Typography>

        <Box className={classes.circle} />

        <Typography variant="h5">
          <FormattedMessage
            id="ui.course.table.lessons.title"
            defaultMessage="ui.course.table.lessons.title"
            values={{
              lessonsNumber: lessons?.length || 0
            }}
          />
        </Typography>
      </Stack>
      <AccordionLessons lessons={lessons} sections={sections} className={classes.accordion} />
    </Root>
  );
}

export default memo(Student);
