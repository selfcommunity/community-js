import React, {useEffect, useMemo, useState} from 'react';
import {styled} from '@mui/material/styles';
import CommentNotification from '../Notification/Comment';
import UserFollowNotification from '../Notification/UserFollow';
import UndeletedForNotification from '../Notification/UndeletedFor';
import DeletedForNotification from '../Notification/DeletedFor';
import UserConnectionNotification from '../Notification/UserConnection';
import UserNotificationPrivateMessage from '../Notification/PrivateMessage';
import UserBlockedNotification from '../Notification/UserBlocked';
import UserNotificationMention from '../Notification/Mention';
import CollapsedForNotification from '../Notification/CollapsedFor';
import KindlyNoticeForNotification from '../Notification/KindlyNoticeFor';
import {defineMessages, FormattedMessage} from 'react-intl';
import KindlyNoticeFlagNotification from '../Notification/KindlyNoticeFlag';
import VoteUpNotification from '../Notification/VoteUp';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {AxiosResponse} from 'axios';
import ContributionFollowNotification from '../Notification/ContributionFollow';
import {Box, Button, CardProps, MenuItem, MenuList} from '@mui/material';
import IncubatorApprovedNotification from '../Notification/IncubatorApproved';
import classNames from 'classnames';
import Skeleton from './Skeleton';
import {NotificationObjectTemplateType} from '../../types';
import {grey} from '@mui/material/colors';
import {
  Endpoints,
  http,
  Link,
  Logger,
  SCNotificationAggregatedType,
  SCNotificationType,
  SCNotificationTypologyType,
  SCRoutes,
  SCRoutingContextType,
  SCUserContextType,
  useSCRouting,
  useSCUser
} from '@selfcommunity/core';

const PREFIX = 'SCUserPopupNotifications';

const classes = {
  root: `${PREFIX}-root`,
  content: `${PREFIX}-content`,
  notificationsWrap: `${PREFIX}-notifications-wrap`,
  notificationItemWrap: `${PREFIX}-notification-item-wrap`,
  viewOthersButtonWrap: `${PREFIX}-view-others-button-wrap`,
  viewOthersButton: `${PREFIX}-view-others-button`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  width: '100%',
  marginBottom: theme.spacing(1),
  [`& .${classes.content}`]: {
    padding: '0px !important'
  },
  [`& .${classes.notificationsWrap}`]: {
    maxHeight: 370,
    overflowY: 'auto',
    overflowX: 'hidden',
    borderBottom: '#e8e7e7 solid 1px'
  },
  [`& .${classes.notificationItemWrap}`]: {
    padding: 5,
    whiteSpace: 'normal'
  },
  [`& .${classes.viewOthersButtonWrap}`]: {
    padding: '10px 20px !important'
  },
  '& a': {
    textDecoration: 'none',
    color: grey[900]
  }
}));

export interface UserPopupNotificationsProps extends CardProps {
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
 > API documentation for the Community-UI UserPopupNotifications component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {UserPopupNotifications} from '@selfcommunity/ui';
 ```

 #### Component Name

 The name `SCUserPopupNotifications` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCUserNotification-root|Styles applied to the root element.|
 |notificationsWrap|.SCUserNotification-notification-wrap|Styles applied to the notifications wrap.|
 |notificationItemWrap|.SCUserNotification-notification-item-wrap|Styles applied to the single notification.|
 |viewOthersButtonWrap|.SCUserNotification-view-others-button-wrap|Styles applied to the element button wrap.|
 |viewOthersButton|.SCUserNotification-view-others-button|Styles applied to the element button.|

 * @param props
 */
export default function UserPopupNotifications(props: UserPopupNotificationsProps): JSX.Element {
  // PROPS
  const {id = `userPopupNotifications`, className, showMax = 20, handleCustomNotification, ...rest} = props;

  // CONTEXT
  const scRoutingContext: SCRoutingContextType = useSCRouting();
  const scUserContext: SCUserContextType = useSCUser();

  // STATE
  const [notifications, setNotifications] = useState<SCNotificationAggregatedType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

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
      return <UserNotificationPrivateMessage notificationObject={n} key={i} template={NotificationObjectTemplateType.SNIPPET} />;
    } else if (n.type === SCNotificationTypologyType.BLOCKED_USER || n.type === SCNotificationTypologyType.UNBLOCKED_USER) {
      return <UserBlockedNotification notificationObject={n} key={i} template={NotificationObjectTemplateType.SNIPPET} />;
    } else if (n.type === SCNotificationTypologyType.MENTION) {
      return <UserNotificationMention notificationObject={n} key={i} template={NotificationObjectTemplateType.SNIPPET} />;
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
      <Box classes={{root: classes.content}}>
        <Box className={classes.notificationsWrap}>
          {loading ? (
            <Skeleton elevation={0} />
          ) : (
            <MenuList>
              {notifications.slice(0, showMax).map((notificationObject: SCNotificationAggregatedType, i) => (
                <Box key={i}>
                  {notificationObject.aggregated.map((n: SCNotificationType, k) => (
                    <MenuItem className={classes.notificationItemWrap} key={k}>
                      {renderAggregatedItem(n, i)}
                    </MenuItem>
                  ))}
                </Box>
              ))}
            </MenuList>
          )}
        </Box>
        <Box className={classes.viewOthersButtonWrap}>
          <Button
            fullWidth
            component={Link}
            to={scRoutingContext.url(SCRoutes.USER_NOTIFICATIONS_ROUTE_NAME, {})}
            variant="text"
            color="primary"
            classes={{root: classes.viewOthersButton}}
            disabled={loading}>
            <FormattedMessage id="ui.userPopupNotification.viewOther" defaultMessage="ui.userPopupNotification.viewOther" />
          </Button>
        </Box>
      </Box>
    </Root>
  );
}
