import React, {useContext, useState} from 'react';
import {styled} from '@mui/material/styles';
import Widget, {WidgetProps} from '../Widget';
import {FormattedMessage} from 'react-intl';
import {Avatar, Box, Button, CardContent, CardProps, Typography} from '@mui/material';
import Bullet from '../../shared/Bullet';
import classNames from 'classnames';
import {SCOPE_SC_UI} from '../../constants/Errors';
import CommentObjectSkeleton from './Skeleton';
import {SCCommentsOrderBy} from '../../types/comments';
import CommentObjectReply from '../CommentObjectReply';
import ContributionActionsMenu from '../../shared/ContributionActionsMenu';
import DateTimeAgo from '../../shared/DateTimeAgo';
import {getContributionHtml, getContributionType, getRouteData} from '../../utils/contribution';
import {useSnackbar} from 'notistack';
import {useThemeProps} from '@mui/system';
import CommentsObject from '../CommentsObject';
import BaseItem from '../../shared/BaseItem';
import {SCCommentType, SCContributionType, SCFeedObjectType} from '@selfcommunity/types';
import {Endpoints, http, HttpResponse} from '@selfcommunity/api-services';
import {CacheStrategies, Logger, LRUCache} from '@selfcommunity/utils';
import {
  Link,
  SCCache,
  SCContextType,
  SCRoutes,
  SCRoutingContextType,
  SCThemeType,
  SCUserContext,
  SCUserContextType,
  UserUtils,
  useSCContext,
  useSCFetchCommentObject,
  useSCFetchCommentObjects,
  useSCRouting
} from '@selfcommunity/react-core';
import VoteButton from '../VoteButton';
import VoteAudienceButton from '../VoteAudienceButton';
import UserDeletedSnackBar from '../../shared/UserDeletedSnackBar';
import UserAvatar from '../../shared/UserAvatar';

const PREFIX = 'SCCommentObject';

const classes = {
  root: `${PREFIX}-root`,
  comment: `${PREFIX}-comment`,
  nestedComments: `${PREFIX}-nested-comments`,
  avatar: `${PREFIX}-avatar`,
  content: `${PREFIX}-content`,
  author: `${PREFIX}-author`,
  textContent: `${PREFIX}-text-content`,
  commentActionsMenu: `${PREFIX}-comment-actions-menu`,
  deleted: `${PREFIX}-deleted`,
  activityAt: `${PREFIX}-activity-at`,
  vote: `${PREFIX}-vote`,
  voteAudience: `${PREFIX}-vote-audience`,
  reply: `${PREFIX}-reply`,
  contentSubSection: `${PREFIX}-comment-sub-section`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}: {theme: SCThemeType}) => ({}));

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
   * @default SCContributionType.POST
   */
  feedObjectType?: Exclude<SCContributionType, SCContributionType.COMMENT>;

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
   * Props to spread to single comment object CommentObjectReply
   * @default {elevation: 0}
   */
  CommentObjectReplyProps?: CardProps;

  /**
   * If datetime is linkable or not
   * @default true
   */
  linkableCommentDateTime?: boolean;

  /**
   * Caching strategies
   * @default CacheStrategies.CACHE_FIRST
   */
  cacheStrategy?: CacheStrategies;

  /**
   * Other props
   */
  [p: string]: any;
}

/**
 * > API documentation for the Community-JS Comment Object component. Learn about the available props and the CSS API.
 *
 *
 * This component renders a comment item.
 * Take a look at our <strong>demo</strong> component [here](/docs/sdk/community-js/react-ui/Components/CommentObject)

 #### Import

 ```jsx
 import {CommentObject} from '@selfcommunity/react-ui';
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
 |vote|.SCCommentObject-vote|Styles applied to the votes section.|
 |btnVotes|.SCCommentObject-vote-audience|Styles applied to the votes audience section.|
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
    feedObjectType = SCContributionType.POST,
    commentReply,
    onOpenReply,
    onDelete,
    onVote,
    elevation = 0,
    CommentObjectSkeletonProps = {elevation, WidgetProps: {variant: 'outlined'} as WidgetProps},
    CommentObjectReplyProps = {elevation, WidgetProps: {variant: 'outlined'} as WidgetProps},
    linkableCommentDateTime = true,
    cacheStrategy = CacheStrategies.NETWORK_ONLY,
    ...rest
  } = props;

  // CONTEXT
  const scContext: SCContextType = useSCContext();
  const scUserContext: SCUserContextType = useContext(SCUserContext);
  const scRoutingContext: SCRoutingContextType = useSCRouting();
  const {enqueueSnackbar} = useSnackbar();

  // STATE
  const {obj, setObj} = useSCFetchCommentObject({id: commentObjectId, commentObject, cacheStrategy});
  const [replyComment, setReplyComment] = useState<SCCommentType>(commentReply);
  const [isReplying, setIsReplying] = useState<boolean>(false);
  const [isSavingComment, setIsSavingComment] = useState<boolean>(false);
  const [editComment, setEditComment] = useState<SCCommentType>(null);
  const commentsObject = useSCFetchCommentObjects({
    id: feedObjectId,
    feedObject,
    feedObjectType,
    orderBy: SCCommentsOrderBy.ADDED_AT_DESC,
    parent: commentObject ? commentObject.id : commentObjectId,
    cacheStrategy
  });
  const [openAlert, setOpenAlert] = useState<boolean>(false);

  // HANDLERS
  const handleVoteSuccess = (contribution: SCFeedObjectType | SCCommentType) => {
    setObj(contribution as SCCommentType);
    onVote && onVote(contribution as SCCommentType);
  };

  /**
   * Update state object
   * @param newObj
   */
  function updateObject(newObj) {
    LRUCache.set(SCCache.getCommentObjectCacheKey(obj.id), newObj);
    setObj(newObj);
    const contributionType = getContributionType(obj);
    LRUCache.deleteKeysWithPrefix(SCCache.getCommentObjectsCachePrefixKeys(newObj[contributionType].id, contributionType));
  }

  /**
   * Render added_at of the comment
   * @param comment
   */
  function renderTimeAgo(comment) {
    return (
      <>
        {linkableCommentDateTime ? (
          <Link to={scRoutingContext.url(SCRoutes.COMMENT_ROUTE_NAME, getRouteData(comment))} className={classes.activityAt}>
            <DateTimeAgo date={comment.added_at} />
          </Link>
        ) : (
          <DateTimeAgo date={comment.added_at} />
        )}
      </>
    );
  }

  /**
   * Render CommentObjectReply action
   * @param comment
   */
  function renderActionReply(comment) {
    return (
      <Button className={classes.reply} variant="text" onClick={() => reply(comment)}>
        <FormattedMessage id="ui.commentObject.reply" defaultMessage="ui.commentObject.reply" />
      </Button>
    );
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
   * Perform reply
   * Comment of second level
   */
  const performReply = (comment) => {
    return http
      .request({
        url: Endpoints.NewComment.url({}),
        method: Endpoints.NewComment.method,
        data: {
          [`${feedObject ? feedObject.type : feedObjectType}`]: feedObject ? feedObject.id : feedObjectId,
          parent: replyComment.parent ? replyComment.parent : replyComment.id,
          ...(replyComment.parent ? {in_reply_to: replyComment.id} : {}),
          text: comment
        }
      })
      .then((res: HttpResponse<SCCommentType>) => {
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
        variant: 'warning',
        autoHideDuration: 3000
      });
    } else {
      setIsReplying(true);
      performReply(comment)
        .then((data: SCCommentType) => {
          updateObject({...obj, ...{comment_count: obj.comment_count + 1, latest_comments: [...obj.latest_comments, data]}});
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
      updateObject(Object.assign({}, obj, {latest_comments: _latestComment}));
    } else {
      const _comment = Object.assign({}, obj, {deleted: !obj.deleted});
      updateObject(Object.assign({}, obj, {deleted: !obj.deleted}));
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
      updateObject(Object.assign({}, obj, {latest_comments: _latestComment}));
    } else {
      updateObject(Object.assign({}, obj, {collapsed: !obj.collapsed}));
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
      updateObject(Object.assign({}, obj, {latest_comments: _latestComment}));
    } else {
      updateObject(Object.assign({}, obj, {deleted: false}));
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
      .then((res: HttpResponse<SCCommentType>) => {
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
        variant: 'warning',
        autoHideDuration: 3000
      });
    } else {
      setIsSavingComment(true);
      performSave(comment)
        .then((data: SCCommentType) => {
          const newObj = Object.assign({}, obj, {
            text: data.text,
            html: data.html,
            summary: data.summary,
            added_at: data.added_at
          });
          updateObject(newObj);
          setEditComment(null);
          setIsSavingComment(false);
        })
        .catch((error) => {
          Logger.error(SCOPE_SC_UI, error);
          enqueueSnackbar(<FormattedMessage id="ui.common.error.action" defaultMessage="ui.common.error.action" />, {
            variant: 'error',
            autoHideDuration: 3000
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
    const commentHtml = comment.summary_html ? comment.summary_html : comment.html;
    const summaryHtmlTruncated = comment.summary_truncated ? comment.summary_truncated : false;
    const summaryHtml = getContributionHtml(commentHtml, scRoutingContext.url);
    return (
      <React.Fragment key={comment.id}>
        {editComment && editComment.id === comment.id ? (
          <Box className={classes.comment}>
            <CommentObjectReply
              text={comment.html}
              autoFocus
              id={`edit-${comment.id}`}
              onSave={handleSave}
              onCancel={handleCancel}
              editable={!isReplying || !isSavingComment}
              {...CommentObjectReplyProps}
            />
          </Box>
        ) : (
          <BaseItem
            elevation={0}
            className={classes.comment}
            image={
              <Link
                {...(!comment.author.deleted && {to: scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, comment.author)})}
                onClick={comment.author.deleted ? () => setOpenAlert(true) : null}>
                <UserAvatar hide={!obj.author.community_badge}>
                  <Avatar alt={obj.author.username} variant="circular" src={comment.author.avatar} className={classes.avatar} />
                </UserAvatar>
              </Link>
            }
            disableTypography
            primary={
              <>
                <Widget className={classes.content} elevation={elevation} {...rest}>
                  <CardContent className={classNames({[classes.deleted]: obj && obj.deleted})}>
                    <Link
                      className={classes.author}
                      {...(!comment.author.deleted && {to: scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, comment.author)})}
                      onClick={comment.author.deleted ? () => setOpenAlert(true) : null}>
                      <Typography component="span">{comment.author.username}</Typography>
                    </Link>
                    <Typography className={classes.textContent} variant="body2" gutterBottom dangerouslySetInnerHTML={{__html: summaryHtml}} />
                    {summaryHtmlTruncated && (
                      <Link to={scRoutingContext.url(SCRoutes.COMMENT_ROUTE_NAME, getRouteData(comment))}>
                        <FormattedMessage id="ui.commentObject.showMore" defaultMessage="ui.commentObject.showMore" />
                      </Link>
                    )}
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
                  <VoteButton
                    size="small"
                    className={classes.vote}
                    contributionId={comment.id}
                    contributionType={SCContributionType.COMMENT}
                    contribution={comment}
                    onVote={handleVoteSuccess}
                  />
                  <Bullet />
                  {renderActionReply(comment)}
                  <VoteAudienceButton
                    size="small"
                    className={classes.voteAudience}
                    contributionId={comment.id}
                    contributionType={SCContributionType.COMMENT}
                    contribution={comment}
                  />
                </Box>
              </>
            }
          />
        )}
        {comment.comment_count > 0 && <Box className={classes.nestedComments}>{renderLatestComment(comment)}</Box>}
        {scUserContext.user && replyComment && (replyComment.id === comment.id || replyComment.parent === comment.id) && !comment.parent && (
          <Box className={classes.nestedComments}>
            <CommentObjectReply
              text={`@${replyComment.author.username}, `}
              autoFocus
              key={`reply-${replyComment.id}`}
              id={`reply-${replyComment.id}`}
              onReply={handleReply}
              editable={!isReplying}
              {...CommentObjectReplyProps}
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
      <CommentsObject
        feedObject={commentsObject.feedObject}
        feedObjectType={commentsObject.feedObject ? commentsObject.feedObject.type : feedObjectType}
        hideAdvertising={true}
        comments={[].concat(commentsObject.comments).reverse()}
        endComments={comment.latest_comments}
        previous={comment.comment_count > comment.latest_comments.length ? commentsObject.next : null}
        isLoadingPrevious={commentsObject.isLoadingNext}
        handlePrevious={commentsObject.getNextPage}
        CommentComponentProps={{
          onOpenReply: reply,
          CommentObjectSkeletonProps,
          elevation: elevation,
          linkableCommentDateTime: linkableCommentDateTime,
          ...rest,
          cacheStrategy
        }}
        CommentsObjectSkeletonProps={{count: 1, CommentObjectSkeletonProps: CommentObjectSkeletonProps}}
        cacheStrategy={cacheStrategy}
      />
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
    <>
      <Root id={id} className={classNames(classes.root, className)}>
        {comment}
      </Root>
      {openAlert && <UserDeletedSnackBar open={openAlert} handleClose={() => setOpenAlert(false)} />}
    </>
  );
}
