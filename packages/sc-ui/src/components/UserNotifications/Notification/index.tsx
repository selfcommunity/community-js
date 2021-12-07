import React from 'react';
import {styled} from '@mui/material/styles';
import {Avatar, Card, ListItem, ListItemAvatar, ListItemText, Typography} from '@mui/material';
import CardContent from '@mui/material/CardContent';
import UserNotificationComment from './Comment';
import UserFollowNotification from './UserFollow';
import UndeletedForNotification from './UndeletedFor';
import DeletedForNotification from './DeletedFor';
import UserConnectionNotification from './UserConnection';
import UserNotificationPrivateMessage from './PrivateMessage';
import UserBlockedNotification from './UserBlocked';
import UserNotificationMention from './Mention';
import {SCNotificationAggregatedType, SCNotificationPrivateMessageType, SCNotificationType, SCNotificationTypologyType} from '@selfcommunity/core';
import {defineMessages, useIntl} from 'react-intl';
import {grey} from '@mui/material/colors';

const messages = defineMessages({
  receivePrivateMessage: {
    id: 'ui.userNotifications.receivePrivateMessage',
    defaultMessage: 'ui.userNotifications.receivePrivateMessage'
  }
});

const PREFIX = 'SCUserNotification';

const classes = {
  title: `${PREFIX}-title`
};

const Root = styled(Card, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  width: '100%',
  marginBottom: theme.spacing(1),
  [`& .${classes.title}`]: {
    fontWeight: 600,
    color: grey[800],
    fontSize: 15,
    padding: '10px 8px 2px 8px',
    textDecoration: 'underline'
  },
  ['& .MuiCardContent-root']: {
    padding: 0
  }
}));

export default function UserNotification({notificationObject = null, ...props}: {notificationObject: SCNotificationAggregatedType}): JSX.Element {
  const intl = useIntl();

  /**
   * Render:
   * - discussion/post/status summary if notification include contribute
   * - user header for private message
   */
  function renderTitle() {
    if (notificationObject.aggregated && notificationObject.aggregated[0].type === SCNotificationTypologyType.PRIVATE_MESSAGE) {
      let messageNotification: SCNotificationPrivateMessageType = notificationObject.aggregated[0] as SCNotificationPrivateMessageType;
      return (
        <ListItem alignItems="flex-start">
          <ListItemAvatar>
            <Avatar alt={messageNotification.message.sender.username} variant="circular" src={messageNotification.message.sender.avatar} />
          </ListItemAvatar>
          <ListItemText
            primary={
              <Typography component="span" sx={{display: 'inline'}} color="primary">
                {intl.formatMessage(messages.receivePrivateMessage, {
                  username: messageNotification.message.sender.username,
                  total: notificationObject.aggregated.length,
                  b: (...chunks) => <strong>{chunks}</strong>
                })}
              </Typography>
            }
          />
        </ListItem>
      );
    }
    const summary =
      'discussion' in notificationObject
        ? notificationObject.discussion.summary
        : 'post' in notificationObject
        ? notificationObject.post.summary
        : 'status' in notificationObject
        ? notificationObject.status.summary
        : null;
    return <>{summary && <Typography variant="body2" gutterBottom dangerouslySetInnerHTML={{__html: summary}} classes={{root: classes.title}} />}</>;
  }

  /**
   * Render every single notification in aggregated group
   * @param n
   * @param i
   */
  function renderAggregated(n, i) {
    if (n.type === SCNotificationTypologyType.COMMENT || n.type === SCNotificationTypologyType.NESTED_COMMENT) {
      return <UserNotificationComment notificationObject={n} key={i} />;
    } else if (n.type === SCNotificationTypologyType.USER_FOLLOW) {
      return <UserFollowNotification notificationObject={n} key={i} />;
    } else if (n.type === SCNotificationTypologyType.CONNECTION_REQUEST || n.type === SCNotificationTypologyType.CONNECTION_ACCEPT) {
      return <UserConnectionNotification notificationObject={n} key={i} />;
    } else if (n.type === SCNotificationTypologyType.UNDELETED_FOR) {
      return <UndeletedForNotification notificationObject={n} key={i} />;
    } else if (
      n.type === SCNotificationTypologyType.DELETED_FOR_ADVERTISING ||
      n.type === SCNotificationTypologyType.DELETED_FOR_AGGRESSIVE ||
      n.type === SCNotificationTypologyType.DELETED_FOR_POOR ||
      n.type === SCNotificationTypologyType.DELETED_FOR_VULGAR ||
      n.type === SCNotificationTypologyType.DELETED_FOR_OFFTOPIC
    ) {
      return <DeletedForNotification notificationObject={n} key={i} />;
    } else if (n.type === SCNotificationTypologyType.PRIVATE_MESSAGE) {
      return <UserNotificationPrivateMessage notificationObject={n} key={i} />;
    } else if (n.type === SCNotificationTypologyType.BLOCKED_USER || n.type === SCNotificationTypologyType.UNBLOCKED_USER) {
      return <UserBlockedNotification notificationObject={n} key={i} />;
    } else if (n.type === SCNotificationTypologyType.MENTION) {
      return <UserNotificationMention notificationObject={n} key={i} />;
    }
    return null;
  }

  return (
    <Root {...props}>
      <CardContent sx={{paddingBottom: 1}}>
        {renderTitle()}
        {notificationObject.aggregated.map((n: SCNotificationType, i) => renderAggregated(n, i))}
      </CardContent>
    </Root>
  );
}
