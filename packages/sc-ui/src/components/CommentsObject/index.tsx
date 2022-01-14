import React, {useEffect, useMemo, useState} from 'react';
import {styled} from '@mui/material/styles';
import Card from '@mui/material/Card';
import {
  SCFeedObjectType,
  SCFeedObjectTypologyType,
  useSCFetchFeedObject,
  http,
  Endpoints,
  Logger,
  useSCFetchCommentObject
} from '@selfcommunity/core';
import {defineMessages, FormattedMessage} from 'react-intl';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {AxiosResponse} from 'axios';
import CommentObject from '../CommentObject';
import {SCCommentType} from '@selfcommunity/core';
import ReplyCommentObject from '../CommentObject/ReplyComment';
import Typography from '@mui/material/Typography';
import InfiniteScroll from 'react-infinite-scroll-component';
import CommentObjectSkeleton from '../Skeleton/CommentObjectSkeleton';
import {Box, Button, Stack} from '@mui/material';
import {CommentsOrderBy} from '../../types/comments';

const messages = defineMessages({
  noOtherComment: {
    id: 'ui.commentsObject.noOtherComment',
    defaultMessage: 'ui.commentsObject.noOtherComment'
  }
});

const PREFIX = 'SCCommentsObject';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(Card, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  boxShadow: 'none'
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
    commentsPageCount = 5,
    commentsOrderBy = CommentsOrderBy.ADDED_AT_DESC,
    infiniteScrolling = true,
    hidePrimaryReply = false,
    commentsLoadingBoxCount = 3,
    additionalHeaderComments = [],
    onChangePage,
    ...rest
  } = props;

  // STATE
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [comment, setComment] = useState<SCCommentType>(null);
  const [comments, setComments] = useState<SCCommentType[]>([]);
  const [next, setNext] = useState<string>(null);
  const [total, setTotal] = useState<number>(null);
  const [isReplying, setIsReplying] = useState<boolean>(false);
  const [infiniteScrollingEnabled, setInfiniteScrollingEnabled] = useState<boolean>(
    infiniteScrolling && !(commentObject || Boolean(commentObjectId))
  );

  // RETRIVE OBJECTS
  const {obj, setObj} = useSCFetchFeedObject({id: feedObjectId, feedObject, feedObjectType});
  const {obj: commentObj, setObj: setCommentObj} = useSCFetchCommentObject({id: commentObjectId, commentObject});

  /**
   * Get Comments
   */
  const performFetchComments = useMemo(
    () => () => {
      return http
        .request({
          url: next ? next : `${Endpoints.Comments.url()}?${feedObjectType}=${obj.id}&limit=${commentsPageCount}&ordering=${commentsOrderBy}`,
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
   * Fetch comments
   */
  function fetchComments() {
    if (obj) {
      setIsLoading(true);
      performFetchComments()
        .then((res) => {
          setComments([...comments, ...res.results]);
          setTotal(res.count);
          setNext(res.next);
          if (commentObj) {
            const _searchId = commentObj.parent ? commentObj.parent : commentObj.id;
            const _isCommentDataIncluded =
              res.results.filter((c) => {
                return c.id === _searchId || (c.latest_comments.length > 0 && c.latest_comments[0].id === _searchId);
              }).length > 0;
            _isCommentDataIncluded && setComment(null);
          }
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
    if (commentObjectId && commentObj) {
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
   * Fetch comments only if obj changed
   */
  useEffect(() => {
    if (commentObjectId) {
      fetchComment();
    } else if (obj && obj.id && comments.length === 0) {
      fetchComments();
    }
  }, [obj, commentObjectId, commentObject, commentObj]);

  /**
   * Reload comments
   */
  useEffect(() => {
    if (obj && obj.id) {
      setNext(null);
      setComments([]);
    }
  }, [commentsPageCount, commentsOrderBy]);

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
   * Handle comment of 2° level
   */
  function handleReply(comment) {
    setIsReplying(true);
    performReply(comment)
      .then((comment: SCCommentType) => {
        setComments([...[comment], ...comments]);
        setIsReplying(false);
      })
      .catch((error) => {
        Logger.error(SCOPE_SC_UI, error);
      });
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
    if (infiniteScrollingEnabled) {
      commentsRendered = (
        <InfiniteScroll
          dataLength={comments.length}
          next={fetchComments}
          hasMore={next !== null}
          loader={<CommentObjectSkeleton {...rest} />}
          endMessage={
            <Typography variant="body2" align="center">
              <b>
                <FormattedMessage id="ui.commentsObject.noOtherComments" defaultMessage="ui.commentsObject.noOtherComments" />
              </b>
            </Typography>
          }>
          {[...additionalHeaderComments, ...comments, ...(comment ? [comment] : [])].map((comment: SCCommentType, index) => (
            <React.Fragment key={index}>
              {renderComment ? (
                renderComment(comment)
              ) : (
                <CommentObject commentObject={comment} onOpenReply={openReplyBox} feedObject={obj} feedObjectType={feedObjectType} {...rest} />
              )}
            </React.Fragment>
          ))}
        </InfiniteScroll>
      );
    } else {
      commentsRendered = (
        <>
          {isLoading && commentObj && comments.length === 0 && <CommentObjectSkeleton {...rest} />}
          {comment && comments.length === 0 && obj && obj.comment_count > 0 && !isLoading && (
            <Button variant="text" onClick={fetchComments} disabled={isLoading}>
              <FormattedMessage id="ui.commentsObject.loadMoreComments" defaultMessage="ui.commentsObject.loadMoreComments" />
            </Button>
          )}
          {[...additionalHeaderComments, ...comments].map((comment: SCCommentType, index) => {
            return (
              <React.Fragment key={comment.id}>
                {renderComment ? (
                  renderComment(comment)
                ) : (
                  <CommentObject
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
              <Button variant="text" onClick={fetchComments} disabled={isLoading}>
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
          {comment && (
            <React.Fragment key={comment.id}>
              {renderComment ? (
                renderComment(comment)
              ) : (
                <CommentObject
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
        </>
      );
    }
  }

  /**
   * Renders root object
   */
  return (
    <Root>
      {!hidePrimaryReply && !commentObj && <ReplyCommentObject readOnly={isReplying} onReply={handleReply} inline {...rest} />}
      {commentsRendered}
    </Root>
  );
}
