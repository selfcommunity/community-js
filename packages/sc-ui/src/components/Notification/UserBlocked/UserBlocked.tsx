import React from 'react';
import {styled} from '@mui/material/styles';
import {Avatar, Box, ListItem, ListItemAvatar, ListItemText, Typography} from '@mui/material';
import {red} from '@mui/material/colors';
import EmojiFlagsIcon from '@mui/icons-material/EmojiFlags';
import {SCNotificationBlockedUserType, SCNotificationTypologyType} from '@selfcommunity/core';
import {defineMessages, useIntl} from 'react-intl';
import DateTimeAgo from '../../../shared/DateTimeAgo';
import NewChip from '../../../shared/NewChip/NewChip';
import classNames from 'classnames';

const messages = defineMessages({
  accountBlocked: {
    id: 'ui.notification.userBlocked.accountBlocked',
    defaultMessage: 'ui.notification.userBlocked.accountBlocked'
  },
  accountReactivated: {
    id: 'ui.notification.userBlocked.accountReactivated',
    defaultMessage: 'ui.notification.userBlocked.accountReactivated'
  }
});

const PREFIX = 'SCUserBlockedNotification';

const classes = {
  root: `${PREFIX}-root`,
  blockedIconWrap: `${PREFIX}-flag-icon-wrap`,
  blockedIcon: `${PREFIX}-blocked-icon`,
  blockedText: `${PREFIX}-blocked-text`,
  activeAt: `${PREFIX}-active-at`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  [`& .${classes.blockedIcon}`]: {
    backgroundColor: red[500],
    color: '#FFF'
  },
  [`& .${classes.blockedText}`]: {
    display: 'inline',
    fontWeight: '600'
  }
}));

export interface NotificationBlockedProps {
  /**
   * Id of the feedObject
   * @default `n_<notificationObject.sid>`
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
    <Root id={id} className={classNames(classes.root, className)} {...rest}>
      <ListItem alignItems="flex-start" component={'div'}>
        <ListItemAvatar classes={{root: classes.blockedIconWrap}}>
          <Avatar variant="circular" classes={{root: classes.blockedIcon}}>
            <EmojiFlagsIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          disableTypography={true}
          primary={
            <>
              {notificationObject.is_new && <NewChip />}
              <Typography component="div" color="inherit" className={classes.blockedText}>
                {notificationObject.type === SCNotificationTypologyType.BLOCKED_USER
                  ? intl.formatMessage(messages.accountBlocked, {b: (...chunks) => <strong>{chunks}</strong>})
                  : intl.formatMessage(messages.accountReactivated, {b: (...chunks) => <strong>{chunks}</strong>})}
              </Typography>
            </>
          }
          secondary={<DateTimeAgo date={notificationObject.active_at} className={classes.activeAt} />}
        />
      </ListItem>
    </Root>
  );
}
