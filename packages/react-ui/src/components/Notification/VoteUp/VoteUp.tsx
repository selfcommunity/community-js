import React, {useState} from 'react';
import {styled} from '@mui/material/styles';
import {AutocompleteProps, Avatar, Box, Stack, Typography} from '@mui/material';
import {Link, SCRoutes, SCRoutingContextType, useSCRouting} from '@selfcommunity/react-core';
import {SCNotificationVoteUpType} from '@selfcommunity/types';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import DateTimeAgo from '../../../shared/DateTimeAgo';
import {getContribution, getContributionType, getContributionSnippet, getRouteData, getContributionRouteName} from '../../../utils/contribution';
import classNames from 'classnames';
import {SCNotificationObjectTemplateType} from '../../../types/notification';
import {useThemeProps} from '@mui/system';
import NotificationItem, {NotificationItemProps} from '../../../shared/NotificationItem';
import UserDeletedSnackBar from '../../../shared/UserDeletedSnackBar';

const messages = defineMessages({
  appreciated: {
    id: 'ui.notification.voteUp.appreciated',
    defaultMessage: 'ui.notification.voteUp.appreciated'
  }
});

const PREFIX = 'SCVoteUpNotification';

const classes = {
  root: `${PREFIX}-root`,
  avatar: `${PREFIX}-avatar`,
  username: `${PREFIX}-username`,
  voteUpText: `${PREFIX}-vote-up-text`,
  activeAt: `${PREFIX}-active-at`,
  contributionText: `${PREFIX}-contribution-text`
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
  [`& .${classes.voteUpText}`]: {
    color: theme.palette.text.primary
  },
  [`& .${classes.contributionText}`]: {
    '&:hover': {
      textDecoration: 'underline'
    }
  }
}));

export interface NotificationVoteUpProps
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
 * This component render the content of the notification of type vote up
 * @param inProps
 * @constructor
 */
export default function VoteUpNotification(inProps: NotificationVoteUpProps): JSX.Element {
  // PROPS
  const props: NotificationVoteUpProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {
    notificationObject,
    id = `n_${props.notificationObject['sid']}`,
    className,
    template = SCNotificationObjectTemplateType.DETAIL,
    index,
    onVote,
    loadingVote,
    ...rest
  } = props;

  // CONTEXT
  const scRoutingContext: SCRoutingContextType = useSCRouting();

  // CONST
  const contribution = getContribution(notificationObject);
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
            <Avatar alt={notificationObject.user.username} variant="circular" src={notificationObject.user.avatar} classes={{root: classes.avatar}} />
          </Link>
        }
        primary={
          <>
            <Link
              {...(!notificationObject.user.deleted && {to: scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, notificationObject.user)})}
              onClick={notificationObject.user.deleted ? () => setOpenAlert(true) : null}
              className={classes.username}>
              {notificationObject.user.username}
            </Link>{' '}
            {intl.formatMessage(messages.appreciated, {
              username: notificationObject.user.username,
              b: (...chunks) => <strong>{chunks}</strong>
            })}
          </>
        }
        secondary={
          <>
            <Link
              to={scRoutingContext.url(SCRoutes[`${contributionType.toUpperCase()}_ROUTE_NAME`], getRouteData(notificationObject[contributionType]))}>
              <Typography variant="body2" className={classes.contributionText} component={'div'}>
                {getContributionSnippet(notificationObject[contributionType])}
              </Typography>
            </Link>
            {(template === SCNotificationObjectTemplateType.DETAIL || template === SCNotificationObjectTemplateType.SNIPPET) && (
              <DateTimeAgo date={notificationObject.active_at} className={classes.activeAt} />
            )}
          </>
        }
        footer={
          template === SCNotificationObjectTemplateType.TOAST && (
            <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
              <DateTimeAgo date={notificationObject.active_at} />
              <Typography color="primary" component={'div'}>
                <Link to={scRoutingContext.url(getContributionRouteName(contribution), getRouteData(contribution))}>
                  <FormattedMessage id="ui.userToastNotifications.viewContribution" defaultMessage={'ui.userToastNotifications.viewContribution'} />
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
