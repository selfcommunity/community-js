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

const messages = defineMessages({
  receivePrivateMessage: {
    id: 'ui.notification.receivePrivateMessage',
    defaultMessage: 'ui.notification.receivePrivateMessage'
  }
});

const PREFIX = 'SCNotificationPrivateMessage';

const classes = {
  root: `${PREFIX}-root`,
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
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  [`& .${classes.username}`]: {
    display: 'inline',
    fontWeight: 700,
    '&:hover': {
      textDecoration: 'underline'
    }
  },
  [`& .${classes.messageLabel}`]: {
    color: theme.palette.text.primary
  },
  [`& .${classes.messageWrap}`]: {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    WebkitLineClamp: '2',
    lineClamp: 2,
    WebkitBoxOrient: 'vertical',
    '& p': {
      margin: 0
    }
  },
  [`& .${classes.message}`]: {
    height: 20,
    overflowY: 'hidden',
    textOverflow: 'ellipsis',
    display: 'inline',
    overflow: 'hidden',
    '&:hover': {
      textDecoration: 'underline'
    },
    '& > p': {
      overflowY: 'hidden',
      textOverflow: 'ellipsis',
      display: '-webkit-box',
      WebkitLineClamp: '2',
      lineClamp: 2,
      WebkitBoxOrient: 'vertical'
    }
  },
  [`& .${classes.actions}`]: {
    fontSize: '13px',
    maxWidth: '40%'
  }
}));

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
    if (scUserContext.user && scUserContext.user.id !== notificationObject.message.sender.id) {
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
          <Link to={scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, notificationObject.message.sender)}>
            <Avatar
              alt={notificationObject.message.sender.username}
              variant="circular"
              src={notificationObject.message.sender.avatar}
              classes={{root: classes.avatar}}
            />
          </Link>
        }
        primary={
          <>
            {isToastTemplate && (
              <Box>
                <Link to={scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, notificationObject.message.sender)}>
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
                  <Link to={scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, notificationObject.message.sender)} className={classes.username}>
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
            loading={scUserContext.user ? follower === null || manager.isLoading(notificationObject.message.sender) : null}
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
  );
}
