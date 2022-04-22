import React, {useEffect, useState} from 'react';
import {styled} from '@mui/material/styles';
import {Box} from '@mui/material';
import {SCCommentsOrderBy} from '../../../types/comments';
import classNames from 'classnames';
import useThemeProps from '@mui/material/styles/useThemeProps';
import CommentsObject from '../../CommentsObject';
import ActivitiesMenu from './ActivitiesMenu';
import LazyLoad from 'react-lazyload';
import {CommentObjectProps, SCFeedObjectActivitiesType} from '@selfcommunity/ui';
import RelevantActivities from './RelevantActivities';
import {CommentsObjectProps} from '../../CommentsObject';
import {
  SCCommentType,
  SCFeedObjectType,
  SCFeedObjectTypologyType,
  useSCFetchCommentObjects
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
   * Comments (if new)
   * @default []
   */
  comments?: SCCommentType[];

  /**
   * Activities type
   * @default SCFeedObjectActivitiesType.RECENT_COMMENTS
   */
  activitiesType?: SCFeedObjectActivitiesType;

  /**
   * Callback change activities type
   */
  onSetSelectedActivities?: (type: SCFeedObjectActivitiesType) => void;

  /**
   * Props to spread to comments object skeleton
   * @default {elevation: 0, WidgetProps: {variant: 'outlined'} as WidgetProps}
   */
  CommentsObjectProps?: CommentsObjectProps;

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
    feedObjectActivities = [],
    comments = [],
    onSetSelectedActivities,
    activitiesType = SCFeedObjectActivitiesType.RECENT_COMMENTS,
    ...rest
  } = props;

  // STATE
  const [selectedActivities, setSelectedActivities] = useState<SCFeedObjectActivitiesType>(activitiesType);

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
   * Sync activities type if prop change
   */
  useEffect(() => {
    setSelectedActivities(activitiesType);
  }, [activitiesType]);

  /**
   * Prefetch comments only if obj
   */
  useEffect(() => {
    commentsObject.getNextPage();
  }, [objId]);

  /**
   * Handle change activities type
   * @param type
   */
  function handleSelectActivitiesType(type: SCFeedObjectActivitiesType) {
    onSetSelectedActivities(type);
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
