import React from 'react';
import {styled} from '@mui/material/styles';
import {Avatar, Box, Grid, ListItem, ListItemAvatar, ListItemText, Typography} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TimeAgo from 'timeago-react';
import {SCNotificationCommentType} from '@selfcommunity/core';

const PREFIX = 'SCUserNotificationComment';

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

export default function UserNotificationComment({notificationObject = null, ...props}: {notificationObject: SCNotificationCommentType}): JSX.Element {
  return (
    <Root {...props}>
      <ListItem button={true} alignItems="flex-start">
        <ListItemAvatar>
          <Avatar alt={notificationObject.comment.author.username} variant="circular" src={notificationObject.comment.author.avatar} />
        </ListItemAvatar>
        <ListItemText
          primary={
            <Typography component="span" sx={{display: 'inline'}} color="primary">
              {notificationObject.comment.author.username} <b>ha commentanto il tuo post: </b>
            </Typography>
          }
          secondary={
            <React.Fragment>
              {notificationObject.comment.summary}
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
