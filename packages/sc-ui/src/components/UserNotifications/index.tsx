import React, {useEffect, useRef, useState} from 'react';
import {styled} from '@mui/material/styles';
import {Box, Button, List, ListItem, Stack, Typography} from '@mui/material';
import {Endpoints, http, Logger, SCNotificationTopicType} from '@selfcommunity/core';
import {AxiosResponse} from 'axios';
import PubSub from 'pubsub-js';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {FormattedMessage} from 'react-intl';
import {NotificationSkeleton} from '../Skeleton';
import UserNotification from './Notification';
import InfiniteScroll from 'react-infinite-scroll-component';
import {SCNotificationAggregatedType} from '@selfcommunity/core';

const PREFIX = 'SCUserNotifications';

const classes = {
  btnNewNotification: `${PREFIX}-btn-new-notification`
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

export default function UserNotifications(rest): JSX.Element {
  const [notifications, setNotifications] = useState<SCNotificationAggregatedType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [next, setNext] = useState<string>(Endpoints.UserNotificationList.url({}));
  const [newNotifications, setNewNotifications] = useState<boolean>(false);
  const notificationSubscription = useRef(null);

  /**
   * Fetches user notifications
   * Manages pagination, infinite scrolling
   */
  function fetchNotifications() {
    http
      .request({
        url: next,
        method: Endpoints.UserNotificationList.method
      })
      .then((res: AxiosResponse<{next?: string; previous?: string; results: SCNotificationAggregatedType[]}>) => {
        const data = res.data;
        setNotifications([...notifications, ...data.results]);
        setNext(data.next);
        setLoading(false);
      })
      .catch((error) => {
        Logger.error(SCOPE_SC_UI, error);
      });
  }

  /**
   * Reload notifications
   */
  const reloadNotifications = () => {
    setNext(null);
    setNotifications([]);
    setLoading(true);
    setNewNotifications(false);
    fetchNotifications();
  };

  /**
   * Render box new notifications
   */
  const renderNewNotificationAlert = () => {
    return (
      <Stack spacing={2} direction="row" justifyContent="center" alignItems="center">
        <Button variant="outlined" classes={{root: classes.btnNewNotification}} onClick={reloadNotifications}>
          <FormattedMessage id="ui.userNotifications.newNotificationsLabel" defaultMessage="ui.userNotifications.newNotificationsLabel" />
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
   */
  useEffect(() => {
    fetchNotifications();
    notificationSubscription.current = PubSub.subscribe(SCNotificationTopicType.INTERACTION, notificationSubscriber);
    return () => {
      PubSub.unsubscribe(notificationSubscription.current);
    };
  }, []);

  return (
    <Root>
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
              next={fetchNotifications}
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
              <List>
                {notifications.map((n: SCNotificationAggregatedType, i) => (
                  <ListItem>
                    <UserNotification notificationObject={n} key={i} {...rest} />
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
