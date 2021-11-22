import React, {useEffect, useMemo, useState} from 'react';
import {styled} from '@mui/material/styles';
import Card from '@mui/material/Card';
import FeedObjectSkeleton from '../Skeleton/FeedObjectSkeleton';
import {SCFeedObjectType, SCFeedObjectTypologyType, useSCFetchFeedObject, http, Endpoints, Logger} from '@selfcommunity/core';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {AxiosResponse} from 'axios';
import CommentObject from '../CommentObject';
import {SCCommentType} from '@selfcommunity/core';

const messages = defineMessages({
  comment: {
    id: 'ui.feedObject.comment',
    defaultMessage: 'ui.feedObject.comment'
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
  boxShadow: 'none',
  '& .MuiSvgIcon-root': {
    width: '0.7em',
    marginBottom: '0.5px'
  }
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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<any[]>(null);
  const [next, setNext] = useState<string>(null);

  /**
   * Get Status Flag
   */
  const performFetchComments = useMemo(
    () => () => {
      return http
        .request({
          url: `${Endpoints.Comments.url()}?${feedObjectType}=${obj.id}`,
          method: Endpoints.Comments.method
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
   * Fetch initial flag status
   */
  function fetchData() {
    if (obj) {
      setIsLoading(true);
      performFetchComments()
        .then((data) => {
          setData(data.results);
          setIsLoading(false);
        })
        .catch((error) => {
          Logger.error(SCOPE_SC_UI, error);
        });
    }
  }

  useEffect(() => {
    if (obj && obj.id && !isLoading) {
      fetchData();
    }
  }, [obj]);

  /**
   * Render comments
   */
  let comments = <></>;
  if (data) {
    if (data.length) {
      comments = (
        <>
          {data.map((comment: SCCommentType) => {
            if (renderComment) {
              renderComment(comment);
            }
            return <CommentObject key={comment.id} commentObject={comment} />;
          })}
        </>
      );
    } else {
      comments = (
        <>
          {renderNoComment ? (
            renderNoComment()
          ) : (
            <FormattedMessage id={'ui.commentsObject.noComments'} defaultMessage={'ui.commentsObject.noComments'} />
          )}
        </>
      );
    }
  } else {
    comments = <FeedObjectSkeleton elevation={0} />;
  }

  /**
   * Render root object
   */
  return <Root {...rest}>{comments}</Root>;
}
