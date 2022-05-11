import React, {useEffect, useMemo, useState} from 'react';
import {styled} from '@mui/material/styles';
import {FormattedMessage} from 'react-intl';
import CommentObject, {CommentObjectProps} from '../CommentObject';
import {Box} from '@mui/material';
import {SCCommentsOrderBy} from '../../types/comments';
import classNames from 'classnames';
import useThemeProps from '@mui/material/styles/useThemeProps';
import {WidgetProps} from '../Widget';
import CommentsObject from '../CommentsObject';
import {SCOPE_SC_UI} from '../../constants/Errors';
import Typography from '@mui/material/Typography';
import {getContribution} from '../../utils/contribution';
import {http, Endpoints, HttpResponse} from '@selfcommunity/api-services';
import {Logger, useSCFetchCommentObject, useSCFetchCommentObjects} from '@selfcommunity/react-core';
import {SCCommentType, SCFeedObjectType, SCFeedObjectTypologyType} from '@selfcommunity/types';

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
    padding: theme.spacing(),
    paddingLeft: 0
  },
  [`& .${classes.commentNotFound}`]: {
    padding: theme.spacing()
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
   * CommentComponent component
   * Useful to override the single Comment render component
   * @default CommentObject
   */
  CommentComponent?: (inProps: CommentObjectProps) => JSX.Element;

  /**
   * Props to spread to CommentObject component
   * @default {variant: 'outlined}
   */
  CommentComponentProps?: CommentObjectProps;

  /**
   * Props to spread to CommentObject component
   * @default {elevation: 0, variant: 'outlined'}
   */
  CommentObjectSkeletonProps?: any;

  /**
   * renderNoComment function
   * invoked when no comments founds
   * @default null
   */
  renderNoComments?: () => JSX.Element;

  /**
   * renderCommentNotFound function
   * invoked when comment not found
   * @default null
   */
  renderCommentNotFound?: () => JSX.Element;

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
   * additional comments to show in the header/footer
   * useful when from a feedObject publish a comment
   * @default []
   */
  comments?: SCCommentType[];

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

/**
 *> API documentation for the Community-UI Comments Object component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {CommentsObject} from '@selfcommunity/react-ui';
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
    id = `comments_object_${props.feedObjectType ? props.feedObjectType : props.feedObject ? props.feedObject.type : ''}_${
      props.feedObjectId ? props.feedObjectId : props.feedObject ? props.feedObject.id : ''
    }`,
    className,
    feedObjectId,
    feedObject,
    feedObjectType = SCFeedObjectTypologyType.POST,
    commentObjectId,
    commentObject,
    CommentComponent = CommentObject,
    CommentComponentProps = {variant: 'outlined'},
    CommentObjectSkeletonProps = {elevation: 0, WidgetProps: {variant: 'outlined'} as WidgetProps},
    renderNoComments,
    renderCommentNotFound,
    page = 1,
    commentsPageCount = 5,
    commentsOrderBy = SCCommentsOrderBy.ADDED_AT_ASC,
    showTitle = false,
    infiniteScrolling = true,
    onChangePage,
    comments = [],
    ...rest
  } = props;

  // STATE
  const commentsObject = useSCFetchCommentObjects({
    id: feedObjectId,
    feedObject,
    feedObjectType,
    offset: (page - 1) * commentsPageCount,
    pageSize: commentsPageCount,
    orderBy: commentsOrderBy,
    onChangePage: onChangePage
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [comment, setComment] = useState<SCCommentType>(null);
  const {obj: commentObj, error: errorCommentObj} = useSCFetchCommentObject({id: commentObjectId, commentObject});
  const [commentError, setCommentError] = useState<boolean>(null);

  // CONST
  const objId = commentsObject.feedObject ? commentsObject.feedObject.id : null;
  const commentObjId = commentObj ? commentObj.id : null;

  /**
   * Total number of comments
   */
  const total = commentsObject.total + comments.length;

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
    [total, isLoading]
  );

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
   * Render comment not found
   */
  function renderCommentNotFoundError() {
    return (
      <>
        {renderCommentNotFound ? (
          renderCommentNotFound()
        ) : (
          <Box className={classes.commentNotFound}>
            <FormattedMessage id="ui.commentsObject.commentNotFound" defaultMessage="ui.commentsObject.commentNotFound" />
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
        .then((res: HttpResponse<any>) => {
          if (res.status >= 300) {
            return Promise.reject(res);
          }
          return Promise.resolve(res.data);
        });
    },
    [commentsObject.feedObject, commentObjectId, commentObj]
  );

  /**
   * Focus on comment
   * @param comment
   */
  function scrollToComment(comment) {
    // Add (window.innerHeight / 2) to scroll
    // (usually >= (topBar + offset) and in center of the screen)
    setTimeout(() => {
      const el = document.querySelector(`#comment_object_${comment.id}`);
      if (el) {
        const y = el.getBoundingClientRect().top + window.pageYOffset - window.innerHeight / 2;
        window.scrollTo({top: y, behavior: 'smooth'});
      }
    }, 300);
  }

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
            if (getContribution(parent).id === commentsObject.feedObject.id) {
              setComment(_parent);
              scrollToComment(_parent);
            } else {
              setCommentError(true);
            }
            setIsLoading(false);
          })
          .catch((error) => {
            // Comment not found
            setIsLoading(false);
            Logger.error(SCOPE_SC_UI, error);
          });
      } else {
        if (getContribution(commentObj).id === commentsObject.feedObject.id) {
          setComment(commentObj);
          scrollToComment(commentObj);
        } else {
          setCommentError(true);
        }
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
    if (objId !== null && !isLoading) {
      if (commentObjectId || commentObj) {
        fetchComment();
      } else if (!isLoading) {
        commentsObject.getNextPage();
      }
    }
  }, [objId, commentObjId, errorCommentObj]);

  /**
   * Render comments
   */
  let commentsRendered = <></>;
  if (commentsObject.componentLoaded && !total && !commentsObject.isLoadingNext && !isLoading) {
    /**
     * If comments were not found and loading is finished
     * and the component was not looking for a particular
     * comment render no comments message
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
      <>
        {Boolean((commentError || errorCommentObj) && !isLoading && !total) && renderCommentNotFoundError()}
        <CommentsObject
          feedObject={commentsObject.feedObject}
          comments={commentsObject.comments}
          endComments={[...(comment ? [comment] : []), ...(commentsOrderBy === SCCommentsOrderBy.ADDED_AT_ASC ? comments : [])]}
          startComments={[...(commentsOrderBy === SCCommentsOrderBy.ADDED_AT_ASC ? [] : comments)]}
          previous={commentsObject.previous}
          handlePrevious={commentsObject.getPreviousPage}
          isLoadingPrevious={commentsObject.isLoadingPrevious}
          next={commentsObject.next}
          isLoadingNext={commentsObject.isLoadingNext}
          handleNext={commentsObject.getNextPage}
          page={commentsObject.page}
          infiniteScrolling={infiniteScrolling && commentsObject.total > 0 && !comment && !comments.length}
          CommentComponent={CommentComponent}
          CommentComponentProps={CommentComponentProps}
          CommentObjectSkeletonProps={CommentObjectSkeletonProps}
        />
      </>
    );
  }

  /**
   * Renders root object
   */
  return (
    <Root id={id} className={classNames(classes.root, className)} {...rest}>
      {renderTitle()}
      {commentsRendered}
    </Root>
  );
}
