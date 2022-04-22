import React, {useEffect, useMemo, useState} from 'react';
import {styled} from '@mui/material/styles';
import {FormattedMessage} from 'react-intl';
import ReplyCommentObject, {ReplyCommentObjectProps} from '../../CommentObject/ReplyComment';
import {Box} from '@mui/material';
import {SCCommentsOrderBy} from '../../../types/comments';
import classNames from 'classnames';
import useThemeProps from '@mui/material/styles/useThemeProps';
import CommentsObject from '../../CommentsObject';
import ActivitiesMenu from './ActivitiesMenu';
import LazyLoad from 'react-lazyload';
import {CommentObjectProps, SCFeedObjectActivitiesType} from '@selfcommunity/ui';
import {SCOPE_SC_UI} from '../../../constants/Errors';
import {useSnackbar} from 'notistack';
import {AxiosResponse} from 'axios';
import RelevantActivities from './RelevantActivities';
import {CommentsObjectProps} from '../../CommentsObject';
import {
  Endpoints,
  http,
  Logger,
  SCCommentType,
  SCFeedObjectType,
  SCFeedObjectTypologyType,
  SCUserContextType,
  UserUtils,
  useSCFetchCommentObjects,
  useSCUser
} from '@selfcommunity/core';

const PREFIX = 'SCFeedObjectActivities';

const classes = {root: `${PREFIX}-root`};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  width: '100%'
}));

export interface ActivitiesProps {
  /**
   * Id of the FeedObjectActivities
   * @default `feed_object_activities_<feedObjectId | feedObject.id>`
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
   * Feed Object latest activities
   * @default null
   */
  feedObjectActivities?: any[];

  /**
   * ReplyCommentComponent component
   * Usefull to override the single ReplyComment render component
   * @default CommentObject
   */
  ReplyCommentComponent?: (inProps: ReplyCommentObjectProps) => JSX.Element;

  /**
   * Props to spread to single reply comment object
   * @default {variant: 'outlined'}
   */
  ReplyCommentComponentProps?: ReplyCommentObjectProps;

  /**
   * Props to spread to comments object skeleton
   * @default {elevation: 0, WidgetProps: {variant: 'outlined'} as WidgetProps}
   */
  CommentsObjectProps?: CommentsObjectProps;

  /**
   * Callback on add a comment
   * @default null
   */
  onAddComment?: (obj) => void;

  /**
   * Other props
   */
  [p: string]: any;
}

export default function Activities(inProps: ActivitiesProps): JSX.Element {
  const props: ActivitiesProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });

  // PROPS
  const {
    id = `feed_object_activities_${props.feedObjectId ? props.feedObjectId : props.feedObject ? props.feedObject.id : ''}`,
    className,
    feedObjectId,
    feedObject,
    feedObjectType = SCFeedObjectTypologyType.POST,
    CommentsObjectProps = {CommentComponentProps: {variant: 'outlined'} as CommentObjectProps},
    ReplyCommentComponent = ReplyCommentObject,
    ReplyCommentComponentProps = {ReplyBoxProps: {variant: 'outlined'}},
    feedObjectActivities = [],
    onAddComment,
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
    pageSize: 3,
    orderBy:
      selectedActivities === SCFeedObjectActivitiesType.CONNECTIONS_COMMENTS
        ? SCCommentsOrderBy.CONNECTION_DESC
        : selectedActivities === SCFeedObjectActivitiesType.FIRST_COMMENTS
        ? SCCommentsOrderBy.ADDED_AT_ASC
        : SCCommentsOrderBy.ADDED_AT_DESC
  });

  const objId = commentsObject.feedObject ? commentsObject.feedObject.id : null;

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
   * Perform reply
   * Comment of first level
   */
  const performReply = useMemo(
    () => (comment: SCCommentType) => {
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
  function handleReply(comment: SCCommentType) {
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
          if (onAddComment) {
            onAddComment(data);
          } else {
            commentsObject.setFeedObject(Object.assign(commentsObject.feedObject, {comment_count: commentsObject.feedObject.comment_count + 1}));
          }
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
  }, [objId]);

  /**
   * Handle change activities type
   * @param type
   */
  function handleSelectActivitiesType(type: SCFeedObjectActivitiesType) {
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
              comments={commentsObject.comments}
              startComments={comments}
              next={commentsObject.next}
              isLoadingNext={commentsObject.isLoadingNext}
              handleNext={commentsObject.getNextPage}
              totalLoadedComments={commentsObject.comments.length + comments.length}
              totalComments={commentsObject.feedObject.comment_count}
              {...CommentsObjectProps}
            />
          </LazyLoad>
        )}
      </>
    );
  }

  /**
   * Renders root object
   */
  return (
    <Root id={id} className={classNames(classes.root, className)} {...rest}>
      {scUserContext.user && (
        <ReplyCommentComponent
          inline
          onReply={handleReply}
          readOnly={isReplying || !commentsObject.feedObject}
          key={Number(isReplying)}
          {...ReplyCommentComponentProps}
        />
      )}
      {(commentsObject.feedObject.comment_count || (feedObjectActivities && feedObjectActivities.length > 0) || comments.length > 0) && (
        <ActivitiesMenu
          selectedActivities={selectedActivities}
          hideRelevantActivitiesItem={!(feedObjectActivities && feedObjectActivities.length > 0)}
          onChange={handleSelectActivitiesType}
        />
      )}
      {selectedActivities === SCFeedObjectActivitiesType.RELEVANCE_ACTIVITIES ? renderRelevantActivities() : renderComments()}
    </Root>
  );
}
