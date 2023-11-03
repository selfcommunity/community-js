import React from 'react';
import {styled} from '@mui/material/styles';
import {Avatar, Stack, Typography} from '@mui/material';
import Icon from '@mui/material/Icon';
import {SCNotificationBlockedUserType, SCNotificationTypologyType} from '@selfcommunity/types';
import {defineMessages, useIntl} from 'react-intl';
import DateTimeAgo from '../../../shared/DateTimeAgo';
import classNames from 'classnames';
import {SCNotificationObjectTemplateType} from '../../../types';
import {useThemeProps} from '@mui/system';
import NotificationItem, {NotificationItemProps} from '../../../shared/NotificationItem';
import {PREFIX} from '../constants';

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

const classes = {
  root: `${PREFIX}-user-blocked-root`,
  unBlockedIcon: `${PREFIX}-unblocked-icon`,
  blockedIcon: `${PREFIX}-blocked-icon`,
  blockedText: `${PREFIX}-blocked-text`,
  activeAt: `${PREFIX}-active-at`
};

const Root = styled(NotificationItem, {
  name: PREFIX,
  slot: 'UserBlockedRoot'
})(() => ({}));

export interface NotificationBlockedProps
  extends Pick<
    NotificationItemProps,
    Exclude<
      keyof NotificationItemProps,
      'image' | 'disableTypography' | 'primary' | 'primaryTypographyProps' | 'secondary' | 'secondaryTypographyProps' | 'actions' | 'footer' | 'isNew'
    >
  > {
  /**
   * Notification obj
   * @default null
   */
  notificationObject: SCNotificationBlockedUserType;
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
    <Root
      id={id}
      className={classNames(classes.root, className, `${PREFIX}-${template}`)}
      template={template}
      isNew={notificationObject.is_new}
      disableTypography
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
        <Typography component="div" color="inherit" className={classes.blockedText}>
          {notificationObject.type === SCNotificationTypologyType.BLOCKED_USER
            ? intl.formatMessage(messages.accountBlocked, {b: (...chunks) => <strong>{chunks}</strong>})
            : intl.formatMessage(messages.accountReactivated, {b: (...chunks) => <strong>{chunks}</strong>})}
        </Typography>
      }
      secondary={
        (template === SCNotificationObjectTemplateType.DETAIL || template === SCNotificationObjectTemplateType.SNIPPET) && (
          <DateTimeAgo date={notificationObject.active_at} className={classes.activeAt} />
        )
      }
      footer={
        template === SCNotificationObjectTemplateType.TOAST && (
          <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
            <DateTimeAgo date={notificationObject.active_at} />
          </Stack>
        )
      }
      {...rest}
    />
  );
}
