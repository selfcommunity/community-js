import React from 'react';
import {styled} from '@mui/material/styles';
import {Avatar, Box, Grid, ListItem, ListItemAvatar, ListItemText, Typography} from '@mui/material';
import { Link, SCNotificationVoteUpType, SCRoutes, SCRoutingContextType, useSCRouting } from '@selfcommunity/core';
import {defineMessages, useIntl} from 'react-intl';
import DateTimeAgo from '../../../../shared/DateTimeAgo';
import {grey} from '@mui/material/colors';

const messages = defineMessages({
  appreciated: {
    id: 'ui.userNotifications.voteUp.appreciated',
    defaultMessage: 'ui.userNotifications.voteUp.appreciated'
  }
});

const PREFIX = 'SCVoteUpNotification';

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));

export default function VoteUpNotification({notificationObject = null, ...props}: {notificationObject: SCNotificationVoteUpType}): JSX.Element {
  const scRoutingContext: SCRoutingContextType = useSCRouting();
  const intl = useIntl();
  return (
    <Root {...props}>
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <Link to={scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, {id: notificationObject.user.id})}>
            <Avatar alt={notificationObject.user.username} variant="circular" src={notificationObject.user.avatar} />
          </Link>
        </ListItemAvatar>
        <ListItemText
          primary={
            <Typography component="span" sx={{display: 'inline'}} color="primary">
              <Link to={scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, {id: notificationObject.user.id})}>{notificationObject.user.username}</Link>{' '}
              {intl.formatMessage(messages.appreciated, {
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
