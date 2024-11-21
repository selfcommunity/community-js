import React, {useState} from 'react';
import {styled} from '@mui/material/styles';
import {Avatar, Box, Icon, Stack, Typography} from '@mui/material';
import {Link, SCRoutes, SCRoutingContextType, useSCRouting} from '@selfcommunity/react-core';
import {SCNotificationLiveStreamActivityType} from '@selfcommunity/types';
import {FormattedMessage, useIntl} from 'react-intl';
import DateTimeAgo from '../../../shared/DateTimeAgo';
import classNames from 'classnames';
import {SCNotificationObjectTemplateType} from '../../../types';
import NotificationItem, {NotificationItemProps} from '../../../shared/NotificationItem';
import {LoadingButton} from '@mui/lab';
import UserDeletedSnackBar from '../../../shared/UserDeletedSnackBar';
import UserAvatar from '../../../shared/UserAvatar';
import {PREFIX} from '../constants';
import {default as EventItem} from '../../Event';

const classes = {
  root: `${PREFIX}-event-root`,
  avatar: `${PREFIX}-avatar`,
  actions: `${PREFIX}-actions`,
  seeButton: `${PREFIX}see-button`,
  activeAt: `${PREFIX}-active-at`,
  snippetTime: `${PREFIX}-snippet-time`,
  username: `${PREFIX}-username`
};

const Root = styled(NotificationItem, {
  name: PREFIX,
  slot: 'EventRoot'
})(() => ({}));

export interface NotificationLiveStreamProps
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
  notificationObject: SCNotificationLiveStreamActivityType;
}

/**
 * This component render the content of the notification of type event
 * @constructor
 * @param props
 */
export default function LiveStreamNotification(props: NotificationLiveStreamProps): JSX.Element {
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
  const intl = useIntl();

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
              id={`ui.notification.event.${notificationObject.type}`}
              defaultMessage={`ui.notification.event.${notificationObject.type}`}
              values={{
                // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                // @ts-ignore
                icon: (...chunks) => <Icon>{chunks}</Icon>,
                event: notificationObject.live_stream.title,
                link: (...chunks) => <Link to={scRoutingContext.url(SCRoutes.LIVESTREAM_ROUTE_NAME, notificationObject.live_stream)}>{chunks}</Link>
              }}
            />
          </Box>
        }
        secondary={
          <>
            <Typography component="span">
              <FormattedMessage
                id="ui.notification.event.dateTime"
                defaultMessage="ui.notification.event.dateTime"
                values={{
                  date: intl.formatDate(notificationObject.live_stream.created_at, {
                    weekday: 'long',
                    day: 'numeric',
                    year: 'numeric',
                    month: 'long'
                  }),
                  hour: intl.formatDate(notificationObject.live_stream.created_at, {hour: 'numeric', minute: 'numeric'})
                }}
              />
            </Typography>
          </>
        }
        footer={
          isToastTemplate ? (
            <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
              <DateTimeAgo date={notificationObject.active_at} />
              <Typography color="primary">
                <Link to={scRoutingContext.url(SCRoutes.LIVESTREAM_ROUTE_NAME, notificationObject.live_stream)}>
                  <FormattedMessage id="ui.notification.event.button.see" defaultMessage="ui.notification.event.button.see" />
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
              id={`ui.notification.${notificationObject.type}`}
              defaultMessage={`ui.notification.${notificationObject.type}`}
              values={{
                // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                // @ts-ignore
                icon: (...chunks) => <Icon>{chunks}</Icon>,
                event: notificationObject.live_stream.title,
                link: (...chunks) => <Link to={scRoutingContext.url(SCRoutes.LIVESTREAM_ROUTE_NAME, notificationObject.live_stream)}>{chunks}</Link>
              }}
            />
            <EventItem event={notificationObject.live_stream as any} actions={<></>} elevation={0} />
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
              to={scRoutingContext.url(SCRoutes.LIVESTREAM_ROUTE_NAME, notificationObject.live_stream)}>
              <FormattedMessage id="ui.notification.event.button.see" defaultMessage="ui.notification.event.button.see" />
            </LoadingButton>
          </Stack>
        }
        {...rest}
      />
      {openAlert && <UserDeletedSnackBar open={openAlert} handleClose={() => setOpenAlert(false)} />}
    </>
  );
}
