import React from 'react';
import {styled} from '@mui/material/styles';
import {Avatar, Box, Stack} from '@mui/material';
import {green, grey, red} from '@mui/material/colors';
import Icon from '@mui/material/Icon';
import {SCNotificationBlockedUserType, SCNotificationTypologyType} from '@selfcommunity/core';
import {defineMessages, useIntl} from 'react-intl';
import DateTimeAgo from '../../../shared/DateTimeAgo';
import classNames from 'classnames';
import {SCNotificationObjectTemplateType} from '../../../types';
import useThemeProps from '@mui/material/styles/useThemeProps';
import NotificationItem from '../../../shared/NotificationItem';

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
  unBlockedIcon: `${PREFIX}-unblocked-icon`,
  blockedIcon: `${PREFIX}-blocked-icon`,
  blockedText: `${PREFIX}-blocked-text`,
  activeAt: `${PREFIX}-active-at`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  [`& .${classes.unBlockedIcon}`]: {
    backgroundColor: green[500],
    color: '#FFF'
  },
  [`& .${classes.blockedIcon}`]: {
    backgroundColor: red[500],
    color: '#FFF'
  },
  [`& .${classes.blockedText}`]: {
    color: theme.palette.text.primary,
    textOverflow: 'ellipsis',
    display: 'inline',
    overflow: 'hidden'
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
   * Notification Object template type
   * @default 'detail'
   */
  template?: SCNotificationObjectTemplateType;

  /**
   * Any other properties
   */
  [p: string]: any;
}
/**
 * This component render the content of the notification of type user blocked
 * @param inProps
 * @constructor
 */
export default function UserBlockedNotification(inProps: NotificationBlockedProps): JSX.Element {
  // PROPS
  const props: NotificationBlockedProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {
    notificationObject = null,
    id = `n_${props.notificationObject['sid']}`,
    template = SCNotificationObjectTemplateType.DETAIL,
    className,
    ...rest
  } = props;

  // INTL
  const intl = useIntl();

  /**
   * Renders root object
   */
  return (
    <Root id={id} className={classNames(classes.root, className, `${PREFIX}-${template}`)} {...rest}>
      <NotificationItem
        template={template}
        isNew={notificationObject.is_new}
        image={
          <Avatar
            variant="circular"
            classes={{
              root: classNames(classes.unBlockedIcon, {
                [classes.blockedIcon]: notificationObject.type === SCNotificationTypologyType.BLOCKED_USER
              })
            }}>
            <Icon>outlined_flag</Icon>
          </Avatar>
        }
        primary={
          <>
            {notificationObject.type === SCNotificationTypologyType.BLOCKED_USER
              ? intl.formatMessage(messages.accountBlocked, {b: (...chunks) => <strong>{chunks}</strong>})
              : intl.formatMessage(messages.accountReactivated, {b: (...chunks) => <strong>{chunks}</strong>})}
          </>
        }
        secondary={
          template === SCNotificationObjectTemplateType.DETAIL && <DateTimeAgo date={notificationObject.active_at} className={classes.activeAt} />
        }
        footer={
          <>
            {template === SCNotificationObjectTemplateType.TOAST && (
              <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                <DateTimeAgo date={notificationObject.active_at} />
              </Stack>
            )}
          </>
        }
      />
    </Root>
  );
}
