import React from 'react';
import {styled} from '@mui/material/styles';
import {Avatar, Box, Grid, ListItem, ListItemAvatar, ListItemText, Tooltip, Typography} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TimeAgo from 'timeago-react';
import {SCNotificationCommentType, SCNotificationTypologyType} from '@selfcommunity/core';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import Bullet from '../../../../shared/Bullet';
import {LoadingButton} from '@mui/lab';
import VoteFilledIcon from '@mui/icons-material/ThumbUpTwoTone';
import VoteIcon from '@mui/icons-material/ThumbUpOutlined';

const messages = defineMessages({
  comment: {
    id: 'ui.userNotifications.comment.comment',
    defaultMessage: 'ui.userNotifications.comment.comment'
  },
  nestedComment: {
    id: 'ui.userNotifications.comment.nestedComment',
    defaultMessage: 'ui.userNotifications.comment.nestedComment'
  }
});

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

export default function UserNotificationComment({
  notificationObject = null,
  index = null,
  onVote = null,
  loadingVote = null,
  ...props
}: {
  notificationObject: SCNotificationCommentType;
  key: number;
  onVote: (i, v) => void;
  loadingVote: number;
  [p: string]: any;
}): JSX.Element {
  const intl = useIntl();
  return (
    <Root {...props}>
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <Avatar alt={notificationObject.comment.author.username} variant="circular" src={notificationObject.comment.author.avatar} />
        </ListItemAvatar>
        <ListItemText
          primary={
            <Typography component="span" sx={{display: 'inline'}} color="primary">
              {notificationObject.type === SCNotificationTypologyType.NESTED_COMMENT
                ? intl.formatMessage(messages.comment, {
                    username: notificationObject.comment.author.username,
                    b: (...chunks) => <strong>{chunks}</strong>
                  })
                : intl.formatMessage(messages.nestedComment, {
                    username: notificationObject.comment.author.username,
                    b: (...chunks) => <strong>{chunks}</strong>
                  })}
            </Typography>
          }
          secondary={
            <React.Fragment>
              <Typography variant="body2" gutterBottom dangerouslySetInnerHTML={{__html: notificationObject.comment.summary}} />
              <Box component="span" sx={{display: 'flex', justifyContent: 'flex-start', p: '2px'}}>
                <Grid component="span" item={true} sm="auto" container direction="row" alignItems="center">
                  <AccessTimeIcon sx={{paddingRight: '2px'}} />
                  <TimeAgo datetime={notificationObject.active_at} />
                  <Bullet sx={{paddingLeft: '10px', paddingTop: '1px'}} />
                  <LoadingButton
                    variant={'text'}
                    sx={{marginTop: '-1px', minWidth: '30px'}}
                    onClick={() => onVote(index, notificationObject.comment)}
                    disabled={loadingVote !== null}
                    loading={loadingVote === index}>
                    {notificationObject.comment.voted ? (
                      <Tooltip
                        title={
                          <FormattedMessage id={'ui.userNotifications.comment.voteDown'} defaultMessage={'ui.userNotifications.comment.voteDown'} />
                        }>
                        <VoteFilledIcon fontSize={'small'} color={'secondary'} />
                      </Tooltip>
                    ) : (
                      <Tooltip
                        title={
                          <FormattedMessage id={'ui.userNotifications.comment.voteUp'} defaultMessage={'ui.userNotifications.comment.voteUp'} />
                        }>
                        <VoteIcon fontSize={'small'} />
                      </Tooltip>
                    )}
                  </LoadingButton>
                </Grid>
              </Box>
            </React.Fragment>
          }
        />
      </ListItem>
    </Root>
  );
}
