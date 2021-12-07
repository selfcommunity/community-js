import React from 'react';
import {styled} from '@mui/material/styles';
import {Avatar, Box, Grid, ListItem, ListItemAvatar, ListItemText, Typography} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import {SCNotificationUserFollowType} from '@selfcommunity/core';
import {defineMessages, useIntl} from 'react-intl';
import DateTimeAgo from '../../../../shared/DateTimeAgo';

const messages = defineMessages({
  followUser: {
    id: 'ui.userNotifications.userFollow.followUser',
    defaultMessage: 'ui.userNotifications.userFollow.followUser'
  }
});

const PREFIX = 'SCUserFollowNotification';

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  '& .MuiSvgIcon-root': {
    width: '0.7em',
    marginBottom: '0.5px'
  }
}));

export default function UserFollowNotification({
  notificationObject = null,
  ...props
}: {
  notificationObject: SCNotificationUserFollowType;
}): JSX.Element {
  const intl = useIntl();
  return (
    <Root {...props}>
      <ListItem button={true} alignItems="flex-start">
        <ListItemAvatar>
          <Avatar alt={notificationObject.follower.username} variant="circular" src={notificationObject.follower.avatar} />
        </ListItemAvatar>
        <ListItemText
          primary={
            <Typography component="span" sx={{display: 'inline'}} color="primary">
              {intl.formatMessage(messages.followUser, {username: notificationObject.follower.username, b: (...chunks) => <strong>{chunks}</strong>})}
            </Typography>
          }
          secondary={
            <React.Fragment>
              <Box component="span" sx={{display: 'flex', justifyContent: 'flex-start', p: '2px'}}>
                <Grid component="span" item={true} sm="auto" container direction="row" alignItems="center">
                  <AccessTimeIcon sx={{paddingRight: '2px'}} />
                  <DateTimeAgo date={notificationObject.active_at} />
                </Grid>
              </Box>
            </React.Fragment>
          }
        />
      </ListItem>
    </Root>
  );
}
