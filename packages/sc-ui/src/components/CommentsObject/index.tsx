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

export default function CommentsObject({
  feedObjectId = null,
  feedObject = null,
  feedObjectType = SCFeedObjectTypologyType.POST,
  commentObjectId = null,
  commentObject = null,
  renderComment = null,
  renderNoComments = null,
  commentsPageCount = 5,
  commentsOrderBy = CommentsOrderBy.ADDED_AT_DESC,
  infiniteScrolling = true,
  hidePrimaryReply = false,
  commentsLoadingBoxCount = 3,
  additionalHeaderComments = [],
  ...rest
}: {
  feedObjectId?: number;
  feedObject?: SCFeedObjectType;
  feedObjectType?: SCFeedObjectTypologyType;
  commentObjectId?: number;
  commentObject?: SCCommentType;
  renderComment?: (SCCommentType) => JSX.Element;
  renderNoComments?: () => JSX.Element;
  commentsPageCount?: number;
  commentsOrderBy?: CommentsOrderBy;
  infiniteScrolling?: boolean;
  hidePrimaryReply?: boolean;
  commentsLoadingBoxCount?: number;
  additionalHeaderComments?: SCCommentType[];
  [p: string]: any;
}): JSX.Element {
  // STATE
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [commentData, setCommentData] = useState<SCCommentType>(null);
  const [data, setData] = useState<SCCommentType[]>([]);
  const [next, setNext] = useState<string>(null);
  const [total, setTotal] = useState<number>(null);
  const [isReplying, setIsReplying] = useState<boolean>(false);
  const [infiniteScrollingEnabled, setInfiniteScrollingEnabled] = useState<boolean>(
    infiniteScrolling && !(commentObject || Boolean(commentObjectId))
  );


  // RETRIVE objects
  const {obj, setObj} = useSCFetchFeedObject({id: feedObjectId, feedObject, feedObjectType});
  const commentObj = useSCFetchCommentObject({id: commentObjectId, commentObject});

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
   * Fetch COMMENTS initial data
   */
  function fetchCommentsData() {
    if (obj) {
      setIsLoading(true);
      performFetchComments()
        .then((res) => {
          setData([...data, ...res.results]);
          setTotal(res.count);
          setNext(res.next);
          if (commentObj.obj) {
            const _searchId = commentObj.obj.parent ? commentObj.obj.parent : commentObj.obj.id;
            const _isCommentDataIncluded =
              res.results.filter((c) => {
                return c.id === _searchId || (c.latest_comments.length > 0 && c.latest_comments[0].id === _searchId);
              }).length > 0;
            _isCommentDataIncluded && setCommentData(null);
          }
          setIsLoading(false);
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
   * Fetch COMMENT initial data
   * and comment parent (if need it)
   */
  function fetchCommentData() {
    setIsLoading(true);
    if (commentObjectId && commentObj && commentObj.obj) {
      if (commentObj.obj.parent) {
        performFetchComment(commentObj.obj.parent)
          .then((parent) => {
            const _parent = Object.assign({}, parent);
            _parent.latest_comments = [commentObj.obj];
            setCommentData(parent);
            setIsLoading(false);
          })
          .catch((error) => {
            Logger.error(SCOPE_SC_UI, error);
          });
      } else {
        setCommentData(commentObj.obj);
        setIsLoading(false);
      }
    }
  }

  /**
   * Fetch data only if obj changed
   */
  useEffect(() => {
    if (commentObjectId) {
      fetchCommentData();
    } else if (obj && obj.id && data.length === 0) {
      fetchCommentsData();
    }
  }, [obj, commentObjectId, commentObject, commentObj.obj]);

  /**
   * Reload comments data
   */
  useEffect(() => {
    if (obj && obj.id) {
      setNext(null);
      setData([]);
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
        setData([...[comment], ...data]);
        setIsReplying(false);
      })
      .catch((error) => {
        Logger.error(SCOPE_SC_UI, error);
      });
  }

  /**
   * Render comments
   */
  let comments = <></>;
  if (data.length === 0 && isLoading) {
    comments = (
      <>
        {[...Array(commentsLoadingBoxCount)].map((x, i) => (
          <CommentObjectSkeleton key={i} {...rest} />
        ))}
      </>
    );
  } else if (data.length === 0 && !commentData && !isLoading) {
    comments = (
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
      comments = (
        <InfiniteScroll
          dataLength={data.length}
          next={fetchCommentsData}
          hasMore={next !== null}
          loader={<CommentObjectSkeleton {...rest} />}
          endMessage={
            <Typography variant="body2" align="center">
              <b>
                <FormattedMessage id="ui.commentsObject.noOtherComments" defaultMessage="ui.commentsObject.noOtherComments" />
              </b>
            </Typography>
          }>
          {[...additionalHeaderComments, ...data, ...(commentData ? [commentData] : [])].map((comment: SCCommentType, index) => (
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
      comments = (
        <>
          {isLoading && commentObj.obj && data.length === 0 && <CommentObjectSkeleton {...rest} />}
          {commentData && data.length === 0 && obj && obj.comment_count > 0 && !isLoading && (
            <Button variant="text" onClick={fetchCommentsData} disabled={isLoading}>
              <FormattedMessage id="ui.commentsObject.loadMoreComments" defaultMessage="ui.commentsObject.loadMoreComments" />
            </Button>
          )}
          {[...additionalHeaderComments, ...data].map((comment: SCCommentType, index) => {
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
                    commentReply={commentObj.obj ? commentObj.obj : null}
                    {...rest}
                  />
                )}
              </React.Fragment>
            );
          })}
          {Boolean(next) && !isLoading && (
            <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
              <Button variant="text" onClick={fetchCommentsData} disabled={isLoading}>
                <FormattedMessage id="ui.commentsObject.loadMoreComments" defaultMessage="ui.commentsObject.loadMoreComments" />
              </Button>
              {total && !commentObj.obj && (
                <Typography variant="body1">
                  <FormattedMessage
                    id="ui.commentsObject.numberOfComments"
                    defaultMessage="ui.commentsObject.numberOfComments"
                    values={{loaded: data.length, total: total}}
                  />
                </Typography>
              )}
            </Stack>
          )}
          {isLoading && (!commentObj.obj || (commentObj.obj && data.length > 0)) && <CommentObjectSkeleton {...rest} />}
          {commentData && (
            <React.Fragment key={commentData.id}>
              {renderComment ? (
                renderComment(commentData)
              ) : (
                <CommentObject
                  commentObject={commentData}
                  onOpenReply={openReplyBox}
                  feedObject={obj}
                  feedObjectType={feedObjectType}
                  commentReply={commentObj.obj ? commentObj.obj : null}
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
      {!hidePrimaryReply && !commentObj.obj && <ReplyCommentObject readOnly={isReplying} onReply={handleReply} inline {...rest} />}
      {comments}
    </Root>
  );
}
