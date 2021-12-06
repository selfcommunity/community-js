import React, {useEffect, useState} from 'react';
import {styled} from '@mui/material/styles';
import {Avatar, Card, ListItem, ListItemAvatar, ListItemText, Typography} from '@mui/material';
import CardContent from '@mui/material/CardContent';
import UserNotificationComment from './Comment';
import UserFollowNotification from './UserFollow';
import UndeletedForNotification from './UndeletedFor';
import DeletedForNotification from './DeletedFor';
import {
  NotificationTypeComment,
  NotificationTypeConnectionRequest,
  NotificationTypeConnectionAccept,
  NotificationTypeDeletedForAdvertising,
  NotificationTypeDeletedForAggressive,
  NotificationTypeDeletedForOfftopic,
  NotificationTypeDeletedForPoor,
  NotificationTypeDeletedForVulgar,
  NotificationTypePrivateMessage,
  NotificationTypeUndeletedFor,
  NotificationTypeUserFollow,
  NotificationTypeBlockedUser,
  NotificationTypeUnBlockedUser, NotificationTypeMention,
} from '../../../constants/Notification.js';
import UserConnectionNotification from './UserConnection';
import UserNotificationPrivateMessage from './PrivateMessage';
import UserBlockedNotification from './UserBlocked';
import UserNotificationmention from './Mention';

const PREFIX = 'SCUserNotification';

const Root = styled(Card, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  maxWidth: 700,
  marginBottom: theme.spacing(1)
}));

export default function UserNotification({notificationObject = null, ...props}: {notificationObject: any}): JSX.Element {
  /**
   * Render discussion/post/status intro if needed or header for private message
   */
  function renderTitle() {
    if (notificationObject.aggregated && notificationObject.aggregated[0].type === NotificationTypePrivateMessage) {
      return (
        <ListItem alignItems="flex-start">
          <ListItemAvatar>
            <Avatar
              alt={notificationObject.aggregated[0].message.sender.username}
              variant="circular"
              src={notificationObject.aggregated[0].message.sender.avatar}
            />
          </ListItemAvatar>
          <ListItemText
            primary={
              <Typography component="span" sx={{display: 'inline'}} color="primary">
                {notificationObject.aggregated[0].message.sender.username} ti ha inviato {notificationObject.aggregated.length} messaggi
              </Typography>
            }
          />
        </ListItem>
      );
    }
    return (
      <Typography variant="body1" gutterBottom>
        <b>
          {'discussion' in notificationObject && notificationObject.discussion.title}
          {'post' in notificationObject && notificationObject.post.title}
          {'status' in notificationObject && notificationObject.status.title}
        </b>
      </Typography>
    );
  }

  /**
   * Render single aggregated notification
   * @param n
   * @param i
   */
  function renderAggregated(n, i) {
    if (n.type === NotificationTypeComment) {
      return <UserNotificationComment notificationObject={n} key={i} />;
    } else if (n.type === NotificationTypeUserFollow) {
      return <UserFollowNotification notificationObject={n} key={i} />;
    } else if (n.type === NotificationTypeConnectionRequest || n.type === NotificationTypeConnectionAccept) {
      return <UserConnectionNotification notificationObject={n} key={i} />;
    } else if (n.type === NotificationTypeUndeletedFor) {
      return <UndeletedForNotification notificationObject={n} key={i} />;
    } else if (
      n.type === NotificationTypeDeletedForAdvertising ||
      n.type === NotificationTypeDeletedForAggressive ||
      n.type === NotificationTypeDeletedForVulgar ||
      n.type === NotificationTypeDeletedForPoor ||
      n.type === NotificationTypeDeletedForOfftopic
    ) {
      return <DeletedForNotification notificationObject={n} key={i} />;
    } else if (n.type === NotificationTypePrivateMessage) {
      return <UserNotificationPrivateMessage notificationObject={n} key={i} />;
    } else if (n.type === NotificationTypeBlockedUser || n.type === NotificationTypeUnBlockedUser) {
      return <UserBlockedNotification notificationObject={n} key={i} />;
    } else if (n.type === NotificationTypeMention) {
      return <UserNotificationmention notificationObject={n} key={i} />;
    }
    return null;
  }

  return (
    <Root {...props}>
      <CardContent sx={{paddingBottom: 1}}>
        {renderTitle()}
        {notificationObject.aggregated.map((n, i) => renderAggregated(n, i))}
      </CardContent>
    </Root>
  );
}
