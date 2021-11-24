import React, {useContext, useEffect, useMemo, useState} from 'react';
import {styled} from '@mui/material/styles';
import Card from '@mui/material/Card';
import FeedObjectSkeleton from '../Skeleton/FeedObjectSkeleton';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import {Avatar, Box, Button, CardContent, Grid, ListItem, ListItemAvatar, ListItemText, Typography} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TimeAgo from 'timeago-react';
import Bullet from '../../shared/Bullet';
import {SCCommentType} from '@selfcommunity/core/src/types/comment';
import {
  Endpoints,
  http,
  Logger,
  SCFeedObjectType,
  SCFeedObjectTypologyType,
  SCTagType,
  SCUserContext,
  SCUserContextType,
  SCUserType,
  useSCFetchCommentObject
} from '@selfcommunity/core';
import classNames from 'classnames';
import Votes from './Votes';
import {AxiosResponse} from 'axios';
import {SCOPE_SC_UI} from '../../constants/Errors';
import CommentObjectSkeleton from '../Skeleton/CommentObjectSkeleton';

const messages = defineMessages({
  reply: {
    id: 'ui.commentObject.reply',
    defaultMessage: 'ui.commentObject.reply'
  },
  voteUp: {
    id: 'ui.commentObject.voteUp',
    defaultMessage: 'ui.commentObject.voteUp'
  },
  voteDown: {
    id: 'ui.commentObject.voteDown',
    defaultMessage: 'ui.commentObject.voteDown'
  }
});

const PREFIX = 'SCCommentsObject';

const classes = {
  root: `${PREFIX}-root`,
  comment: `${PREFIX}-comment`,
  commentChild: `${PREFIX}-commentChild`,
  btnVotes: `${PREFIX}-btnVotes`,
  votes: `${PREFIX}-votes`,
  btnViewPreviousComments: `${PREFIX}-btnViewPreviousComments`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  '& .MuiSvgIcon-root': {
    width: '0.7em',
    marginBottom: '0.5px'
  },
  [`& .${classes.commentChild}`]: {
    paddingLeft: '70px'
  },
  [`& .${classes.btnViewPreviousComments}`]: {
    paddingLeft: '70px'
  }
}));

export default function CommentObject({
  id = null,
  commentObject = null,
  feedObject = null,
  feedObjectType = SCFeedObjectTypologyType.POST,
  onReply = null,
  onVote = null,
  ...rest
}: {
  id?: number;
  feedObject: SCFeedObjectType;
  feedObjectType: SCFeedObjectTypologyType;
  commentObject?: SCCommentType;
  onReply?: (comment: SCCommentType) => void;
  onVote?: (comment: SCCommentType) => void;
  [p: string]: any;
}): JSX.Element {
  const scUser: SCUserContextType = useContext(SCUserContext);
  const {obj, setObj} = useSCFetchCommentObject({id, commentObject});
  const [loading, setLoading] = useState(false);
  const [next, setNext] = useState<string>(`${Endpoints.Comments.url()}?${feedObjectType}=${feedObject.id}&parent=${commentObject.id}&limit=5`);
  const intl = useIntl();

  /**
   * Render added_at of the comment
   * @param comment
   */
  function renderTimeAgo(comment) {
    return [
      <AccessTimeIcon sx={{paddingRight: '2px'}} />,
      <Typography variant={'body2'}>
        <TimeAgo datetime={comment.added_at} />
      </Typography>
    ];
  }

  /**
   * Render vote action
   * @param comment
   */
  function renderActionVote(comment) {
    return (
      <Button variant={'text'} sx={{marginTop: '-1px'}} onClick={vote}>
        {comment.voted ? intl.formatMessage(messages.voteDown) : intl.formatMessage(messages.voteUp)}
      </Button>
    );
  }

  /**
   * Render Reply action
   * @param comment
   */
  function renderActionReply(comment) {
    return (
      <Button variant={'text'} sx={{marginTop: '-1px'}} onClick={() => reply(comment)}>
        {intl.formatMessage(messages.reply)}
      </Button>
    );
  }

  /**
   * Render Votes counter
   */
  function renderVotes(comment) {
    return <Votes commentObject={comment} />;
  }

  /**
   * Handle reply
   * Open Editor
   * @param comment
   */
  function reply(comment) {
    if (onReply) {
      onReply(comment);
    }
  }

  /**
   * Handle vote comment
   * @param comment
   */
  function vote(comment) {
    if (onVote) {
      onVote(comment);
    }
  }

  /**
   * Handle fetch latest comments
   * @param comment
   */
  function loadLatestComment() {
    setLoading(true);
    fetchLatestComment()
      .then((data) => {
        const newObj = obj;
        obj.latest_comments = [...data.results, ...obj.latest_comments];
        setObj(newObj);
        setNext(data.next);
        setLoading(false);
      })
      .catch((error) => {
        Logger.error(SCOPE_SC_UI, error);
      });
  }

  /**
   * fetchVotes
   */
  const fetchLatestComment = useMemo(
    () => () => {
      return http
        .request({
          url: next,
          method: Endpoints.VotesList.method
        })
        .then((res: AxiosResponse<any>) => {
          if (res.status >= 300) {
            return Promise.reject(res);
          }
          return Promise.resolve(res.data);
        });
    },
    [next]
  );

  /**
   * Render comment & latest activities
   * @param comment
   */
  function renderComment(comment) {
    return (
      <React.Fragment key={comment.id}>
        <ListItem button={false} alignItems="flex-start" classes={{root: classNames({[classes.commentChild]: Boolean(comment.parent)})}}>
          <ListItemAvatar>
            <Avatar alt={obj.author.username} variant="circular" src={comment.author.avatar} />
          </ListItemAvatar>
          <ListItemText
            disableTypography
            secondary={
              <>
                <Card classes={{root: classes.comment}} {...rest}>
                  <CardContent>
                    <Typography component="span" sx={{display: 'inline'}} gutterBottom color="primary">
                      {comment.author.username}
                    </Typography>
                    <Typography variant="body2" gutterBottom dangerouslySetInnerHTML={{__html: comment.html}}></Typography>
                  </CardContent>
                </Card>
                <Box component="span" sx={{display: 'flex', justifyContent: 'flex-start', p: '2px'}}>
                  <Grid component="span" item={true} sm="auto" container direction="row" alignItems="center">
                    {renderTimeAgo(comment)}
                    <Bullet sx={{paddingLeft: '10px', paddingTop: '1px'}} />
                    {renderActionVote(comment)}
                    <Bullet sx={{paddingTop: '1px'}} />
                    {renderActionReply(comment)}
                    {renderVotes(comment)}
                  </Grid>
                </Box>
              </>
            }
          />
        </ListItem>
        {renderLatestComment(comment)}
      </React.Fragment>
    );
  }

  /**
   * Render Latest Comment
   * @param comment
   */
  function renderLatestComment(comment) {
    return (
      <>
        {comment.comment_count - comment.latest_comments?.length >= 1 && (
          <>
            {loading ? (
              <Box sx={{paddingLeft: '55px', paddingRight: 0}}>
                <CommentObjectSkeleton {...rest} />
              </Box>
            ) : (
              <Button variant="text" onClick={loadLatestComment} classes={{text: classNames(classes.btnViewPreviousComments, classes.commentChild)}}>
                <FormattedMessage
                  id={'ui.commentObject.viewLatestComment'}
                  defaultMessage={'ui.commentObject.viewLatestComment'}
                  values={{total: comment.comment_count - comment.latest_comments?.length}}
                />
              </Button>
            )}
          </>
        )}
        {comment.latest_comments?.map((lc: SCCommentType) => renderComment(lc))}
      </>
    );
  }

  /**
   * Render comments
   */
  let comment;
  if (obj) {
    comment = renderComment(obj);
  } else {
    comment = <FeedObjectSkeleton elevation={0} />;
  }

  /**
   * Render object
   */
  return <Root>{comment}</Root>;
}
