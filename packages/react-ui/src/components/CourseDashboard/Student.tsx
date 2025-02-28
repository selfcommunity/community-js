import {Fragment, HTMLAttributes, memo, useCallback, useEffect, useMemo, useState} from 'react';
import {PREFIX} from './constants';
import {Avatar, Box, Divider, LinearProgress, Skeleton, Stack, styled, Typography, useThemeProps} from '@mui/material';
import classNames from 'classnames';
import HeaderCourseDashboard from './Header';
import {SCCourseJoinStatusType, SCCoursePrivacyType, SCCourseSectionType, SCCourseType} from '@selfcommunity/types';
import {FormattedMessage, useIntl} from 'react-intl';
import ActionButton from './Student/ActionButton';
import {CLAPPING} from '../../assets/courses/clapping';
import {SCRoutes, SCRoutingContextType, useSCFetchCourse, useSCRouting} from '@selfcommunity/react-core';
import AccordionLessons from '../../shared/AccordionLessons';
import {CourseService} from '@selfcommunity/api-services';
import {Logger} from '@selfcommunity/utils';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {useSnackbar} from 'notistack';

const messages = {
  dashboard: 'ui.course.dashboard.student.button.dashboard',
  request: 'ui.course.dashboard.student.button.request',
  cancel: 'ui.course.dashboard.student.button.cancel',
  start: 'ui.course.dashboard.student.button.start',
  continue: 'ui.course.dashboard.student.button.continue'
};

const classes = {
  root: `${PREFIX}-root`,
  studentContainer: `${PREFIX}-student-container`,
  userWrapper: `${PREFIX}-user-wrapper`,
  actionsWrapper: `${PREFIX}-actions-wrapper`,
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

type DataUrlLesson = {
  id: number;
  slug: string;
  section_id?: number;
  lesson_id?: number;
};

function getUrlNextLesson(course: SCCourseType): DataUrlLesson {
  const data: DataUrlLesson = {
    id: course.id,
    slug: course.slug
  };

  course.sections.some((section: SCCourseSectionType) => {
    Object.assign(data, {
      section_id: section.id,
      lesson_id: section.lessons[section.num_lessons_completed].id
    });

    return section.num_lessons_completed < section.num_lessons;
  });

  return data;
}

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
  const [sentRequest, setSentRequest] = useState<boolean | null>(null);
  const [loadingRequest, setLoadingRequest] = useState<boolean>(false);

  // CONTEXTS
  const scRoutingContext: SCRoutingContextType = useSCRouting();

  // HOOKS
  const {scCourse} = useSCFetchCourse({id: courseId, course});
  const intl = useIntl();
  const {enqueueSnackbar} = useSnackbar();

  // EFFETCS
  useEffect(() => {
    if (scCourse) {
      setSentRequest(scCourse.join_status === SCCourseJoinStatusType.REQUESTED);
    }
  }, [scCourse, setSentRequest]);

  // HANDLERS
  const handleRequest = useCallback(() => {
    setLoadingRequest(true);

    let request: Promise<any>;
    if (sentRequest) {
      request = CourseService.leaveOrRemoveCourseRequest(scCourse.id);
    } else {
      request = CourseService.joinOrAcceptInviteToCourse(scCourse.id);
    }

    request
      .then(() => {
        enqueueSnackbar(
          <FormattedMessage
            id={`ui.course.dashboard.student.snackbar.success.${sentRequest ? 'cancel' : 'request'}`}
            defaultMessage={`ui.course.dashboard.student.snackbar.success.${sentRequest ? 'cancel' : 'request'}`}
          />,
          {
            variant: 'success',
            autoHideDuration: 3000
          }
        );

        setSentRequest((prev) => !prev);
        setLoadingRequest(false);
      })
      .catch((error) => {
        enqueueSnackbar(<FormattedMessage id="ui.common.error.action" defaultMessage="ui.common.error.action" />, {
          variant: 'error',
          autoHideDuration: 3000
        });

        Logger.error(SCOPE_SC_UI, error);
      });
  }, [scCourse, sentRequest, setLoadingRequest]);

  // MEMOS
  const actionButton = useMemo(() => {
    if (!scCourse) {
      return <Skeleton animation="wave" variant="rounded" width="160px" height="28px" />;
    }

    return (
      <Stack className={classes.actionsWrapper}>
        {(scCourse?.join_status === SCCourseJoinStatusType.CREATOR || scCourse?.join_status === SCCourseJoinStatusType.MANAGER) && (
          <ActionButton
            labelId={messages.dashboard}
            to={scRoutingContext.url(SCRoutes.COURSE_DASHBOARD_ROUTE_NAME, scCourse)}
            color="inherit"
            variant="outlined"
          />
        )}
        {(scCourse?.join_status === SCCourseJoinStatusType.MANAGER || scCourse?.join_status === SCCourseJoinStatusType.JOINED) &&
          (scCourse?.join_status !== null || scCourse.privacy !== SCCoursePrivacyType.PRIVATE) &&
          scCourse.user_completion_rate < 100 && (
            <ActionButton
              labelId={scCourse.num_lessons_completed === 0 ? messages.start : messages.continue}
              to={scRoutingContext.url(SCRoutes.COURSE_LESSON_ROUTE_NAME, getUrlNextLesson(scCourse))}
            />
          )}
        {scCourse.privacy === SCCoursePrivacyType.PRIVATE &&
          (scCourse.join_status === null || scCourse.join_status === SCCourseJoinStatusType.REQUESTED) && (
            <ActionButton
              labelId={sentRequest ? messages.cancel : messages.request}
              color="inherit"
              variant="outlined"
              loading={loadingRequest}
              onClick={handleRequest}
            />
          )}
      </Stack>
    );
  }, [scCourse, sentRequest, loadingRequest, handleRequest]);

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
                <Typography variant="body1">
                  <FormattedMessage id="ui.course.dashboard.header.user.creator" defaultMessage="ui.course.dashboard.header.user.creator" />
                </Typography>
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

      {(scCourse?.join_status === SCCourseJoinStatusType.CREATOR ||
        scCourse?.join_status === SCCourseJoinStatusType.MANAGER ||
        scCourse?.join_status === SCCourseJoinStatusType.JOINED ||
        scCourse?.privacy !== SCCoursePrivacyType.PRIVATE) && (
        <Fragment>
          <Typography variant="h6" className={classes.margin}>
            <FormattedMessage id="ui.course.dashboard.student.description" defaultMessage="ui.course.dashboard.student.description" />
          </Typography>

          <Stack className={classes.box}>
            {scCourse ? <Typography variant="body1">{scCourse.description}</Typography> : <Skeleton animation="wave" variant="text" height="130px" />}
          </Stack>
        </Fragment>
      )}

      {(scCourse?.join_status === SCCourseJoinStatusType.MANAGER || scCourse?.join_status === SCCourseJoinStatusType.JOINED) && (
        <Fragment>
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

            <LinearProgress className={classes.progress} variant="determinate" value={scCourse?.user_completion_rate} />
          </Stack>

          {scCourse?.user_completion_rate === 100 && (
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
            {scCourse ? (
              <Typography variant="h5">
                <FormattedMessage
                  id="ui.course.table.sections.title"
                  defaultMessage="ui.course.table.sections.title"
                  values={{
                    sectionsNumber: scCourse.num_sections
                  }}
                />
              </Typography>
            ) : (
              <Skeleton animation="wave" variant="text" width="58px" height="21px" />
            )}

            <Box className={classes.circle} />

            {scCourse ? (
              <Typography variant="h5">
                <FormattedMessage
                  id="ui.course.table.lessons.title"
                  defaultMessage="ui.course.table.lessons.title"
                  values={{
                    lessonsNumber: scCourse.num_lessons
                  }}
                />
              </Typography>
            ) : (
              <Skeleton animation="wave" variant="text" width="58px" height="21px" />
            )}
          </Stack>
          <AccordionLessons course={scCourse} className={classes.accordion} />
        </Fragment>
      )}
    </Root>
  );
}

export default memo(Student);
