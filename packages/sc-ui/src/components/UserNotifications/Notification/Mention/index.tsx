import React from 'react';
import {styled} from '@mui/material/styles';
import {Avatar, Box, Grid, ListItem, ListItemAvatar, ListItemText, Typography} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TimeAgo from 'timeago-react';
import {SCFeedObjectTypologyType, SCNotificationMentionType} from '@selfcommunity/core';
import {defineMessages, useIntl} from 'react-intl';

const messages = defineMessages({
  quotedYouOn: {
    id: 'ui.userNotifications.mention.quotedYou',
    defaultMessage: 'ui.userNotifications.mention.quotedYou'
  }
});

const PREFIX = 'SCUserNotificationMention';

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

export default function UserNotificationMention({notificationObject = null, ...props}: {notificationObject: SCNotificationMentionType}): JSX.Element {
  const intl = useIntl();
  const objectType = notificationObject.discussion
    ? SCFeedObjectTypologyType.DISCUSSION
    : notificationObject.post
    ? SCFeedObjectTypologyType.POST
    : notificationObject.status
    ? SCFeedObjectTypologyType.STATUS
    : 'comment';
  return (
    <Root {...props}>
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <Avatar alt={notificationObject[objectType].author.username} variant="circular" src={notificationObject[objectType].author.avatar} />
        </ListItemAvatar>
        <ListItemText
          primary={
            <Typography component="span" sx={{display: 'inline'}} color="primary">
              {intl.formatMessage(messages.quotedYouOn, {
                username: notificationObject[objectType].author.username,
                b: (...chunks) => <strong>{chunks}</strong>
              })}
            </Typography>
          }
          secondary={
            <React.Fragment>
              <Typography
                component={'span'}
                variant="body2"
                gutterBottom
                dangerouslySetInnerHTML={{__html: notificationObject[objectType].summary}}
              />
              <Box component="span" sx={{display: 'flex', justifyContent: 'flex-start', p: '2px'}}>
                <Grid component="span" item={true} sm="auto" container direction="row" alignItems="center">
                  <AccessTimeIcon sx={{paddingRight: '2px'}} />
                  <TimeAgo datetime={notificationObject.active_at} />
                </Grid>
              </Box>
            </React.Fragment>
          }
        />
      </ListItem>
    </Root>
  );
}
