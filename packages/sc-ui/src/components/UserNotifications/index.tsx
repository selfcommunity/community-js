import React, { useEffect, useRef, useState } from 'react';
import {styled} from '@mui/material/styles';
import {Box, List, ListItem, Typography} from '@mui/material';
import { Endpoints, http, Logger, SCNotificationTopicType } from '@selfcommunity/core';
import {AxiosResponse} from 'axios';
import PubSub from 'pubsub-js';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {FormattedMessage} from 'react-intl';
import {NotificationSkeleton} from '../Skeleton';
import UserNotification from './Notification';
import InfiniteScroll from 'react-infinite-scroll-component';
import {SCNotificationAggregatedType} from '@selfcommunity/core';
import { SCNotificationTopics } from '@selfcommunity/core/src/constants/Notification';

const PREFIX = 'SCUserNotifications';

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2)
}));

export default function UserNotifications(rest): JSX.Element {
  const [notifications, setNotifications] = useState<SCNotificationAggregatedType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [next, setNext] = useState<string>(Endpoints.UserNotificationList.url({}));
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
   * Notification subscriber
   * @param msg
   * @param data
   */
  const notificationSubscriber = (msg, data) => {
    console.log('interactions');
    console.dir(data);
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
