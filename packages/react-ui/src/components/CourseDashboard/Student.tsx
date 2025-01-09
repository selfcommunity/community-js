import {Fragment, HTMLAttributes, useEffect, useMemo, useState} from 'react';
import {PREFIX} from './constants';
import {Avatar, Box, Divider, LinearProgress, Skeleton, Stack, styled, Typography, useThemeProps} from '@mui/material';
import classNames from 'classnames';
import HeaderCourseDashboard from './Header';
import {SCCourseType} from '@selfcommunity/types';
import {useSnackbar} from 'notistack';
import {getCourseData} from '../EditCourse/data';
import {Logger} from '@selfcommunity/utils';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {FormattedMessage, useIntl} from 'react-intl';
import ActionButton from './Student/ActionButton';
import AccordionLessons from '../../shared/AccordionLessons';
import {IMAGE} from '../LessonCompletedDialog/image';

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
  className?: HTMLAttributes<HTMLDivElement>['className'];
  [p: string]: any;
}

export default function Student(inProps: StudentCourseDashboardProps) {
  // PROPS
  const props: StudentCourseDashboardProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });

  const {className, ...rest} = props;

  // STATES
  const [course, setCourse] = useState<SCCourseType | null>(null);

  // HOOKS
  const {enqueueSnackbar} = useSnackbar();
  const intl = useIntl();

  // EFFECTS
  useEffect(() => {
    getCourseData(1)
      .then((courseData) => {
        if (courseData) {
          setCourse(courseData);
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

  // MEMOS
  const actionButton = useMemo(() => {
    // TODO - manage different buttons

    if (!course) {
      return <Skeleton animation="wave" variant="rounded" width="160px" height="28px" />;
    }

    return <ActionButton labelId={messages.start} />;
  }, [course]);

  return (
    <Root className={classNames(classes.root, classes.studentContainer, className)} {...rest}>
      <HeaderCourseDashboard course={course} />

      <Divider />

      <Stack className={classes.userWrapper}>
        <Stack className={classes.user}>
          {course ? (
            <Avatar className={classes.avatar} src={course.created_by.avatar} alt={course.created_by.username} />
          ) : (
            <Skeleton animation="wave" variant="circular" className={classes.avatar} />
          )}

          <Box>
            {course ? (
              <Fragment>
                <Typography variant="body1">{course.created_by.username}</Typography>
                <Typography variant="body1">{course.created_by.role}</Typography>
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
        {course ? <Typography variant="body1">{course.description}</Typography> : <Skeleton animation="wave" variant="text" height="130px" />}
      </Stack>

      <Typography variant="h6" className={classes.margin}>
        <FormattedMessage id="ui.course.dashboard.student.progress" defaultMessage="ui.course.dashboard.student.description" />
      </Typography>

      <Stack className={classes.box}>
        <Stack className={classes.percentageWrapper}>
          {course ? (
            <Fragment>
              <Typography variant="body1">
                <FormattedMessage
                  id="ui.course.dashboard.student.progress.described"
                  defaultMessage="ui.course.dashboard.student.progress.described"
                  values={{progress: 1, end: 5}}
                />
              </Typography>

              <Typography variant="body1">
                <FormattedMessage
                  id="ui.course.dashboard.student.progress.percentage"
                  defaultMessage="ui.course.dashboard.student.progress.percentage"
                  values={{percentage: 15}}
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

        <LinearProgress className={classes.progress} variant="determinate" value={15} />
      </Stack>

      <Stack className={classNames(classes.completedWrapper, classes.margin)}>
        <Typography variant="h3">
          <FormattedMessage id="ui.course.dashboard.student.completed" defaultMessage="ui.course.dashboard.student.completed" />
        </Typography>

        <img
          src={IMAGE}
          alt={intl.formatMessage({id: 'ui.course.dashboard.student.completed', defaultMessage: 'ui.course.dashboard.student.completed'})}
          width={32}
          height={32}
        />
      </Stack>

      <Typography variant="h6" className={classes.margin}>
        <FormattedMessage id="ui.course.dashboard.student.contents" defaultMessage="ui.course.dashboard.student.contents" />
      </Typography>

      <Stack className={classes.lessonsSections}>
        <Typography variant="h5">
          <FormattedMessage
            id="ui.course.table.sections.title"
            defaultMessage="ui.course.table.sections.title"
            values={{
              sectionsNumber: 2
            }}
          />
        </Typography>

        <Box className={classes.circle} />

        <Typography variant="h5">
          <FormattedMessage
            id="ui.course.table.lessons.title"
            defaultMessage="ui.course.table.lessons.title"
            values={{
              lessonsNumber: 5
            }}
          />
        </Typography>
      </Stack>
      <AccordionLessons course={course} className={classes.accordion} />
    </Root>
  );
}
