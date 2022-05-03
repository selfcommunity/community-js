import React from 'react';
import {styled} from '@mui/material/styles';
import {Avatar, Box, Stack, Typography} from '@mui/material';
import {Link, SCNotificationVoteUpType, SCRoutes, SCRoutingContextType, useSCRouting} from '@selfcommunity/core';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import DateTimeAgo from '../../../shared/DateTimeAgo';
import classNames from 'classnames';
import {SCNotificationObjectTemplateType} from '../../../types';
import {getContributionType, getRouteData} from '../../../utils/contribution';
import useThemeProps from '@mui/material/styles/useThemeProps';
import NotificationItem from '../../../shared/NotificationItem';

const messages = defineMessages({
  contributionFollow: {
    id: 'ui.notification.contributionFollow.follow',
    defaultMessage: 'ui.notification.contributionFollow.follow'
  }
});

const PREFIX = 'SCContributionFollowNotification';

const classes = {
  root: `${PREFIX}-root`,
  avatar: `${PREFIX}-avatar`,
  username: `${PREFIX}-username`,
  followText: `${PREFIX}-follow-text`,
  activeAt: `${PREFIX}-active-at`,
  contributionText: `${PREFIX}-contribution-text`
};

const Root = styled(Box, {
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
  [`& .${classes.followText}`]: {
    color: theme.palette.text.primary
  },
  [`& .${classes.contributionText}`]: {
    '&:hover': {
      textDecoration: 'underline'
    },
    textOverflow: 'ellipsis',
    display: 'inline',
    overflow: 'hidden'
  },
  '& .MuiIcon-root': {
    fontSize: '18px',
    marginBottom: '0.5px'
  }
}));

export interface ContributionFollowProps {
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
  notificationObject: SCNotificationVoteUpType;

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
 * This component render the content of the notification of type follow (contribution)
 * @param inProps
 * @constructor
 */
export default function ContributionFollowNotification(inProps: ContributionFollowProps): JSX.Element {
  // PROPS
  const props: ContributionFollowProps = useThemeProps({
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

  // CONST
  const contributionType = getContributionType(notificationObject);

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
        disableTypography
        image={
          <Link to={scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, notificationObject.user)}>
            <Avatar alt={notificationObject.user.username} variant="circular" src={notificationObject.user.avatar} classes={{root: classes.avatar}} />
          </Link>
        }
        primary={
          <Typography component="div" color="inherit" className={classes.followText}>
            <Link to={scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, notificationObject.user)} className={classes.username}>
              {notificationObject.user.username}
            </Link>{' '}
            {intl.formatMessage(messages.contributionFollow, {
              username: notificationObject.user.username,
              b: (...chunks) => <strong>{chunks}</strong>
            })}
          </Typography>
        }
        secondary={
          template === SCNotificationObjectTemplateType.DETAIL && <DateTimeAgo date={notificationObject.active_at} className={classes.activeAt} />
        }
        footer={
          <>
            {template === SCNotificationObjectTemplateType.TOAST && (
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
            )}
          </>
        }
      />
    </Root>
  );
}
