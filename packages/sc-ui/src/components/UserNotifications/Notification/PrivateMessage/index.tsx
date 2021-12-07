import React from 'react';
import {styled} from '@mui/material/styles';
import {Avatar, Box, Button, ListItem, ListItemText, Typography} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TimeAgo from 'timeago-react';
import ReplyIcon from '@mui/icons-material/Reply';
import {SCNotificationPrivateMessageType} from '@selfcommunity/core';
import {grey} from '@mui/material/colors';

const PREFIX = 'SCUserNotificationPrivateMessage';

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  '& .MuiSvgIcon-root': {
    width: '0.7em',
    marginBottom: '0.5px',
    float: 'left'
  },
  '& .MuiListItemText-root': {
    color: grey[600]
  },
  '& .MuiListItemSecondaryAction-root': {
    color: grey[600],
    fontSize: '13px'
  },
  '& .MuiButton-root': {
    paddingTop: 1,
    paddingBottom: 1
  }
}));

export default function UserNotificationPrivateMessage({
  notificationObject = null,
  ...props
}: {
  notificationObject: SCNotificationPrivateMessageType;
}): JSX.Element {
  return (
    <Root {...props}>
      <ListItem
        button={true}
        secondaryAction={
          <Box>
            <AccessTimeIcon sx={{paddingRight: '2px'}} />
            <TimeAgo datetime={notificationObject.active_at} />
            <Button variant="outlined" size="small" endIcon={<ReplyIcon />} sx={{marginLeft: '5px'}}>
              Reply
            </Button>
          </Box>
        }>
        <ListItemText primary={<Typography variant="body2" gutterBottom dangerouslySetInnerHTML={{__html: notificationObject.message.html}} />} />
      </ListItem>
    </Root>
  );
}
