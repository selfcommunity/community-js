import React, {useEffect, useState} from 'react';
import {styled} from '@mui/material/styles';
import {Box, Button, List, Typography} from '@mui/material';
import {Endpoints, http, Logger, SCFeedObjectType, SCFeedUnitType} from '@selfcommunity/core';
import {AxiosResponse} from 'axios';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {FormattedMessage} from 'react-intl';
import {NotificationSkeleton} from '../Skeleton';
import UserNotification from './Notification';
import InfiniteScroll from 'react-infinite-scroll-component';
import {SCNotificationAggregatedType} from '@selfcommunity/core';

const PREFIX = 'SCUserNotifications';

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  maxWidth: 700,
  marginBottom: theme.spacing(2)
}));

export default function UserNotifications(props): JSX.Element {
  const [notifications, setNotifications] = useState<SCNotificationAggregatedType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [next, setNext] = useState<string>(Endpoints.UserNotificationList.url({}));

  /**
   * Fetch user notifications
   * Manage pagination, infinite scrolling
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
   * On mount, fetch first page of notifications
   */
  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <Root {...props}>
      {loading ? (
        <>
          {[...Array(Math.floor(Math.random() * 5) + 3)].map((x, i) => (
            <NotificationSkeleton key={i} {...props} />
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
              style={{
                margin: 10
              }}
              dataLength={notifications.length}
              next={fetchNotifications}
              hasMore={Boolean(next)}
              loader={<NotificationSkeleton {...props} />}
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
                  <UserNotification notificationObject={n} key={i} {...props} />
                ))}
              </List>
            </InfiniteScroll>
          )}
        </Box>
      )}
    </Root>
  );
}
