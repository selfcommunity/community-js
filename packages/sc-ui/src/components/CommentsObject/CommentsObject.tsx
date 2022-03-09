import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {styled} from '@mui/material/styles';
import {defineMessages, FormattedMessage} from 'react-intl';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {AxiosResponse} from 'axios';
import CommentObject, {CommentObjectProps, CommentObjectSkeleton} from '../CommentObject';
import ReplyCommentObject, {ReplyCommentObjectProps} from '../CommentObject/ReplyComment';
import Typography from '@mui/material/Typography';
import InfiniteScroll from 'react-infinite-scroll-component';
import {Alert, Box, Button, CardProps, Stack} from '@mui/material';
import {CommentsOrderBy} from '../../types/comments';
import classNames from 'classnames';
import CustomAdv from '../CustomAdv';
import {useSnackbar} from 'notistack';
import {
  Endpoints,
  http,
  Logger,
  SCCommentType,
  SCCustomAdvPosition,
  SCFeedObjectType,
  SCFeedObjectTypologyType,
  SCPreferences,
  SCPreferencesContextType,
  SCUserContextType,
  useSCFetchCommentObject,
  useSCFetchFeedObject,
  useSCPreferences,
  useSCUser
} from '@selfcommunity/core';

const messages = defineMessages({
  noOtherComment: {
    id: 'ui.commentsObject.noOtherComment',
    defaultMessage: 'ui.commentsObject.noOtherComment'
  }
});

const PREFIX = 'SCCommentsObject';

const classes = {
  root: `${PREFIX}-root`,
  fixedPrimaryReply: `${PREFIX}-fixed-primary-reply`,
  fixedTopPrimaryReply: `${PREFIX}-fixed-top-primary-reply`,
  fixedBottomPrimaryReply: `${PREFIX}-fixed-bottom-primary-reply`,
  loadMoreCommentsButton: `${PREFIX}-load-more-comments-button`,
  commentsCounter: `${PREFIX}-comments-counter`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  boxShadow: 'none',
  position: 'relative',
  [`& .${classes.fixedPrimaryReply}`]: {
    height: 100,
    width: '100%',
    position: 'fixed',
    background: '#FFF',
    boxSizing: 'border-box',
    transitionProperty: 'box-shadow',
    transitionDuration: '250ms',
    transitionTimingFunction: 'ease-out',
    zIndex: 1
  },
  [`& .${classes.fixedTopPrimaryReply}`]: {
    top: 0,
    boxShadow: 'rgb(0 0 0 / 5%) 0px 1px 0px 0px, rgb(0 0 0 / 4%) 0px 2px 1px'
  },
  [`& .${classes.fixedBottomPrimaryReply}`]: {
    bottom: 0,
    boxShadow: 'rgb(0 0 0 / 5%) 0px -1px 0px 0px, rgb(0 0 0 / 4%) 0px -1px 1px'
  },
  [`& .${classes.loadMoreCommentsButton}`]: {
    textTransform: 'initial'
  },
  [`& .${classes.commentsCounter}`]: {
    paddingRight: theme.spacing()
  }
}));

export interface CommentsObjectProps {
  /**
   * Id of the CommentsObject
   * @default `comments_object_<feedObjectType>_<feedObjectId | feedObject.id>`
   */
  id?: string;

  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;

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
   * Props to spread to single comment object
   * @default {variant: 'outlined'}
   */
  CommentObjectProps?: CommentObjectProps;

  /**
   * Props to spread to single comment object skeleton
   * @default {variant: 'outlined'}
   */
  CommentObjectSkeletonProps?: CardProps;

  /**
   * Props to spread to single reply comment object
   * @default {variant: 'outlined'}
   */
  ReplyCommentObjectProps?: ReplyCommentObjectProps;

  /**
   * renderComment function
   * Usefull to override the single Comment
   * @default null
   */
  renderComment?: (SCCommentType) => JSX.Element;

  /**
   * renderNoComment function
   * invoked when no comments founds
   * @default null
   */
  renderNoComments?: () => JSX.Element;

  /**
   * page
   * @default 1
   */
  page?: number;

  /**
   * comments per page
   * @default null
   */
  commentsPageCount?: number;

  /**
   * comments orderBy
   * @default CommentsOrderBy.ADDED_AT_DESC
   */
  commentsOrderBy?: CommentsOrderBy;

  /**
   * show title (number of comments)
   */
  showTitle?: boolean;

  /**
   * enable/disable infinite scrolling
   * @default true
   */
  infiniteScrolling?: boolean;

  /**
   * show/hide primary content reply box
   * @default false
   */
  hidePrimaryReply?: boolean;

  /**
   * position the primary reply in the bottom of the component
   * @default false
   */
  fixedPrimaryReply?: boolean;

  /**
   * number of box of skeleton loading to show during loading phase
   * @default 3
   */
  commentsLoadingBoxCount?: number;

  /**
   * additional comments to show in the header
   * @default []
   */
  additionalHeaderComments?: SCCommentType[];

  /**
   * Callback invoked when load comments page
   * Usefull to sync location path for SEO optimization
   * @param page
   */
  onChangePage?: (page) => any;

  /**
   * show/hide box advertising
   * @default false
   */
  hideAdvertising?: boolean;

  /**
   * Other props
   */
  [p: string]: any;
}

const PREFERENCES = [SCPreferences.ADVERTISING_CUSTOM_ADV_ENABLED, SCPreferences.ADVERTISING_CUSTOM_ADV_ONLY_FOR_ANONYMOUS_USERS_ENABLED];
/**
 *> API documentation for the Community-UI Comments Object component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {CommentsObject} from '@selfcommunity/ui';
 ```

 #### Component Name

 The name `SCCommentsObject` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCCommentsObject-root|Styles applied to the root element.|
 |fixedPrimaryReply|.SCCommentsObject-fixed-primary-reply|Styles applied to the comment primary reply element.|
 |fixedTopPrimaryReply|.SCCommentsObject-fixed-top-primary-reply|Styles applied to the comment top primary reply element.|
 |fixedBottomPrimaryReply|.SCCommentsObject-fixed-bottom-primary-reply|Styles applied to the comment bottom primary reply  element.|
 * @param props
 */
export default function CommentsObject(props: CommentsObjectProps): JSX.Element {
  // PROPS
  const {
    id = `comments_object_${props.feedObjectType}_${props.feedObjectId ? props.feedObjectId : props.feedObject ? props.feedObject.id : ''}`,
    className,
    feedObjectId,
    feedObject,
    feedObjectType = SCFeedObjectTypologyType.POST,
    commentObjectId,
    commentObject,
    CommentObjectProps = {variant: 'outlined', elevation: 0},
    renderComment,
    renderNoComments,
    page = 1,
    commentsPageCount = 5,
    commentsOrderBy = CommentsOrderBy.ADDED_AT_DESC,
    showTitle = false,
    infiniteScrolling = true,
    ReplyCommentObjectProps = {variant: 'outlined', elevation: 0},
    hidePrimaryReply = false,
    fixedPrimaryReply = false,
    CommentObjectSkeletonProps = {variant: 'outlined', elevation: 0},
    commentsLoadingBoxCount = 3,
    additionalHeaderComments = [],
    onChangePage,
    hideAdvertising = false,
    ...rest
  } = props;

  // CONTEXT
  const scUserContext: SCUserContextType = useSCUser();
  const scPreferences: SCPreferencesContextType = useSCPreferences();
  const {enqueueSnackbar} = useSnackbar();

  // STATE
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [comment, setComment] = useState<SCCommentType>(null);
  const [comments, setComments] = useState<SCCommentType[]>([]);
  const [newComments, setNewComments] = useState<SCCommentType[]>([]);
  const [next, setNext] = useState<string>(null);
  const [previous, setPrevious] = useState<string>(null);
  const [total, setTotal] = useState<number>(null);
  const [isReplying, setIsReplying] = useState<boolean>(false);
  const [infiniteScrollingEnabled, setInfiniteScrollingEnabled] = useState<boolean>(
    infiniteScrolling && !(commentObject || Boolean(commentObjectId))
  );
  const [rootRef, setRootRef] = useState(null);
  const [rootWidth, setRootWidth] = useState(null);

  // REFS
  const isComponentMounted = useRef(false);

  // RETRIVE OBJECTS
  const {obj, setObj} = useSCFetchFeedObject({id: feedObjectId, feedObject, feedObjectType});
  const {obj: commentObj, setObj: setCommentObj, error: errorCommentObj} = useSCFetchCommentObject({id: commentObjectId, commentObject});

  /**
   * Define root width to set primary reply width
   */
  const rootContainer = useCallback((node) => {
    if (node !== null) {
      setRootRef(node);
      setRootWidth(node.getBoundingClientRect().width);
    }
  }, []);

  /**
   * Render title
   */
  const renderTitle = useMemo(
    () => () => {
      if (showTitle) {
        return (
          <Typography variant="h6" gutterBottom color={'inherit'}>
            <FormattedMessage id="ui.commentsObject.title" defaultMessage="ui.commentsObject.title" values={{total: total}} />
          </Typography>
        );
      }
      return null;
    },
    [total]
  );

  /**
   * Compute preferences
   */
  const preferences = useMemo(() => {
    const _preferences = {};
    PREFERENCES.map((p) => (_preferences[p] = p in scPreferences.preferences ? scPreferences.preferences[p].value : null));
    return _preferences;
  }, [scPreferences.preferences]);

  /**
   * Render advertising above FeedObject Detail
   */
  const renderAdvertising = useMemo(
    () => () => {
      if (
        obj &&
        isComponentMounted.current &&
        !hideAdvertising &&
        preferences[SCPreferences.ADVERTISING_CUSTOM_ADV_ENABLED] &&
        ((preferences[SCPreferences.ADVERTISING_CUSTOM_ADV_ONLY_FOR_ANONYMOUS_USERS_ENABLED] && scUserContext.user === null) ||
          !preferences[SCPreferences.ADVERTISING_CUSTOM_ADV_ONLY_FOR_ANONYMOUS_USERS_ENABLED])
      ) {
        return (
          <CustomAdv
            position={SCCustomAdvPosition.POSITION_IN_COMMENTS}
            {...(obj.categories.length && {categoriesId: obj.categories.map((c) => c.id)})}
          />
        );
      }
      return null;
    },
    [JSON.stringify(obj)]
  );

  /**
   * Remove commentObj or comments from newComments
   * if commentsObj.id or ids of newComments are included in commentsSet
   * @param commentsSet
   */
  const filterExtraComments = (commentsSet) => {
    // Filter comment
    if (comment) {
      const _isCommentDataIncluded = commentsSet.filter((c) => c.id === comment.id).length > 0;
      _isCommentDataIncluded && setComment(null);
    }
    // Filter newComments
    if (newComments.length) {
      const commentIds: number[] = commentsSet.map((c) => c.id);
      let newCommentsToRemove = [];
      newComments.map((nC: SCCommentType) => {
        if (commentIds.includes(nC.id)) {
          newCommentsToRemove.push(nC.id);
        }
      });
      setNewComments(newComments.filter((c) => !newCommentsToRemove.includes(c.id)));
    }
  };

  /**
   * Get Comments
   */
  const performFetchComments = (url) => {
    return http
      .request({
        url,
        method: Endpoints.Comments.method
      })
      .then((res: AxiosResponse<any>) => {
        if (res.status >= 300) {
          return Promise.reject(res);
        }
        return Promise.resolve(res.data);
      });
  };

  /**
   * Fetch prevoius comments
   */
  function fetchPreviousComments() {
    if (obj && previous) {
      setIsLoading(true);
      performFetchComments(previous)
        .then((res) => {
          setComments([...res.results, ...comments]);
          setPrevious(res.previous);
          filterExtraComments(res.results);
          setIsLoading(false);
          onChangePage && onChangePage(comments.length / commentsPageCount + 1);
        })
        .catch((error) => {
          Logger.error(SCOPE_SC_UI, error);
        });
    }
  }

  /**
   * Fetch next comments
   */
  function fetchNextComments() {
    if (obj) {
      const _next = next
        ? next
        : `${Endpoints.Comments.url()}?${feedObjectType}=${obj.id}&limit=${commentsPageCount}&ordering=${commentsOrderBy}&offset=${
            page > 0 ? (page - 1) * commentsPageCount : 0
          }`;
      setIsLoading(true);
      performFetchComments(_next)
        .then((res) => {
          setComments(next ? [...comments, ...res.results] : res.results);
          setTotal(res.count);
          setNext(res.next);
          if (page > 1 && comments.length === 0) {
            // Save initial previous if start from a page > 1
            setPrevious(res.previous);
          }
          filterExtraComments(res.results);
          setIsLoading(false);
          onChangePage && onChangePage(comments.length / commentsPageCount + 1);
        })
        .catch((error) => {
          Logger.error(SCOPE_SC_UI, error);
        });
    }
  }

  /**
   * Get a single comment
   */
  const performFetchComment = useMemo(
    () => (commentId) => {
      return http
        .request({
          url: Endpoints.Comment.url({id: commentId}),
          method: Endpoints.Comment.method
        })
        .then((res: AxiosResponse<any>) => {
          if (res.status >= 300) {
            return Promise.reject(res);
          }
          return Promise.resolve(res.data);
        });
    },
    [obj, commentObjectId, commentObj]
  );

  /**
   * Fetch a single comment
   * and comment parent (if need it)
   */
  function fetchComment() {
    if (commentObj) {
      if (commentObj.parent) {
        setIsLoading(true);
        performFetchComment(commentObj.parent)
          .then((parent) => {
            const _parent = Object.assign({}, parent);
            _parent.latest_comments = [commentObj];
            setComment(_parent);
            setIsLoading(false);
          })
          .catch((error) => {
            // Comment not found
            setIsLoading(false);
            Logger.error(SCOPE_SC_UI, error);
          });
      } else {
        setComment(commentObj);
        setIsLoading(false);
      }
    } else if (errorCommentObj) {
      setIsLoading(false);
    }
  }

  /**
   * Reload comments
   */
  useEffect(() => {
    if (obj && obj.id && isComponentMounted.current) {
      setNext(null);
      setComments([]);
      setNewComments([]);
      fetchNextComments();
    }
  }, [commentsPageCount, commentsOrderBy]);

  /**
   * Fetch comments only if obj change
   */
  useEffect(() => {
    if (commentObjectId || commentObj) {
      fetchComment();
    } else if (obj && obj.id) {
      fetchNextComments();
    }
    isComponentMounted.current = true;
    return () => {
      isComponentMounted.current = false;
    };
  }, [obj, commentObj, errorCommentObj]);

  /**
   * Handle open reply box
   * @param comment
   */
  function openReplyBox(comment) {
    setTimeout(() => {
      const element = document.getElementById(`reply-${comment.id}`);
      element && element.scrollIntoView({behavior: 'smooth', block: 'center'});
    }, 200);
  }

  /**
   * Perform reply
   * Comment of first level
   */
  const performReply = (comment) => {
    return http
      .request({
        url: Endpoints.NewComment.url({}),
        method: Endpoints.NewComment.method,
        data: {
          [`${feedObjectType}`]: feedObjectId,
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
   * Handle comment of 1° level
   */
  function handleReply(content) {
    setIsReplying(true);
    performReply(content)
      .then((c: SCCommentType) => {
        if (infiniteScrollingEnabled && (commentsOrderBy === CommentsOrderBy.ADDED_AT_ASC || previous || comment)) {
          setInfiniteScrollingEnabled(false);
        }
        setNewComments(commentsOrderBy === CommentsOrderBy.ADDED_AT_DESC ? [...[c], ...newComments] : [...newComments, ...[c]]);
        setIsReplying(false);
        setTimeout(() => {
          const element = document.getElementById(`${c.id}`);
          element && element.scrollIntoView({behavior: 'smooth', block: 'center'});
        }, 100);
      })
      .catch((error) => {
        Logger.error(SCOPE_SC_UI, error);
        enqueueSnackbar(<FormattedMessage id="ui.common.error.action" defaultMessage="ui.common.error.action" />, {
          variant: 'error'
        });
      });
  }

  /**
   * Render header primary reply
   */
  function renderHeadPrimaryReply() {
    if (scUserContext.user && !hidePrimaryReply && commentsOrderBy === CommentsOrderBy.ADDED_AT_DESC) {
      return (
        <Box
          className={classNames({[classes.fixedPrimaryReply]: fixedPrimaryReply, [classes.fixedTopPrimaryReply]: fixedPrimaryReply})}
          style={{width: `${rootWidth}px`}}>
          <ReplyCommentObject readOnly={isReplying || isLoading} onReply={handleReply} key={Number(isReplying)} inline {...ReplyCommentObjectProps} />
        </Box>
      );
    }
    return null;
  }

  /**
   * Render footer primary reply
   */
  function renderFooterPrimaryReply() {
    if (scUserContext.user && !hidePrimaryReply && commentsOrderBy === CommentsOrderBy.ADDED_AT_ASC) {
      return (
        <Box
          className={classNames({[classes.fixedPrimaryReply]: fixedPrimaryReply, [classes.fixedBottomPrimaryReply]: fixedPrimaryReply})}
          style={{width: `${rootWidth}px`}}>
          <ReplyCommentObject readOnly={isReplying || isLoading} onReply={handleReply} key={Number(isReplying)} inline {...ReplyCommentObjectProps} />
        </Box>
      );
    }
    return null;
  }

  /**
   * Render new comments
   */
  function renderNewComments(order) {
    if (order === commentsOrderBy) {
      return (
        <>
          {newComments.map((comment: SCCommentType) => {
            return (
              <React.Fragment key={comment.id}>
                {renderComment ? (
                  renderComment(comment)
                ) : (
                  <CommentObject
                    id={comment.id}
                    commentObject={comment}
                    onOpenReply={openReplyBox}
                    feedObject={obj}
                    feedObjectType={feedObjectType}
                    commentReply={commentObj}
                    {...CommentObjectProps}
                  />
                )}
              </React.Fragment>
            );
          })}
        </>
      );
    }
    return null;
  }

  /**
   * Render comments
   */
  const advPosition = Math.floor(Math.random() * (Math.min(total, 5) - 1 + 1) + 1);
  let commentsRendered = <></>;
  if ((comments.length === 0 && isLoading) || !obj) {
    commentsRendered = (
      <>
        {[...Array(commentsLoadingBoxCount)].map((x, i) => (
          <CommentObjectSkeleton key={i} {...CommentObjectSkeletonProps} />
        ))}
      </>
    );
  } else if (comments.length === 0 && !comment && !isLoading && !errorCommentObj) {
    commentsRendered = (
      <>
        {renderNoComments ? (
          renderNoComments()
        ) : (
          <>
            <FormattedMessage id={'ui.commentsObject.noComments'} defaultMessage={'ui.commentsObject.noComments'} />
          </>
        )}
      </>
    );
  } else {
    const wrapperStyles = {
      ...(fixedPrimaryReply ? (commentsOrderBy === CommentsOrderBy.ADDED_AT_DESC ? {paddingTop: 100} : {paddingBottom: 100}) : {})
    };
    if (infiniteScrollingEnabled) {
      commentsRendered = (
        <InfiniteScroll
          dataLength={comments.length}
          next={fetchNextComments}
          hasMore={next !== null}
          loader={<CommentObjectSkeleton {...CommentObjectSkeletonProps} />}
          style={wrapperStyles}
          endMessage={
            !errorCommentObj && commentsOrderBy === CommentsOrderBy.ADDED_AT_DESC ? (
              <Typography variant="body2" align="center">
                <FormattedMessage id="ui.commentsObject.noOtherComments" defaultMessage="ui.commentsObject.noOtherComments" />
              </Typography>
            ) : null
          }>
          {previous && !isLoading && (
            <Button variant="text" onClick={fetchPreviousComments} disabled={isLoading} color="inherit">
              <FormattedMessage id="ui.commentsObject.loadPreviousComments" defaultMessage="ui.commentsObject.loadPreviousComments" />
            </Button>
          )}
          {[...additionalHeaderComments, ...newComments, ...comments, ...(comment ? [comment] : [])].map((c: SCCommentType, index) => {
            return (
              <React.Fragment key={c.id}>
                {renderComment ? (
                  renderComment(c)
                ) : (
                  <CommentObject
                    id={c.id}
                    commentObject={c}
                    onOpenReply={openReplyBox}
                    feedObject={obj}
                    feedObjectType={feedObjectType}
                    {...CommentObjectProps}
                  />
                )}
                {advPosition === index && renderAdvertising()}
              </React.Fragment>
            );
          })}
        </InfiniteScroll>
      );
    } else {
      commentsRendered = (
        <Box style={wrapperStyles}>
          {isLoading && commentObj && comments.length === 0 && <CommentObjectSkeleton {...CommentObjectSkeletonProps} />}
          {renderNewComments(CommentsOrderBy.ADDED_AT_DESC)}
          {comment && comments.length === 0 && obj && obj.comment_count > 0 && !isLoading && (
            <Button variant="text" onClick={fetchNextComments} disabled={isLoading} color="inherit">
              <FormattedMessage id="ui.commentsObject.loadMoreComments" defaultMessage="ui.commentsObject.loadMoreComments" />
            </Button>
          )}
          {previous && !isLoading && (
            <Button variant="text" onClick={fetchPreviousComments} disabled={isLoading} color="inherit">
              <FormattedMessage id="ui.commentsObject.loadPreviousComments" defaultMessage="ui.commentsObject.loadPreviousComments" />
            </Button>
          )}
          {(errorCommentObj || (commentObjectId && !comment && !isLoading)) && comments.length === 0 && (
            <>
              <Alert icon={false} variant="outlined" severity="error">
                <FormattedMessage id="ui.commentsObject.commentNotFound" defaultMessage="ui.commentsObject.commentNotFound" />
              </Alert>
              <Button variant="text" onClick={fetchNextComments} disabled={isLoading} color="inherit">
                <FormattedMessage id="ui.commentsObject.loadMoreComments" defaultMessage="ui.commentsObject.loadMoreComments" />
              </Button>
            </>
          )}
          {[...additionalHeaderComments, ...comments].map((comment: SCCommentType, index) => {
            return (
              <React.Fragment key={comment.id}>
                {renderComment ? (
                  renderComment(comment)
                ) : (
                  <CommentObject
                    id={comment.id}
                    commentObject={comment}
                    onOpenReply={openReplyBox}
                    feedObject={obj}
                    feedObjectType={feedObjectType}
                    commentReply={commentObj}
                    {...CommentObjectProps}
                  />
                )}
                {advPosition === index && renderAdvertising()}
              </React.Fragment>
            );
          })}
          {Boolean(next) && !isLoading && (
            <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
              <Button
                variant="text"
                onClick={fetchNextComments}
                disabled={isLoading}
                color="inherit"
                classes={{root: classes.loadMoreCommentsButton}}>
                <FormattedMessage id="ui.commentsObject.loadMoreComments" defaultMessage="ui.commentsObject.loadMoreComments" />
              </Button>
              {total && !commentObj && (
                <Typography variant="body1" classes={{root: classes.commentsCounter}}>
                  <FormattedMessage
                    id="ui.commentsObject.numberOfComments"
                    defaultMessage="ui.commentsObject.numberOfComments"
                    values={{loaded: comments.length, total: total}}
                  />
                </Typography>
              )}
            </Stack>
          )}
          {isLoading && (!commentObj || (commentObj && comments.length > 0)) && <CommentObjectSkeleton {...CommentObjectSkeletonProps} />}
          {renderNewComments(CommentsOrderBy.ADDED_AT_ASC)}
          {comment && (
            <React.Fragment key={comment.id}>
              {renderComment ? (
                renderComment(comment)
              ) : (
                <CommentObject
                  id={comment.id}
                  commentObject={comment}
                  onOpenReply={openReplyBox}
                  feedObject={obj}
                  feedObjectType={feedObjectType}
                  commentReply={commentObj}
                  {...CommentObjectProps}
                />
              )}
            </React.Fragment>
          )}
        </Box>
      );
    }
  }

  /**
   * Renders root object
   */
  return (
    <Root ref={rootContainer} id={id} className={className} {...rest}>
      {renderTitle()}
      {renderHeadPrimaryReply()}
      {commentsRendered}
      {renderFooterPrimaryReply()}
    </Root>
  );
}
