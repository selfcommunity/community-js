import React, {useContext, useMemo, useState} from 'react';
import {styled} from '@mui/material/styles';
import Card from '@mui/material/Card';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import {Avatar, Box, Button, CardContent, CardProps, Grid, ListItem, ListItemAvatar, ListItemText, Tooltip, Typography} from '@mui/material';
import Bullet from '../../shared/Bullet';
import classNames from 'classnames';
import Votes from './Votes';
import {AxiosResponse} from 'axios';
import {SCOPE_SC_UI} from '../../constants/Errors';
import CommentObjectSkeleton from './Skeleton';
import {
  Endpoints,
  http,
  Link,
  Logger,
  SCCommentType,
  SCCommentTypologyType,
  SCFeedObjectType,
  SCFeedObjectTypologyType,
  SCRoutingContextType,
  SCUserContext,
  SCUserContextType,
  useSCFetchCommentObject,
  useSCRouting,
  useSCContext,
  SCContextType,
  SCRoutes
} from '@selfcommunity/core';
import {LoadingButton} from '@mui/lab';
import VoteFilledIcon from '@mui/icons-material/ThumbUpTwoTone';
import VoteIcon from '@mui/icons-material/ThumbUpOutlined';
import {CommentsOrderBy} from '../../types/comments';
import ReplyCommentObject from './ReplyComment';
import CommentActionsMenu from './CommentActionsMenu';
import DateTimeAgo from '../../shared/DateTimeAgo';

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
  avatarWrap: `${PREFIX}-avatar-wrap`,
  avatar: `${PREFIX}-avatar`,
  author: `${PREFIX}-author`,
  content: `${PREFIX}-content`,
  textContent: `${PREFIX}-text-content`,
  commentChild: `${PREFIX}-comment-child`,
  btnVotes: `${PREFIX}-btn-votes`,
  votes: `${PREFIX}-votes`,
  btnViewPreviousComments: `${PREFIX}-btn-view-previous-comments`,
  commentActionsMenu: `${PREFIX}-comment-actions-menu`,
  deleted: `${PREFIX}-deleted`,
  activityAt: `${PREFIX}-activity-at`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  overflow: 'auto',
  '& .MuiSvgIcon-root': {
    width: '0.7em',
    marginBottom: '0.5px'
  },
  [`& .${classes.comment}`]: {
    paddingBottom: 0
  },
  [`& .${classes.avatarWrap}`]: {
    minWidth: 46
  },
  [`& .${classes.avatar}`]: {
    width: 35,
    height: 35
  },
  [`& .${classes.author}`]: {
    textDecoration: 'none',
    '& span': {
      fontWeight: '600'
    }
  },
  [`& .${classes.content}`]: {
    '& .MuiCardContent-root': {
      padding: '7px 13px 7px 13px'
    }
  },
  [`& .${classes.textContent}`]: {
    '& p': {
      marginBlockStart: '0.3em',
      marginBlockEnd: '0.3em'
    }
  },
  [`& .${classes.commentChild}`]: {
    paddingLeft: '70px'
  },
  [`& .${classes.btnViewPreviousComments}`]: {
    paddingLeft: '70px'
  },
  [`& .${classes.commentActionsMenu}`]: {
    position: 'absolute',
    top: 10,
    right: 11
  },
  [`& .${classes.deleted}`]: {
    opacity: 0.3
  },
  [`& .${classes.activityAt}`]: {
    display: 'flex',
    textDecoration: 'none',
    color: theme.palette.grey[700]
  }
}));

export interface CommentObjectProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;

  /**
   * Id of the comment object
   * @default null
   */
  commentObjectId?: number;

  /**
   * Comment object
   * @default null
   */
  commentObject?: SCCommentType;

  /**
   * Id of feed object
   * @default null
   */
  feedObjectId?: number;

  /**
   * Feed object
   * @default null
   */
  feedObject?: SCFeedObjectType;

  /**
   * Type of feed object
   * @default SCFeedObjectTypologyType.POST
   */
  feedObjectType?: SCFeedObjectTypologyType;

  /**
   * comments per page (latest_comments)
   * @default null
   */
  commentsPageCount?: number;

  /**
   * comments orderBy
   * @default CommentsOrderBy.ADDED_AT_DESC
   */
  commentsOrderBy?: CommentsOrderBy;

  /**
   * comment to reply
   * Used to intial open reply box for that comment
   * @default null
   */
  commentReply?: SCCommentType;

  /**
   * Callback on open reply box
   * @default null
   */
  onOpenReply?: (comment: SCCommentType) => void;

  /**
   * Callback on vote the comment or a sub-comment (latest_comments)
   * @default null
   */
  onVote?: (comment: SCCommentType) => void;

  /**
   * Callback on fecth latest comments
   * @default null
   */
  onFetchLatestComment?: () => void;

  /**
   * Props to spread to single comment object skeleton
   * @default {elevation: 0}
   */
  CommentObjectSkeletonProps?: CardProps;

  /**
   * Props to spread to single comment object ReplyCommentObject
   * @default {elevation: 0}
   */
  ReplyCommentObjectProps?: CardProps;

  /**
   * Other props
   */
  [p: string]: any;
}

export default function CommentObject(props: CommentObjectProps): JSX.Element {
  // PROPS
  const {
    className,
    commentObjectId,
    commentObject,
    feedObjectId,
    feedObject,
    feedObjectType = SCFeedObjectTypologyType.POST,
    commentsPageCount = 5,
    commentsOrderBy = CommentsOrderBy.ADDED_AT_DESC,
    commentReply,
    onOpenReply,
    onVote,
    onFetchLatestComment,
    CommentObjectSkeletonProps = {elevation: 0, variant: 'outlined'},
    ReplyCommentObjectProps = {elevation: 0, variant: 'outlined'},
    ...rest
  } = props;

  // CONTEXT
  const scContext: SCContextType = useSCContext();
  const scUserContext: SCUserContextType = useContext(SCUserContext);
  const scRoutingContext: SCRoutingContextType = useSCRouting();
  const intl = useIntl();

  // STATE
  const {obj, setObj} = useSCFetchCommentObject({id: commentObjectId, commentObject});
  const [loadingVote, setLoadingVote] = useState(false);
  const [loadingLatestComments, setLoadingLatestComments] = useState(false);
  const [next, setNext] = useState<string>(null);
  const [replyComment, setReplyComment] = useState<SCCommentType>(commentReply);
  const [isReplying, setIsReplying] = useState<boolean>(false);
  const [editComment, setEditComment] = useState<SCCommentType>(null);
  const [isSavingComment, setIsSavingComment] = useState<boolean>(false);

  /**
   * Render added_at of the comment
   * @param comment
   */
  function renderTimeAgo(comment) {
    return (
      <Link
        to={scRoutingContext.url(SCRoutes.COMMENT_ROUTE_NAME, {
          ...comment,
          ...{contribution_type: feedObjectType, contribution_id: feedObjectId ? feedObjectId : feedObject.id}
        })}
        className={classes.activityAt}>
        <DateTimeAgo date={comment.added_at} />
      </Link>
    );
  }

  /**
   * Render vote action
   * @param comment
   */
  function renderActionVote(comment) {
    return (
      <LoadingButton
        variant={'text'}
        sx={{minWidth: 30}}
        onClick={() => (!scUserContext.user ? scContext.settings.handleAnonymousAction() : vote(comment))}
        disabled={loadingVote}>
        {comment.voted ? (
          <Tooltip title={<FormattedMessage id={'ui.commentObject.voteDown'} defaultMessage={'ui.commentObject.voteDown'} />}>
            <VoteFilledIcon fontSize={'small'} color={'secondary'} />
          </Tooltip>
        ) : (
          <Tooltip title={<FormattedMessage id={'ui.commentObject.voteUp'} defaultMessage={'ui.commentObject.voteUp'} />}>
            <VoteIcon fontSize={'small'} />
          </Tooltip>
        )}
      </LoadingButton>
    );
  }

  /**
   * Render Reply action
   * @param comment
   */
  function renderActionReply(comment) {
    return (
      <Button variant={'text'} onClick={() => (!scUserContext.user ? scContext.settings.handleAnonymousAction() : reply(comment))}>
        {intl.formatMessage(messages.reply)}
      </Button>
    );
  }

  /**
   * Render Votes counter
   */
  function renderVotes(comment) {
    return <Votes commentObject={comment} sx={{display: {xs: 'none', sm: 'block'}}} />;
  }

  /**
   * Handle reply: open Editor
   * @param comment
   */
  function reply(comment) {
    setReplyComment(comment);
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
        obj.latest_comments = obj.latest_comments.length <= 1 ? [...data.results.reverse()] : [...data.results.reverse(), ...obj.latest_comments];
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
          url: next
            ? next
            : `${Endpoints.Comments.url()}?${feedObjectType}=${feedObjectId ? feedObjectId : feedObject.id}&parent=${
                obj.id
              }&limit=${commentsPageCount}&ordering=${commentsOrderBy}`,
          method: Endpoints.Comments.method
        })
        .then((res: AxiosResponse<any>) => {
          if (res.status >= 300) {
            return Promise.reject(res);
          }
          return Promise.resolve(res.data);
        });
    },
    [obj, next, commentsOrderBy, commentsPageCount]
  );

  /**
   * Perform vote comment
   */
  const performVoteComment = useMemo(
    () => (comment) => {
      return http
        .request({
          url: Endpoints.Vote.url({type: SCCommentTypologyType, id: comment.id}),
          method: Endpoints.Vote.method
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
   * Perform reply
   * Comment of second level
   */
  const performReply = (comment) => {
    return http
      .request({
        url: Endpoints.NewComment.url({}),
        method: Endpoints.NewComment.method,
        data: {
          [`${feedObjectType}`]: feedObjectId ? feedObjectId : feedObject.id,
          parent: replyComment.parent ? replyComment.parent : replyComment.id,
          ...(replyComment.parent ? {in_reply_to: replyComment.id} : {}),
          text: comment
        }
      })
      .then((res: AxiosResponse<SCCommentType>) => {
        if (res.status >= 300) {
          return Promise.reject(res);
        }
        return Promise.resolve(res.data);
      });
  };

  /**
   * Handle comment of 2° level
   */
  function handleReply(comment) {
    setIsReplying(true);
    performReply(comment)
      .then((data: SCCommentType) => {
        setObj(
          Object.assign({}, obj, {
            latest_comments: [...obj.latest_comments, ...[data]]
          })
        );
        setReplyComment(null);
        setIsReplying(false);
      })
      .catch((error) => {
        Logger.error(SCOPE_SC_UI, error);
      });
  }

  /**
   * Handle comment delete
   */
  function handleDelete(comment) {
    if (comment.parent) {
      const _latestComment = obj.latest_comments.map((c) => {
        if (c.id === comment.id) {
          c.deleted = true;
        }
        return c;
      });
      setObj(Object.assign({}, obj, {latest_comments: _latestComment}));
    } else {
      setObj(Object.assign({}, obj, {deleted: true}));
    }
  }

  /**
   * Handle comment restore
   */
  function handleRestore(comment) {
    if (comment.parent) {
      const _latestComment = obj.latest_comments.map((c) => {
        if (c.id === comment.id) {
          c.deleted = false;
        }
        return c;
      });
      setObj(Object.assign({}, obj, {latest_comments: _latestComment}));
    } else {
      setObj(Object.assign({}, obj, {deleted: false}));
    }
  }

  /**
   * Handle edit comment
   */
  function handleEdit(comment) {
    setEditComment(comment);
  }

  function handleCancel() {
    setEditComment(null);
  }

  /**
   * Perform save/update comment
   */
  const performSave = (comment) => {
    return http
      .request({
        url: Endpoints.UpdateComment.url({id: editComment.id}),
        method: Endpoints.UpdateComment.method,
        data: {text: comment}
      })
      .then((res: AxiosResponse<SCCommentType>) => {
        if (res.status >= 300) {
          return Promise.reject(res);
        }
        return Promise.resolve(res.data);
      });
  };

  /**
   * Handle save comment
   */
  function handleSave(comment) {
    setIsSavingComment(true);
    performSave(comment)
      .then((data: SCCommentType) => {
        if (data.parent) {
          const _latestComment = obj.latest_comments.map((c) => {
            if (c.id === data.id) {
              return data;
            }
            return c;
          });
          setObj(Object.assign({}, obj, {latest_comments: _latestComment}));
        } else {
          setObj(Object.assign({}, obj, {text: data.text, html: data.html, summary: data.summary, added_at: data.added_at}));
        }
        setEditComment(null);
        setIsSavingComment(false);
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
    if (
      (comment.deleted && scUserContext.user && !scUserContext.user.role) ||
      (scUserContext.user && scUserContext.user.role && !scUserContext.user.role.includes('admin'))
    ) {
      // if the logged user isn't an administrator can't view the comment
      return null;
    }
    return (
      <React.Fragment key={comment.id}>
        {editComment && editComment.id === comment.id ? (
          <ReplyCommentObject
            text={comment.html}
            autoFocus
            id={`reply-${comment.id}`}
            commentObject={comment}
            onSave={handleSave}
            onCancel={handleCancel}
            readOnly={isReplying}
            inline={!comment.parent}
            ReplyBoxProps={ReplyCommentObjectProps}
          />
        ) : (
          <ListItem
            button={false}
            alignItems="flex-start"
            classes={{root: classNames(classes.comment, {[classes.commentChild]: Boolean(comment.parent)})}}>
            <ListItemAvatar classes={{root: classes.avatarWrap}}>
              <Link to={scRoutingContext.url('profile', {id: comment.author.id})}>
                <Avatar alt={obj.author.username} variant="circular" src={comment.author.avatar} classes={{root: classes.avatar}} />
              </Link>
            </ListItemAvatar>
            <ListItemText
              disableTypography
              secondary={
                <>
                  <Card classes={{root: classes.content}} {...rest}>
                    <CardContent classes={{root: classNames({[classes.deleted]: obj.deleted})}}>
                      <Link className={classes.author} to={scRoutingContext.url('profile', {id: comment.author.id})}>
                        <Typography component="span" sx={{display: 'inline'}} gutterBottom color="primary">
                          {comment.author.username}
                        </Typography>
                      </Link>
                      <Typography
                        className={classes.textContent}
                        variant="body2"
                        gutterBottom
                        dangerouslySetInnerHTML={{__html: comment.html}}></Typography>
                    </CardContent>
                    {scUserContext.user && (
                      <Box className={classes.commentActionsMenu}>
                        <CommentActionsMenu
                          commentObject={comment}
                          feedObject={feedObject}
                          feedObjectId={feedObjectId}
                          feedObjectType={feedObjectType}
                          onRestore={handleRestore}
                          onDelete={handleDelete}
                          onEdit={handleEdit}
                        />
                      </Box>
                    )}
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
        )}
        {renderLatestComment(comment)}
        {scUserContext.user && replyComment && (replyComment.id === comment.id || replyComment.parent === comment.id) && !comment.parent && (
          <ReplyCommentObject
            text={replyComment.parent ? `@${replyComment.author.username}, ` : ''}
            autoFocus
            id={`reply-${replyComment.id}`}
            commentObject={replyComment}
            onReply={handleReply}
            readOnly={isReplying}
            {...rest}
          />
        )}
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
                disabled={loadingLatestComments || (!feedObjectId && !feedObject)}
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
          <React.Fragment key={lc.id}>{renderComment(lc)}</React.Fragment>
        ))}
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
    comment = <CommentObjectSkeleton {...CommentObjectSkeletonProps} />;
  }

  /**
   * Render object
   */
  return <Root className={className}>{comment}</Root>;
}
