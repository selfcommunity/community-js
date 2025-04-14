import React, {useEffect, useRef, useState} from 'react';
import {styled} from '@mui/material/styles';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import LessonCommentObject, {LessonCommentObjectProps, LessonCommentObjectSkeleton} from '../LessonCommentObject';
import {Box, List, ListItem} from '@mui/material';
import classNames from 'classnames';
import {useThemeProps} from '@mui/system';
import {SCCommentsOrderBy, SCCourseCommentType, SCCourseLessonType} from '@selfcommunity/types';
import {CacheStrategies, Logger, LRUCache} from '@selfcommunity/utils';
import {SCCache, SCUserContextType, UserUtils, useSCFetchLessonCommentObjects, useSCUser} from '@selfcommunity/react-core';
import {PREFIX} from './constants';
import LessonCommentsObjectSkeleton from './Skeleton';
import CommentObjectReply from '../CommentObjectReply';
import {enqueueSnackbar} from 'notistack';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {Endpoints, http, HttpResponse} from '@selfcommunity/api-services';
import InfiniteScroll from '../../shared/InfiniteScroll';
import HiddenPlaceholder from '../../shared/HiddenPlaceholder';

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
   * Caching strategies
   * @default CacheStrategies.CACHE_FIRST
   */
  cacheStrategy?: CacheStrategies;
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
    CommentComponentProps = {},
    CommentObjectSkeletonProps = {elevation: 0},
    CommentsObjectSkeletonProps = {},
    cacheStrategy = CacheStrategies.STALE_WHILE_REVALIDATE,
    ...rest
  } = props;

  //STATE
  const [commenting, setIsCommenting] = useState<boolean>(false);
  const [editing, setIsEditing] = useState<boolean>(false);
  const [replyKey, setReplyKey] = useState(0);

  // CONTEXT
  const scUserContext: SCUserContextType = useSCUser();
  // INTL
  const intl = useIntl();
  // REF
  const commentsEndRef = useRef(null);

  // STATE
  const commentsObject = useSCFetchLessonCommentObjects({
    id: lessonObject.id,
    lessonObject: lessonObject,
    orderBy: SCCommentsOrderBy.ADDED_AT_ASC,
    cacheStrategy
  });

  // EFFECTS
  useEffect(() => {
    if (commentsObject.lessonObject) {
      commentsObject.getNextPage();
    }
  }, [commentsObject.lessonObject]);

  //HANDLERS
  function handleNext() {
    commentsObject.getNextPage();
  }

  const scrollToBottom = () => {
    commentsEndRef.current?.scrollIntoView({block: 'end', behavior: 'smooth'});
  };

  useEffect(() => {
    if (commentsObject.comments.length > 0) {
      scrollToBottom();
    }
  }, [commentsObject.comments]);

  /**
   * Perform save/update comment
   */
  const performComment = (comment, medias) => {
    const mediaIds = medias ? medias.map((media) => media.id) : [];
    return http
      .request({
        url: Endpoints.CreateCourseComment.url({id: lessonObject.course_id, section_id: lessonObject.section_id, lesson_id: lessonObject.id}),
        method: Endpoints.CreateCourseComment.method,
        data: {text: comment, medias: mediaIds}
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
  function handleCommentAction(comment, medias) {
    if (UserUtils.isBlocked(scUserContext.user)) {
      enqueueSnackbar(<FormattedMessage id="ui.common.userBlocked" defaultMessage="ui.common.userBlocked" />, {
        variant: 'warning',
        autoHideDuration: 3000
      });
    } else {
      setIsCommenting(true);
      performComment(comment, medias)
        .then((data: SCCourseCommentType) => {
          handleCommentsUpdate(data);
          setReplyKey(comment.id);
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
    let updated;
    if (forDeletion) {
      updated = commentsObject.comments.filter((c) => c.id !== comment.id);
    } else {
      updated = [...commentsObject.comments, comment];
    }
    commentsObject.updateLessonComments([...updated]);
    LRUCache.set(SCCache.getLessonCommentCacheKey(lessonObject.id), updated);
    LRUCache.deleteKeysWithPrefix(SCCache.getLessonCommentsCachePrefixKeys(lessonObject.id));
  };

  /**
   * Renders root object(if obj)
   */
  if (!commentsObject.lessonObject) {
    return <HiddenPlaceholder />;
  }
  if (!commentsObject.comments.length && commentsObject.isLoadingNext) {
    return <LessonCommentsObjectSkeleton count={5} {...CommentsObjectSkeletonProps} />;
  }
  return (
    <Root id={id} className={classNames(classes.root, className)} {...rest}>
      <>
        <>
          {commentsObject.comments.length > 0 ? (
            <InfiniteScroll
              height={'100%'}
              dataLength={commentsObject.comments.length}
              next={handleNext}
              hasMoreNext={Boolean(commentsObject.next)}
              loaderNext={<LessonCommentObjectSkeleton {...CommentObjectSkeletonProps} count={1} />}>
              <List ref={commentsEndRef}>
                {commentsObject.comments.map((c: SCCourseCommentType, index) => (
                  <ListItem key={index}>
                    <LessonCommentObject
                      key={c.id}
                      commentObject={c}
                      lessonObject={commentsObject.lessonObject}
                      onDelete={(comment) => handleCommentsUpdate(comment, true)}
                      isEditing={(editing) => setIsEditing(editing)}
                      {...CommentComponentProps}
                      CommentObjectSkeletonProps={CommentObjectSkeletonProps}
                    />
                  </ListItem>
                ))}
              </List>
            </InfiniteScroll>
          ) : null}
        </>
        {!editing && (
          <CommentObjectReply
            key={replyKey}
            id={`reply-lessonCommentObjects`}
            showAvatar={false}
            replyIcon
            editable={!commenting}
            onReply={handleCommentAction}
            EditorProps={{
              placeholder: intl.formatMessage(messages.commentEditorPlaceholder),
              uploadFile: true,
              uploadImage: false,
              isLessonCommentEditor: true
            }}
          />
        )}
      </>
    </Root>
  );
}
