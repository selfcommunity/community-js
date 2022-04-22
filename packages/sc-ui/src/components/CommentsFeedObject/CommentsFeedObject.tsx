import React, {useEffect, useMemo, useRef, useState} from 'react';
import {styled} from '@mui/material/styles';
import {FormattedMessage} from 'react-intl';
import CommentObject, {CommentObjectProps} from '../CommentObject';
import ReplyCommentObject, {ReplyCommentObjectProps} from '../CommentObject/ReplyComment';
import {Box} from '@mui/material';
import {SCCommentsOrderBy} from '../../types/comments';
import classNames from 'classnames';
import useThemeProps from '@mui/material/styles/useThemeProps';
import {WidgetProps} from '../Widget';
import CommentsObjectSkeleton from './Skeleton';
import CommentsObject from '../CommentsObject';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {AxiosResponse} from 'axios';
import {
  Endpoints,
  http,
  Logger,
  SCCommentType,
  SCFeedObjectType,
  SCFeedObjectTypologyType,
  useSCFetchCommentObject,
  useSCFetchCommentObjects
} from '@selfcommunity/core';

const PREFIX = 'SCCommentsFeedObject';

const classes = {
  root: `${PREFIX}-root`,
  noComments: `${PREFIX}-no-comments`,
  commentNotFound: `${PREFIX}-comment-not-found`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  width: '100%',
  [`& .${classes.noComments}`]: {
    paddingBottom: 200
  },
  [`& .${classes.commentNotFound}`]: {
    padding: theme.spacing(1),
    fontWeight: '500'
  }
}));

export interface CommentsFeedObjectProps {
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
  CommentsObjectProps?: CommentObjectProps;

  /**
   * Props to spread to single comment object skeleton
   * @default CommentObjectSkeletonProps
   */
  CommentObjectSkeletonProps?: any;

  /**
   * ReplyCommentComponent component
   * Usefull to override the single ReplyComment render component
   * @default CommentObject
   */
  ReplyCommentComponent?: React.ElementType;

  /**
   * Props to spread to single reply comment object
   * @default {variant: 'outlined'}
   */
  ReplyCommentComponentProps?: ReplyCommentObjectProps;

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
   * @default SCCommentsOrderBy.ADDED_AT_DESC
   */
  commentsOrderBy?: SCCommentsOrderBy;

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
   * additional comments to show in the header
   * usefull when from a feedObject publish a comment
   * and this component show recent comments
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
 |commentNotFound|.SCCommentsObject-comment-not-found|Styles applied to the label 'Comment not found'.|
 |noComments|.SCCommentsObject-no-comments|Styles applied to the 'no comments' section.|


 * @param inProps
 */
export default function CommentsFeedObject(inProps: CommentsFeedObjectProps): JSX.Element {
  const props: CommentsFeedObjectProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  // PROPS
  const {
    id = `comments_object_${props.feedObjectType}_${props.feedObjectId ? props.feedObjectId : props.feedObject ? props.feedObject.id : ''}`,
    className,
    feedObjectId,
    feedObject,
    feedObjectType = SCFeedObjectTypologyType.POST,
    commentObjectId,
    commentObject,
    CommentComponent = CommentObject,
    CommentComponentProps = {variant: 'outlined'},
    ReplyCommentComponent = ReplyCommentObject,
    ReplyCommentComponentProps = {ReplyBoxProps: {variant: 'outlined'}},
    renderNoComments,
    page = 1,
    commentsPageCount = 5,
    commentsOrderBy = SCCommentsOrderBy.ADDED_AT_ASC,
    showTitle = false,
    infiniteScrolling = true,
    hidePrimaryReply = false,
    fixedPrimaryReply = false,
    CommentObjectSkeletonProps = {elevation: 0, WidgetProps: {variant: 'outlined'} as WidgetProps},
    onChangePage,
    hideAdvertising = false,
    ...rest
  } = props;

  // STATE
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [comment, setComment] = useState<SCCommentType>(null);
  const {obj: commentObj, setObj: setCommentObj, error: errorCommentObj} = useSCFetchCommentObject({id: commentObjectId, commentObject});
  const commentsObject = useSCFetchCommentObjects({
    id: feedObjectId,
    feedObject,
    feedObjectType,
    page,
    pageSize: commentsPageCount,
    orderBy: commentsOrderBy
  });

  // CONST
  const objId = commentsObject.feedObject ? commentsObject.feedObject.id : null;
  const commentObjId = commentObj ? commentObj.id : null;

  // REFS
  const isComponentMounted = useRef(false);

  /**
   * Total number of comments
   */
  const total = commentsObject.comments.length;

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
   * Render no comments
   */
  function renderNoCommentsFound() {
    return (
      <>
        {renderNoComments ? (
          renderNoComments()
        ) : (
          <Box className={classes.noComments}>
            <FormattedMessage id="ui.commentsObject.noComments" defaultMessage="ui.commentsObject.noComments" />
          </Box>
        )}
      </>
    );
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
    [commentsObject.feedObject, commentObjectId, commentObj]
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
   * Prefetch comments only if obj exists
   */
  useEffect(() => {
    if (commentObjectId || commentObj) {
      fetchComment();
    } else if (commentsObject.feedObject && !isLoading) {
      commentsObject.getNextPage();
    }
    isComponentMounted.current = true;
    return () => {
      isComponentMounted.current = false;
    };
  }, [objId, commentObjId, errorCommentObj]);

  /**
   * Render comments
   */
  let commentsRendered = <></>;
  if (!commentsObject.feedObject || isLoading) {
    /**
     * Until the contribution has not been founded and there are
     * no comments during loading render the skeletons
     */
    commentsRendered = <CommentsObjectSkeleton CommentObjectSkeletonProps={CommentObjectSkeletonProps} elevation={0} />;
  } else if (!total && !commentsObject.isLoadingNext && !isLoading && !comment) {
    /**
     * If comments were not found and loading is finished
     * and the componet and the component was not looking
     * for a particular comment render no comments message
     */
    commentsRendered = renderNoCommentsFound();
  } else {
    /**
     * Two modes available:
     *  - infinite scroll
     *  - load pagination with load more button
     *  !IMPORTANT:
     *  the component will switch to 'load more pagination' mode automatically
     *  in case it needs to display a single comment
     */
    commentsRendered = (
      <CommentsObject
        feedObject={commentsObject.feedObject}
        comments={commentsObject.comments}
        endComments={comment ? [comment] : []}
        next={commentsObject.next}
        isLoadingNext={commentsObject.isLoadingNext}
        handleNext={commentsObject.getNextPage}
        infiniteScrolling={infiniteScrolling && commentsObject.total > 0 && !comment}
      />
    );
  }

  /**
   * Renders root object
   */
  return (
    <Root id={id} className={classNames(classes.root, className)} {...rest}>
      {commentsRendered}
    </Root>
  );
}
