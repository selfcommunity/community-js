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
import ContributionFollowNotification from '../Notification/ContributionFollow';
import {Box, CardProps, MenuItem, MenuList} from '@mui/material';
import IncubatorApprovedNotification from '../Notification/IncubatorApproved';
import classNames from 'classnames';
import Skeleton from './Skeleton';
import {SCNotificationObjectTemplateType} from '../../types';
import ScrollContainer from '../../shared/ScrollContainer';
import {FormattedMessage} from 'react-intl';
import {SCNotificationAggregatedType, SCNotificationTopicType, SCNotificationType, SCNotificationTypologyType} from '@selfcommunity/types';
import {http, Endpoints, HttpResponse} from '@selfcommunity/api-services';
import {Logger} from '@selfcommunity/utils';
import {SCNotification, SCUserContextType, useSCUser} from '@selfcommunity/react-core';
import useThemeProps from '@mui/material/styles/useThemeProps';

const PREFIX = 'SCSnippetNotifications';

const classes = {
  root: `${PREFIX}-root`,
  notificationsWrap: `${PREFIX}-notifications-wrap`,
  emptyBoxNotifications: `${PREFIX}-empty-box-notifications`,
  notificationsList: `${PREFIX}-notifications-list`,
  notificationItem: `${PREFIX}-notification-item`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  width: '100%',
  [`& .${classes.notificationsWrap}`]: {
    height: 330,
    maxWidth: 320,
    overflowY: 'hidden'
  },
  [`& .${classes.notificationItem}`]: {
    padding: 0,
    margin: `${theme.spacing()} 0px`,
    whiteSpace: 'normal',
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.05)',
      cursor: 'default'
    }
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
   * Handle single notification
   * Override content
   */
  handleNotification?: (type, data, content) => JSX.Element;

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
   * Props to spread to ScrollContainer component
   * This lib use 'react-custom-scrollbars' component to perform scrollbars
   * For more info: https://github.com/malte-wessel/react-custom-scrollbars/blob/master/docs/API.md
   * @default {}
   */
  ScrollContainerProps?: Record<string, any>;

  /**
   * Callback when click on single notification
   * @param notification
   */
  onNotificationClick?: (event, notification) => void;

  /**
   * Any other properties
   */
  [p: string]: any;
}

/**
 *
 > API documentation for the Community-JS SnippetNotifications component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {SnippetNotifications} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCSnippetNotifications` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCSnippetNotification-root|Styles applied to the root element.|
 |notificationsWrap|.SCSnippetNotification-notification-wrap|Styles applied to the notifications wrap.|
 |emptyBoxNotifications|.SCSnippetNotification-empty-box-notifications|Styles applied to the box indicating that there are no notifications.|
 |notificationsList|.SCSnippetNotification-notifications-list|Styles applied to the list of notifications.|
 |notificationItem|.SCSnippetNotification-notification-item|Styles applied to the single notification.|

 * @param inProps
 */
export default function SnippetNotifications(inProps: SnippetNotificationsProps): JSX.Element {
  // PROPS
  const props: SnippetNotificationsProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });

  const {
    id = `snippetNotifications`,
    className,
    showMax = 20,
    handleCustomNotification,
    handleNotification,
    ScrollContainerProps = {},
    onNotificationClick,
    ...rest
  } = props;

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
        .then((res: HttpResponse<any>) => {
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
    /**
     * Ignore notifications of type: notification_banner
     * (data.data.activity_type === SCNotificationTypologyType.NOTIFICATION_BANNER)
     */
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

  const handleSingleNotificationClick = (e, n) => {
    if (onNotificationClick) {
      onNotificationClick(e, n);
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
    const type = n.type;
    let content;
    if (type === SCNotificationTypologyType.COMMENT || type === SCNotificationTypologyType.NESTED_COMMENT) {
      content = <CommentNotification notificationObject={n} key={i} index={i} template={SCNotificationObjectTemplateType.SNIPPET} />;
    } else if (type === SCNotificationTypologyType.FOLLOW) {
      content = <ContributionFollowNotification notificationObject={n} key={i} template={SCNotificationObjectTemplateType.SNIPPET} />;
    } else if (type === SCNotificationTypologyType.USER_FOLLOW) {
      content = <UserFollowNotification notificationObject={n} key={i} template={SCNotificationObjectTemplateType.SNIPPET} />;
    } else if (type === SCNotificationTypologyType.CONNECTION_REQUEST || type === SCNotificationTypologyType.CONNECTION_ACCEPT) {
      content = <UserConnectionNotification notificationObject={n} key={i} template={SCNotificationObjectTemplateType.SNIPPET} />;
    } else if (type === SCNotificationTypologyType.VOTE_UP) {
      content = <VoteUpNotification notificationObject={n} key={i} template={SCNotificationObjectTemplateType.SNIPPET} />;
    } else if (
      type === SCNotificationTypologyType.KINDLY_NOTICE_ADVERTISING ||
      type === SCNotificationTypologyType.KINDLY_NOTICE_AGGRESSIVE ||
      type === SCNotificationTypologyType.KINDLY_NOTICE_POOR ||
      type === SCNotificationTypologyType.KINDLY_NOTICE_VULGAR ||
      type === SCNotificationTypologyType.KINDLY_NOTICE_OFFTOPIC
    ) {
      content = <KindlyNoticeForNotification notificationObject={n} key={i} template={SCNotificationObjectTemplateType.SNIPPET} />;
    } else if (type === SCNotificationTypologyType.KINDLY_NOTICE_FLAG) {
      content = <KindlyNoticeFlagNotification notificationObject={n} key={i} template={SCNotificationObjectTemplateType.SNIPPET} />;
    } else if (
      type === SCNotificationTypologyType.DELETED_FOR_ADVERTISING ||
      type === SCNotificationTypologyType.DELETED_FOR_AGGRESSIVE ||
      type === SCNotificationTypologyType.DELETED_FOR_POOR ||
      type === SCNotificationTypologyType.DELETED_FOR_VULGAR ||
      type === SCNotificationTypologyType.DELETED_FOR_OFFTOPIC
    ) {
      content = <DeletedForNotification notificationObject={n} key={i} template={SCNotificationObjectTemplateType.SNIPPET} />;
    } else if (type === SCNotificationTypologyType.UNDELETED_FOR) {
      content = <UndeletedForNotification notificationObject={n} key={i} template={SCNotificationObjectTemplateType.SNIPPET} />;
    } else if (
      type === SCNotificationTypologyType.COLLAPSED_FOR_ADVERTISING ||
      type === SCNotificationTypologyType.COLLAPSED_FOR_AGGRESSIVE ||
      type === SCNotificationTypologyType.COLLAPSED_FOR_POOR ||
      type === SCNotificationTypologyType.COLLAPSED_FOR_VULGAR ||
      type === SCNotificationTypologyType.COLLAPSED_FOR_OFFTOPIC
    ) {
      content = <CollapsedForNotification notificationObject={n} key={i} template={SCNotificationObjectTemplateType.SNIPPET} />;
    } else if (type === SCNotificationTypologyType.PRIVATE_MESSAGE) {
      content = <PrivateMessageNotification notificationObject={n} key={i} template={SCNotificationObjectTemplateType.SNIPPET} />;
    } else if (type === SCNotificationTypologyType.BLOCKED_USER || type === SCNotificationTypologyType.UNBLOCKED_USER) {
      content = <UserBlockedNotification notificationObject={n} key={i} template={SCNotificationObjectTemplateType.SNIPPET} />;
    } else if (type === SCNotificationTypologyType.MENTION) {
      content = <MentionNotification notificationObject={n} key={i} template={SCNotificationObjectTemplateType.SNIPPET} />;
    } else if (type === SCNotificationTypologyType.INCUBATOR_APPROVED) {
      content = <IncubatorApprovedNotification notificationObject={n} key={i} template={SCNotificationObjectTemplateType.SNIPPET} />;
    } else if (type === SCNotificationTypologyType.CUSTOM_NOTIFICATION && handleCustomNotification) {
      content = handleCustomNotification(n);
    }
    if (type && handleNotification) {
      /** Override content */
      content = handleNotification(type, n, content);
    }
    return content;
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
          <>
            {notifications.length === 0 ? (
              <Box className={classes.emptyBoxNotifications}>
                <FormattedMessage
                  id="ui.snippetNotifications.noNotifications"
                  defaultMessage="ui.snippetNotifications.noNotifications"></FormattedMessage>
              </Box>
            ) : (
              <ScrollContainer {...ScrollContainerProps}>
                <MenuList className={classes.notificationsList}>
                  {notifications.slice(0, showMax).map((notificationObject: SCNotificationAggregatedType, i) =>
                    notificationObject.aggregated.map((n: SCNotificationType, k) => (
                      <MenuItem className={classes.notificationItem} key={k} onClick={(e) => handleSingleNotificationClick(e, n)}>
                        {renderAggregatedItem(n, i)}
                      </MenuItem>
                    ))
                  )}
                </MenuList>
              </ScrollContainer>
            )}
          </>
        )}
      </Box>
    </Root>
  );
}
