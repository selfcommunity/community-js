import React, {useState} from 'react';
import {styled} from '@mui/material/styles';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import LessonCommentObject, {LessonCommentObjectProps, LessonCommentObjectSkeleton} from '../LessonCommentObject';
import {Box} from '@mui/material';
import classNames from 'classnames';
import {useThemeProps} from '@mui/system';
import {InView} from 'react-intersection-observer';
import {SCCourseCommentType, SCCourseLessonType} from '@selfcommunity/types';
import {CacheStrategies, Logger} from '@selfcommunity/utils';
import {SCUserContextType, UserUtils, useSCFetchLesson, useSCUser} from '@selfcommunity/react-core';
import {PREFIX} from './constants';
import LessonCommentsObjectSkeleton from './Skeleton';
import ScrollContainer from '../../shared/ScrollContainer';
import CommentObjectReply from '../CommentObjectReply';
import {enqueueSnackbar} from 'notistack';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {Endpoints, http, HttpResponse} from '@selfcommunity/api-services';

const messages = defineMessages({
  commentEditorPlaceholder: {
    id: 'ui.lessonCommentObjects.editor.placeholder',
    defaultMessage: 'ui.lessonCommentObjects.editor.placeholder'
  }
});

const classes = {
  root: `${PREFIX}-root`,
  loadNextCommentsButton: `${PREFIX}-load-more-comments-button`,
  loadPreviousCommentsButton: `${PREFIX}-load-previous-comments-button`,
  paginationLink: `${PREFIX}-pagination-link`,
  pagination: `${PREFIX}-pagination`,
  commentsCounter: `${PREFIX}-comments-counter`,
  commentNotFound: `${PREFIX}-comment-not-found`,
  noOtherComments: `${PREFIX}-no-other-comment`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root'
})(() => ({}));

export interface LessonCommentObjectsProps {
  /**
   * Id of the LessonCommentObjects
   * @default `lesson_comments_object_<lessonObjectId | lessonObject.id>`
   */
  id?: string;

  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;

  /**
   * Id of lesson object
   * @default null
   */
  lessonObjectId?: number;

  /**
   * Lesson object
   * @default null
   */
  lessonObject?: SCCourseLessonType;

  /**
   * CommentComponent component
   * Useful to override the single Comment render component
   * @default LessonCommentObject
   */
  CommentComponent?: (inProps: LessonCommentObjectProps) => JSX.Element;

  /**
   * Props to spread to single comment object
   * @default {}
   */
  CommentComponentProps?: LessonCommentObjectProps;

  /**
   * Props to spread to CommentsObjectSkeleton
   * @default {}
   */
  CommentsObjectSkeletonProps?: any;

  /**
   * Props to spread to single comment object skeleton
   * @default {elevation: 0},
   */
  CommentObjectSkeletonProps?: any;

  /**
   * Comments to show
   */
  comments: SCCourseCommentType[];

  /**
   * Next url
   * If exist show load next button
   */
  next?: string;

  /**
   * Next page
   */
  nextPage?: number;

  /**
   * Is loading next comments
   * If exist load next button is replaced by comment skeleton
   */
  isLoadingNext?: boolean;

  /**
   * Handle load next comments callback
   */
  handleNext?: () => void;
  /**
   * Enable/disable infinite scrolling
   * @default true
   */
  infiniteScrolling?: boolean;

  /**
   * Caching strategies
   * @default CacheStrategies.CACHE_FIRST
   */
  cacheStrategy?: CacheStrategies;

  /**
   *
   */
  onUpdate?: (comments: SCCourseCommentType[]) => void;
  /**
   * Other props
   */
  [p: string]: any;
}

/**
 * > API documentation for the Community-JS Comments Object component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {LessonCommentObjects} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCLessonCommentObjects` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCLessonCommentObjects-root|Styles applied to the root element.|
 |pagination|.SCLessonCommentObjects-pagination|Styles applied to the pagination controls.|
 |paginationLink|.SCLessonCommentObjects-pagination-link|Styles applied to the pagination link.|
 |loadNextCommentsButton|.SCLessonCommentObjects-load-next-comments-button|Styles applied to the load next comments button.|
 |loadPreviousCommentsButton|.SCLessonCommentObjects-load-previous-comments-button|Styles applied to the load previous comments button.|
 |commentsCounter|.SCLessonCommentObjects-comments-counter|Styles applied to the comments counter element.|

 * @param inProps
 */
export default function LessonCommentObjects(inProps: LessonCommentObjectsProps): JSX.Element {
  const props: LessonCommentObjectsProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  // PROPS
  const {
    id = `lesson_comment_objects_lesson_${props.lessonObjectId ? props.lessonObjectId : props.lessonObject ? props.lessonObject.id : ''}`,
    className,
    lessonObjectId,
    lessonObject,
    CommentComponent = LessonCommentObject,
    CommentComponentProps = {},
    CommentObjectSkeletonProps = {elevation: 0},
    CommentsObjectSkeletonProps = {},
    next,
    isLoadingNext,
    handleNext,
    nextPage,
    isLoadingPrevious,
    comments = [],
    infiniteScrolling = true,
    cacheStrategy = CacheStrategies.NETWORK_ONLY,
    onUpdate,
    ...rest
  } = props;

  //STATE
  const [commenting, setIsCommenting] = useState<boolean>(false);
  const [editing, setIsEditing] = useState<boolean>(false);

  // CONTEXT
  const scUserContext: SCUserContextType = useSCUser();
  const {scLesson} = useSCFetchLesson({
    id: lessonObjectId,
    lesson: lessonObject,
    courseId: lessonObject.course_id,
    sectionId: lessonObject.section_id,
    cacheStrategy
  });

  // INTL
  const intl = useIntl();

  /**
   * handle on scroll end
   * @param inView
   */
  function handleScrollEnd(inView) {
    if (infiniteScrolling && inView && !isLoadingNext) {
      handleNext && handleNext();
    }
  }

  /**
   * Perform save/update comment
   */
  const performComment = (comment) => {
    return http
      .request({
        url: Endpoints.CreateCourseComment.url({id: lessonObject.course_id, section_id: lessonObject.section_id, lesson_id: lessonObject.id}),
        method: Endpoints.CreateCourseComment.method,
        data: {text: comment}
      })
      .then((res: HttpResponse<SCCourseCommentType>) => {
        if (res.status >= 300) {
          return Promise.reject(res);
        }
        return Promise.resolve(res.data);
      });
  };

  /**
   * Handle save comment
   */
  function handleCommentAction(comment) {
    if (UserUtils.isBlocked(scUserContext.user)) {
      enqueueSnackbar(<FormattedMessage id="ui.common.userBlocked" defaultMessage="ui.common.userBlocked" />, {
        variant: 'warning',
        autoHideDuration: 3000
      });
    } else {
      setIsCommenting(true);
      performComment(comment)
        .then((data: SCCourseCommentType) => {
          handleCommentsUpdate(data);
          setIsCommenting(false);
        })
        .catch((error) => {
          Logger.error(SCOPE_SC_UI, error);
          enqueueSnackbar(<FormattedMessage id="ui.common.error.action" defaultMessage="ui.common.error.action" />, {
            variant: 'error',
            autoHideDuration: 3000
          });
        });
    }
  }

  const handleCommentsUpdate = (comment: SCCourseCommentType, forDeletion?: boolean) => {
    const newComments = [...comments];
    let updated;
    if (forDeletion) {
      updated = newComments.filter((c) => c.id !== comment.id);
    } else {
      updated = [...newComments, comment];
    }
    onUpdate(updated);
  };

  /**
   * Footer with n comments of, only for load more pagination mode
   */
  function renderLoadNextComments() {
    return (
      <Box className={classes.pagination}>
        {isLoadingNext ? (
          <LessonCommentObjectSkeleton {...CommentObjectSkeletonProps} count={1} />
        ) : (
          <InView as="div" onChange={handleScrollEnd} threshold={1.0} />
        )}
      </Box>
    );
  }

  /**
   * Render comments and load others with load more button
   */
  function renderComments(objs) {
    return (
      <>
        {/*<Box sx={{position: 'relative', overflow: 'hidden', height: '100%'}}>*/}
        <ScrollContainer>
          {objs.map((c: SCCourseCommentType, index) => (
            <React.Fragment key={index}>
              <CommentComponent
                key={c.id}
                commentObject={c}
                lessonObject={scLesson}
                onDelete={(comment) => handleCommentsUpdate(comment, true)}
                isEditing={(editing) => setIsEditing(editing)}
                {...CommentComponentProps}
                CommentObjectSkeletonProps={CommentObjectSkeletonProps}
              />
            </React.Fragment>
          ))}
        </ScrollContainer>
        {!editing && (
          <CommentObjectReply
            id={`reply-lessonCommentObjects`}
            showAvatar={false}
            replyIcon={!commenting}
            editable={!commenting}
            onReply={handleCommentAction}
            EditorProps={{placeholder: intl.formatMessage(messages.commentEditorPlaceholder)}}
          />
        )}
      </>
    );
  }

  /**
   * Render comments
   */
  let commentsRendered = <></>;
  if (!scLesson || ((isLoadingPrevious || isLoadingNext) && !comments.length)) {
    /**
     * Until the contribution has not been founded and there are
     * no comments during loading render skeletons
     */
    commentsRendered = (
      <LessonCommentsObjectSkeleton count={5} CommentObjectSkeletonProps={CommentObjectSkeletonProps} {...CommentsObjectSkeletonProps} />
    );
  } else {
    /**
     * Two modes available:
     *  - infinite scroll
     *  - load pagination with load next comment button
     *  !IMPORTANT:
     *  the component will switch to 'load more pagination' mode automatically
     *  in case it needs to display a single comment or newComments
     */
    commentsRendered = (
      <>
        {renderComments(comments)}
        {next && renderLoadNextComments()}
      </>
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
