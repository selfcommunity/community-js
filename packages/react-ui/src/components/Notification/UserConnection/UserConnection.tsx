import React, {useState} from 'react';
import {styled} from '@mui/material/styles';
import {Avatar, Box, Stack, Typography} from '@mui/material';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import DateTimeAgo from '../../../shared/DateTimeAgo';
import {SCNotificationConnectionAcceptType, SCNotificationConnectionRequestType, SCNotificationTypologyType} from '@selfcommunity/types';
import {Link, SCRoutes, SCRoutingContextType, useSCRouting} from '@selfcommunity/react-core';
import classNames from 'classnames';
import {SCNotificationObjectTemplateType} from '../../../types';
import {useThemeProps} from '@mui/system';
import NotificationItem, {NotificationItemProps} from '../../../shared/NotificationItem';
import UserDeletedSnackBar from '../../../shared/UserDeletedSnackBar';

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

const PREFIX = 'SCUserConnectionNotification';

const classes = {
  root: `${PREFIX}-root`,
  avatar: `${PREFIX}-avatar`,
  username: `${PREFIX}-username`,
  connectionText: `${PREFIX}-connection-text`,
  activeAt: `${PREFIX}-active-at`
};

const Root = styled(NotificationItem, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  [`& .${classes.username}`]: {
    fontWeight: 700,
    '&:hover': {
      textDecoration: 'underline'
    }
  },
  [`& .${classes.connectionText}`]: {
    color: theme.palette.text.primary
  }
}));

export interface NotificationConnectionProps
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
  notificationObject: SCNotificationConnectionRequestType | SCNotificationConnectionAcceptType;
}

/**
 * This component render the content of the notification of connection accept/request
 * @param inProps
 * @constructor
 */
export default function UserConnectionNotification(inProps: NotificationConnectionProps): JSX.Element {
  // PROPS
  const props: NotificationConnectionProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {
    notificationObject = null,
    id = `n_${props.notificationObject['sid']}`,
    className,
    template = SCNotificationObjectTemplateType.DETAIL,
    ...rest
  } = props;

  // CONTEXT
  const scRoutingContext: SCRoutingContextType = useSCRouting();

  // STATE
  const [openAlert, setOpenAlert] = useState<boolean>(false);

  // INTL
  const intl = useIntl();

  // CONST
  const userConnection =
    notificationObject.type === SCNotificationTypologyType.CONNECTION_REQUEST ? notificationObject.request_user : notificationObject.accept_user;

  /**
   * Renders root object
   */
  return (
    <>
      <Root
        id={id}
        className={classNames(classes.root, className, `${PREFIX}-${template}`)}
        template={template}
        isNew={notificationObject.is_new}
        disableTypography
        image={
          <Link
            {...(!userConnection.deleted && {to: scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, userConnection)})}
            onClick={userConnection.deleted ? () => setOpenAlert(true) : null}>
            <Avatar alt={userConnection.username} variant="circular" src={userConnection.avatar} classes={{root: classes.avatar}} />
          </Link>
        }
        primary={
          <Typography component="div" color="inherit" className={classes.connectionText}>
            <Link
              {...(!userConnection.deleted && {to: scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, userConnection)})}
              onClick={userConnection.deleted ? () => setOpenAlert(true) : null}
              className={classes.username}>
              {userConnection.username}
            </Link>{' '}
            {notificationObject.type === SCNotificationTypologyType.CONNECTION_REQUEST
              ? intl.formatMessage(messages.requestConnection, {b: (...chunks) => <strong>{chunks}</strong>})
              : intl.formatMessage(messages.acceptConnection, {b: (...chunks) => <strong>{chunks}</strong>})}
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
              <Typography color="primary" component={'div'}>
                <Link
                  {...(!userConnection.deleted && {to: scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, userConnection)})}
                  onClick={userConnection.deleted ? () => setOpenAlert(true) : null}>
                  <FormattedMessage id="ui.userToastNotifications.goToProfile" defaultMessage={'ui.userToastNotifications.goToProfile'} />
                </Link>
              </Typography>
            </Stack>
          )
        }
        {...rest}
      />
      <UserDeletedSnackBar open={openAlert} handleClose={() => setOpenAlert(false)} />
    </>
  );
}
