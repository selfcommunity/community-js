import React, {useState} from 'react';
import {styled} from '@mui/material/styles';
import {Avatar, Box, Stack, Typography} from '@mui/material';
import {Link, SCRoutes, SCRoutingContextType, useSCRouting} from '@selfcommunity/react-core';
import {SCNotificationUserFollowType} from '@selfcommunity/types';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import DateTimeAgo from '../../../shared/DateTimeAgo';
import classNames from 'classnames';
import {SCNotificationObjectTemplateType} from '../../../types';
import {useThemeProps} from '@mui/system';
import NotificationItem, {NotificationItemProps} from '../../../shared/NotificationItem';
import UserDeletedSnackBar from '../../../shared/UserDeletedSnackBar';

const messages = defineMessages({
  followUser: {
    id: 'ui.notification.userFollow.followUser',
    defaultMessage: 'ui.notification.userFollow.followUser'
  }
});

const PREFIX = 'SCUserFollowNotification';

const classes = {
  root: `${PREFIX}-root`,
  avatar: `${PREFIX}-avatar`,
  username: `${PREFIX}-username`,
  followText: `${PREFIX}-follow-text`,
  activeAt: `${PREFIX}-active-at`
};

const Root = styled(NotificationItem, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  width: '100%',
  [`& .${classes.username}`]: {
    fontWeight: 700,
    '&:hover': {
      textDecoration: 'underline'
    }
  },
  [`& .${classes.followText}`]: {
    color: theme.palette.text.primary
  }
}));

export interface NotificationFollowProps
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
  notificationObject: SCNotificationUserFollowType;
}

/**
 * This component render the content of the notification of type user follow
 * @param inProps
 * @constructor
 */
export default function UserFollowNotification(inProps: NotificationFollowProps): JSX.Element {
  // PROPS
  const props: NotificationFollowProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {
    notificationObject,
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
            {...(!notificationObject.follower.deleted && {to: scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, notificationObject.follower)})}
            onClick={notificationObject.follower.deleted ? () => setOpenAlert(true) : null}>
            <Avatar
              alt={notificationObject.follower.username}
              variant="circular"
              src={notificationObject.follower.avatar}
              classes={{root: classes.avatar}}
            />
          </Link>
        }
        primary={
          <Typography component="div" color="inherit" className={classes.followText}>
            <Link
              {...(!notificationObject.follower.deleted && {to: scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, notificationObject.follower)})}
              onClick={notificationObject.follower.deleted ? () => setOpenAlert(true) : null}
              className={classes.username}>
              {notificationObject.follower.username}
            </Link>{' '}
            {intl.formatMessage(messages.followUser, {b: (...chunks) => <strong>{chunks}</strong>})}
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
                  {...(!notificationObject.follower.deleted && {
                    to: scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, notificationObject.follower)
                  })}
                  onClick={notificationObject.follower.deleted ? () => setOpenAlert(true) : null}>
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
