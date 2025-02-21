import React, {useContext, useState} from 'react';
import {styled} from '@mui/material/styles';
import Widget from '../Widget';
import {FormattedMessage} from 'react-intl';
import {Avatar, Box, CardContent, CardProps, Typography} from '@mui/material';
import Bullet from '../../shared/Bullet';
import classNames from 'classnames';
import {SCOPE_SC_UI} from '../../constants/Errors';
import CommentObjectSkeleton from './Skeleton';
import CommentObjectReply from '../CommentObjectReply';
import DateTimeAgo from '../../shared/DateTimeAgo';
import {getCommentContributionHtml} from '../../utils/contribution';
import {useSnackbar} from 'notistack';
import {useThemeProps} from '@mui/system';
import BaseItem from '../../shared/BaseItem';
import {SCCourseCommentType, SCCourseLessonType} from '@selfcommunity/types';
import {Endpoints, http, HttpResponse} from '@selfcommunity/api-services';
import {CacheStrategies, Logger, LRUCache} from '@selfcommunity/utils';
import {
  Link,
  SCCache,
  SCRoutes,
  SCRoutingContextType,
  SCUserContext,
  SCUserContextType,
  UserUtils,
  useSCFetchLessonCommentObject,
  useSCRouting
} from '@selfcommunity/react-core';
import UserDeletedSnackBar from '../../shared/UserDeletedSnackBar';
import UserAvatar from '../../shared/UserAvatar';
import {PREFIX} from './constants';
import LessonCommentActionsMenu from '../../shared/LessonCommentActionsMenu';

const classes = {
  root: `${PREFIX}-root`,
  comment: `${PREFIX}-comment`,
  avatar: `${PREFIX}-avatar`,
  content: `${PREFIX}-content`,
  author: `${PREFIX}-author`,
  textContent: `${PREFIX}-text-content`,
  commentActionsMenu: `${PREFIX}-comment-actions-menu`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root'
})(() => ({}));

export interface LessonCommentObjectProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;

  /**
   * Id of the comment object
   * @default null
   */
  commentObjectId?: number;

  /**
   * Comment object
   * @default null
   */
  commentObject?: SCCourseCommentType;

  /**
   * Id of lesson object
   * @default null
   */
  lessonObjectId?: number;

  /**
   * Feed object
   * @default null
   */
  lessonObject?: SCCourseLessonType;

  /**
   * Callback on delete the comment
   * @default null
   */
  onDelete?: (comment: SCCourseCommentType) => void;

  /**
   * Callback on comment edit
   * @default false
   */
  isEditing?: (editing: boolean) => void;

  /**
   * Props to spread to single comment object skeleton
   * @default {elevation: 0}
   */
  CommentObjectSkeletonProps?: CardProps;

  /**
   * Props to spread to single comment object CommentObjectReply
   * @default {elevation: 0}
   */
  CommentObjectReplyProps?: CardProps;

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
 * > API documentation for the Community-JS Comment Object component. Learn about the available props and the CSS API.
 *
 *
 * This component renders a comment item.
 * Take a look at our <strong>demo</strong> component [here](/docs/sdk/community-js/react-ui/Components/CommentObject)

 #### Import

 ```jsx
 import {CommentObject} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCCommentObject` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCCommentObject-root|Styles applied to the root element.|
 |comment|.SCCommentObject-comment|Styles applied to comment element.|
 |avatar|.SCCommentObject-avatar|Styles applied to the avatar element.|
 |author|.SCCommentObject-author|Styles applied to the author section.|
 |content|.SCCommentObject-content|Styles applied to content section.|
 |textContent|.SCCommentObject-text-content|Styles applied to text content section.|
 |commentActionsMenu|.SCCommentObject-comment-actions-menu|Styles applied to comment action menu element.|
 

 * @param inProps
 */
export default function LessonCommentObject(inProps: LessonCommentObjectProps): JSX.Element {
  // PROPS
  const props: LessonCommentObjectProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {
    id = `lesson_comment_object_${props.commentObjectId ? props.commentObjectId : props.commentObject ? props.commentObject.id : ''}`,
    className,
    commentObjectId,
    commentObject,
    isEditing,
    lessonObjectId,
    lessonObject,
    onDelete,
    elevation = 0,
    CommentObjectSkeletonProps = {elevation},
    CommentObjectReplyProps = {elevation},
    cacheStrategy = CacheStrategies.NETWORK_ONLY,
    ...rest
  } = props;

  // CONTEXT
  const scUserContext: SCUserContextType = useContext(SCUserContext);
  const scRoutingContext: SCRoutingContextType = useSCRouting();
  const {enqueueSnackbar} = useSnackbar();

  // STATE
  const {obj, setObj} = useSCFetchLessonCommentObject({id: commentObjectId, commentObject: commentObject, lesson: lessonObject, cacheStrategy});
  const [isSavingComment, setIsSavingComment] = useState<boolean>(false);
  const [editComment, setEditComment] = useState<SCCourseCommentType>(null);
  const [openAlert, setOpenAlert] = useState<boolean>(false);

  // HANDLERS
  /**
   * Update state object
   * @param newObj
   */
  function updateObject(newObj) {
    LRUCache.set(SCCache.getLessonCommentCacheKey(obj.id), newObj);
    setObj(newObj);
    LRUCache.deleteKeysWithPrefix(SCCache.getLessonCommentsCachePrefixKeys(lessonObject.id));
  }

  /**
   * Handle comment delete
   */
  function handleDelete(comment) {
    updateObject(comment);
    onDelete && onDelete(comment);
  }

  /**
   * Handle edit comment
   */
  function handleEdit(comment) {
    setEditComment(comment);
    isEditing && isEditing(true);
  }

  function handleCancel() {
    setEditComment(null);
    isEditing && isEditing(false);
  }

  /**
   * Perform save/update comment
   */
  const performUpdate = (comment, medias) => {
    const mediaIds = medias ? medias.map((media) => media.id) : [];
    return http
      .request({
        url: Endpoints.UpdateCourseComment.url({
          id: lessonObject.course_id,
          section_id: lessonObject.section_id,
          lesson_id: lessonObject.id,
          comment_id: commentObject.id
        }),
        method: Endpoints.UpdateCourseComment.method,
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
  function handleUpdate(comment, medias) {
    if (UserUtils.isBlocked(scUserContext.user)) {
      enqueueSnackbar(<FormattedMessage id="ui.common.userBlocked" defaultMessage="ui.common.userBlocked" />, {
        variant: 'warning',
        autoHideDuration: 3000
      });
    } else {
      setIsSavingComment(true);
      performUpdate(comment, medias)
        .then((data: SCCourseCommentType) => {
          const newObj = Object.assign({}, obj, {
            text: data.text,
            html: data.html,
            created_at: data.created_at
          });
          updateObject(newObj);
          setEditComment(null);
          setIsSavingComment(false);
          isEditing && isEditing(false);
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

  /**
   * Render comment & latest activities
   * @param comment
   */
  function renderComment(comment: SCCourseCommentType) {
    if (!scUserContext.user || (scUserContext.user && !UserUtils.isStaff(scUserContext.user) && scUserContext.user.id !== comment.created_by.id)) {
      // render the comment if user is logged and is staff (admin, moderator)
      // or the comment author is the logged user
      return null;
    }

    const summaryHtml = getCommentContributionHtml(comment.html, scRoutingContext.url);
    return (
      <React.Fragment key={comment.id}>
        {editComment && editComment.id === comment.id ? (
          <Box className={classes.comment}>
            <CommentObjectReply
              text={comment.html}
              medias={comment.medias}
              autoFocus
              id={`edit-${comment.id}`}
              onSave={handleUpdate}
              onCancel={handleCancel}
              editable={!isSavingComment}
              EditorProps={{uploadFile: true, uploadImage: false}}
              {...CommentObjectReplyProps}
            />
          </Box>
        ) : (
          <BaseItem
            elevation={0}
            className={classes.comment}
            image={
              <Link
                {...(!comment.created_by.deleted && {to: scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, comment.created_by)})}
                onClick={comment.created_by.deleted ? () => setOpenAlert(true) : null}>
                <UserAvatar hide={!obj.created_by.community_badge}>
                  <Avatar alt={obj.created_by.username} variant="circular" src={comment.created_by.avatar} className={classes.avatar} />
                </UserAvatar>
              </Link>
            }
            disableTypography
            primary={
              <>
                <Widget className={classes.content} elevation={elevation} {...rest}>
                  <CardContent>
                    <Link
                      className={classes.author}
                      {...(!comment.created_by.deleted && {to: scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, comment.created_by)})}
                      onClick={comment.created_by.deleted ? () => setOpenAlert(true) : null}>
                      <Typography component="span">{comment.created_by.username}</Typography>
                    </Link>
                    <>
                      <Bullet />
                      <DateTimeAgo date={comment.created_at} showStartIcon={false} />
                    </>
                    <Typography className={classes.textContent} variant="body2" gutterBottom dangerouslySetInnerHTML={{__html: summaryHtml}} />
                  </CardContent>
                  {scUserContext.user && (
                    <Box className={classes.commentActionsMenu}>
                      <LessonCommentActionsMenu lesson={lessonObject} commentObject={comment} onDelete={handleDelete} onEdit={handleEdit} />
                    </Box>
                  )}
                </Widget>
              </>
            }
          />
        )}
      </React.Fragment>
    );
  }

  /**
   * Render comments
   */
  let comment;
  if (obj) {
    comment = renderComment(obj);
  } else {
    comment = <CommentObjectSkeleton {...CommentObjectSkeletonProps} />;
  }

  /**
   * Render object
   */
  return (
    <>
      <Root id={id} className={classNames(classes.root, className)}>
        {comment}
      </Root>
      {openAlert && <UserDeletedSnackBar open={openAlert} handleClose={() => setOpenAlert(false)} />}
    </>
  );
}
