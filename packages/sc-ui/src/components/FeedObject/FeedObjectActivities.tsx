import React, {useEffect, useMemo, useState} from 'react';
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
import {
  Endpoints,
  http,
  Logger,
  SCCommentType,
  SCContextType,
  SCFeedObjectType,
  SCFeedObjectTypologyType,
  SCPreferences,
  SCRoutingContextType,
  SCUserContextType,
  UserUtils,
  useSCContext,
  useSCFetchCommentObjects,
  useSCRouting,
  useSCUser
} from '@selfcommunity/core';
import CommentsObject from '../CommentsObject/CommentsObject';
import ActivitiesMenu from './ActivitiesMenu';
import LazyLoad from 'react-lazyload';
import {SCFeedObjectActivitiesType} from '@selfcommunity/ui';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {useSnackbar} from 'notistack';
import {AxiosResponse} from 'axios';
import RelevantActivities from './RelevantActivities';

const PREFIX = 'SCFeedObjectActivities';

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
  width: '100%',
  paddingBottom: '3px',
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

export interface FeedObjectActivitiesProps {
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
   * Feed Object latest activities
   * @default null
   */
  feedObjectActivities?: any[];

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
 |noOtherComments|.SCCommentsObject-no-other-comments|Styles applied to the label 'No other comments'.|
 |loadMoreCommentsButton|.SCCommentsObject-load-more-comments-button|Styles applied to the load more button.|
 |paginationLink|.SCCommentsObject-pagination-link|Styles applied to the pagination link.|
 |paginationFooter|.SCCommentsObject-pagination-footer|Styles applied to the pagination footer.|
 |commentsCounter|.SCCommentsObject-comments-counter|Styles applied to the comments counter element.|
 |noComments|.SCCommentsObject-no-comments|Styles applied to the 'no comments' section.|


 * @param inProps
 */
export default function FeedObjectActivities(inProps: FeedObjectActivitiesProps): JSX.Element {
  const props: FeedObjectActivitiesProps = useThemeProps({
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
    CommentComponent = CommentObject,
    CommentComponentProps = {variant: 'outlined'},
    ReplyCommentComponent = ReplyCommentObject,
    ReplyCommentComponentProps = {ReplyBoxProps: {variant: 'outlined'}},
    CommentObjectSkeletonProps = {elevation: 0, WidgetProps: {variant: 'outlined'} as WidgetProps},
    feedObjectActivities = [],
    ...rest
  } = props;

  const scUserContext: SCUserContextType = useSCUser();
  const {enqueueSnackbar} = useSnackbar();

  // STATE
  const [comments, setComments] = useState<SCCommentType[]>([]);
  const [isReplying, setIsReplying] = useState<boolean>(false);
  const [selectedActivities, setSelectedActivities] = useState<string>(getInitialSelectedActivitiesType());

  const commentsObject = useSCFetchCommentObjects({
    id: feedObjectId,
    feedObject,
    feedObjectType,
    orderBy:
      selectedActivities === SCFeedObjectActivitiesType.CONNECTIONS_COMMENTS
        ? SCCommentsOrderBy.CONNECTION_DESC
        : selectedActivities === SCFeedObjectActivitiesType.FIRST_COMMENTS
        ? SCCommentsOrderBy.ADDED_AT_ASC
        : SCCommentsOrderBy.ADDED_AT_DESC
  });

  /**
   * Get initial selected activities section
   */
  function getInitialSelectedActivitiesType() {
    if (feedObjectActivities && feedObjectActivities.length > 0) {
      return SCFeedObjectActivitiesType.RELEVANCE_ACTIVITIES;
    }
    return SCFeedObjectActivitiesType.RECENT_COMMENTS;
  }

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
  const performReply = useMemo(
    () => (comment) => {
      return http
        .request({
          url: Endpoints.NewComment.url({}),
          method: Endpoints.NewComment.method,
          data: {
            [`${feedObjectType}`]: commentsObject.feedObject.id,
            text: comment
          }
        })
        .then((res: AxiosResponse<SCCommentType>) => {
          if (res.status >= 300) {
            return Promise.reject(res);
          }
          return Promise.resolve(res.data);
        });
    },
    [commentsObject.feedObject]
  );

  /**
   * Handle comment
   */
  function handleReply(comment) {
    if (UserUtils.isBlocked(scUserContext.user)) {
      enqueueSnackbar(<FormattedMessage id="ui.common.userBlocked" defaultMessage="ui.common.userBlocked" />, {
        variant: 'warning'
      });
    } else {
      setIsReplying(true);
      performReply(comment)
        .then((data: SCCommentType) => {
          if (selectedActivities !== SCFeedObjectActivitiesType.RECENT_COMMENTS) {
            setComments([]);
            setSelectedActivities(SCFeedObjectActivitiesType.RECENT_COMMENTS);
          } else {
            setComments([...[data], ...comments]);
          }
          commentsObject.setFeedObject(Object.assign(commentsObject.feedObject, {comment_count: commentsObject.feedObject.comment_count + 1}));
          setIsReplying(false);
        })
        .catch((error) => {
          Logger.error(SCOPE_SC_UI, error);
          enqueueSnackbar(<FormattedMessage id="ui.common.error.action" defaultMessage="ui.common.error.action" />, {
            variant: 'error'
          });
        });
    }
  }

  /**
   * Prefetch comments only if obj exists and additionalHeaderComments is empty
   */
  useEffect(() => {
    commentsObject.getNextPage();
  }, [commentsObject.feedObject]);

  /**
   * Handle change activities type
   * @param type
   */
  function handleSelectActivitiesType(type) {
    setComments([]);
    setSelectedActivities(type);
  }

  /**
   * Render latest activities of feedObject
   */
  function renderRelevantActivities() {
    return <RelevantActivities activities={feedObjectActivities} />;
  }

  /**
   * Render comments of feedObject
   */
  function renderComments() {
    return (
      <>
        {(commentsObject.feedObject.comment_count > 0 || comments.length > 0) && (
          <LazyLoad once>
            <CommentsObject
              feedObject={commentsObject.feedObject}
              feedObjectType={commentsObject.feedObject && commentsObject.feedObject.type}
              comments={commentsObject.comments}
              startComments={comments}
              next={commentsObject.next}
              isLoadingNext={commentsObject.isLoadingNext}
              handleNext={commentsObject.getNextPage}
            />
          </LazyLoad>
        )}
      </>
    );
  }

  /**
   * Render comments
   */
  console.log(commentsObject.feedObject);
  let activitiesRender = <></>;
  if (!commentsObject.feedObject) {
    /**
     * Until the contribution has not been founded and there are
     * no comments during loading render the skeletons
     */
    activitiesRender = <CommentsObjectSkeleton CommentObjectSkeletonProps={CommentObjectSkeletonProps} elevation={0} />;
  } else {
    activitiesRender = (
      <>
        {scUserContext.user && <ReplyCommentObject inline onReply={handleReply} isLoading={isReplying} key={Number(isReplying)} />}
        {(commentsObject.feedObject.comment_count || (feedObjectActivities && feedObjectActivities.length > 0) || comments.length > 0) && (
          <ActivitiesMenu
            selectedActivities={selectedActivities}
            hideRelevantActivitiesItem={!(feedObjectActivities && feedObjectActivities.length > 0)}
            onChange={handleSelectActivitiesType}
          />
        )}
        {selectedActivities === SCFeedObjectActivitiesType.RELEVANCE_ACTIVITIES ? renderRelevantActivities() : renderComments()}
      </>
    );
  }

  /**
   * Renders root object
   */
  return (
    <Root id={id} className={classNames(classes.root, className)} {...rest}>
      {activitiesRender}
    </Root>
  );
}
