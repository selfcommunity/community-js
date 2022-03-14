import React, {useEffect, useMemo, useRef, useState} from 'react';
import {styled} from '@mui/material/styles';
import CommentNotification from '../Notification/Comment';
import UserFollowNotification from '../Notification/UserFollow';
import UndeletedForNotification from '../Notification/UndeletedFor';
import DeletedForNotification from '../Notification/DeletedFor';
import UserConnectionNotification from '../Notification/UserConnection';
import PrivateMessageNotification from '../Notification/PrivateMessage';
import UserBlockedNotification from '../Notification/UserBlocked';
import MentionNotification from '../Notification/Mention';
import CollapsedForNotification from '../Notification/CollapsedFor';
import KindlyNoticeForNotification from '../Notification/KindlyNoticeFor';
import KindlyNoticeFlagNotification from '../Notification/KindlyNoticeFlag';
import VoteUpNotification from '../Notification/VoteUp';
import {SCOPE_SC_UI} from '../../constants/Errors';
import PubSub from 'pubsub-js';
import {AxiosResponse} from 'axios';
import ContributionFollowNotification from '../Notification/ContributionFollow';
import {Box, CardProps, MenuItem, MenuList} from '@mui/material';
import IncubatorApprovedNotification from '../Notification/IncubatorApproved';
import classNames from 'classnames';
import Skeleton from './Skeleton';
import {NotificationObjectTemplateType} from '../../types';
import {
  Endpoints,
  http,
  Logger,
  SCNotification,
  SCNotificationAggregatedType,
  SCNotificationTopicType,
  SCNotificationType,
  SCNotificationTypologyType,
  SCUserContextType,
  useSCUser
} from '@selfcommunity/core';

const PREFIX = 'SCSnippetNotifications';

const classes = {
  root: `${PREFIX}-root`,
  notificationsWrap: `${PREFIX}-notifications-wrap`,
  notificationsList: `${PREFIX}-notifications-list`,
  notificationItem: `${PREFIX}-notification-item`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  width: '100%',
  marginBottom: theme.spacing(1),
  [`& .${classes.notificationsWrap}`]: {
    maxHeight: 370,
    overflowY: 'auto',
    overflowX: 'hidden',
    borderBottom: '#e8e7e7 solid 1px'
  },
  [`& .${classes.notificationItem}`]: {
    padding: 5,
    whiteSpace: 'normal'
  },
  '& a': {
    textDecoration: 'none',
    color: theme.palette.text.primary
  }
}));

export interface SnippetNotificationsProps extends CardProps {
  /**
   * Id of the UserNotification
   * @default `notification_<notificationObject.sid>`
   */
  id?: string;

  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;

  /**
   * Handle custom notification
   * @param data
   */
  handleCustomNotification?: (data) => JSX.Element;

  /**
   * The max n of results shown
   * @default 20
   */
  showMax?: number;

  /**
   * The obj key
   */
  key: number;

  /**
   * Any other properties
   */
  [p: string]: any;
}

/**
 *
 > API documentation for the Community-UI SnippetNotifications component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {SnippetNotifications} from '@selfcommunity/ui';
 ```

 #### Component Name

 The name `SCSnippetNotifications` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCSnippetNotification-root|Styles applied to the root element.|
 |notificationsWrap|.SCSnippetNotification-notification-wrap|Styles applied to the notifications wrap.|
 |notificationsList|.SCSnippetNotification-notifications-list|Styles applied to the list of notifications.|
 |notificationItem|.SCSnippetNotification-notification-item|Styles applied to the single notification.|

 * @param props
 */
export default function SnippetNotifications(props: SnippetNotificationsProps): JSX.Element {
  // PROPS
  const {id = `snippetNotifications`, className, showMax = 20, handleCustomNotification, ...rest} = props;

  // CONTEXT
  const scUserContext: SCUserContextType = useSCUser();

  // STATE
  const [notifications, setNotifications] = useState<SCNotificationAggregatedType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // REFS
  const notificationSubscription = useRef(null);

  /**
   * Perform vote
   */
  const performFetchNotifications = useMemo(
    () => () => {
      return http
        .request({
          url: Endpoints.UserNotificationList.url(),
          method: Endpoints.UserNotificationList.method
        })
        .then((res: AxiosResponse<any>) => {
          if (res.status >= 300) {
            return Promise.reject(res);
          }
          return Promise.resolve(res.data);
        });
    },
    []
  );

  /**
   * Handles vote
   * @param comment
   */
  function fetchNotifications() {
    setLoading(true);
    performFetchNotifications()
      .then((data) => {
        setNotifications(data.results);
        setLoading(false);
        scUserContext.refreshNotificationCounters();
      })
      .catch((error) => {
        Logger.error(SCOPE_SC_UI, error);
      });
  }

  /**
   * Fetch notifications
   */
  useEffect(() => {
    if (scUserContext.user && loading) {
      fetchNotifications();
    }
  }, [scUserContext.user]);

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
      !SCNotification.SCSilentSnippetNotifications.includes(data.data.activity_type)
    ) {
      if (data.data.notification_obj) {
        setNotifications([...[{is_new: true, sid: '', aggregated: [data.data.notification_obj]}], ...notifications]);
      }
    }
  };

  /**
   * On mount, fetches first page of notifications
   * On mount, subscribe to receive notification updates
   */
  useEffect(() => {
    if (!loading) {
      notificationSubscription.current = PubSub.subscribe(SCNotificationTopicType.INTERACTION, notificationSubscriber);
    }
    return () => {
      notificationSubscription.current && PubSub.unsubscribe(notificationSubscription.current);
    };
  }, [loading]);

  /**
   * Render every single notification in aggregated group
   * @param n
   * @param i
   */
  function renderAggregatedItem(n, i) {
    if (n.type === SCNotificationTypologyType.COMMENT || n.type === SCNotificationTypologyType.NESTED_COMMENT) {
      return <CommentNotification notificationObject={n} key={i} index={i} template={NotificationObjectTemplateType.SNIPPET} />;
    } else if (n.type === SCNotificationTypologyType.FOLLOW) {
      return <ContributionFollowNotification notificationObject={n} key={i} template={NotificationObjectTemplateType.SNIPPET} />;
    } else if (n.type === SCNotificationTypologyType.USER_FOLLOW) {
      return <UserFollowNotification notificationObject={n} key={i} template={NotificationObjectTemplateType.SNIPPET} />;
    } else if (n.type === SCNotificationTypologyType.CONNECTION_REQUEST || n.type === SCNotificationTypologyType.CONNECTION_ACCEPT) {
      return <UserConnectionNotification notificationObject={n} key={i} template={NotificationObjectTemplateType.SNIPPET} />;
    } else if (n.type === SCNotificationTypologyType.VOTE_UP) {
      return <VoteUpNotification notificationObject={n} key={i} template={NotificationObjectTemplateType.SNIPPET} />;
    } else if (
      n.type === SCNotificationTypologyType.KINDLY_NOTICE_ADVERTISING ||
      n.type === SCNotificationTypologyType.KINDLY_NOTICE_AGGRESSIVE ||
      n.type === SCNotificationTypologyType.KINDLY_NOTICE_POOR ||
      n.type === SCNotificationTypologyType.KINDLY_NOTICE_VULGAR ||
      n.type === SCNotificationTypologyType.KINDLY_NOTICE_OFFTOPIC
    ) {
      return <KindlyNoticeForNotification notificationObject={n} key={i} template={NotificationObjectTemplateType.SNIPPET} />;
    } else if (n.type === SCNotificationTypologyType.KINDLY_NOTICE_FLAG) {
      return <KindlyNoticeFlagNotification notificationObject={n} key={i} template={NotificationObjectTemplateType.SNIPPET} />;
    } else if (
      n.type === SCNotificationTypologyType.DELETED_FOR_ADVERTISING ||
      n.type === SCNotificationTypologyType.DELETED_FOR_AGGRESSIVE ||
      n.type === SCNotificationTypologyType.DELETED_FOR_POOR ||
      n.type === SCNotificationTypologyType.DELETED_FOR_VULGAR ||
      n.type === SCNotificationTypologyType.DELETED_FOR_OFFTOPIC
    ) {
      return <DeletedForNotification notificationObject={n} key={i} template={NotificationObjectTemplateType.SNIPPET} />;
    } else if (n.type === SCNotificationTypologyType.UNDELETED_FOR) {
      return <UndeletedForNotification notificationObject={n} key={i} template={NotificationObjectTemplateType.SNIPPET} />;
    } else if (
      n.type === SCNotificationTypologyType.COLLAPSED_FOR_ADVERTISING ||
      n.type === SCNotificationTypologyType.COLLAPSED_FOR_AGGRESSIVE ||
      n.type === SCNotificationTypologyType.COLLAPSED_FOR_POOR ||
      n.type === SCNotificationTypologyType.COLLAPSED_FOR_VULGAR ||
      n.type === SCNotificationTypologyType.COLLAPSED_FOR_OFFTOPIC
    ) {
      return <CollapsedForNotification notificationObject={n} key={i} template={NotificationObjectTemplateType.SNIPPET} />;
    } else if (n.type === SCNotificationTypologyType.PRIVATE_MESSAGE) {
      return <PrivateMessageNotification notificationObject={n} key={i} template={NotificationObjectTemplateType.SNIPPET} />;
    } else if (n.type === SCNotificationTypologyType.BLOCKED_USER || n.type === SCNotificationTypologyType.UNBLOCKED_USER) {
      return <UserBlockedNotification notificationObject={n} key={i} template={NotificationObjectTemplateType.SNIPPET} />;
    } else if (n.type === SCNotificationTypologyType.MENTION) {
      return <MentionNotification notificationObject={n} key={i} template={NotificationObjectTemplateType.SNIPPET} />;
    } else if (n.type === SCNotificationTypologyType.INCUBATOR_APPROVED) {
      return <IncubatorApprovedNotification notificationObject={n} key={i} template={NotificationObjectTemplateType.SNIPPET} />;
    } else if (n.type === SCNotificationTypologyType.CUSTOM_NOTIFICATION) {
      handleCustomNotification && handleCustomNotification(n);
    }
    return null;
  }

  /**
   * Renders root object
   */
  return (
    <Root id={id} className={classNames(classes.root, className)} {...rest}>
      <Box className={classes.notificationsWrap}>
        {loading ? (
          <Skeleton elevation={0} />
        ) : (
          <MenuList className={classes.notificationsList}>
            {notifications.slice(0, showMax).map((notificationObject: SCNotificationAggregatedType, i) => (
              <React.Fragment key={i}>
                {notificationObject.aggregated.map((n: SCNotificationType, k) => (
                  <MenuItem className={classes.notificationItem} key={k}>
                    {renderAggregatedItem(n, i)}
                  </MenuItem>
                ))}
              </React.Fragment>
            ))}
          </MenuList>
        )}
      </Box>
    </Root>
  );
}
