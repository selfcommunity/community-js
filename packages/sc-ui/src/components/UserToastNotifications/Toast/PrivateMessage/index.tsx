import React from 'react';
import {styled} from '@mui/material/styles';
import {Avatar, Box, ListItem, ListItemAvatar, ListItemText, Stack, Typography} from '@mui/material';
import {Link, SCRoutes, SCRoutingContextType, useSCRouting} from '@selfcommunity/core';
import {FormattedMessage} from 'react-intl';
import DateTimeAgo from '../../../../shared/DateTimeAgo';

const PREFIX = 'SCUserNotificationPrivateMessage';

const classes = {
  content: `${PREFIX}-content`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  [`& .${PREFIX}-content`]: {
    padding: '8px 0px 10px 0px'
  }
}));

export interface NotificationPMToastProps {
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
 * toast notification of type private message
 * @param props
 * @constructor
 */
export default function UserNotificationPrivateMessageToast(props: NotificationPMToastProps): JSX.Element {
  // PROPS
  const {notificationObject = null, id = `tn_${props.notificationObject['feed_serialization_id']}`, className, ...rest} = props;

  // CONTEXT
  const scRoutingContext: SCRoutingContextType = useSCRouting();

  /**
   * Renders root object
   */
  return (
    <Root id={id} className={className} {...rest}>
      <ListItem alignItems={'flex-start'} component={'div'} className={classes.content}>
        <ListItemAvatar>
          <Link to={scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, {id: notificationObject.private_message.sender.id})}>
            <Avatar
              alt={notificationObject.private_message.sender.username}
              variant="circular"
              src={notificationObject.private_message.sender.avatar}
            />
          </Link>
        </ListItemAvatar>
        <ListItemText
          disableTypography={true}
          primary={
            <Typography>
              <Link to={scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, {id: notificationObject.private_message.sender.id})}>
                {notificationObject.private_message.sender.username}
              </Link>{' '}
              <FormattedMessage
                id={'ui.userToastNotifications.privateMessage.sentMessage'}
                defaultMessage={'ui.userToastNotifications.privateMessage.sentMessage'}
              />
              :
            </Typography>
          }
          secondary={<Typography color="primary" gutterBottom dangerouslySetInnerHTML={{__html: notificationObject.private_message.html}} />}
        />
      </ListItem>
      <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
        <DateTimeAgo date={notificationObject.active_at} />
        <Typography color="primary">
          <Link to={scRoutingContext.url('messages', {id: notificationObject.private_message.id})}>
            <FormattedMessage id="ui.userToastNotifications.replyMessage" defaultMessage={'ui.userToastNotifications.replyMessage'} />
          </Link>
        </Typography>
      </Stack>
    </Root>
  );
}
