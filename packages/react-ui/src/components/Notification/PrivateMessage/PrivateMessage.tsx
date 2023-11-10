import React, {useContext, useEffect, useMemo, useState} from 'react';
import {styled} from '@mui/material/styles';
import {Avatar, Box, Button, Stack, Typography} from '@mui/material';
import {
  Link,
  SCConnectionsManagerType,
  SCFollowersManagerType,
  SCPreferences,
  SCPreferencesContextType,
  SCRoutes,
  SCRoutingContextType,
  SCUserContext,
  SCUserContextType,
  useSCPreferences,
  useSCRouting
} from '@selfcommunity/react-core';
import {SCNotificationPrivateMessageType} from '@selfcommunity/types';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import DateTimeAgo from '../../../shared/DateTimeAgo';
import classNames from 'classnames';
import {SCNotificationObjectTemplateType} from '../../../types';
import {useThemeProps} from '@mui/system';
import NotificationItem, {NotificationItemProps} from '../../../shared/NotificationItem';
import {LoadingButton} from '@mui/lab';
import UserDeletedSnackBar from '../../../shared/UserDeletedSnackBar';
import UserAvatar from '../../../shared/UserAvatar';
import {PREFIX} from '../constants';

const messages = defineMessages({
  receivePrivateMessage: {
    id: 'ui.notification.receivePrivateMessage',
    defaultMessage: 'ui.notification.receivePrivateMessage'
  }
});

const classes = {
  root: `${PREFIX}-private-message-root`,
  avatar: `${PREFIX}-avatar`,
  actions: `${PREFIX}-actions`,
  replyButton: `${PREFIX}-reply-button`,
  activeAt: `${PREFIX}-active-at`,
  messageLabel: `${PREFIX}-message-label`,
  username: `${PREFIX}-username`,
  messageWrap: `${PREFIX}-message-wrap`,
  message: `${PREFIX}-message`
};

const Root = styled(NotificationItem, {
  name: PREFIX,
  slot: 'PrivateMessageRoot'
})(() => ({}));

export interface NotificationPrivateMessageProps
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
  notificationObject: SCNotificationPrivateMessageType;
}

/**
 * This component render the content of the notification of type private message
 * @param inProps
 * @constructor
 */
export default function PrivateMessageNotification(inProps: NotificationPrivateMessageProps): JSX.Element {
  // PROPS
  const props: NotificationPrivateMessageProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {
    notificationObject,
    id = `n_${props.notificationObject['sid']}`,
    className,
    template = SCNotificationObjectTemplateType.DETAIL,
    ...rest
  } = props;

  // CONTEXT
  const scRoutingContext: SCRoutingContextType = useSCRouting();
  const scUserContext: SCUserContextType = useContext(SCUserContext);
  const scPreferencesContext: SCPreferencesContextType = useSCPreferences();
  const followEnabled = useMemo(
    () =>
      SCPreferences.CONFIGURATIONS_FOLLOW_ENABLED in scPreferencesContext.preferences &&
      scPreferencesContext.preferences[SCPreferences.CONFIGURATIONS_FOLLOW_ENABLED].value,
    [scPreferencesContext.preferences]
  );
  const manager: SCFollowersManagerType | SCConnectionsManagerType = followEnabled
    ? scUserContext.managers.followers
    : scUserContext.managers.connections;
  function checkFollowerOrConnection(user) {
    if ('isFollower' in manager) {
      return manager.isFollower(user);
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    return manager.status(user);
  }
  const [follower, setFollower] = useState<boolean>(null);
  const [openAlert, setOpenAlert] = useState<boolean>(false);

  // CONST
  const isSnippetTemplate = template === SCNotificationObjectTemplateType.SNIPPET;
  const isToastTemplate = template === SCNotificationObjectTemplateType.TOAST;

  //INTL
  const intl = useIntl();

  useEffect(() => {
    /**
     * Call scFollowedManager.isFollower inside an effect
     * to avoid warning rendering child during update parent state
     */
    if (scUserContext.user && scUserContext.user.id !== notificationObject.message.sender.id && !notificationObject.message.sender.deleted) {
      setFollower(checkFollowerOrConnection(notificationObject.message.sender));
    }
  });

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
            {...(!notificationObject.message.sender.deleted && {
              to: scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, notificationObject.message.sender)
            })}
            onClick={notificationObject.message.sender.deleted ? () => setOpenAlert(true) : null}>
            <UserAvatar hide={!notificationObject.message.sender.community_badge} smaller={true}>
              <Avatar
                alt={notificationObject.message.sender.username}
                variant="circular"
                src={notificationObject.message.sender.avatar}
                classes={{root: classes.avatar}}
              />
            </UserAvatar>
          </Link>
        }
        primary={
          <>
            {isToastTemplate && (
              <Box>
                <Link
                  {...(!notificationObject.message.sender.deleted && {
                    to: scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, notificationObject.message.sender)
                  })}
                  onClick={notificationObject.message.sender.deleted ? () => setOpenAlert(true) : null}>
                  {notificationObject.message.sender.username}
                </Link>{' '}
                <FormattedMessage
                  id={'ui.userToastNotifications.privateMessage.sentMessage'}
                  defaultMessage={'ui.userToastNotifications.privateMessage.sentMessage'}
                />
                :
                <Box className={classes.messageWrap}>
                  <Link
                    to={scRoutingContext.url(SCRoutes.USER_PRIVATE_MESSAGES_ROUTE_NAME, notificationObject.message.sender)}
                    className={classes.message}>
                    <Typography variant="body2" dangerouslySetInnerHTML={{__html: notificationObject.message.message}} />
                  </Link>
                </Box>
              </Box>
            )}
            {isSnippetTemplate && (
              <Box>
                <Typography component="div" color="inherit">
                  <Link
                    {...(!notificationObject.message.sender.deleted && {
                      to: scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, notificationObject.message.sender)
                    })}
                    onClick={notificationObject.message.sender.deleted ? () => setOpenAlert(true) : null}
                    className={classes.username}>
                    {notificationObject.message.sender.username}
                  </Link>{' '}
                  <Link
                    to={scRoutingContext.url(SCRoutes.USER_PRIVATE_MESSAGES_ROUTE_NAME, notificationObject.message.sender)}
                    className={classes.messageLabel}>
                    {intl.formatMessage(messages.receivePrivateMessage, {
                      total: 1,
                      b: (...chunks) => <strong>{chunks}</strong>
                    })}
                  </Link>
                </Typography>
              </Box>
            )}
          </>
        }
        footer={
          isToastTemplate && (
            <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
              <DateTimeAgo date={notificationObject.active_at} />
              <Typography color="primary">
                <Link to={scRoutingContext.url(SCRoutes.USER_PRIVATE_MESSAGES_ROUTE_NAME, notificationObject.message.sender)}>
                  {scUserContext.user && follower ? (
                    <FormattedMessage id="ui.userToastNotifications.replyMessage" defaultMessage={'ui.userToastNotifications.replyMessage'} />
                  ) : (
                    <FormattedMessage id="ui.userToastNotifications.viewMessage" defaultMessage={'ui.userToastNotifications.viewMessage'} />
                  )}
                </Link>
              </Typography>
            </Stack>
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
        actions={
          <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
            <DateTimeAgo date={notificationObject.active_at} className={classes.activeAt} />
            <LoadingButton
              color={'primary'}
              variant="outlined"
              size="small"
              classes={{root: classes.replyButton}}
              component={Link}
              loading={
                notificationObject.message.sender.deleted
                  ? null
                  : scUserContext.user
                  ? follower === null || manager.isLoading(notificationObject.message.sender)
                  : null
              }
              to={scRoutingContext.url(SCRoutes.USER_PRIVATE_MESSAGES_ROUTE_NAME, notificationObject.message.sender)}>
              {scUserContext.user && follower ? (
                <FormattedMessage id="ui.notification.privateMessage.btnReplyLabel" defaultMessage="ui.notification.privateMessage.btnReplyLabel" />
              ) : (
                <FormattedMessage id="ui.notification.privateMessage.btnViewLabel" defaultMessage="ui.notification.privateMessage.btnViewLabel" />
              )}
            </LoadingButton>
          </Stack>
        }
        primary={
          <Box className={classes.messageWrap}>
            <Link to={scRoutingContext.url(SCRoutes.USER_PRIVATE_MESSAGES_ROUTE_NAME, notificationObject.message.sender)} className={classes.message}>
              <Typography variant="body2" dangerouslySetInnerHTML={{__html: notificationObject.message.message}} />
            </Link>
          </Box>
        }
        {...rest}
      />
      {openAlert && <UserDeletedSnackBar open={openAlert} handleClose={() => setOpenAlert(false)} />}
    </>
  );
}
