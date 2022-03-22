import React, {useEffect, useRef} from 'react';
import {styled} from '@mui/material/styles';
import {Box, BoxProps} from '@mui/material';
import {SCNotificationTopicType, SCNotification, SCNotificationTypologyType, useSCContext, SCContextType, Logger} from '@selfcommunity/core';
import PubSub from 'pubsub-js';
import {useSnackbar} from 'notistack';
import CustomSnackMessage from '../../shared/CustomSnackMessage';
import {NotificationObjectTemplateType} from '../../types';
import CommentNotification from '../Notification/Comment';
import ContributionFollowNotification from '../Notification/ContributionFollow';
import UserFollowNotification from '../Notification/UserFollow';
import UserConnectionNotification from '../Notification/UserConnection';
import VoteUpNotification from '../Notification/VoteUp';
import PrivateMessageNotification from '../Notification/PrivateMessage';
import MentionNotification from '../Notification/Mention';
import IncubatorApprovedNotification from '../Notification/IncubatorApproved';
import UserBlockedNotification from '../Notification/UserBlocked';

const PREFIX = 'SCToastNotifications';

const classes = {
  root: `${PREFIX}-root`,
  toastMessage: `${PREFIX}-toast-message`,
  toastContent: `${PREFIX}-toast-content`,
  toastActions: `${PREFIX}-toast-actions`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));

export interface ToastNotificationsProps extends BoxProps {
  /**
   * Props for toast message
   * @default null
   */
  ToastMessageProps?: any;

  /**
   * Handle notification
   */
  handleNotification?: (type, data, content) => JSX.Element;

  /**
   * Disable Toast Notification
   */
  disableToastNotification?: boolean;

  /**
   * Other props
   */
  [p: string]: any;
}
/**
 *
 > API documentation for the Community-UI Toast Notifications component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {ToastNotifications} from '@selfcommunity/ui';
 ```

 #### Component Name

 The name `SCToastNotifications` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCUserNotifications-root|Styles applied to the root element.|
 |toastMessage|.SCUserToastNotifications-toast-message|Styles applied to the toast message element.|
 |toastContent|.SCUserToastNotifications-toast-content|Styles applied to the toast content element.|
 |toastActions|.SCUserToastNotifications-toast-actions|Styles applied to the toast actions section.|

 * @param props
 */
export default function UserToastNotifications(props: ToastNotificationsProps): JSX.Element {
  // PROPS
  const {ToastMessageProps = {}, handleNotification, disableToastNotification = false} = props;

  // CONTEXT
  const scContext: SCContextType = useSCContext();

  // REFS
  const notificationSubscription = useRef(null);

  // CONTEXT
  const {enqueueSnackbar} = useSnackbar();

  /**
   * Render every single notification content
   * @param n
   */
  const getContent = (n) => {
    let content;
    let type;
    if (n.notification_obj) {
      /** Notification of types: comment, nested_comment, etc... */
      type = SCNotification.SCNotificationMapping[n.activity_type];
      if (type === SCNotificationTypologyType.COMMENT || type === SCNotificationTypologyType.NESTED_COMMENT) {
        content = <CommentNotification notificationObject={n.notification_obj} template={NotificationObjectTemplateType.TOAST} />;
      } else if (type === SCNotificationTypologyType.FOLLOW) {
        content = <ContributionFollowNotification notificationObject={n.notification_obj} template={NotificationObjectTemplateType.TOAST} />;
      } else if (type === SCNotificationTypologyType.USER_FOLLOW) {
        content = <UserFollowNotification notificationObject={n.notification_obj} template={NotificationObjectTemplateType.TOAST} />;
      } else if (type === SCNotificationTypologyType.CONNECTION_REQUEST || type === SCNotificationTypologyType.CONNECTION_ACCEPT) {
        content = <UserConnectionNotification notificationObject={n.notification_obj} template={NotificationObjectTemplateType.TOAST} />;
      } else if (type === SCNotificationTypologyType.VOTE_UP) {
        content = <VoteUpNotification notificationObject={n.notification_obj} template={NotificationObjectTemplateType.TOAST} />;
      } else if (type === SCNotificationTypologyType.PRIVATE_MESSAGE) {
        content = <PrivateMessageNotification notificationObject={n.notification_obj} template={NotificationObjectTemplateType.TOAST} />;
      } else if (n.type === SCNotificationTypologyType.BLOCKED_USER || n.type === SCNotificationTypologyType.UNBLOCKED_USER) {
        return <UserBlockedNotification notificationObject={n.notification_obj} template={NotificationObjectTemplateType.TOAST} />;
      } else if (type === SCNotificationTypologyType.MENTION) {
        content = <MentionNotification notificationObject={n.notification_obj} template={NotificationObjectTemplateType.TOAST} />;
      } else if (type === SCNotificationTypologyType.INCUBATOR_APPROVED) {
        content = <IncubatorApprovedNotification notificationObject={n.notification_obj} template={NotificationObjectTemplateType.TOAST} />;
      }
    }
    if (n.activity_type && n.activity_type === SCNotificationTypologyType.NOTIFICATION_BANNER) {
      /** Notification of type: 'notification_banner' */
      // TODO: When api is fixed, use BroadcastMessage -> Message as the component to render this content
      content = <div style={{maxWidth: 300}} dangerouslySetInnerHTML={{__html: n.message}} />;
    }
    if (handleNotification && type) {
      /** Override content */
      content = handleNotification(type, n, content);
    }
    return content;
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
      (data.data.activity_type === SCNotificationTypologyType.NOTIFICATION_BANNER || SCNotification.SCNotificationMapping[data.data.activity_type]) &&
      !SCNotification.SCSilentToastNotifications.includes(data.data.activity_type) &&
      !disableToastNotification &&
      !scContext.settings.notifications.webSocket.disableToastMessage
    ) {
      const messageKey = data.data.feed_serialization_id ? data.data.feed_serialization_id : data.data.id;
      enqueueSnackbar(
        null,
        Object.assign(
          {},
          {
            content: (
              <CustomSnackMessage
                id={messageKey}
                message={
                  <div className={classes.toastMessage}>
                    <div className={classes.toastContent}>{getContent(data.data)}</div>
                  </div>
                }
              />
            ),
            preventDuplicate: true,
            key: messageKey,
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
