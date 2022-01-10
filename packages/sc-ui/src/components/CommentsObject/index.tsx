import React, {RefObject, useEffect, useMemo, useRef, useState} from 'react';
import {styled} from '@mui/material/styles';
import Card from '@mui/material/Card';
import {SCFeedObjectType, SCFeedObjectTypologyType, useSCFetchFeedObject, http, Endpoints, Logger} from '@selfcommunity/core';
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
  renderComment = null,
  renderNoComments = null,
  commentsPageCount = 5,
  commentsOrderBy = CommentsOrderBy.ADDED_AT_DESC,
  infiniteScrolling = true,
  hidePrimaryReply = false,
  commentsLoadingBoxCount = 3,
  additionalComments = [],
  ...rest
}: {
  feedObjectId?: number;
  feedObject?: SCFeedObjectType;
  feedObjectType?: SCFeedObjectTypologyType;
  renderComment?: (SCCommentType) => JSX.Element;
  renderNoComments?: () => JSX.Element;
  commentsPageCount?: number;
  commentsOrderBy?: CommentsOrderBy;
  infiniteScrolling?: boolean;
  hidePrimaryReply?: boolean;
  commentsLoadingBoxCount?: number;
  additionalComments?: SCCommentType[];
  [p: string]: any;
}): JSX.Element {
  const {obj, setObj} = useSCFetchFeedObject({id: feedObjectId, feedObject, feedObjectType});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [data, setData] = useState<SCCommentType[]>([]);
  const [next, setNext] = useState<string>(null);
  const [total, setTotal] = useState<number>(null);
  const [isReplying, setIsReplying] = useState<boolean>(false);

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
   * Fetch initial data
   */
  function fetchData() {
    if (obj) {
      setIsLoading(true);
      performFetchComments()
        .then((res) => {
          setData([...data, ...res.results]);
          setTotal(res.count);
          setNext(res.next);
          setIsLoading(false);
        })
        .catch((error) => {
          Logger.error(SCOPE_SC_UI, error);
        });
    }
  }

  /**
   * Fetch data only if obj changed
   */
  useEffect(() => {
    if (obj && obj.id && data.length === 0) {
      fetchData();
    }
  }, [obj, data]);

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
  } else if (data.length === 0 && !isLoading) {
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
    if (infiniteScrolling) {
      comments = (
        <InfiniteScroll
          dataLength={data.length}
          next={fetchData}
          hasMore={next !== null}
          loader={<CommentObjectSkeleton {...rest} />}
          endMessage={
            <Typography variant="body2" align="center">
              <b>
                <FormattedMessage id="ui.commentsObject.noOtherComments" defaultMessage="ui.commentsObject.noOtherComments" />
              </b>
            </Typography>
          }>
          {[...additionalComments, ...data].map((comment: SCCommentType, index) => (
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
          {[...additionalComments, ...data].map((comment: SCCommentType, index) => {
            return (
              <React.Fragment key={comment.id}>
                {renderComment ? (
                  renderComment(comment)
                ) : (
                  <CommentObject commentObject={comment} onOpenReply={openReplyBox} feedObject={obj} feedObjectType={feedObjectType} {...rest} />
                )}
              </React.Fragment>
            );
          })}
          {Boolean(next) && !isLoading && (
            <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
              <Button variant="text" onClick={fetchData} disabled={isLoading}>
                <FormattedMessage id="ui.commentsObject.loadMoreComments" defaultMessage="ui.commentsObject.loadMoreComments" />
              </Button>
              {total && (
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
          {isLoading && <CommentObjectSkeleton {...rest} />}
        </>
      );
    }
  }

  /**
   * Render root object
   */
  return (
    <Root>
      {!hidePrimaryReply && <ReplyCommentObject readOnly={isReplying} onReply={handleReply} inline {...rest} />}
      {comments}
    </Root>
  );
}
