import React from 'react';
import {styled} from '@mui/material/styles';
import {Avatar, Box, ListItem, ListItemAvatar, ListItemText, Typography} from '@mui/material';
import {defineMessages, useIntl} from 'react-intl';
import DateTimeAgo from '../../../../shared/DateTimeAgo';
import {
  Link,
  SCNotificationConnectionAcceptType,
  SCNotificationConnectionRequestType,
  SCNotificationTypologyType,
  SCRoutes,
  SCRoutingContextType,
  useSCRouting
} from '@selfcommunity/core';

const messages = defineMessages({
  requestConnection: {
    id: 'ui.userNotifications.userConnection.requestConnection',
    defaultMessage: 'ui.userNotifications.userConnection.requestConnection'
  },
  acceptConnection: {
    id: 'ui.userNotifications.userConnection.acceptConnection',
    defaultMessage: 'ui.userNotifications.userConnection.acceptConnection'
  }
});

const PREFIX = 'SCUserConnectionNotification';

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));

export interface NotificationConnectionProps {
  /**
   * Notification obj
   * @default null
   */
  notificationObject: SCNotificationConnectionRequestType | SCNotificationConnectionAcceptType;
  /**
   * Any other properties
   */
  [p: string]: any;
}
export default function UserConnectionNotification(props: NotificationConnectionProps): JSX.Element {
  // PROPS
  const {notificationObject = null, ...rest} = props;

  // CONTEXT
  const scRoutingContext: SCRoutingContextType = useSCRouting();

  // INTL
  const intl = useIntl();

  // STATE
  const userConnection =
    notificationObject.type === SCNotificationTypologyType.CONNECTION_REQUEST ? notificationObject.request_user : notificationObject.accept_user;

  /**
   * Renders root object
   */
  return (
    <Root {...rest}>
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <Link to={scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, {id: userConnection.id})}>
            <Avatar alt={userConnection.username} variant="circular" src={userConnection.avatar} />
          </Link>
        </ListItemAvatar>
        <ListItemText
          primary={
            <Typography component="span" sx={{display: 'inline'}} color="primary">
              <Link to={scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, {id: userConnection.id})}>{userConnection.username}</Link>{' '}
              {notificationObject.type === SCNotificationTypologyType.CONNECTION_REQUEST
                ? intl.formatMessage(messages.requestConnection, {b: (...chunks) => <strong>{chunks}</strong>})
                : intl.formatMessage(messages.requestConnection, {b: (...chunks) => <strong>{chunks}</strong>})}
            </Typography>
          }
          secondary={<DateTimeAgo date={notificationObject.active_at} />}
        />
      </ListItem>
    </Root>
  );
}
