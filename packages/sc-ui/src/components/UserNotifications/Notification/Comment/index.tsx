import React from 'react';
import {styled} from '@mui/material/styles';
import {Avatar, Box, Grid, ListItem, ListItemAvatar, ListItemText, Tooltip, Typography} from '@mui/material';
import {Link, SCNotificationCommentType, SCNotificationTypologyType, SCRoutingContextType, useSCRouting} from '@selfcommunity/core';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import Bullet from '../../../../shared/Bullet';
import {LoadingButton} from '@mui/lab';
import VoteFilledIcon from '@mui/icons-material/ThumbUpTwoTone';
import VoteIcon from '@mui/icons-material/ThumbUpOutlined';
import {grey} from '@mui/material/colors';
import DateTimeAgo from '../../../../shared/DateTimeAgo';

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
  },
  '& a': {
    textDecoration: 'none',
    color: grey[900]
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
  const scRoutingContext: SCRoutingContextType = useSCRouting();
  const intl = useIntl();
  return (
    <Root {...props}>
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <Link to={scRoutingContext.url('profile', {id: notificationObject.comment.author.id})}>
            <Avatar alt={notificationObject.comment.author.username} variant="circular" src={notificationObject.comment.author.avatar} />
          </Link>
        </ListItemAvatar>
        <ListItemText
          primary={
            <Typography component="span" sx={{display: 'inline'}} color="primary">
              <Link to={scRoutingContext.url('profile', {id: notificationObject.comment.author.id})}>
                {notificationObject.comment.author.username}
              </Link>{' '}
              {notificationObject.type === SCNotificationTypologyType.NESTED_COMMENT
                ? intl.formatMessage(messages.comment, {
                    b: (...chunks) => <strong>{chunks}</strong>
                  })
                : intl.formatMessage(messages.nestedComment, {
                    b: (...chunks) => <strong>{chunks}</strong>
                  })}
            </Typography>
          }
          secondary={
            <React.Fragment>
              <Link to={scRoutingContext.url('comment', {id: notificationObject.comment.id})} sx={{textDecoration: 'underline'}}>
                <Typography variant="body2" gutterBottom dangerouslySetInnerHTML={{__html: notificationObject.comment.summary}} />
              </Link>
              <Box component="span" sx={{display: 'flex', justifyContent: 'flex-start', p: '2px'}}>
                <Grid component="span" item={true} sm="auto" container direction="row" alignItems="center">
                  <DateTimeAgo date={notificationObject.active_at} />
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
