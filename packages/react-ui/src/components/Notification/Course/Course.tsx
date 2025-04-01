import React, {useState} from 'react';
import {styled} from '@mui/material/styles';
import {Avatar, Box, Stack, Typography} from '@mui/material';
import {Link, SCRoutes, SCRoutingContextType, useSCRouting} from '@selfcommunity/react-core';
import {SCNotificationCourseActivityType} from '@selfcommunity/types';
import {FormattedMessage} from 'react-intl';
import DateTimeAgo from '../../../shared/DateTimeAgo';
import classNames from 'classnames';
import {SCCourseTemplateType, SCNotificationObjectTemplateType} from '../../../types';
import NotificationItem, {NotificationItemProps} from '../../../shared/NotificationItem';
import {LoadingButton} from '@mui/lab';
import UserDeletedSnackBar from '../../../shared/UserDeletedSnackBar';
import UserAvatar from '../../../shared/UserAvatar';
import {PREFIX} from '../constants';
import {default as CourseItem} from '../../Course';
import HiddenPlaceholder from '../../../shared/HiddenPlaceholder';

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
            {...(!notificationObject.course.created_by.deleted && {
              to: scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, notificationObject.course.created_by)
            })}
            onClick={notificationObject.course.created_by.deleted ? () => setOpenAlert(true) : null}>
            <UserAvatar hide={!notificationObject.course.created_by.community_badge} smaller={true}>
              <Avatar
                alt={notificationObject.course.created_by.username}
                variant="circular"
                src={notificationObject.course.created_by.avatar}
                classes={{root: classes.avatar}}
              />
            </UserAvatar>
          </Link>
        }
        primary={
          <Box>
            <Link
              {...(!notificationObject.course.created_by.deleted && {
                to: scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, notificationObject.course.created_by)
              })}
              onClick={notificationObject.course.created_by.deleted ? () => setOpenAlert(true) : null}
              className={classes.username}>
              {notificationObject.course.created_by.username}
            </Link>{' '}
            <FormattedMessage
              id={`ui.notification.course.${notificationObject.type}`}
              defaultMessage={`ui.notification.course.${notificationObject.type}`}
              values={{
                // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                // @ts-ignore
                course: notificationObject.course.name,
                link: (...chunks) => <Link to={scRoutingContext.url(SCRoutes.COURSE_ROUTE_NAME, notificationObject.course)}>{chunks}</Link>
              }}
            />
          </Box>
        }
        footer={
          isToastTemplate ? (
            <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
              <DateTimeAgo date={notificationObject.active_at} />
              <Typography color="primary">
                <Link to={scRoutingContext.url(SCRoutes.COURSE_ROUTE_NAME, notificationObject.course)}>
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
            {...(!notificationObject.course.created_by.deleted && {
              to: scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, notificationObject.course.created_by)
            })}
            onClick={notificationObject.course.created_by.deleted ? () => setOpenAlert(true) : null}>
            <UserAvatar hide={!notificationObject.course.created_by.community_badge} smaller={true}>
              <Avatar
                className={classes.avatar}
                alt={notificationObject.course.created_by.username}
                variant="circular"
                src={notificationObject.course.created_by.avatar}
              />
            </UserAvatar>
          </Link>
        }
        primary={
          <>
            <Link
              {...(!notificationObject.course.created_by.deleted && {
                to: scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, notificationObject.course.created_by)
              })}
              onClick={notificationObject.course.created_by.deleted ? () => setOpenAlert(true) : null}
              className={classes.username}>
              {notificationObject.course.created_by.username}
            </Link>{' '}
            <FormattedMessage
              id={`ui.notification.course.${notificationObject.type}`}
              defaultMessage={`ui.notification.course.${notificationObject.type}`}
              values={{
                // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                // @ts-ignore
                course: notificationObject.course.name,
                link: (...chunks) => <Link to={scRoutingContext.url(SCRoutes.COURSE_ROUTE_NAME, notificationObject.course)}>{chunks}</Link>
              }}
            />
            <CourseItem course={notificationObject.course as any} actions={<></>} template={SCCourseTemplateType.SNIPPET} elevation={0} />
          </>
        }
        actions={
          <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
            <DateTimeAgo date={notificationObject.active_at} className={classes.activeAt} />
            <LoadingButton
              color={'primary'}
              variant="outlined"
              size="small"
              classes={{root: classes.seeButton}}
              component={Link}
              to={scRoutingContext.url(SCRoutes.COURSE_ROUTE_NAME, notificationObject.course)}>
              <FormattedMessage id="ui.notification.course.button.see" defaultMessage="ui.notification.course.button.see" />
            </LoadingButton>
          </Stack>
        }
        {...rest}
      />
      {openAlert && <UserDeletedSnackBar open={openAlert} handleClose={() => setOpenAlert(false)} />}
    </>
  );
}
