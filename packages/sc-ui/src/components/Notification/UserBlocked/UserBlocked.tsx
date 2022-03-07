import React from 'react';
import {styled} from '@mui/material/styles';
import {Avatar, Box, ListItem, ListItemAvatar, ListItemText, Stack, Typography} from '@mui/material';
import {green, grey, red} from '@mui/material/colors';
import Icon from '@mui/material/Icon';
import {SCNotificationBlockedUserType, SCNotificationTypologyType} from '@selfcommunity/core';
import {defineMessages, useIntl} from 'react-intl';
import DateTimeAgo from '../../../shared/DateTimeAgo';
import NewChip from '../../../shared/NewChip/NewChip';
import classNames from 'classnames';
import {NotificationObjectTemplateType} from '../../../types';

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
  listItemSnippet: `${PREFIX}-list-item-snippet`,
  listItemSnippetNew: `${PREFIX}-list-item-snippet-new`,
  blockedIconWrap: `${PREFIX}-flag-icon-wrap`,
  unBlockedIcon: `${PREFIX}-unblocked-icon`,
  blockedIcon: `${PREFIX}-blocked-icon`,
  blockedIconSnippet: `${PREFIX}-blocked-icon-snippet`,
  blockedText: `${PREFIX}-blocked-text`,
  activeAt: `${PREFIX}-active-at`,
  toastInfo: `${PREFIX}-toast-info`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  [`& .${classes.listItemSnippet}`]: {
    alignItems: 'center',
    padding: '0px 5px'
  },
  [`& .${classes.listItemSnippetNew}`]: {
    borderLeft: '2px solid red'
  },
  [`& .${classes.blockedIconWrap}`]: {
    minWidth: 'auto',
    paddingRight: 10
  },
  [`& .${classes.unBlockedIcon}`]: {
    backgroundColor: green[500],
    color: '#FFF'
  },
  [`& .${classes.blockedIcon}`]: {
    backgroundColor: red[500],
    color: '#FFF'
  },
  [`& .${classes.blockedIconSnippet}`]: {
    width: 30,
    height: 30
  },
  [`& .${classes.blockedText}`]: {
    display: 'inline',
    color: theme.palette.text.primary
  },
  [`& .${classes.toastInfo}`]: {
    marginTop: 10
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
   * @default 'preview'
   */
  template?: NotificationObjectTemplateType;

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
  const {
    notificationObject = null,
    id = `n_${props.notificationObject['sid']}`,
    template = NotificationObjectTemplateType.DETAIL,
    className,
    ...rest
  } = props;

  // INTL
  const intl = useIntl();

  // CONST
  const isSnippetTemplate = template === NotificationObjectTemplateType.SNIPPET;
  const isToastTemplate = template === NotificationObjectTemplateType.TOAST;

  /**
   * Renders root object
   */
  return (
    <Root id={id} className={classNames(classes.root, className, `${PREFIX}-${template}`)} {...rest}>
      <ListItem
        alignItems={isSnippetTemplate ? 'center' : 'flex-start'}
        component={'div'}
        classes={{
          root: classNames({
            [classes.listItemSnippet]: isToastTemplate || isSnippetTemplate,
            [classes.listItemSnippetNew]: isSnippetTemplate && notificationObject.is_new
          })
        }}>
        <ListItemAvatar classes={{root: classes.blockedIconWrap}}>
          <Avatar
            variant="circular"
            classes={{
              root: classNames(classes.unBlockedIcon, {
                [classes.blockedIcon]: notificationObject.type === SCNotificationTypologyType.BLOCKED_USER,
                [classes.blockedIconSnippet]: isSnippetTemplate
              })
            }}>
            <Icon>outlined_flag</Icon>
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          disableTypography={true}
          primary={
            <>
              {template === NotificationObjectTemplateType.DETAIL && notificationObject.is_new && <NewChip />}
              <Typography component="div" color="inherit" className={classes.blockedText}>
                {notificationObject.type === SCNotificationTypologyType.BLOCKED_USER
                  ? intl.formatMessage(messages.accountBlocked, {b: (...chunks) => <strong>{chunks}</strong>})
                  : intl.formatMessage(messages.accountReactivated, {b: (...chunks) => <strong>{chunks}</strong>})}
              </Typography>
            </>
          }
          secondary={
            <>
              {template === NotificationObjectTemplateType.DETAIL && <DateTimeAgo date={notificationObject.active_at} className={classes.activeAt} />}
            </>
          }
        />
      </ListItem>
      {template === NotificationObjectTemplateType.TOAST && (
        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2} className={classes.toastInfo}>
          <DateTimeAgo date={notificationObject.active_at} />
        </Stack>
      )}
    </Root>
  );
}
