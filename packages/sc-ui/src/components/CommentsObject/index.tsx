import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {styled} from '@mui/material/styles';
import Card from '@mui/material/Card';
import {
  Endpoints,
  http,
  Logger,
  SCCommentType,
  SCFeedObjectType,
  SCFeedObjectTypologyType,
  useSCFetchCommentObject,
  useSCFetchFeedObject
} from '@selfcommunity/core';
import {defineMessages, FormattedMessage} from 'react-intl';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {AxiosResponse} from 'axios';
import CommentObject from '../CommentObject';
import ReplyCommentObject from '../CommentObject/ReplyComment';
import Typography from '@mui/material/Typography';
import InfiniteScroll from 'react-infinite-scroll-component';
import CommentObjectSkeleton from '../Skeleton/CommentObjectSkeleton';
import {Box, Button, Stack} from '@mui/material';
import {CommentsOrderBy} from '../../types/comments';
import classNames from 'classnames';

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
  fixedBottomPrimaryReply: `${PREFIX}-fixed-bottom-primary-reply`
};

const Root = styled(Card, {
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
    'box-shadow': 'rgb(0 0 0 / 5%) 0px 1px 0px 0px, rgb(0 0 0 / 4%) 0px 2px 1px'
  },
  [`& .${classes.fixedBottomPrimaryReply}`]: {
    bottom: 0,
    'box-shadow': 'rgb(0 0 0 / 5%) 0px -1px 0px 0px, rgb(0 0 0 / 4%) 0px -1px 1px'
  }
}));

export interface CommentsObjectProps {
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
   * Other props
   */
  [p: string]: any;
}

export default function CommentsObject(props: CommentsObjectProps): JSX.Element {
  // PROPS
  const {
    feedObjectId,
    feedObject,
    feedObjectType = SCFeedObjectTypologyType.POST,
    commentObjectId,
    commentObject,
    renderComment,
    renderNoComments,
    page = 1,
    commentsPageCount = 5,
    commentsOrderBy = CommentsOrderBy.ADDED_AT_DESC,
    showTitle = false,
    infiniteScrolling = true,
    hidePrimaryReply = false,
    fixedPrimaryReply = false,
    commentsLoadingBoxCount = 3,
    additionalHeaderComments = [],
    onChangePage,
    ...rest
  } = props;

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

  // RETRIVE OBJECTS
  const {obj, setObj} = useSCFetchFeedObject({id: feedObjectId, feedObject, feedObjectType});
  const {obj: commentObj, setObj: setCommentObj} = useSCFetchCommentObject({id: commentObjectId, commentObject});

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
          <Typography variant="h6" gutterBottom>
            <FormattedMessage id="ui.commentsObject.title" defaultMessage="ui.commentsObject.title" values={{total: total}} />
          </Typography>
        );
      }
      return null;
    },
    [total]
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
  const performFetchComments = useMemo(
    () => (url) => {
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
    },
    [obj, next, commentsOrderBy, commentsPageCount]
  );

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
      setIsLoading(true);
      performFetchComments(
        next
          ? next
          : `${Endpoints.Comments.url()}?${feedObjectType}=${obj.id}&limit=${commentsPageCount}&ordering=${commentsOrderBy}&offset=${
              page > 0 ? (page - 1) * commentsPageCount : 0
            }`
      )
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
    setIsLoading(true);
    if (commentObj) {
      if (commentObj.parent) {
        performFetchComment(commentObj.parent)
          .then((parent) => {
            const _parent = Object.assign({}, parent);
            _parent.latest_comments = [commentObj];
            setComment(_parent);
            setIsLoading(false);
          })
          .catch((error) => {
            Logger.error(SCOPE_SC_UI, error);
          });
      } else {
        setComment(commentObj);
        setIsLoading(false);
      }
    }
  }

  /**
   * Reload comments
   */
  useEffect(() => {
    if (obj && obj.id) {
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
  }, [obj, commentObj]);

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
        if (infiniteScrollingEnabled && (previous || comment)) {
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
      });
  }

  /**
   * Render header primary reply
   */
  function renderHeadPrimaryReply() {
    if (!hidePrimaryReply && commentsOrderBy === CommentsOrderBy.ADDED_AT_DESC) {
      return (
        <Box
          className={classNames({[classes.fixedPrimaryReply]: fixedPrimaryReply, [classes.fixedTopPrimaryReply]: fixedPrimaryReply})}
          style={{width: `${rootWidth}px`}}>
          <ReplyCommentObject readOnly={isReplying || isLoading} onReply={handleReply} key={Number(isReplying)} inline {...rest} />
        </Box>
      );
    }
    return null;
  }

  /**
   * Render footer primary reply
   */
  function renderFooterPrimaryReply() {
    if (!hidePrimaryReply && commentsOrderBy === CommentsOrderBy.ADDED_AT_ASC) {
      return (
        <Box
          className={classNames({[classes.fixedPrimaryReply]: fixedPrimaryReply, [classes.fixedBottomPrimaryReply]: fixedPrimaryReply})}
          style={{width: `${rootWidth}px`}}>
          <ReplyCommentObject readOnly={isReplying || isLoading} onReply={handleReply} key={Number(isReplying)} inline {...rest} />
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
          {newComments.map((comment: SCCommentType, index) => {
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
                    {...rest}
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
  let commentsRendered = <></>;
  if (comments.length === 0 && isLoading) {
    commentsRendered = (
      <>
        {[...Array(commentsLoadingBoxCount)].map((x, i) => (
          <CommentObjectSkeleton key={i} {...rest} />
        ))}
      </>
    );
  } else if (comments.length === 0 && !comment && !isLoading) {
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
          loader={<CommentObjectSkeleton {...rest} />}
          style={wrapperStyles}
          endMessage={
            commentsOrderBy === CommentsOrderBy.ADDED_AT_DESC ? (
              <Typography variant="body2" align="center">
                <b>
                  <FormattedMessage id="ui.commentsObject.noOtherComments" defaultMessage="ui.commentsObject.noOtherComments" />
                </b>
              </Typography>
            ) : null
          }>
          {previous && !isLoading && (
            <Button variant="text" onClick={fetchPreviousComments} disabled={isLoading}>
              <FormattedMessage id="ui.commentsObject.loadPreviousComments" defaultMessage="ui.commentsObject.loadPreviousComments" />
            </Button>
          )}
          {[...additionalHeaderComments, ...newComments, ...comments, ...(comment ? [comment] : [])].map((c: SCCommentType) => {
            return (
              <React.Fragment key={c.id}>
                {renderComment ? (
                  renderComment(c)
                ) : (
                  <CommentObject id={c.id} commentObject={c} onOpenReply={openReplyBox} feedObject={obj} feedObjectType={feedObjectType} {...rest} />
                )}
              </React.Fragment>
            );
          })}
        </InfiniteScroll>
      );
    } else {
      commentsRendered = (
        <Box style={wrapperStyles}>
          {isLoading && commentObj && comments.length === 0 && <CommentObjectSkeleton {...rest} />}
          {renderNewComments(CommentsOrderBy.ADDED_AT_DESC)}
          {comment && comments.length === 0 && obj && obj.comment_count > 0 && !isLoading && (
            <Button variant="text" onClick={fetchNextComments} disabled={isLoading}>
              <FormattedMessage id="ui.commentsObject.loadMoreComments" defaultMessage="ui.commentsObject.loadMoreComments" />
            </Button>
          )}
          {previous && !isLoading && (
            <Button variant="text" onClick={fetchPreviousComments} disabled={isLoading}>
              <FormattedMessage id="ui.commentsObject.loadPreviousComments" defaultMessage="ui.commentsObject.loadPreviousComments" />
            </Button>
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
                    {...rest}
                  />
                )}
              </React.Fragment>
            );
          })}
          {Boolean(next) && !isLoading && (
            <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
              <Button variant="text" onClick={fetchNextComments} disabled={isLoading}>
                <FormattedMessage id="ui.commentsObject.loadMoreComments" defaultMessage="ui.commentsObject.loadMoreComments" />
              </Button>
              {total && !commentObj && (
                <Typography variant="body1">
                  <FormattedMessage
                    id="ui.commentsObject.numberOfComments"
                    defaultMessage="ui.commentsObject.numberOfComments"
                    values={{loaded: comments.length, total: total}}
                  />
                </Typography>
              )}
            </Stack>
          )}
          {isLoading && (!commentObj || (commentObj && comments.length > 0)) && <CommentObjectSkeleton {...rest} />}
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
                  {...rest}
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
    <Root ref={rootContainer}>
      {renderTitle()}
      {renderHeadPrimaryReply()}
      {commentsRendered}
      {renderFooterPrimaryReply()}
    </Root>
  );
}
