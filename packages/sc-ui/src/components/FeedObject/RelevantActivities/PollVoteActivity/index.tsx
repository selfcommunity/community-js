import React from 'react';
import {styled} from '@mui/material/styles';
import {Avatar, Box, ListItem, ListItemAvatar, ListItemText, Typography} from '@mui/material';
import {Link, SCFeedUnitActivityType, SCNotificationUserFollowType, SCRoutes, SCRoutingContextType, useSCRouting} from '@selfcommunity/core';
import {defineMessages, useIntl} from 'react-intl';
import DateTimeAgo from '../../../../shared/DateTimeAgo';

const messages = defineMessages({
  followUser: {
    id: 'ui.userNotifications.userFollow.followUser',
    defaultMessage: 'ui.userNotifications.userFollow.followUser'
  }
});

const PREFIX = 'SCPollVoteRelevantActivity';

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));

export default function PollVoteRelevantActivity({
  activityObject = null,
  ...props
}: {
  activityObject: SCFeedUnitActivityType;
  [p: string]: any;
}): JSX.Element {
  const scRoutingContext: SCRoutingContextType = useSCRouting();
  const intl = useIntl();

  return (
    <Root {...props}>
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <Link to={scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, {id: activityObject.author.id})}>
            <Avatar alt={activityObject.author.username} variant="circular" src={activityObject.author.avatar} />
          </Link>
        </ListItemAvatar>
        <ListItemText
          primary={
            <Typography component="span" sx={{display: 'inline'}} color="primary">
              <Link to={scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, {id: activityObject.author.id})}>
                {activityObject.author.username}
              </Link>{' '}
              ha votato il poll
            </Typography>
          }
          secondary={<DateTimeAgo date={activityObject.active_at} />}
        />
      </ListItem>
    </Root>
  );
}
