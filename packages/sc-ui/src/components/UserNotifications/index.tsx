import React, {useEffect, useMemo, useRef, useState} from 'react';
import {styled} from '@mui/material/styles';
import {Box, BoxProps, Button, List, ListItem, Stack, Typography} from '@mui/material';
import {
  Endpoints,
  http,
  Logger,
  SCNotificationTopicType,
  SCUserContextType,
  useSCUser
} from '@selfcommunity/core';
import {AxiosResponse} from 'axios';
import PubSub from 'pubsub-js';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {FormattedMessage} from 'react-intl';
import {NotificationSkeleton} from '../Skeleton';
import UserNotification, {UserNotificationProps} from './Notification';
import InfiniteScroll from 'react-infinite-scroll-component';
import {SCNotificationAggregatedType} from '@selfcommunity/core';

const PREFIX = 'SCUserNotifications';

const classes = {
  btnNewNotification: `${PREFIX}-btn-new-notification`,
  notificationsList: `${PREFIX}-notification-list`,
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
  [`& .${classes.btnNewNotification}`]: {
    width: '95%',
    color: theme.palette.error.main,
    borderColor: theme.palette.error.main
  }
}));

export interface UserNotificationsProps extends BoxProps {
  /**
   * Id of the UserNotifications
   * @default 'notifications'
   */
  id?: string;

  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;

  /**
   * Props to spread to single notification
   * @default empty object
   */
  UserNotificationProps?: UserNotificationProps;

  /**
   * Other props
   */
  [p: string]: any;
}

export default function UserNotifications(props: UserNotificationsProps): JSX.Element {
  // PROPS
  const {id = `notifications`, className = null, UserNotificationProps = {}, ...rest} = props;

  // CONTEXT
  const scUserContext: SCUserContextType = useSCUser();

  // STATE
  const [notifications, setNotifications] = useState<SCNotificationAggregatedType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [next, setNext] = useState<string>(null);
  const [newNotifications, setNewNotifications] = useState<boolean>(false);

  // REFS
  const notificationSubscription = useRef(null);

  // CONST
  const notificationBaseUrl = Endpoints.UserNotificationList.url({});

  /**
   * Fetches user notifications
   * Manages pagination, infinite scrolling
   */
  const performFetchNotifications = useMemo(
    () => (next) => {
      return http
        .request({
          url: next,
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
   * Performs the contribute sharing
   */
  function fetchNotifications(next) {
    setLoading(true);
    performFetchNotifications(next)
      .then((r) => {
        setNotifications(next === notificationBaseUrl ? [...r.results] : [...notifications, ...r.results]);
        setNext(r.next);
        setLoading(false);
      })
      .catch((error) => {
        Logger.error(SCOPE_SC_UI, error);
        setLoading(false);
      });
  }

  /**
   * Reload notifications
   */
  const reloadNotifications = () => {
    setNewNotifications(false);
    fetchNotifications(notificationBaseUrl);
  };

  /**
   * Render box new notifications
   */
  const renderNewNotificationAlert = () => {
    return (
      <Stack spacing={2} direction="row" justifyContent="center" alignItems="center">
        <Button variant="outlined" classes={{root: classes.btnNewNotification}} onClick={reloadNotifications}>
          <FormattedMessage
            id="ui.userNotifications.newNotificationsLabel"
            defaultMessage="ui.userNotifications.newNotificationsLabel"
            values={{count: scUserContext.user.unseen_interactions_counter}}
          />
        </Button>
      </Stack>
    );
  };

  /**
   * Notification subscriber
   * @param msg
   * @param data
   */
  const notificationSubscriber = (msg, data) => {
    if (data && data.data && data.data.count_interactions > 0) {
      setNewNotifications(true);
    }
  };

  /**
   * On mount, fetches first page of notifications
   * On mount, subscribe to receive notification updates
   */
  useEffect(() => {
    fetchNotifications(notificationBaseUrl);
    notificationSubscription.current = PubSub.subscribe(SCNotificationTopicType.INTERACTION, notificationSubscriber);
    return () => {
      PubSub.unsubscribe(notificationSubscription.current);
    };
  }, []);

  return (
    <Root id={id} className={className} {...rest}>
      {loading ? (
        <>
          {[...Array(Math.floor(Math.random() * 5) + 3)].map((x, i) => (
            <NotificationSkeleton key={i} {...rest} />
          ))}
        </>
      ) : (
        <Box>
          {newNotifications && renderNewNotificationAlert()}
          {notifications.length <= 0 ? (
            <Typography variant="body2">
              <FormattedMessage id="ui.userNotifications.noResults" defaultMessage="ui.userNotifications.noResults" />
            </Typography>
          ) : (
            <InfiniteScroll
              dataLength={notifications.length}
              next={() => fetchNotifications(next)}
              hasMore={Boolean(next)}
              loader={
                <ListItem>
                  <NotificationSkeleton {...rest} sx={{width: '100%'}} />
                </ListItem>
              }
              pullDownToRefreshThreshold={10}
              endMessage={
                <p style={{textAlign: 'center'}}>
                  <b>
                    <FormattedMessage id="ui.userNotifications.noOtherNotifications" defaultMessage="ui.userNotifications.noOtherNotifications" />
                  </b>
                </p>
              }>
              <List className={classes.notificationsList}>
                {notifications.map((n: SCNotificationAggregatedType, i) => (
                  <ListItem key={i}>
                    <UserNotification notificationObject={n} key={i} {...UserNotificationProps} />
                  </ListItem>
                ))}
              </List>
            </InfiniteScroll>
          )}
        </Box>
      )}
    </Root>
  );
}
