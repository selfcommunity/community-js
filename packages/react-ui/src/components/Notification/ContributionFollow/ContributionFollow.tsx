import React, {useState} from 'react';
import {styled} from '@mui/material/styles';
import {Avatar, Stack, Typography} from '@mui/material';
import {SCNotificationVoteUpType} from '@selfcommunity/types';
import {Link, SCRoutes, SCRoutingContextType, useSCRouting} from '@selfcommunity/react-core';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import DateTimeAgo from '../../../shared/DateTimeAgo';
import classNames from 'classnames';
import {SCNotificationObjectTemplateType} from '../../../types';
import {getContributionSnippet, getContributionType, getRouteData} from '../../../utils/contribution';
import NotificationItem, {NotificationItemProps} from '../../../shared/NotificationItem';
import UserDeletedSnackBar from '../../../shared/UserDeletedSnackBar';
import UserAvatar from '../../../shared/UserAvatar';
import {PREFIX} from '../constants';

const messages = defineMessages({
  contributionFollow: {
    id: 'ui.notification.contributionFollow.follow',
    defaultMessage: 'ui.notification.contributionFollow.follow'
  }
});

const classes = {
  root: `${PREFIX}-contribution-follow-root`,
  avatar: `${PREFIX}-avatar`,
  username: `${PREFIX}-username`,
  followText: `${PREFIX}-follow-text`,
  activeAt: `${PREFIX}-active-at`,
  contributionText: `${PREFIX}-contribution-text`
};

const Root = styled(NotificationItem, {
  name: PREFIX,
  slot: 'ContributionFollowRoot'
})(() => ({}));

export interface ContributionFollowProps
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
  notificationObject: SCNotificationVoteUpType;
}

/**
 * This component render the content of the notification of type follow (contribution)
 * @constructor
 * @param props
 */
export default function ContributionFollowNotification(props: ContributionFollowProps): JSX.Element {
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

  // CONST
  const contributionType = getContributionType(notificationObject);

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
            {...(!notificationObject.user.deleted && {to: scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, notificationObject.user)})}
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
          <Typography component="span" color="inherit" className={classes.followText}>
            <Link
              {...(!notificationObject.user.deleted && {to: scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, notificationObject.user)})}
              onClick={notificationObject.user.deleted ? () => setOpenAlert(true) : null}
              className={classes.username}>
              {notificationObject.user.username}
            </Link>{' '}
            {intl.formatMessage(messages.contributionFollow, {
              b: (...chunks) => <strong>{chunks}</strong>
            })}
          </Typography>
        }
        secondary={
          <React.Fragment>
            {template === SCNotificationObjectTemplateType.SNIPPET && (
              <>
                <Link
                  to={scRoutingContext.url(
                    SCRoutes[`${notificationObject[contributionType]['type'].toUpperCase()}_ROUTE_NAME`],
                    getRouteData(notificationObject[contributionType])
                  )}>
                  <Typography variant="body2" className={classes.contributionText}>
                    {getContributionSnippet(notificationObject[contributionType])}
                  </Typography>
                </Link>
              </>
            )}
            {(template === SCNotificationObjectTemplateType.DETAIL || template === SCNotificationObjectTemplateType.SNIPPET) && (
              <div>
                <DateTimeAgo date={notificationObject.active_at} className={classes.activeAt} />
              </div>
            )}
          </React.Fragment>
        }
        footer={
          template === SCNotificationObjectTemplateType.TOAST && (
            <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
              <DateTimeAgo date={notificationObject.active_at} />
              <Typography color="primary" component={'div'}>
                <Link
                  to={scRoutingContext.url(
                    SCRoutes[`${notificationObject[contributionType]['type'].toUpperCase()}_ROUTE_NAME`],
                    getRouteData(notificationObject[contributionType])
                  )}>
                  <FormattedMessage id="ui.userToastNotifications.viewContribution" defaultMessage={'ui.userToastNotifications.viewContribution'} />
                </Link>
              </Typography>
            </Stack>
          )
        }
        {...rest}
      />
      {openAlert && <UserDeletedSnackBar open={openAlert} handleClose={() => setOpenAlert(false)} />}
    </>
  );
}
