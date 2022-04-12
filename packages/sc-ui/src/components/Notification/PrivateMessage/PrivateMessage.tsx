import React from 'react';
import {styled} from '@mui/material/styles';
import {Avatar, Box, Button, Stack, Typography} from '@mui/material';
import Icon from '@mui/material/Icon';
import {Link, SCNotificationPrivateMessageType, SCRoutes, SCRoutingContextType, useSCRouting} from '@selfcommunity/core';
import {grey, red} from '@mui/material/colors';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import DateTimeAgo from '../../../shared/DateTimeAgo';
import classNames from 'classnames';
import {SCNotificationObjectTemplateType} from '../../../types';
import useThemeProps from '@mui/material/styles/useThemeProps';
import NotificationItem from '../../../shared/NotificationItem';

const messages = defineMessages({
  receivePrivateMessage: {
    id: 'ui.notification.receivePrivateMessage',
    defaultMessage: 'ui.notification.receivePrivateMessage'
  }
});

const PREFIX = 'SCUserNotificationPrivateMessage';

const classes = {
  root: `${PREFIX}-root`,
  avatar: `${PREFIX}-avatar`,
  actions: `${PREFIX}-actions`,
  replyButton: `${PREFIX}-reply-button`,
  replyButtonIcon: `${PREFIX}-reply-button-icon`,
  activeAt: `${PREFIX}-active-at`,
  messageLabel: `${PREFIX}-message-label`,
  username: `${PREFIX}-username`,
  messageWrap: `${PREFIX}-message-wrap`,
  message: `${PREFIX}-message`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  [`& .${classes.replyButton}`]: {
    minWidth: 30
  },
  [`& .${classes.activeAt}`]: {
    minWidth: 30,
    [theme.breakpoints.down('md')]: {
      display: 'none'
    }
  },
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
    display: 'inline-block',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    '-webkit-line-clamp': '2',
    lineClamp: 2,
    '-webkit-box-orient': 'vertical',
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
      '-webkit-line-clamp': '2',
      lineClamp: 2,
      '-webkit-box-orient': 'vertical',
    }
  },
  [`& .${classes.actions}`]: {
    fontSize: '13px',
    maxWidth: '40%'
  }
}));

export interface NotificationPrivateMessageProps {
  /**
   * Id of the feedObject
   * @default `n_<notificationObject.sid>`
   */
  id?: string;

  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;

  /**
   * Notification obj
   * @default null
   */
  notificationObject: SCNotificationPrivateMessageType;

  /**
   * Notification Object template type
   * @default 'detail'
   */
  template?: SCNotificationObjectTemplateType;

  /**
   * Any other properties
   */
  [p: string]: any;
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

  // CONST
  const isSnippetTemplate = template === SCNotificationObjectTemplateType.SNIPPET;
  const isToastTemplate = template === SCNotificationObjectTemplateType.TOAST;

  //INTL
  const intl = useIntl();

  /**
   * Renders content
   */
  let content;
  if (isSnippetTemplate || isToastTemplate) {
    content = (
      <NotificationItem
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
                  <Link to={scRoutingContext.url(SCRoutes.USER_PRIVATE_MESSAGES_ROUTE_NAME, notificationObject.message)} className={classes.message}>
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
                    to={scRoutingContext.url(SCRoutes.USER_PRIVATE_MESSAGES_ROUTE_NAME, notificationObject.message)}
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
          <>
            {isToastTemplate && (
              <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                <DateTimeAgo date={notificationObject.active_at} />
                <Typography color="primary">
                  <Link to={scRoutingContext.url(SCRoutes.USER_PRIVATE_MESSAGES_ROUTE_NAME, notificationObject.message)}>
                    <FormattedMessage id="ui.userToastNotifications.replyMessage" defaultMessage={'ui.userToastNotifications.replyMessage'} />
                  </Link>
                </Typography>
              </Stack>
            )}
          </>
        }
      />
    );
  } else {
    content = (
      <NotificationItem
        template={template}
        isNew={notificationObject.is_new}
        disableTypography
        actions={
          <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
            <DateTimeAgo date={notificationObject.active_at} className={classes.activeAt} />
            <Button
              color={'primary'}
              variant="outlined"
              size="small"
              classes={{root: classes.replyButton}}
              component={Link}
              to={scRoutingContext.url(SCRoutes.USER_PRIVATE_MESSAGES_ROUTE_NAME, notificationObject.message)}
              endIcon={<Icon className={classes.replyButtonIcon}>reply</Icon>}>
              <FormattedMessage id="ui.notification.privateMessage.btnReplyLabel" defaultMessage="ui.notification.privateMessage.btnReplyLabel" />
            </Button>
          </Stack>
        }
        primary={
          <Box className={classes.messageWrap}>
            <Link to={scRoutingContext.url(SCRoutes.USER_PRIVATE_MESSAGES_ROUTE_NAME, notificationObject.message)} className={classes.message}>
              <Typography variant="body2" dangerouslySetInnerHTML={{__html: notificationObject.message.message}} />
            </Link>
          </Box>
        }
      />
    );
  }

  /**
   * Renders root object
   */
  return (
    <Root id={id} className={classNames(classes.root, className, `${PREFIX}-${template}`)} {...rest}>
      {content}
    </Root>
  );
}
