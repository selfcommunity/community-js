import React, {useContext, useMemo, useState} from 'react';
import {styled} from '@mui/material/styles';
import Widget, {WidgetProps} from '../Widget';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import {Avatar, Box, Button, CardContent, CardProps, Tooltip, Typography} from '@mui/material';
import Bullet from '../../shared/Bullet';
import classNames from 'classnames';
import Votes from './Votes';
import {AxiosResponse} from 'axios';
import {SCOPE_SC_UI} from '../../constants/Errors';
import CommentObjectSkeleton from './Skeleton';
import {LoadingButton} from '@mui/lab';
import Icon from '@mui/material/Icon';
import {SCCommentsOrderBy} from '../../types/comments';
import ReplyCommentObject from './ReplyComment';
import ContributionActionsMenu from '../../shared/ContributionActionsMenu';
import DateTimeAgo from '../../shared/DateTimeAgo';
import {getContributionHtml, getRouteData} from '../../utils/contribution';
import {useSnackbar} from 'notistack';
import useThemeProps from '@mui/material/styles/useThemeProps';
import CommentsObject from '../CommentsObject';
import BaseItem from '../../shared/BaseItem';
import {
  Endpoints,
  http,
  Link,
  Logger,
  SCCommentType,
  SCCommentTypologyType,
  SCContextType,
  SCFeedObjectType,
  SCFeedObjectTypologyType,
  SCRoutes,
  SCRoutingContextType,
  SCUserContext,
  SCUserContextType,
  UserUtils,
  useSCContext,
  useSCFetchCommentObject,
  useSCFetchCommentObjects,
  useSCRouting
} from '@selfcommunity/core';

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

const PREFIX = 'SCCommentObject';

const classes = {
  root: `${PREFIX}-root`,
  comment: `${PREFIX}-comment`,
  nestedComments: `${PREFIX}-nestedComments`,
  avatar: `${PREFIX}-avatar`,
  content: `${PREFIX}-content`,
  author: `${PREFIX}-author`,
  textContent: `${PREFIX}-text-content`,
  btnVotes: `${PREFIX}-btn-votes`,
  votes: `${PREFIX}-votes`,
  commentActionsMenu: `${PREFIX}-comment-actions-menu`,
  deleted: `${PREFIX}-deleted`,
  activityAt: `${PREFIX}-activity-at`,
  reply: `${PREFIX}-reply`,
  contentSubSection: `${PREFIX}-comment-sub-section`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  overflow: 'auto',
  width: '100%',
  '& .MuiIcon-root': {
    fontSize: '18px',
    marginBottom: '0.5px'
  },
  [`& .${classes.comment}`]: {
    paddingBottom: 0,
    '& > div': {
      alignItems: 'flex-start'
    }
  },
  [`& .${classes.nestedComments}`]: {
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 55,
    '& ul.MuiList-root': {
      paddingTop: 0,
      paddingBottom: 0,
      width: '100%',
      '& li.MuiListItem-root': {
        paddingTop: 5
      }
    }
  },
  [`& .${classes.content}`]: {
    position: 'relative',
    display: 'flex',
    '& .MuiCardContent-root': {
      padding: '7px 13px 7px 13px',
      flexGrow: 1
    }
  },
  [`& .${classes.avatar}`]: {
    top: theme.spacing()
  },
  [`& .${classes.author}`]: {
    textDecoration: 'none',
    color: theme.palette.text.primary,
    '& span': {
      fontWeight: '600'
    }
  },
  [`& .${classes.textContent}`]: {
    '& a': {
      color: theme.palette.text.primary
    },
    '& p': {
      marginBlockStart: '0.3em',
      marginBlockEnd: '0.3em'
    }
  },
  [`& .${classes.commentActionsMenu}`]: {
    alignItems: 'flexStart'
  },
  [`& .${classes.deleted}`]: {
    opacity: 0.3
  },
  [`& .${classes.contentSubSection}`]: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    color: theme.palette.text.secondary
  },
  [`& .${classes.activityAt}`]: {
    display: 'flex',
    textDecoration: 'none',
    color: 'inherit'
  },
  [`& .${classes.reply}`]: {
    textTransform: 'capitalize',
    textDecoration: 'underline',
    textDecorationStyle: 'dotted'
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
   * @default SCCommentsOrderBy.ADDED_AT_DESC
   */
  commentsOrderBy?: SCCommentsOrderBy;

  /**
   * comment to reply
   * Used to initial open reply box for that comment
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
   * Callback on delete the comment
   * @default null
   */
  onDelete?: (comment: SCCommentType) => void;

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

/**
 *> API documentation for the Community-UI Comment Object component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {CommentObject} from '@selfcommunity/ui';
 ```

 #### Component Name

 The name `SCCommentObject` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCCommentObject-root|Styles applied to the root element.|
 |comment|.SCCommentObject-comment|Styles applied to comment element.|
 |nestedComments|.SCCommentObject-nestedComments|Styles applied to nested comments element wrapper.|
 |avatar|.SCCommentObject-avatar|Styles applied to the avatar element.|
 |author|.SCCommentObject-author|Styles applied to the author section.|
 |content|.SCCommentObject-content|Styles applied to content section.|
 |textContent|.SCCommentObject-text-content|Styles applied to text content section.|
 |btnVotes|.SCCommentObject-btn-votes|Styles applied to the vote button element.|
 |votes|.SCCommentObject-votes|Styles applied to the votes section.|
 |commentActionsMenu|.SCCommentObject-comment-actions-menu|Styles applied to comment action menu element.|
 |deleted|.SCCommentObject-deleted|Styles applied to tdeleted element.|
 |activityAt|.SCCommentObject-activity-at|Styles applied to activity at section.|
 |reply|.SCCommentObject-reply|Styles applied to the reply element.|
 |contentSubSection|.SCCommentObject-content-sub-section|Styles applied to the comment subsection|

 * @param inProps
 */
export default function CommentObject(inProps: CommentObjectProps): JSX.Element {
  // PROPS
  const props: CommentObjectProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {
    id = `comment_object_${props.commentObjectId ? props.commentObjectId : props.commentObject ? props.commentObject.id : ''}`,
    className,
    commentObjectId,
    commentObject,
    feedObjectId,
    feedObject,
    feedObjectType = SCFeedObjectTypologyType.POST,
    commentReply,
    onOpenReply,
    onDelete,
    onVote,
    elevation = 0,
    CommentObjectSkeletonProps = {elevation, WidgetProps: {variant: 'outlined'} as WidgetProps},
    ReplyCommentObjectProps = {elevation, ReplyBoxProps: {variant: 'outlined'} as WidgetProps},
    ...rest
  } = props;

  // CONTEXT
  const scContext: SCContextType = useSCContext();
  const scUserContext: SCUserContextType = useContext(SCUserContext);
  const scRoutingContext: SCRoutingContextType = useSCRouting();
  const {enqueueSnackbar} = useSnackbar();
  const intl = useIntl();

  // STATE
  const {obj, setObj} = useSCFetchCommentObject({id: commentObjectId, commentObject});
  const [loadingVote, setLoadingVote] = useState(false);
  const [replyComment, setReplyComment] = useState<SCCommentType>(commentReply);
  const [isReplying, setIsReplying] = useState<boolean>(false);
  const [isSavingComment, setIsSavingComment] = useState<boolean>(false);
  const [editComment, setEditComment] = useState<SCCommentType>(null);
  const commentsObject = useSCFetchCommentObjects({
    id: feedObjectId,
    feedObject,
    feedObjectType,
    orderBy: SCCommentsOrderBy.ADDED_AT_DESC,
    parent: commentObject ? commentObject.id : commentObjectId
  });

  /**
   * Render added_at of the comment
   * @param comment
   */
  function renderTimeAgo(comment) {
    return (
      <Link to={scRoutingContext.url(SCRoutes.COMMENT_ROUTE_NAME, getRouteData(comment))} className={classes.activityAt}>
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
      <LoadingButton variant={'text'} sx={{minWidth: 30}} onClick={() => vote(comment)} disabled={loadingVote} color="inherit">
        {comment.voted ? (
          <Tooltip title={<FormattedMessage id={'ui.commentObject.voteDown'} defaultMessage={'ui.commentObject.voteDown'} />}>
            <Icon fontSize={'small'} color="primary">
              thumb_up_alt
            </Icon>
          </Tooltip>
        ) : (
          <Tooltip title={<FormattedMessage id={'ui.commentObject.voteUp'} defaultMessage={'ui.commentObject.voteUp'} />}>
            <Icon fontSize={'small'} color="inherit">
              thumb_up_off_alt
            </Icon>
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
      <Button className={classes.reply} variant="text" onClick={() => reply(comment)} color="inherit">
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
    if (!scUserContext.user) {
      scContext.settings.handleAnonymousAction();
    } else {
      setReplyComment(comment);
      onOpenReply && onOpenReply(comment);
    }
  }

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
    if (!scUserContext.user) {
      scContext.settings.handleAnonymousAction();
    } else {
      if (UserUtils.isBlocked(scUserContext.user)) {
        enqueueSnackbar(<FormattedMessage id="ui.common.userBlocked" defaultMessage="ui.common.userBlocked" />, {
          variant: 'warning'
        });
      } else {
        setLoadingVote(true);
        performVoteComment(comment)
          .then((data) => {
            const newObj = obj;
            obj.voted = !obj.voted;
            obj.vote_count = obj.vote_count - (obj.voted ? -1 : 1);
            setObj(newObj);
            setLoadingVote(false);
            onVote && onVote(comment);
          })
          .catch((error) => {
            Logger.error(SCOPE_SC_UI, error);
            enqueueSnackbar(<FormattedMessage id="ui.common.error.action" defaultMessage="ui.common.error.action" />, {
              variant: 'error'
            });
          });
      }
    }
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
    if (UserUtils.isBlocked(scUserContext.user)) {
      enqueueSnackbar(<FormattedMessage id="ui.common.userBlocked" defaultMessage="ui.common.userBlocked" />, {
        variant: 'warning'
      });
    } else {
      setIsReplying(true);
      performReply(comment)
        .then((data: SCCommentType) => {
          setObj({...obj, ...{comment_count: obj.comment_count + 1, latest_comments: [...obj.latest_comments, data]}});
          setReplyComment(null);
          setIsReplying(false);
        })
        .catch((error) => {
          Logger.error(SCOPE_SC_UI, error);
          enqueueSnackbar(<FormattedMessage id="ui.common.error.action" defaultMessage="ui.common.error.action" />, {
            variant: 'error',
            autoHideDuration: 3000
          });
          setIsReplying(false);
        });
    }
  }

  /**
   * Handle comment delete
   */
  function handleDelete(comment) {
    if (comment.parent) {
      const _latestComment = obj.latest_comments.map((c) => {
        if (c.id === comment.id) {
          c.deleted = !c.deleted;
        }
        return c;
      });
      setObj(Object.assign({}, obj, {latest_comments: _latestComment}));
    } else {
      const _comment = Object.assign({}, obj, {deleted: !obj.deleted});
      setObj(Object.assign({}, obj, {deleted: !obj.deleted}));
      onDelete && onDelete(_comment);
    }
  }

  /**
   * Handle comment delete
   */
  function handleHide(comment) {
    if (comment.parent) {
      const _latestComment = obj.latest_comments.map((c) => {
        if (c.id === comment.id) {
          c.collapsed = !c.collapsed;
        }
        return c;
      });
      setObj(Object.assign({}, obj, {latest_comments: _latestComment}));
    } else {
      setObj(Object.assign({}, obj, {collapsed: !obj.collapsed}));
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
    if (UserUtils.isBlocked(scUserContext.user)) {
      enqueueSnackbar(<FormattedMessage id="ui.common.userBlocked" defaultMessage="ui.common.userBlocked" />, {
        variant: 'warning'
      });
    } else {
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
            setObj(
              Object.assign({}, obj, {
                text: data.text,
                html: data.html,
                summary: data.summary,
                added_at: data.added_at
              })
            );
          }
          setEditComment(null);
          setIsSavingComment(false);
        })
        .catch((error) => {
          Logger.error(SCOPE_SC_UI, error);
          enqueueSnackbar(<FormattedMessage id="ui.common.error.action" defaultMessage="ui.common.error.action" />, {
            variant: 'error'
          });
        });
    }
  }

  /**
   * Render comment & latest activities
   * @param comment
   */
  function renderComment(comment: SCCommentType) {
    if (
      comment.deleted &&
      (!scUserContext.user || (scUserContext.user && (!UserUtils.isStaff(scUserContext.user) || scUserContext.user.id !== comment.author.id)))
    ) {
      // render the comment if user is logged and is staff (admin, moderator)
      // or the comment author is the logged user
      return null;
    }
    return (
      <React.Fragment key={comment.id}>
        {editComment && editComment.id === comment.id ? (
          <Box className={classes.comment}>
            <ReplyCommentObject
              text={comment.html}
              autoFocus
              id={`edit-${comment.id}`}
              commentObject={comment}
              onSave={handleSave}
              onCancel={handleCancel}
              readOnly={isReplying || isSavingComment}
              inline={!comment.parent}
              {...ReplyCommentObjectProps}
            />
          </Box>
        ) : (
          <BaseItem
            elevation={0}
            className={classes.comment}
            image={
              <Link to={scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, comment.author)}>
                <Avatar alt={obj.author.username} variant="circular" src={comment.author.avatar} className={classes.avatar} />
              </Link>
            }
            disableTypography
            primary={
              <>
                <Widget className={classes.content} elevation={elevation} {...rest}>
                  <CardContent className={classNames({[classes.deleted]: obj && obj.deleted})}>
                    <Link className={classes.author} to={scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, comment.author)}>
                      <Typography component="span">{comment.author.username}</Typography>
                    </Link>
                    <Typography
                      className={classes.textContent}
                      variant="body2"
                      gutterBottom
                      dangerouslySetInnerHTML={{__html: getContributionHtml(comment, scRoutingContext.url)}}></Typography>
                  </CardContent>
                  {scUserContext.user && (
                    <Box className={classes.commentActionsMenu}>
                      <ContributionActionsMenu
                        commentObject={comment}
                        onRestoreContribution={handleRestore}
                        onHideContribution={handleHide}
                        onDeleteContribution={handleDelete}
                        onEditContribution={handleEdit}
                      />
                    </Box>
                  )}
                </Widget>
                <Box component="span" className={classes.contentSubSection}>
                  {renderTimeAgo(comment)}
                  <Bullet />
                  {renderActionVote(comment)}
                  <Bullet />
                  {renderActionReply(comment)}
                  {renderVotes(comment)}
                </Box>
              </>
            }
          />
        )}
        {comment.comment_count > 0 && <Box className={classes.nestedComments}>{renderLatestComment(comment)}</Box>}
        {scUserContext.user && replyComment && (replyComment.id === comment.id || replyComment.parent === comment.id) && !comment.parent && (
          <Box className={classes.nestedComments}>
            <ReplyCommentObject
              text={replyComment.parent ? `@${replyComment.author.username}, ` : ''}
              autoFocus
              key={`reply-${replyComment.id}`}
              id={`reply-${replyComment.id}`}
              commentObject={replyComment}
              onReply={handleReply}
              readOnly={isReplying}
              {...ReplyCommentObjectProps}
            />
          </Box>
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
        {Boolean(comment.comment_count) && (
          <CommentsObject
            feedObject={commentsObject.feedObject}
            feedObjectType={commentsObject.feedObject ? commentsObject.feedObject.type : feedObjectType}
            hideAdvertising={true}
            comments={[].concat(commentsObject.comments).reverse()}
            endComments={comment.latest_comments}
            previous={comment.comment_count > comment.latest_comments.length ? commentsObject.next : null}
            isLoadingPrevious={commentsObject.isLoadingNext}
            handlePrevious={commentsObject.getNextPage}
            variant={'outlined'}
            CommentComponentProps={{onOpenReply: reply, variant: 'outlined'}}
            CommentsObjectSkeletonProps={{count: 1}}
          />
        )}
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
  return (
    <Root id={id} className={classNames(classes.root, className)}>
      {comment}
    </Root>
  );
}
