import React from 'react';
import {styled} from '@mui/material/styles';
import {Avatar, Box, ListItem, ListItemAvatar, ListItemText, Typography} from '@mui/material';
import {green} from '@mui/material/colors';
import EmojiFlagsIcon from '@mui/icons-material/EmojiFlags';
import {SCNotificationBlockedUserType, SCNotificationTypologyType} from '@selfcommunity/core';
import {defineMessages, useIntl} from 'react-intl';
import DateTimeAgo from '../../../../shared/DateTimeAgo';

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
   * Notification obj
   * @default null
   */
  notificationObject: any;
  /**
   * Any other properties
   */
  [p: string]: any;
}

export default function UserBlockedNotification(props: NotificationBlockedProps): JSX.Element {
  // PROPS
  const {notificationObject = null, ...rest} = props;

  // INTL
  const intl = useIntl();

  /**
   * Renders root object
   */
  return <div dangerouslySetInnerHTML={{__html: notificationObject.html}} />;
  /* return (
    <Root {...rest}>
      <ListItem alignItems="flex-start" component={'div'}>
        <ListItemAvatar>
          <Avatar variant="circular" sx={{bgcolor: green[500]}}>
            <EmojiFlagsIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          disableTypography={true}
          primary={
            <Typography component="div" sx={{display: 'inline'}} color="primary">
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
  ); */
}
