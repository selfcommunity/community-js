import React, {useEffect, useRef} from 'react';
import {styled} from '@mui/material/styles';
import {Box, BoxProps} from '@mui/material';
import {SCNotificationTopicType, SCNotification, SCNotificationTypologyType} from '@selfcommunity/core';
import PubSub from 'pubsub-js';
import {useSnackbar} from 'notistack';
import CustomSnackMessage from '../../shared/CustomSnackMessage';
import UserNotificationCommentToast from './Toast/Comment';
import ContributionFollowNotificationToast from './Toast/ContributionFollow';
import UserNotificationMentionToast from './Toast/Mention';
import UserNotificationPrivateMessageToast from './Toast/PrivateMessage';
import UserConnectionNotificationToast from './Toast/UserConnection';
import UserFollowNotificationToast from './Toast/UserFollow';
import VoteUpNotificationToast from './Toast/VoteUp';
import IncubatorApprovedNotificationToast from './Toast/IncubatorApproved';
/*
import CollapsedForNotificationToast from './Toast/CollapsedFor';
import DeletedForNotificationToast from './Toast/DeletedFor';
import KindlyNoticeFlagNotificationToast from './Toast/KindlyNoticeFlag';
import KindlyNoticeForNotificationToast from './Toast/KindlyNoticeFor';
import UndeletedForNotificationToast from './Toast/UndeletedFor';
import UserBlockedNotificationToast from './Toast/UserBlocked';
*/

const PREFIX = 'SCUserToastNotifications';

const classes = {
  toastMessage: `${PREFIX}-toast-message`,
  toastContent: `${PREFIX}-toast-content`,
  toastActions: `${PREFIX}-toast-actions`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  [`& .${classes.toastMessage}`]: {
    minWidth: 280
  },
  [`& .${classes.toastContent}`]: {
    marginBottom: 10
  }
}));

export interface UserToastNotificationsProps extends BoxProps {
  /**
   * Props for toast message
   * @default null
   */
  ToastMessageProps?: any;

  /**
   * Handle custom notification
   */
  handleCustomNotification?: (data) => void;

  /**
   * Other props
   */
  [p: string]: any;
}

export default function UserToastNotifications(props: UserToastNotificationsProps): JSX.Element {
  // PROPS
  const {ToastMessageProps = {}, handleCustomNotification} = props;

  // REFS
  const notificationSubscription = useRef(null);

  // CONTEXT
  const {enqueueSnackbar} = useSnackbar();

  /**
   * Render every single notification content
   * @param n
   */
  const getContent = (n) => {
    const type = SCNotification.SCNotificationMapping[n.activity_type];
    if (type === SCNotificationTypologyType.COMMENT || type === SCNotificationTypologyType.NESTED_COMMENT) {
      return <UserNotificationCommentToast notificationObject={n} />;
    } else if (type === SCNotificationTypologyType.FOLLOW) {
      return <ContributionFollowNotificationToast notificationObject={n} />;
    } else if (type === SCNotificationTypologyType.USER_FOLLOW) {
      return <UserFollowNotificationToast notificationObject={n} />;
    } else if (type === SCNotificationTypologyType.CONNECTION_REQUEST || type === SCNotificationTypologyType.CONNECTION_ACCEPT) {
      return <UserConnectionNotificationToast notificationObject={n} />;
    } else if (type === SCNotificationTypologyType.VOTE_UP) {
      return <VoteUpNotificationToast notificationObject={n} />;
    } else if (type === SCNotificationTypologyType.PRIVATE_MESSAGE) {
      return <UserNotificationPrivateMessageToast notificationObject={n} />;
    } else if (type === SCNotificationTypologyType.MENTION) {
      return <UserNotificationMentionToast notificationObject={n} />;
    } else if (type === SCNotificationTypologyType.INCUBATOR_APPROVED) {
      return <IncubatorApprovedNotificationToast notificationObject={n} />;
      /*
    } else if (
      type === SCNotificationTypologyType.KINDLY_NOTICE_ADVERTISING ||
      type === SCNotificationTypologyType.KINDLY_NOTICE_AGGRESSIVE ||
      type === SCNotificationTypologyType.KINDLY_NOTICE_POOR ||
      type === SCNotificationTypologyType.KINDLY_NOTICE_VULGAR ||
      type === SCNotificationTypologyType.KINDLY_NOTICE_OFFTOPIC
    ) {
      return <KindlyNoticeForNotificationToast notificationObject={n} />;
    } else if (type === SCNotificationTypologyType.KINDLY_NOTICE_FLAG) {
      return <KindlyNoticeFlagNotificationToast notificationObject={n} />;
    } else if (
      type === SCNotificationTypologyType.DELETED_FOR_ADVERTISING ||
      type === SCNotificationTypologyType.DELETED_FOR_AGGRESSIVE ||
      type === SCNotificationTypologyType.DELETED_FOR_POOR ||
      type === SCNotificationTypologyType.DELETED_FOR_VULGAR ||
      type === SCNotificationTypologyType.DELETED_FOR_OFFTOPIC
    ) {
      return <DeletedForNotificationToast notificationObject={n} />;
    } else if (type === SCNotificationTypologyType.UNDELETED_FOR) {
      return <UndeletedForNotificationToast notificationObject={n} />;
    } else if (
      type === SCNotificationTypologyType.COLLAPSED_FOR_ADVERTISING ||
      type === SCNotificationTypologyType.COLLAPSED_FOR_AGGRESSIVE ||
      type === SCNotificationTypologyType.COLLAPSED_FOR_POOR ||
      type === SCNotificationTypologyType.COLLAPSED_FOR_VULGAR ||
      type === SCNotificationTypologyType.COLLAPSED_FOR_OFFTOPIC
    ) {
      return <CollapsedForNotificationToast notificationObject={n} />;
    } else if (type === SCNotificationTypologyType.BLOCKED_USER || type === SCNotificationTypologyType.UNBLOCKED_USER) {
      return <UserBlockedNotificationToast notificationObject={n} />;
    } else if (type === SCNotificationTypologyType.CUSTOM_NOTIFICATION) {
      handleCustomNotification && handleCustomNotification(n);
    */
    }
    return null;
  };

  /**
   * Notification subscriber
   * @param msg
   * @param data
   */
  const notificationSubscriber = (msg, data) => {
    if (
      data &&
      data.type === SCNotificationTopicType.INTERACTION &&
      SCNotification.SCNotificationMapping[data.data.activity_type] &&
      !SCNotification.SCSilentNotifications.includes(data.data.activity_type)
    ) {
      enqueueSnackbar(
        null,
        Object.assign(
          {},
          {
            content: (
              <CustomSnackMessage
                id={data.data.feed_serialization_id}
                message={
                  <div className={classes.toastMessage}>
                    <div className={classes.toastContent}>{getContent(data.data)}</div>
                  </div>
                }
              />
            ),
            preventDuplicate: true,
            key: data.data.feed_serialization_id,
            variant: 'default',
            persist: true,
            anchorOrigin: {horizontal: 'left', vertical: 'bottom'},
            action: null
          },
          ToastMessageProps
        )
      );
    }
  };

  /**
   * On mount, fetches first page of notifications
   * On mount, subscribe to receive notification updates
   */
  useEffect(() => {
    notificationSubscription.current = PubSub.subscribe(SCNotificationTopicType.INTERACTION, notificationSubscriber);
    return () => {
      PubSub.unsubscribe(notificationSubscription.current);
    };
  }, []);

  return <Root></Root>;
}
