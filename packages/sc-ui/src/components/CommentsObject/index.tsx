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
import {Button} from '@mui/material';
import { CommentsOrderBy } from '../../types/comments';

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
  renderNoComment = null,
  commentsPageSize = 5,
  commentsOrderBy = CommentsOrderBy.ADDED_AT_DESC,
  infiniteScrolling = true,
  hidePrimaryReply = false,
  ...rest
}: {
  feedObjectId?: number;
  feedObject?: SCFeedObjectType;
  feedObjectType?: SCFeedObjectTypologyType;
  renderComment?: (SCCommentType) => JSX.Element;
  renderNoComment?: () => JSX.Element;
  commentsPageSize?: number;
  commentsOrderBy?: CommentsOrderBy;
  infiniteScrolling?: boolean;
  hidePrimaryReply?: boolean;
  [p: string]: any;
}): JSX.Element {
  const {obj, setObj} = useSCFetchFeedObject({id: feedObjectId, feedObject, feedObjectType});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [data, setData] = useState<SCCommentType[]>([]);
  const [next, setNext] = useState<string>(null);
  const [replyComment, setReplyComment] = useState<SCCommentType>(null);

  /**
   * Get Comments
   */
  const performFetchComments = useMemo(
    () => () => {
      return http
        .request({
          url: next ? next : `${Endpoints.Comments.url()}?${feedObjectType}=${obj.id}&limit=${commentsPageSize}&ordering=${commentsOrderBy}`,
          method: Endpoints.Comments.method
        })
        .then((res: AxiosResponse<any>) => {
          if (res.status >= 300) {
            return Promise.reject(res);
          }
          return Promise.resolve(res.data);
        });
    },
    [obj, next, commentsOrderBy, commentsPageSize]
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
  }, [commentsPageSize, commentsOrderBy]);

  /**
   * Handle comment reply
   * @param comment
   */
  function handleReply(comment: SCCommentType) {
    // if not replyComment handle a feedObject comment
    console.log(replyComment);
  }

  /**
   * Handle open reply box
   * @param comment
   */
  function openReplyBox(comment) {
    setReplyComment(comment);
    setTimeout(() => {
      const element = document.getElementById(`reply-${comment.id}`);
      element && element.scrollIntoView({behavior: 'smooth', block: 'center'});
    }, 200);
  }

  /**
   * Render comments
   */
  let comments = <></>;
  if (data.length === 0 && isLoading) {
    comments = (
      <>
        <CommentObjectSkeleton {...rest} />
        <CommentObjectSkeleton {...rest} />
        <CommentObjectSkeleton {...rest} />
      </>
    );
  } else if (data.length === 0 && !isLoading) {
    comments = (
      <>
        {renderNoComment ? (
          renderNoComment()
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
          {data.map((comment: SCCommentType, index) => (
            <React.Fragment key={index}>
              {renderComment ? (
                renderComment(comment)
              ) : (
                <>
                  <CommentObject commentObject={comment} onOpenReply={openReplyBox} feedObject={obj} feedObjectType={feedObjectType} {...rest} />
                  {replyComment && (replyComment.id === comment.id || replyComment.parent === comment.id) && (
                    <ReplyCommentObject autoFocus id={`reply-${comment.id}`} commentObject={comment} onReply={handleReply} {...rest} />
                  )}
                </>
              )}
            </React.Fragment>
          ))}
        </InfiniteScroll>
      );
    } else {
      comments = (
        <>
          {data.map((comment: SCCommentType, index) => (
            <React.Fragment key={index}>
              {renderComment ? (
                renderComment(comment)
              ) : (
                <>
                  <CommentObject commentObject={comment} onOpenReply={openReplyBox} feedObject={obj} feedObjectType={feedObjectType} {...rest} />
                  {replyComment && (replyComment.id === comment.id || replyComment.parent === comment.id) && (
                    <ReplyCommentObject autoFocus id={`reply-${comment.id}`} commentObject={comment} onReply={handleReply} {...rest} />
                  )}
                </>
              )}
            </React.Fragment>
          ))}
          {Boolean(next) && !isLoading && (
            <Button variant="text" onClick={fetchData} disabled={isLoading}>
              Load more comments
            </Button>
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
      {!hidePrimaryReply && <ReplyCommentObject onReply={handleReply} inline {...rest} />}
      {comments}
    </Root>
  );
}
