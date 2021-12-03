import React, {useEffect, useState} from 'react';
import {styled} from '@mui/material/styles';
import {Avatar, Card, Typography} from '@mui/material';
import CardContent from '@mui/material/CardContent';
import UserNotificationComment from './Comment';
import UserFollowNotification from './UserFollow';
import UndeletedForNotification from './UndeletedFor';
import DeletedForNotification from './DeletedFor';

const PREFIX = 'SCUserNotification';

const Root = styled(Card, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  maxWidth: 700,
  marginBottom: theme.spacing(1)
}));

const NotificationTypeComment = 'comment';
const NotificationTypeUserFollow = 'user_follow';
const NotificationTypeUndeletedFor = 'undeleted_for';
const NotificationTypeDeletedForAdvertising = 'deleted_for_advertising';
const NotificationTypeDeletedForAggressive = 'deleted_for_aggressive';
const NotificationTypeDeletedForVulgar = 'deleted_for_vulgar';
const NotificationTypeDeletedForPoor = 'deleted_for_poor';
const NotificationTypeDeletedForOfftopic = 'deleted_for_offtopic';

export default function UserNotification({notificationObject = null, ...props}: {notificationObject: any}): JSX.Element {
  /**
   * Render discussion/post/status intro if needed
   */
  function renderTitle() {
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
