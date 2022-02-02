import React from 'react';
import {styled} from '@mui/material/styles';
import {Avatar, Box, ListItem, ListItemAvatar, ListItemText, Typography} from '@mui/material';
import {red} from '@mui/material/colors';
import EmojiFlagsIcon from '@mui/icons-material/EmojiFlags';
import {SCNotificationBlockedUserType, SCNotificationTypologyType} from '@selfcommunity/core';
import {defineMessages, useIntl} from 'react-intl';
import DateTimeAgo from '../../../../shared/DateTimeAgo';
import NotificationNewChip from '../../NotificationNewChip';

const messages = defineMessages({
  accountBlocked: {
    id: 'ui.userNotifications.userBlocked.accountBlocked',
    defaultMessage: 'ui.userNotifications.userBlocked.accountBlocked'
  },
  accountReactivated: {
    id: 'ui.userNotifications.userBlocked.accountReactivated',
    defaultMessage: 'ui.userNotifications.userBlocked.accountReactivated'
  }
});

const PREFIX = 'SCUserBlockedNotification';

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));

export interface NotificationBlockedProps {
  /**
   * Id of the feedObject
   * @default 'n_<notificationObject.sid>'
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
  notificationObject: SCNotificationBlockedUserType;

  /**
   * Any other properties
   */
  [p: string]: any;
}
/**
 * This component render the content of the notification of type user blocked
 * @param props
 * @constructor
 */
export default function UserBlockedNotification(props: NotificationBlockedProps): JSX.Element {
  // PROPS
  const {notificationObject = null, id = `n_${props.notificationObject['sid']}`, className, ...rest} = props;
  // INTL
  const intl = useIntl();

  /**
   * Renders root object
   */
  return (
    <Root id={id} className={className} {...rest}>
      <ListItem alignItems="flex-start" component={'div'}>
        <ListItemAvatar>
          <Avatar variant="circular" sx={{bgcolor: red[500]}}>
            <EmojiFlagsIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          disableTypography={true}
          primary={
            <Typography component="div" sx={{display: 'inline'}} color="primary">
              {notificationObject.is_new && <NotificationNewChip />}
              <b>
                {notificationObject.type === SCNotificationTypologyType.BLOCKED_USER
                  ? intl.formatMessage(messages.accountBlocked, {b: (...chunks) => <strong>{chunks}</strong>})
                  : intl.formatMessage(messages.accountReactivated, {b: (...chunks) => <strong>{chunks}</strong>})}
              </b>
            </Typography>
          }
          secondary={<DateTimeAgo date={notificationObject.active_at} />}
        />
      </ListItem>
    </Root>
  );
}
