import {useState} from 'react';
import {Avatar, Box, Button, Stack, Typography, styled} from '@mui/material';
import {Link, SCRoutes, SCRoutingContextType, useSCRouting} from '@selfcommunity/react-core';
import {SCNotificationCourseActivityType, SCNotificationTypologyType} from '@selfcommunity/types';
import {FormattedMessage} from 'react-intl';
import DateTimeAgo from '../../../shared/DateTimeAgo';
import classNames from 'classnames';
import {SCCourseTemplateType, SCNotificationObjectTemplateType} from '../../../types';
import NotificationItem, {NotificationItemProps} from '../../../shared/NotificationItem';
import UserDeletedSnackBar from '../../../shared/UserDeletedSnackBar';
import UserAvatar from '../../../shared/UserAvatar';
import {PREFIX} from '../constants';
import {default as CourseItem} from '../../Course';
import HiddenPlaceholder from '../../../shared/HiddenPlaceholder';
import {formatLessonUrl, getRouteName, getRouteParams} from './utils';

const classes = {
  root: `${PREFIX}-course-root`,
  avatar: `${PREFIX}-avatar`,
  actions: `${PREFIX}-actions`,
  seeButton: `${PREFIX}see-button`,
  activeAt: `${PREFIX}-active-at`,
  snippetTime: `${PREFIX}-snippet-time`,
  username: `${PREFIX}-username`
};

const Root = styled(NotificationItem, {
  name: PREFIX,
  slot: 'CourseRoot'
})(() => ({}));

export interface NotificationCourseProps
  extends Pick<
    NotificationItemProps,
    Exclude<
      keyof NotificationItemProps,
      'image' | 'disableTypography' | 'primary' | 'primaryTypographyProps' | 'secondary' | 'secondaryTypographyProps' | 'actions' | 'footer' | 'isNew'
    >
  > {
  /**
   * Notification obj
   * @default null
   */
  notificationObject: SCNotificationCourseActivityType;
}

/**
 * This component render the content of the notification of type course
 * @constructor
 * @param props
 */
export default function CourseNotification(props: NotificationCourseProps): JSX.Element {
  // PROPS
  const {
    notificationObject,
    id = `n_${props.notificationObject['sid']}`,
    className,
    template = SCNotificationObjectTemplateType.DETAIL,
    ...rest
  } = props;

  // CONTEXT
  const scRoutingContext: SCRoutingContextType = useSCRouting();

  // STATE
  const [openAlert, setOpenAlert] = useState<boolean>(false);

  // CONST
  const isSnippetTemplate = template === SCNotificationObjectTemplateType.SNIPPET;
  const isToastTemplate = template === SCNotificationObjectTemplateType.TOAST;

  if (!notificationObject.course) {
    return <HiddenPlaceholder />;
  }

  // RENDER
  if (isSnippetTemplate || isToastTemplate) {
    return (
      <Root
        id={id}
        className={classNames(classes.root, className, `${PREFIX}-${template}`)}
        template={template}
        isNew={notificationObject.is_new}
        disableTypography
        image={
          <Link
            {...(!notificationObject.user.deleted && {
              to: scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, notificationObject.user)
            })}
            onClick={notificationObject.user.deleted ? () => setOpenAlert(true) : null}>
            <UserAvatar hide={!notificationObject.user.community_badge} smaller={true}>
              <Avatar
                alt={notificationObject.user.username}
                variant="circular"
                src={notificationObject.user.avatar}
                classes={{root: classes.avatar}}
              />
            </UserAvatar>
          </Link>
        }
        primary={
          <Box>
            <Link
              {...(!notificationObject.user.deleted && {
                to: scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, notificationObject.user)
              })}
              onClick={notificationObject.user.deleted ? () => setOpenAlert(true) : null}
              className={classes.username}>
              {notificationObject.user.username}
            </Link>{' '}
            <FormattedMessage
              id={`ui.notification.course.${notificationObject.type}`}
              defaultMessage={`ui.notification.course.${notificationObject.type}`}
              values={{
                name:
                  notificationObject.type === SCNotificationTypologyType.USER_COMMENTED_A_COURSE_LESSON
                    ? notificationObject.comment.lesson_name
                    : notificationObject.course.name,
                link: (...chunks) => (
                  <Link
                    to={scRoutingContext.url(
                      notificationObject.type === SCNotificationTypologyType.USER_COMMENTED_A_COURSE_LESSON
                        ? SCRoutes.COURSE_LESSON_ROUTE_NAME
                        : SCRoutes.COURSE_ROUTE_NAME,
                      notificationObject.type === SCNotificationTypologyType.USER_COMMENTED_A_COURSE_LESSON
                        ? formatLessonUrl(notificationObject)
                        : notificationObject.course
                    )}>
                    {chunks}
                  </Link>
                )
              }}
            />
          </Box>
        }
        footer={
          isToastTemplate ? (
            <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
              <DateTimeAgo date={notificationObject.active_at} />
              <Typography color="primary">
                <Link to={scRoutingContext.url(getRouteName(notificationObject), getRouteParams(notificationObject))}>
                  <FormattedMessage id="ui.notification.course.button.see" defaultMessage="ui.notification.course.button.see" />
                </Link>
              </Typography>
            </Stack>
          ) : (
            <DateTimeAgo date={notificationObject.active_at} className={classes.snippetTime} />
          )
        }
        {...rest}
      />
    );
  }
  return (
    <>
      <Root
        id={id}
        className={classNames(classes.root, className, `${PREFIX}-${template}`)}
        template={template}
        isNew={notificationObject.is_new}
        disableTypography
        image={
          <Link
            {...(!notificationObject.user.deleted && {
              to: scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, notificationObject.user)
            })}
            onClick={notificationObject.user.deleted ? () => setOpenAlert(true) : null}>
            <UserAvatar hide={!notificationObject.user.community_badge} smaller={true}>
              <Avatar className={classes.avatar} alt={notificationObject.user.username} variant="circular" src={notificationObject.user.avatar} />
            </UserAvatar>
          </Link>
        }
        primary={
          <>
            <Link
              {...(!notificationObject.user.deleted && {
                to: scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, notificationObject.user)
              })}
              onClick={notificationObject.user.deleted ? () => setOpenAlert(true) : null}
              className={classes.username}>
              {notificationObject.user.username}
            </Link>{' '}
            <FormattedMessage
              id={`ui.notification.course.${notificationObject.type}`}
              defaultMessage={`ui.notification.course.${notificationObject.type}`}
              values={{
                name:
                  notificationObject.type === SCNotificationTypologyType.USER_COMMENTED_A_COURSE_LESSON
                    ? notificationObject.comment.lesson_name
                    : notificationObject.course.name,
                link: (...chunks) => (
                  <Link
                    to={scRoutingContext.url(
                      notificationObject.type === SCNotificationTypologyType.USER_COMMENTED_A_COURSE_LESSON
                        ? SCRoutes.COURSE_LESSON_ROUTE_NAME
                        : SCRoutes.COURSE_ROUTE_NAME,
                      notificationObject.type === SCNotificationTypologyType.USER_COMMENTED_A_COURSE_LESSON
                        ? formatLessonUrl(notificationObject)
                        : notificationObject.course
                    )}>
                    {chunks}
                  </Link>
                )
              }}
            />
            {notificationObject.type === SCNotificationTypologyType.USER_COMMENTED_A_COURSE_LESSON ? (
              <Typography variant="body2" dangerouslySetInnerHTML={{__html: notificationObject.comment.html}} />
            ) : (
              <CourseItem course={notificationObject.course as any} actions={<></>} template={SCCourseTemplateType.SNIPPET} elevation={0} />
            )}
          </>
        }
        actions={
          <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
            <DateTimeAgo date={notificationObject.active_at} className={classes.activeAt} />
            <Button
              color="primary"
              variant="outlined"
              size="small"
              classes={{root: classes.seeButton}}
              component={Link}
              to={scRoutingContext.url(getRouteName(notificationObject), getRouteParams(notificationObject))}>
              <FormattedMessage id="ui.notification.course.button.see" defaultMessage="ui.notification.course.button.see" />
            </Button>
          </Stack>
        }
        {...rest}
      />
      {openAlert && <UserDeletedSnackBar open={openAlert} handleClose={() => setOpenAlert(false)} />}
    </>
  );
}
