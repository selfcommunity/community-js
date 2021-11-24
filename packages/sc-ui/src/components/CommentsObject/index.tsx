import React, {useEffect, useMemo, useState} from 'react';
import {styled} from '@mui/material/styles';
import Card from '@mui/material/Card';
import FeedObjectSkeleton from '../Skeleton/FeedObjectSkeleton';
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
  id = null,
  feedObject = null,
  feedObjectType = SCFeedObjectTypologyType.POST,
  renderComment = null,
  renderNoComment = null,
  ...rest
}: {
  id?: number;
  feedObject?: SCFeedObjectType;
  feedObjectType?: SCFeedObjectTypologyType;
  renderComment?: (SCCommentType) => JSX.Element;
  renderNoComment?: () => JSX.Element;
  [p: string]: any;
}): JSX.Element {
  const {obj, setObj} = useSCFetchFeedObject({id, feedObject, feedObjectType});
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
          url: next ? next : `${Endpoints.Comments.url()}?${feedObjectType}=${obj.id}&limit=5`,
          method: Endpoints.Comments.method
        })
        .then((res: AxiosResponse<any>) => {
          if (res.status >= 300) {
            return Promise.reject(res);
          }
          return Promise.resolve(res.data);
        });
    },
    [obj, next]
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
    if (obj && obj.id) {
      fetchData();
    }
  }, [obj]);

  /**
   * Handle comment reply
   * @param comment
   */
  function handleReply(comment) {
    console.log(comment);
  }

  /**
   * Handle open reply box
   * @param comment
   */
  function openReplyBox(comment) {
    setReplyComment(comment);
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
            <ReplyCommentObject onReply={(c) => handleReply(c)} {...rest} />
          </>
        )}
      </>
    );
  } else {
    comments = (
      <InfiniteScroll
        dataLength={data.length}
        next={fetchData}
        hasMore={next !== null}
        loader={<FeedObjectSkeleton elevation={0} />}
        height={400}
        endMessage={
          <Typography variant="body2" align="center">
            <b>
              <FormattedMessage id="ui.commentsObject.noOtherComment" defaultMessage="ui.commentsObject.noOtherComment" />
            </b>
          </Typography>
        }>
        {data.map((comment: SCCommentType) => {
          if (renderComment) {
            renderComment(comment);
          }
          return (
            <React.Fragment key={comment.id}>
              <CommentObject commentObject={comment} onReply={openReplyBox} feedObject={obj} feedObjectType={feedObjectType} {...rest} />
              {replyComment && (replyComment.id === comment.id || replyComment.parent === comment.id) && (
                <ReplyCommentObject {...rest} onReply={(c) => handleReply(c)} />
              )}
            </React.Fragment>
          );
        })}
      </InfiniteScroll>
    );
  }

  /**
   * Render root object
   */
  return <Root>{comments}</Root>;
}
