import React from 'react';
import {styled} from '@mui/material/styles';
import {Avatar, Box, Grid, ListItem, ListItemAvatar, ListItemText, Typography} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TimeAgo from 'timeago-react';
import {NotificationTypeConnectionRequest} from '../../../../constants/Notification';

const PREFIX = 'SCUserConnectionNotification';

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

export default function UserConnectionNotification({notificationObject = null, ...props}: {notificationObject: any}): JSX.Element {
  const userConnection =
    notificationObject.type === NotificationTypeConnectionRequest ? notificationObject.request_user : notificationObject.accept_user;
  return (
    <Root {...props}>
      <ListItem button={true} alignItems="flex-start">
        <ListItemAvatar>
          <Avatar alt={userConnection.username} variant="circular" src={userConnection.avatar} />
        </ListItemAvatar>
        <ListItemText
          primary={
            <Typography component="span" sx={{display: 'inline'}} color="primary">
              {userConnection.username}{' '}
              <b>
                {notificationObject.type === NotificationTypeConnectionRequest ? 'ti ha richista la connesssione' : 'ha accettato la tua connessione'}
              </b>
            </Typography>
          }
          secondary={
            <React.Fragment>
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
