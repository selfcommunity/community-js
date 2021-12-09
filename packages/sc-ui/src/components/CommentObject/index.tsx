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
import classNames from 'classnames';
import Votes from './Votes';
import {AxiosResponse} from 'axios';
import {SCOPE_SC_UI} from '../../constants/Errors';
import CommentObjectSkeleton from '../Skeleton/CommentObjectSkeleton';
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
import {LoadingButton} from '@mui/lab';

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
  commentObjectId = null,
  commentObject = null,
  feedObjectId = null,
  feedObject = null,
  feedObjectType = SCFeedObjectTypologyType.POST,
  onOpenReply = null,
  onReply = null,
  onVote = null,
  onFetchLatestComment = null,
  ...rest
}: {
  commentObjectId?: number;
  commentObject?: SCCommentType;
  feedObjectId?: number;
  feedObject?: SCFeedObjectType;
  feedObjectType?: SCFeedObjectTypologyType;
  onOpenReply?: (comment: SCCommentType) => void;
  onVote?: (comment: SCCommentType) => void;
  onFetchLatestComment?: () => void;
  [p: string]: any;
}): JSX.Element {
  const scUser: SCUserContextType = useContext(SCUserContext);
  const {obj, setObj} = useSCFetchCommentObject({id: commentObjectId, commentObject});
  const [loadingVote, setLoadingVote] = useState(false);
  const [loadingLatestComments, setLoadingLatestComments] = useState(false);
  const [next, setNext] = useState<string>(
    feedObject || feedObjectId
      ? `${Endpoints.Comments.url()}?${feedObjectType}=${feedObjectId ? feedObjectId : feedObject.id}&parent=${commentObject.id}&limit=5`
      : null
  );
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
      <LoadingButton variant={'text'} sx={{marginTop: '-1px'}} onClick={() => vote(comment)} disabled={loadingVote}>
        {comment.voted ? intl.formatMessage(messages.voteDown) : intl.formatMessage(messages.voteUp)}
      </LoadingButton>
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
   * Handle reply: open Editor
   * @param comment
   */
  function reply(comment) {
    onOpenReply && onOpenReply(comment);
  }

  /**
   * Handle fetch latest comments
   * @param comment
   */
  function loadLatestComment() {
    setLoadingLatestComments(true);
    fetchLatestComment()
      .then((data) => {
        const newObj = obj;
        obj.latest_comments = [...data.results, ...obj.latest_comments];
        setObj(newObj);
        setNext(data.next);
        setLoadingLatestComments(false);
        onFetchLatestComment && onFetchLatestComment();
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
   * Perform vote comment
   */
  const performVoteComment = useMemo(
    () => (comment) => {
      return http
        .request({
          url: Endpoints.CommentVote.url({id: comment.id}),
          method: Endpoints.CommentVote.method
        })
        .then((res: AxiosResponse<any>) => {
          if (res.status >= 300) {
            return Promise.reject(res);
          }
          return Promise.resolve(res.data);
        });
    },
    [obj]
  );

  /**
   * Handle vote comment
   * @param comment
   */
  function vote(comment) {
    setLoadingVote(true);
    performVoteComment(comment)
      .then((data) => {
        const newObj = obj;
        if (comment.parent) {
          // 2° comment level
          const newLatestComments: SCCommentType[] = obj.latest_comments.map((lc) => {
            if (lc.id === comment.id) {
              lc.voted = !lc.voted;
              lc.vote_count = lc.vote_count - (lc.voted ? -1 : 1);
            }
            return lc;
          });
          obj.latest_comments = newLatestComments;
        } else {
          // 1° comment level
          obj.voted = !obj.voted;
          obj.vote_count = obj.vote_count - (obj.voted ? -1 : 1);
        }
        setObj(newObj);
        setLoadingVote(false);
        onVote && onVote(comment);
      })
      .catch((error) => {
        Logger.error(SCOPE_SC_UI, error);
      });
  }

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
            {loadingLatestComments ? (
              <Box sx={{paddingLeft: '55px', paddingRight: 0}}>
                <CommentObjectSkeleton {...rest} />
              </Box>
            ) : (
              <Button
                variant="text"
                onClick={loadLatestComment}
                disabled={!feedObjectId && !feedObject}
                classes={{text: classNames(classes.btnViewPreviousComments, classes.commentChild)}}>
                <FormattedMessage
                  id={'ui.commentObject.viewLatestComment'}
                  defaultMessage={'ui.commentObject.viewLatestComment'}
                  values={{total: comment.comment_count - comment.latest_comments?.length}}
                />
              </Button>
            )}
          </>
        )}
        {comment.latest_comments?.map((lc: SCCommentType, index) => (
          <React.Fragment key={index}>{renderComment(lc)}</React.Fragment>
        ))}
      </>
    );
  }

  /**
   * Render comments
   */
  let comment;
  console.log(obj);
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
