import {useContext, useEffect, useState} from 'react';
import {Avatar, Box, Button, Stack, Typography, styled} from '@mui/material';
import {
  Link,
  SCRoutes,
  SCRoutingContextType,
  SCSubscribedGroupsManagerType,
  SCUserContext,
  SCUserContextType,
  useSCRouting
} from '@selfcommunity/react-core';
import {SCGroupSubscriptionStatusType, SCGroupType, SCNotificationGroupActivityType, SCNotificationTypologyType} from '@selfcommunity/types';
import {FormattedMessage} from 'react-intl';
import DateTimeAgo from '../../../shared/DateTimeAgo';
import classNames from 'classnames';
import {SCNotificationObjectTemplateType} from '../../../types';
import NotificationItem, {NotificationItemProps} from '../../../shared/NotificationItem';
import UserDeletedSnackBar from '../../../shared/UserDeletedSnackBar';
import UserAvatar from '../../../shared/UserAvatar';
import {PREFIX} from '../constants';

const classes = {
  root: `${PREFIX}-group-root`,
  avatar: `${PREFIX}-avatar`,
  actions: `${PREFIX}-actions`,
  acceptButton: `${PREFIX}-reply-button`,
  activeAt: `${PREFIX}-active-at`,
  username: `${PREFIX}-username`
};

const Root = styled(NotificationItem, {
  name: PREFIX,
  slot: 'GroupRoot'
})(() => ({}));

export interface NotificationGroupProps
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
  notificationObject: SCNotificationGroupActivityType;
}

/**
 * This component render the content of the notification of type group
 * @constructor
 * @param props
 */
export default function GroupNotification(props: NotificationGroupProps): JSX.Element {
  // PROPS
  const {
    notificationObject,
    id = `n_${props.notificationObject['sid']}`,
    className,
    template = SCNotificationObjectTemplateType.DETAIL,
    ...rest
  } = props;

  // CONTEXT
  const scRoutingContext: SCRoutingContextType = useSCRouting();
  const scUserContext: SCUserContextType = useContext(SCUserContext);
  const manager: SCSubscribedGroupsManagerType = scUserContext.managers.groups;

  // STATE
  const [status, setStatus] = useState<string>(null);
  const [openAlert, setOpenAlert] = useState<boolean>(false);

  // CONST
  const isSnippetTemplate = template === SCNotificationObjectTemplateType.SNIPPET;
  const isToastTemplate = template === SCNotificationObjectTemplateType.TOAST;

  useEffect(() => {
    setStatus(manager.subscriptionStatus(notificationObject.group as SCGroupType));
  }, [manager.subscriptionStatus, notificationObject.group]);

  // RENDER
  if (isSnippetTemplate || isToastTemplate) {
    return (
      <Root
        id={id}
        className={classNames(classes.root, className, `${PREFIX}-${template}`)}
        template={template}
        isNew={notificationObject.is_new}
        disableTypography
        image={
          <Link
            {...(!notificationObject.user.deleted && {
              to: scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, notificationObject.user)
            })}
            onClick={notificationObject.user.deleted ? () => setOpenAlert(true) : null}>
            <UserAvatar hide={!notificationObject.user.community_badge} smaller={true}>
              <Avatar
                alt={notificationObject.user.username}
                variant="circular"
                src={notificationObject.user.avatar}
                classes={{root: classes.avatar}}
              />
            </UserAvatar>
          </Link>
        }
        primary={
          <Box>
            <Link
              {...(!notificationObject.user.deleted && {
                to: scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, notificationObject.user)
              })}
              onClick={notificationObject.user.deleted ? () => setOpenAlert(true) : null}
              className={classes.username}>
              {notificationObject.user.username}
            </Link>{' '}
            <FormattedMessage
              id={`ui.notification.${notificationObject.type}`}
              defaultMessage={`ui.notification.${notificationObject.type}`}
              values={{
                group: notificationObject.group.name,
                link: (chunks) => (
                  <Link
                    key={`ui.notification.${notificationObject.type}.link`}
                    to={
                      notificationObject.type === SCNotificationTypologyType.USER_REQUESTED_TO_JOIN_GROUP ||
                      notificationObject.type === SCNotificationTypologyType.USER_ACCEPTED_TO_JOIN_GROUP
                        ? scRoutingContext.url(SCRoutes.GROUP_MEMBERS_ROUTE_NAME, notificationObject.group)
                        : scRoutingContext.url(SCRoutes.GROUP_ROUTE_NAME, notificationObject.group)
                    }>
                    {chunks}
                  </Link>
                )
              }}
            />
          </Box>
        }
        footer={
          isToastTemplate && (
            <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
              <DateTimeAgo date={notificationObject.active_at} />
              {status && status !== SCGroupSubscriptionStatusType.SUBSCRIBED && (
                <Typography color="primary">
                  <Link
                    to={
                      notificationObject.type === SCNotificationTypologyType.USER_REQUESTED_TO_JOIN_GROUP ||
                      notificationObject.type === SCNotificationTypologyType.USER_ACCEPTED_TO_JOIN_GROUP
                        ? scRoutingContext.url(SCRoutes.GROUP_MEMBERS_ROUTE_NAME, notificationObject.group)
                        : scRoutingContext.url(SCRoutes.GROUP_ROUTE_NAME, notificationObject.group)
                    }>
                    <FormattedMessage id="ui.notification.group.button.see" defaultMessage="ui.notification.group.button.see" />
                  </Link>
                </Typography>
              )}
            </Stack>
          )
        }
        {...rest}
      />
    );
  }
  return (
    <>
      <Root
        id={id}
        className={classNames(classes.root, className, `${PREFIX}-${template}`)}
        template={template}
        isNew={notificationObject.is_new}
        disableTypography
        actions={
          <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
            <DateTimeAgo date={notificationObject.active_at} className={classes.activeAt} />
            {status && status !== SCGroupSubscriptionStatusType.SUBSCRIBED && (
              <Button
                color="primary"
                variant="outlined"
                size="small"
                classes={{root: classes.acceptButton}}
                component={Link}
                loading={scUserContext.user ? status === null || manager.isLoading(notificationObject.group as SCGroupType) : null}
                to={
                  notificationObject.type === SCNotificationTypologyType.USER_REQUESTED_TO_JOIN_GROUP ||
                  notificationObject.type === SCNotificationTypologyType.USER_ACCEPTED_TO_JOIN_GROUP
                    ? scRoutingContext.url(SCRoutes.GROUP_MEMBERS_ROUTE_NAME, notificationObject.group)
                    : scRoutingContext.url(SCRoutes.GROUP_ROUTE_NAME, notificationObject.group)
                }>
                <FormattedMessage id="ui.notification.group.button.see" defaultMessage="ui.notification.group.button.see" />
              </Button>
            )}
          </Stack>
        }
        {...rest}
      />
      {openAlert && <UserDeletedSnackBar open={openAlert} handleClose={() => setOpenAlert(false)} />}
    </>
  );
}
