import React from 'react';
import {styled} from '@mui/material/styles';
import {Avatar, Box, ListItem, ListItemAvatar, ListItemText, Stack, Typography} from '@mui/material';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import DateTimeAgo from '../../../../shared/DateTimeAgo';
import {Link, SCNotificationTypologyType, SCRoutes, SCRoutingContextType, useSCRouting} from '@selfcommunity/core';

const messages = defineMessages({
  requestConnection: {
    id: 'ui.notification.userConnection.requestConnection',
    defaultMessage: 'ui.notification.userConnection.requestConnection'
  },
  acceptConnection: {
    id: 'ui.notification.userConnection.acceptConnection',
    defaultMessage: 'ui.notification.userConnection.acceptConnection'
  }
});

const PREFIX = 'SCUserConnectionNotificationToast';

const classes = {
  content: `${PREFIX}-content`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  [`& .${PREFIX}-content`]: {
    padding: '8px 0px 15px 0px'
  }
}));

export interface NotificationConnectionToastProps {
  /**
   * Id of the feedObject
   * @default 'tn_<notificationObject.feed_serialization_id>'
   */
  id?: string;

  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;

  /**
   * Notification obj
   * @default null
   */
  notificationObject: any;

  /**
   * Any other properties
   */
  [p: string]: any;
}

/**
 * This component render the content of the
 * toast notification of types:
 *  - request connection
 *  - accept connection
 * @param props
 * @constructor
 */
export default function UserConnectionNotificationToast(props: NotificationConnectionToastProps): JSX.Element {
  // PROPS
  const {notificationObject = null, id = `tn_${props.notificationObject['feed_serialization_id']}`, className, ...rest} = props;

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
    <Root id={id} className={className} {...rest}>
      <ListItem component={'div'} className={classes.content}>
        <ListItemAvatar>
          <Link to={scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, {id: userConnection.id})}>
            <Avatar alt={userConnection.username} variant="circular" src={userConnection.avatar} />
          </Link>
        </ListItemAvatar>
        <ListItemText
          primary={<Link to={scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, {id: userConnection.id})}>{userConnection.username}</Link>}
          secondary={
            <Typography component="div" sx={{display: 'inline'}} color="primary">
              {notificationObject.type === SCNotificationTypologyType.CONNECTION_REQUEST
                ? intl.formatMessage(messages.requestConnection, {b: (...chunks) => <span>{chunks}</span>})
                : intl.formatMessage(messages.requestConnection, {b: (...chunks) => <span>{chunks}</span>})}
            </Typography>
          }
        />
      </ListItem>
      <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
        <DateTimeAgo date={notificationObject.active_at} />
        <Typography color="primary">
          <Link to={scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, {id: userConnection.id})}>
            <FormattedMessage id="ui.userToastNotifications.goToProfile" defaultMessage={'ui.userToastNotifications.goToProfile'} />
          </Link>
        </Typography>
      </Stack>
    </Root>
  );
}
