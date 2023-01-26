import React, {useContext, useMemo, useRef, useState} from 'react';
import {styled} from '@mui/material/styles';
import Widget, {WidgetProps} from '../Widget';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import {Avatar, Box, Button, CardContent, CardProps, Divider, Tooltip, Typography} from '@mui/material';
import Bullet from '../../shared/Bullet';
import classNames from 'classnames';
import Votes from './Votes';
import {SCOPE_SC_UI} from '../../constants/Errors';
import CommentObjectSkeleton from './Skeleton';
import {LoadingButton} from '@mui/lab';
import Icon from '@mui/material/Icon';
import {SCCommentsOrderBy} from '../../types/comments';
import ReplyCommentObject from './ReplyComment';
import ContributionActionsMenu from '../../shared/ContributionActionsMenu';
import DateTimeAgo from '../../shared/DateTimeAgo';
import {getContributionHtml, getContributionType, getRouteData} from '../../utils/contribution';
import {useSnackbar} from 'notistack';
import {useThemeProps} from '@mui/system';
import CommentsObject from '../CommentsObject';
import BaseItem from '../../shared/BaseItem';
import {SCCommentType, SCCommentTypologyType, SCFeedObjectType, SCFeedObjectTypologyType, SCReactionType, SCTagType} from '@selfcommunity/types';
import {http, Endpoints, HttpResponse} from '@selfcommunity/api-services';
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
  useSCRouting,
  SCFeatures,
  useSCPreferences,
  useSCFetchReactions
} from '@selfcommunity/react-core';
import Reactions from './Reactions';
import ReactionsPopover from '../FeedObject/Actions/Reaction/ReactionsPopover';
import {reactionActionTypes} from '../FeedObject/Actions/Reaction/Reaction';

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
  vote: `${PREFIX}-vote`,
  reply: `${PREFIX}-reply`,
  contentSubSection: `${PREFIX}-comment-sub-section`,
  addReaction: `${PREFIX}-add-reaction`,
  reactionIcon: `${PREFIX}-reaction-icon`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}: {theme: SCThemeType}) => ({
  overflow: 'visible',
  width: '100%',
  [`& .${classes.comment}`]: {
    paddingBottom: 0,
    overflow: 'visible',
    '& > div': {
      alignItems: 'flex-start'
    }
  },
  [`& .${classes.nestedComments}`]: {
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 25,
    '& ul.MuiList-root': {
      paddingTop: 0,
      paddingBottom: 0,
      width: '100%',
      '& li.MuiListItem-root': {
        paddingTop: 5
      }
    },
    [theme.breakpoints.up('sm')]: {
      paddingLeft: 55
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
    top: theme.spacing(),
    width: theme.selfcommunity.user.avatar.sizeMedium,
    height: theme.selfcommunity.user.avatar.sizeMedium
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
    },
    '& img': {
      maxWidth: '100%'
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
  [`& .${classes.vote}`]: {
    minWidth: 0
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
 *> API documentation for the Community-JS Comment Object component. Learn about the available props and the CSS API.

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
    ReplyCommentObjectProps = {elevation, WidgetProps: {variant: 'outlined'} as WidgetProps},
    linkableCommentDateTime = true,
    cacheStrategy = CacheStrategies.NETWORK_ONLY,
    ...rest
  } = props;

  // CONTEXT
  const scContext: SCContextType = useSCContext();
  const scUserContext: SCUserContextType = useContext(SCUserContext);
  const scRoutingContext: SCRoutingContextType = useSCRouting();
  const scPreferences = useSCPreferences();
  const {enqueueSnackbar} = useSnackbar();
  const intl = useIntl();

  // STATE
  const {obj, setObj} = useSCFetchCommentObject({id: commentObjectId, commentObject, cacheStrategy});
  const [loadingVote, setLoadingVote] = useState(false);
  const [replyComment, setReplyComment] = useState<SCCommentType>(commentReply);
  const [isReplying, setIsReplying] = useState<boolean>(false);
  const [isSavingComment, setIsSavingComment] = useState<boolean>(false);
  const [editComment, setEditComment] = useState<SCCommentType>(null);
  const {reactions, isLoading} = useSCFetchReactions();
  const [hovered, setHovered] = useState<boolean>(false);
  const popoverAnchor = useRef(null);
  const [timeout, setModalTimeout] = useState(null);
  const defaultReactionId = 1;
  const defaultReaction = reactions.find((r) => r.id === defaultReactionId);
  const commentsObject = useSCFetchCommentObjects({
    id: feedObjectId,
    feedObject,
    feedObjectType,
    orderBy: SCCommentsOrderBy.ADDED_AT_DESC,
    parent: commentObject ? commentObject.id : commentObjectId,
    cacheStrategy
  });
  const reactionsEnabled = scPreferences.features.includes(SCFeatures.REACTION);
  const [reaction, setReaction] = useState<SCReactionType>(null);
  const [_reactionsList, setReactionsList] = useState<[] | any>(obj?.reactions_count);

  // HANDLERS
  function handleMouseEnter() {
    timeout && !hovered && clearTimeout(timeout);
    setModalTimeout(setTimeout(() => setHovered(true), 1000));
  }

  function handleMouseLeave() {
    timeout && clearTimeout(timeout);
    setModalTimeout(setTimeout(() => setHovered(false), 1000));
  }
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
  function dispatchReactionsActions(type: string, reactionObj) {
    const list = [..._reactionsList];
    let updatedList;
    const index = list.findIndex((r) => r.reaction.id === reactionObj.id);
    const inList = list.length ? list.some((o) => o.reaction.id === reactionObj.id) : false;
    switch (type) {
      case reactionActionTypes.REMOVE:
        if (inList && list[index].count > 1) {
          list[index].count = list[index].count - 1;
          updatedList = list;
        } else {
          list.splice(index, 1);
          updatedList = list;
        }
        return updatedList;
      case reactionActionTypes.ADD:
        if (inList) {
          list[index].count = list[index].count + 1;
          updatedList = list;
        } else {
          updatedList = [...list, {reaction: reactionObj, count: 1}];
        }
        return updatedList;
      case reactionActionTypes.CHANGE:
        const i = list.findIndex((r) => r.reaction.id === obj.reaction.id);
        if (!inList) {
          list[i].reaction = list[i].count === 1 ? reactionObj : list[i].reaction;
          list[i].count = list[i].count >= 1 ? list[i].count - 1 : list[i].count;
          setReactionsList(dispatchReactionsActions(reactionActionTypes.ADD, reactionObj));
        } else {
          const n = dispatchReactionsActions(reactionActionTypes.REMOVE, obj.reaction);
          const newIndex = n.findIndex((r) => r.reaction.id === reactionObj.id);
          n[newIndex].count = n[newIndex].count + 1;
          setReactionsList(n);
        }
        break;
    }
  }

  /**
   * Handles reaction actions(add, update, delete);
   * @param voted
   * @param r
   */
  function handleReactions(voted, r) {
    if (voted) {
      const forRemoval = obj.reaction.id === r.id;
      if (forRemoval) {
        setReactionsList(dispatchReactionsActions(reactionActionTypes.REMOVE, obj.reaction));
      } else {
        dispatchReactionsActions(reactionActionTypes.CHANGE, r);
      }
    } else {
      setReactionsList(dispatchReactionsActions(reactionActionTypes.ADD, r));
    }
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
   * Render vote action
   * @param comment
   */
  function renderActionVote(comment) {
    return (
      <LoadingButton variant={'text'} className={classes.vote} onClick={() => vote(comment)} disabled={loadingVote} color="inherit">
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
   * Render reaction action
   */
  function renderActionReaction(comment) {
    return (
      <React.Fragment>
        <LoadingButton
          ref={popoverAnchor}
          onClick={() => addReaction(comment, obj.reaction && obj.voted ? obj.reaction : defaultReaction)}
          onTouchStart={handleMouseEnter}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onTouchMove={handleMouseLeave}
          loading={loadingVote}
          disabled={!obj}
          color="inherit"
          classes={{root: classNames(classes.addReaction)}}>
          {scUserContext.user && obj.voted && obj.reaction ? (
            <Icon fontSize={'large'} className={classes.reactionIcon}>
              <img alt={obj.reaction.label} src={obj.reaction.image} height={16} width={16} />
            </Icon>
          ) : (
            <Icon fontSize={'large'}>thumb_up_off_alt</Icon>
          )}
        </LoadingButton>
        <ReactionsPopover
          anchorEl={popoverAnchor.current}
          open={hovered}
          onOpen={handleMouseEnter}
          onClose={handleMouseLeave}
          reactions={reactions}
          onReactionSelection={(r) => handleReactionVote(comment, r)}
        />
      </React.Fragment>
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
    if (reactionsEnabled) {
      return <Reactions commentObject={comment} reactionsList={_reactionsList} sx={{display: {xs: 'none', sm: 'block'}}} />;
    }
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
        .then((res: HttpResponse<any>) => {
          if (res.status >= 300) {
            return Promise.reject(res);
          }
          return Promise.resolve(res.data);
        });
    },
    [obj]
  );

  /**
   * Performs vote with reactions
   */
  const performReaction = useMemo(
    () => (reaction) => {
      return http
        .request({
          url: Endpoints.Vote.url({type: SCCommentTypologyType, id: obj.id}),
          method: Endpoints.Vote.method,
          params: {
            reaction: reaction.id
          }
        })
        .then((res: HttpResponse<SCTagType>) => {
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
          variant: 'warning',
          autoHideDuration: 3000
        });
      } else {
        setLoadingVote(true);
        performVoteComment(comment)
          .then((data) => {
            const newObj = obj;
            obj.voted = !obj.voted;
            obj.vote_count = obj.vote_count - (obj.voted ? -1 : 1);
            updateObject(obj);
            setLoadingVote(false);
            onVote && onVote(comment);
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
  }

  /**
   * Performs reaction voting
   */
  function addReaction(comment, reaction) {
    handleMouseLeave();
    setReaction(reaction);
    if (scUserContext.user) {
      if (UserUtils.isBlocked(scUserContext.user)) {
        enqueueSnackbar(<FormattedMessage id="ui.common.userBlocked" defaultMessage="ui.common.userBlocked" />, {
          variant: 'warning',
          autoHideDuration: 3000
        });
      } else {
        if (obj && !loadingVote) {
          setLoadingVote(true);
          performReaction(reaction)
            .then((data) => {
              setLoadingVote(false);
              const newObj = Object.assign({}, obj, {
                voted: obj.voted && obj.reaction.id !== reaction.id ? true : !obj.voted,
                vote_count:
                  obj.voted && obj.reaction.id === reaction.id
                    ? obj.vote_count - 1
                    : obj.voted && obj.reaction.id !== reaction.id
                    ? obj.vote_count
                    : obj.vote_count + 1,
                reaction: reaction
              });
              setObj(newObj);
              handleReactions(obj.voted, reaction);
              onVote && onVote(comment);
            })
            .catch((error) => {
              Logger.error(SCOPE_SC_UI, error);
            });
        }
      }
    } else {
      scContext.settings.handleAnonymousAction();
    }
  }

  const handleReactionVote = (comment, r) => {
    addReaction(comment, r);
  };

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
    return (
      <React.Fragment key={comment.id}>
        {editComment && editComment.id === comment.id ? (
          <Box className={classes.comment}>
            <ReplyCommentObject
              text={comment.html}
              autoFocus
              id={`edit-${comment.id}`}
              onSave={handleSave}
              onCancel={handleCancel}
              editable={!isReplying || !isSavingComment}
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
                  {reactionsEnabled ? renderActionReaction(comment) : renderActionVote(comment)}
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
              text={`@${replyComment.author.username}, `}
              autoFocus
              key={`reply-${replyComment.id}`}
              id={`reply-${replyComment.id}`}
              onReply={handleReply}
              editable={!isReplying}
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
    <Root id={id} className={classNames(classes.root, className)}>
      {comment}
    </Root>
  );
}
