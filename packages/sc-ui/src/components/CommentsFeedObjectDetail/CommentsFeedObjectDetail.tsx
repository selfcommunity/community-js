import React, {useEffect, useState} from 'react';
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
import {SCCommentType, SCFeedObjectType, SCFeedObjectTypologyType, SCPreferences, useSCFetchCommentObjects} from '@selfcommunity/core';
import CommentsObject from '../CommentsObject/CommentsObject';

const PREFIX = 'SCCommentsFeedObjectDetail';

const classes = {
  root: `${PREFIX}-root`,
  loadMoreCommentsButton: `${PREFIX}-load-more-comments-button`,
  paginationLink: `${PREFIX}-pagination-link`,
  paginationFooter: `${PREFIX}-pagination-footer`,
  commentsCounter: `${PREFIX}-comments-counter`,
  noComments: `${PREFIX}-no-comments`,
  commentNotFound: `${PREFIX}-comment-not-found`,
  noOtherComments: `${PREFIX}-no-other-comment`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  boxShadow: 'none',
  position: 'relative',
  display: 'flex',
  flexWrap: 'wrap',
  width: '100%',
  [`& .${classes.loadMoreCommentsButton}`]: {
    textTransform: 'initial'
  },
  [`& .${classes.commentsCounter}`]: {
    paddingRight: theme.spacing()
  },
  [`& .${classes.noComments}`]: {
    paddingBottom: 200
  },
  [`& .${classes.commentNotFound}`]: {
    padding: theme.spacing(1),
    fontWeight: '500'
  },
  [`& .${classes.paginationLink}`]: {
    display: 'none'
  },
  [`& .${classes.paginationFooter}`]: {
    width: '100%'
  }
}));

export interface CommentsFeedObjectDetailProps {
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
   * Usefull to override the single Comment render component
   * @default CommentObject
   */
  CommentComponent?: React.ElementType;

  /**
   * Props to spread to single comment object
   * @default {variant: 'outlined'}
   */
  CommentComponentProps?: CommentObjectProps;

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
 |commentNotFound|.SCCommentsObject-comment-not-found|Styles applied to the label 'Comment not found'.|
 |noOtherComments|.SCCommentsObject-no-other-comments|Styles applied to the label 'No other comments'.|
 |loadMoreCommentsButton|.SCCommentsObject-load-more-comments-button|Styles applied to the load more button.|
 |paginationLink|.SCCommentsObject-pagination-link|Styles applied to the pagination link.|
 |paginationFooter|.SCCommentsObject-pagination-footer|Styles applied to the pagination footer.|
 |commentsCounter|.SCCommentsObject-comments-counter|Styles applied to the comments counter element.|
 |noComments|.SCCommentsObject-no-comments|Styles applied to the 'no comments' section.|


 * @param inProps
 */
export default function CommentsFeedObjectDetail(inProps: CommentsFeedObjectDetailProps): JSX.Element {
  const props: CommentsFeedObjectDetailProps = useThemeProps({
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
    additionalHeaderComments = [],
    onChangePage,
    hideAdvertising = false,
    ...rest
  } = props;

  // STATE
  const commentsObject = useSCFetchCommentObjects({
    id: feedObjectId,
    feedObject,
    feedObjectType,
    page,
    pageSize: commentsPageCount,
    orderBy: commentsOrderBy
  });

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
   * Prefetch comments only if obj exists and additionalHeaderComments is empty
   */
  useEffect(() => {
    if (commentsObject.feedObject) {
      commentsObject.getNextPage();
    }
  }, [commentsObject.feedObject]);

  /**
   * Render comments
   */
  let commentsRendered = <></>;
  if (!commentsObject.feedObject) {
    /**
     * Until the contribution has not been founded and there are
     * no comments during loading render the skeletons
     */
    commentsRendered = <CommentsObjectSkeleton CommentObjectSkeletonProps={CommentObjectSkeletonProps} elevation={0} />;
  } else if (!total && !commentsObject.isLoadingNext) {
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
        feedObjectType={commentsObject.feedObject && commentsObject.feedObject.type}
        comments={commentsObject.comments}
        next={commentsObject.next}
        isLoadingNext={commentsObject.isLoadingNext}
        handleNext={commentsObject.getNextPage}
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
