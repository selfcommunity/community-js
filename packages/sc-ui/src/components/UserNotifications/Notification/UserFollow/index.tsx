import React from 'react';
import {styled} from '@mui/material/styles';
import {Avatar, Box, ListItem, ListItemAvatar, ListItemText, Typography} from '@mui/material';
import {Link, SCNotificationUserFollowType, SCRoutes, SCRoutingContextType, useSCRouting} from '@selfcommunity/core';
import {defineMessages, useIntl} from 'react-intl';
import DateTimeAgo from '../../../../shared/DateTimeAgo';

const messages = defineMessages({
  followUser: {
    id: 'ui.userNotifications.userFollow.followUser',
    defaultMessage: 'ui.userNotifications.userFollow.followUser'
  }
});

const PREFIX = 'SCUserFollowNotification';

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));

export interface NotificationFollowProps {
  /**
   * Notification obj
   * @default null
   */
  notificationObject: SCNotificationUserFollowType;
  /**
   * Any other properties
   */
  [p: string]: any;
}
export default function UserFollowNotification(props: NotificationFollowProps): JSX.Element {
  // PROPS
  const {notificationObject = null, ...rest} = props;

  // CONTEXT
  const scRoutingContext: SCRoutingContextType = useSCRouting();

  // INTL
  const intl = useIntl();

  /**
   * Renders root object
   */
  return (
    <Root {...rest}>
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <Link to={scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, {id: notificationObject.follower.id})}>
            <Avatar alt={notificationObject.follower.username} variant="circular" src={notificationObject.follower.avatar} />
          </Link>
        </ListItemAvatar>
        <ListItemText
          primary={
            <Typography component="span" sx={{display: 'inline'}} color="primary">
              <Link to={scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, {id: notificationObject.follower.id})}>
                {notificationObject.follower.username}
              </Link>{' '}
              {intl.formatMessage(messages.followUser, {b: (...chunks) => <strong>{chunks}</strong>})}
            </Typography>
          }
          secondary={<DateTimeAgo date={notificationObject.active_at} />}
        />
      </ListItem>
    </Root>
  );
}
