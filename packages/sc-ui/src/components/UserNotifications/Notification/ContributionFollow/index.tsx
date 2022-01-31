import React from 'react';
import {styled} from '@mui/material/styles';
import {Avatar, Box, Grid, ListItem, ListItemAvatar, ListItemText, Typography} from '@mui/material';
import {Link, SCNotificationVoteUpType, SCRoutes, SCRoutingContextType, useSCRouting} from '@selfcommunity/core';
import {defineMessages, useIntl} from 'react-intl';
import DateTimeAgo from '../../../../shared/DateTimeAgo';
import NotificationNewChip from '../../NotificationNewChip';

const messages = defineMessages({
  contributionFollow: {
    id: 'ui.userNotifications.contributionFollow.follow',
    defaultMessage: 'ui.userNotifications.contributionFollow.follow'
  }
});

const PREFIX = 'SCContributionFollowNotification';

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));

export interface ContributionFollowProps {
  /**
   * Notification obj
   * @default null
   */
  notificationObject: SCNotificationVoteUpType;
  /**
   * Any other properties
   */
  [p: string]: any;
}

export default function ContributionFollowNotification(props: ContributionFollowProps): JSX.Element {
  // PROPS
  const {notificationObject = null, ...rest} = props;

  // CONTEXT
  const scRoutingContext: SCRoutingContextType = useSCRouting();

  // INTL
  const intl = useIntl();

  /**
   * Renders root object
   */
  return (
    <Root {...rest}>
      <ListItem alignItems="flex-start" component={'div'}>
        <ListItemAvatar>
          <Link to={scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, {id: notificationObject.user.id})}>
            <Avatar alt={notificationObject.user.username} variant="circular" src={notificationObject.user.avatar} />
          </Link>
        </ListItemAvatar>
        <ListItemText
          disableTypography={true}
          primary={
            <Typography component="div" sx={{display: 'inline'}} color="primary">
              {notificationObject.is_new && <NotificationNewChip />}
              <Link to={scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, {id: notificationObject.user.id})}>
                {notificationObject.user.username}
              </Link>{' '}
              {intl.formatMessage(messages.contributionFollow, {
                username: notificationObject.user.username,
                b: (...chunks) => <strong>{chunks}</strong>
              })}
            </Typography>
          }
          secondary={<DateTimeAgo date={notificationObject.active_at} />}
        />
      </ListItem>
    </Root>
  );
}
