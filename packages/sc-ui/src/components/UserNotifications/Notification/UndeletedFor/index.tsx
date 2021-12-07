import React from 'react';
import {styled} from '@mui/material/styles';
import {Avatar, Box, Grid, ListItem, ListItemAvatar, ListItemText, Typography} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TimeAgo from 'timeago-react';
import EmojiFlagsIcon from '@mui/icons-material/EmojiFlags';
import {green} from '@mui/material/colors';
import {SCNotificationUnDeletedForType} from '@selfcommunity/core';

const PREFIX = 'SCUndeletedForNotification';

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

export default function UndeletedForNotification({
  notificationObject = null,
  ...props
}: {
  notificationObject: SCNotificationUnDeletedForType;
}): JSX.Element {
  return (
    <Root {...props}>
      <ListItem button={true} alignItems="flex-start">
        <ListItemAvatar>
          <Avatar variant="circular" sx={{bgcolor: green[500]}}>
            <EmojiFlagsIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={
            <Typography component="span" sx={{display: 'inline'}} color="primary">
              <b>Un tuo contenuto, precedentemente rimosso, è stato ripristinato</b>
            </Typography>
          }
        />
      </ListItem>
      <Typography variant={'body2'} color={'primary'}>
        Hai scritto: {notificationObject.post.summary}
      </Typography>
      <Box component="span" sx={{display: 'flex', justifyContent: 'flex-start', p: '2px'}}>
        <Grid component="span" item={true} sm="auto" container direction="row" alignItems="center">
          <AccessTimeIcon sx={{paddingRight: '2px'}} />
          <TimeAgo datetime={notificationObject.active_at} />
        </Grid>
      </Box>
    </Root>
  );
}
