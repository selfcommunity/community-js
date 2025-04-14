import {Fragment, HTMLAttributes, memo, useCallback, useEffect, useMemo, useState} from 'react';
import {PREFIX} from './constants';
import {Avatar, Box, Divider, LinearProgress, Stack, styled, Typography, useThemeProps} from '@mui/material';
import classNames from 'classnames';
import HeaderCourseDashboard from './Header';
import {
  SCCourseJoinStatusType,
  SCCourseLessonCompletionStatusType,
  SCCoursePrivacyType,
  SCCourseSectionType,
  SCCourseType
} from '@selfcommunity/types';
import {FormattedMessage, useIntl} from 'react-intl';
import ActionButton from './Student/ActionButton';
import {CLAPPING} from '../../assets/courses/clapping';
import {
  SCRoutes,
  SCRoutingContextType,
  useSCFetchCourse,
  useSCRouting,
  Link,
  SCUserContextType,
  useSCUser,
  SCContextType,
  useSCContext
} from '@selfcommunity/react-core';
import AccordionLessons from '../../shared/AccordionLessons';
import {CourseService} from '@selfcommunity/api-services';
import {Logger} from '@selfcommunity/utils';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {useSnackbar} from 'notistack';
import StudentSkeleton from './Student/Skeleton';
import UserAvatar from '../../shared/UserAvatar';

const BUTTON_MESSAGES = {
  dashboard: 'ui.course.dashboard.student.button.dashboard',
  request: 'ui.course.dashboard.student.button.request',
  signUp: 'ui.course.dashboard.student.button.signUp',
  review: 'ui.course.dashboard.student.button.review',
  cancel: 'ui.course.dashboard.student.button.cancel',
  start: 'ui.course.dashboard.student.button.start',
  continue: 'ui.course.dashboard.student.button.continue'
};

const SNACKBAR_MESSAGES = {
  cancel: 'ui.course.dashboard.student.snackbar.success.cancel',
  enroll: 'ui.course.dashboard.student.snackbar.success.enroll',
  request: 'ui.course.dashboard.student.snackbar.success.request'
};

const classes = {
  root: `${PREFIX}-root`,
  studentContainer: `${PREFIX}-student-container`,
  userWrapper: `${PREFIX}-user-wrapper`,
  actionsWrapper: `${PREFIX}-actions-wrapper`,
  user: `${PREFIX}-user`,
  avatar: `${PREFIX}-avatar`,
  description: `${PREFIX}-description`,
  progress: `${PREFIX}-progress`,
  lessonsSections: `${PREFIX}-lessons-sections`,
  circle: `${PREFIX}-circle`,
  accordion: `${PREFIX}-accordion`,
  margin: `${PREFIX}-margin`,
  box: `${PREFIX}-box`,
  percentageWrapper: `${PREFIX}-percentage-wrapper`,
  completedWrapper: `${PREFIX}-completed-wrapper`,
  contrastColor: `${PREFIX}-contrast-color`
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

  if (course.user_completion_rate === 100) {
    Object.assign(data, {
      section_id: course.sections?.[0].id,
      lesson_id: course.sections?.[0].lessons[0].id
    });

    return data;
  }

  course.sections?.some((section: SCCourseSectionType) => {
    const isNextLessonInThisSection = section.num_lessons_completed < section.num_lessons && !section.locked;

    if (isNextLessonInThisSection) {
      Object.assign(data, {
        section_id: section.id,
        lesson_id: section.lessons.find((lesson) => lesson.completion_status === SCCourseLessonCompletionStatusType.UNCOMPLETED)?.id
      });
    }

    return isNextLessonInThisSection;
  });

  return data;
}

function getIsNextLessonLocked(course: SCCourseType): boolean {
  if (course.join_status === null) {
    return undefined;
  }

  return course.sections?.every((section: SCCourseSectionType) => {
    return (
      section.num_lessons_completed < section.num_lessons &&
      section.lessons?.find((lesson) => lesson.completion_status === SCCourseLessonCompletionStatusType.UNCOMPLETED)?.locked
    );
  });
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
  const scContext: SCContextType = useSCContext();
  const scUserContext: SCUserContextType = useSCUser();

  // HOOKS
  const {scCourse, setSCCourse} = useSCFetchCourse({id: courseId, course});
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
      .then((data: any) => {
        let updatedCourse: SCCourseType;

        if (data) {
          updatedCourse = data;
        } else {
          updatedCourse = {
            ...scCourse,
            join_status: null
          };
        }

        setSCCourse(updatedCourse);
        setSentRequest((prev) => !prev);
        setLoadingRequest(false);

        enqueueSnackbar(
          <FormattedMessage
            id={
              updatedCourse.join_status === SCCourseJoinStatusType.REQUESTED
                ? SNACKBAR_MESSAGES.request
                : updatedCourse.join_status === SCCourseJoinStatusType.JOINED
                ? SNACKBAR_MESSAGES.enroll
                : SNACKBAR_MESSAGES.cancel
            }
            defaultMessage={
              updatedCourse.join_status === SCCourseJoinStatusType.REQUESTED
                ? SNACKBAR_MESSAGES.request
                : updatedCourse.join_status === SCCourseJoinStatusType.JOINED
                ? SNACKBAR_MESSAGES.enroll
                : SNACKBAR_MESSAGES.cancel
            }
          />,
          {
            variant: 'success',
            autoHideDuration: 3000
          }
        );
      })
      .catch((error) => {
        enqueueSnackbar(<FormattedMessage id="ui.common.error.action" defaultMessage="ui.common.error.action" />, {
          variant: 'error',
          autoHideDuration: 3000
        });

        Logger.error(SCOPE_SC_UI, error);
      });
  }, [scCourse, sentRequest, setLoadingRequest]);

  const handleAnonymousAction = useCallback(() => {
    scContext.settings.handleAnonymousAction();
  }, [scContext.settings.handleAnonymousAction]);

  // MEMOS
  const actionButton = useMemo(() => {
    if (!scCourse) {
      return <></>;
    }

    return (
      <Stack className={classes.actionsWrapper}>
        {(scCourse.join_status === SCCourseJoinStatusType.CREATOR || scCourse.join_status === SCCourseJoinStatusType.MANAGER) && (
          <ActionButton
            labelId={BUTTON_MESSAGES.dashboard}
            to={scRoutingContext.url(SCRoutes.COURSE_DASHBOARD_ROUTE_NAME, scCourse)}
            color="inherit"
            variant="outlined"
          />
        )}
        {(((scCourse.privacy === SCCoursePrivacyType.PRIVATE || scCourse.privacy === SCCoursePrivacyType.SECRET) &&
          (scCourse.join_status === SCCourseJoinStatusType.MANAGER || scCourse.join_status === SCCourseJoinStatusType.JOINED)) ||
          (scCourse.privacy === SCCoursePrivacyType.OPEN && scCourse.join_status !== SCCourseJoinStatusType.CREATOR)) && (
          <ActionButton
            labelId={
              scCourse.join_status === null
                ? BUTTON_MESSAGES.signUp
                : scCourse.user_completion_rate === 0
                ? BUTTON_MESSAGES.start
                : scCourse.user_completion_rate === 100
                ? BUTTON_MESSAGES.review
                : BUTTON_MESSAGES.continue
            }
            to={scCourse.join_status !== null ? scRoutingContext.url(SCRoutes.COURSE_LESSON_ROUTE_NAME, getUrlNextLesson(scCourse)) : undefined}
            disabled={getIsNextLessonLocked(scCourse)}
            color={scCourse.user_completion_rate === 100 ? 'inherit' : undefined}
            variant={scCourse.user_completion_rate === 100 ? 'outlined' : undefined}
            loading={scCourse.join_status === null ? loadingRequest : undefined}
            onClick={!scUserContext.user ? handleAnonymousAction : scCourse.join_status === null ? handleRequest : undefined}
          />
        )}
        {scCourse.privacy === SCCoursePrivacyType.PRIVATE &&
          (scCourse.join_status === null || scCourse.join_status === SCCourseJoinStatusType.REQUESTED) && (
            <ActionButton
              labelId={sentRequest ? BUTTON_MESSAGES.cancel : BUTTON_MESSAGES.request}
              color="inherit"
              variant="outlined"
              loading={loadingRequest}
              onClick={handleRequest}
            />
          )}
      </Stack>
    );
  }, [scCourse, sentRequest, loadingRequest, handleRequest]);

  if (!scCourse) {
    return <StudentSkeleton />;
  }

  return (
    <Root className={classNames(classes.root, classes.studentContainer, className)} {...rest}>
      <HeaderCourseDashboard course={scCourse} />

      <Divider />

      <Stack className={classes.userWrapper}>
        <Stack className={classes.user}>
          <Link
            {...(!scCourse.created_by.deleted && {
              to: scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, scCourse.created_by)
            })}>
            <UserAvatar hide={!scCourse.created_by.community_badge} smaller={true}>
              <Avatar className={classes.avatar} src={scCourse.created_by.avatar} alt={scCourse.created_by.username} />
            </UserAvatar>
          </Link>

          <Box>
            <Link
              {...(!scCourse.created_by.deleted && {
                to: scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, scCourse.created_by)
              })}>
              <Typography variant="body1">{scCourse.created_by.username}</Typography>
            </Link>
            <Typography variant="body1">
              <FormattedMessage id="ui.course.dashboard.header.user.creator" defaultMessage="ui.course.dashboard.header.user.creator" />
            </Typography>
          </Box>
        </Stack>

        {actionButton}
      </Stack>

      <Divider />

      {(((scCourse.privacy === SCCoursePrivacyType.PRIVATE || scCourse.privacy === SCCoursePrivacyType.SECRET) &&
        (scCourse.join_status === SCCourseJoinStatusType.CREATOR ||
          scCourse.join_status === SCCourseJoinStatusType.MANAGER ||
          scCourse.join_status === SCCourseJoinStatusType.JOINED)) ||
        scCourse.privacy === SCCoursePrivacyType.OPEN ||
        scCourse.privacy === SCCoursePrivacyType.DRAFT) &&
        scCourse.description && (
          <Fragment>
            <Typography variant="h6" className={classNames(classes.margin, classes.contrastColor)}>
              <FormattedMessage id="ui.course.dashboard.student.description" defaultMessage="ui.course.dashboard.student.description" />
            </Typography>

            <Stack className={classes.box}>
              <Typography variant="body1" className={classes.description}>
                {scCourse.description}
              </Typography>
            </Stack>
          </Fragment>
        )}

      {(((scCourse.privacy === SCCoursePrivacyType.PRIVATE || scCourse.privacy === SCCoursePrivacyType.SECRET) &&
        (scCourse.join_status === SCCourseJoinStatusType.MANAGER || scCourse.join_status === SCCourseJoinStatusType.JOINED)) ||
        (scCourse.privacy === SCCoursePrivacyType.OPEN && scCourse.join_status !== SCCourseJoinStatusType.CREATOR)) && (
        <Fragment>
          {scCourse.join_status !== null && (
            <Fragment>
              <Typography variant="h6" className={classNames(classes.margin, classes.contrastColor)}>
                <FormattedMessage id="ui.course.dashboard.student.progress" defaultMessage="ui.course.dashboard.student.progress" />
              </Typography>

              <Stack className={classes.box}>
                <Stack className={classes.percentageWrapper}>
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
                </Stack>

                <LinearProgress className={classes.progress} variant="determinate" value={scCourse.user_completion_rate} />
              </Stack>
            </Fragment>
          )}

          {scCourse.user_completion_rate === 100 && (
            <Stack className={classNames(classes.completedWrapper, classes.margin)}>
              <Typography variant="h3" className={classes.contrastColor}>
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

          <Typography variant="h6" className={classNames(classes.margin, classes.contrastColor)}>
            <FormattedMessage id="ui.course.dashboard.student.contents" defaultMessage="ui.course.dashboard.student.contents" />
          </Typography>

          <Stack className={classes.lessonsSections}>
            <Typography variant="h5">
              <FormattedMessage
                id="ui.course.table.sections.title"
                defaultMessage="ui.course.table.sections.title"
                values={{
                  sectionsNumber: scCourse.num_sections
                }}
              />
            </Typography>

            <Box className={classes.circle} />

            <Typography variant="h5">
              <FormattedMessage
                id="ui.course.table.lessons.title"
                defaultMessage="ui.course.table.lessons.title"
                values={{
                  lessonsNumber: scCourse.num_lessons
                }}
              />
            </Typography>
          </Stack>
          <AccordionLessons course={scCourse} className={classes.accordion} />
        </Fragment>
      )}
    </Root>
  );
}

export default memo(Student);
