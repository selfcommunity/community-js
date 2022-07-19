import React, {useEffect, useRef, useState} from 'react';
import {styled} from '@mui/material/styles';
import {Box} from '@mui/material';
import {SCCommentsOrderBy} from '../../../types/comments';
import classNames from 'classnames';
import {useThemeProps} from '@mui/system';
import CommentsObject from '../../CommentsObject';
import ActivitiesMenu from './ActivitiesMenu';
import {CommentObjectProps} from '../../CommentObject';
import RelevantActivities from './RelevantActivities';
import {CommentsObjectProps} from '../../CommentsObject';
import {SCFeedObjectActivitiesType} from '../../../types/feedObject';
import {useSCFetchCommentObjects} from '@selfcommunity/react-core';
import {SCCommentType, SCFeedObjectType, SCFeedObjectTypologyType} from '@selfcommunity/types';
import {CacheStrategies} from '@selfcommunity/utils';
import {useInView} from 'react-intersection-observer';

const PREFIX = 'SCFeedObjectActivities';

const classes = {
  root: `${PREFIX}-root`,
  activities: `${PREFIX}-activities`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  width: '100%',
  [`& .${classes.activities}`]: {
    minHeight: 150
  }
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
   * Caching strategies
   * @default CacheStrategies.CACHE_FIRST
   */
  cacheStrategy?: CacheStrategies;

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
    cacheStrategy = CacheStrategies.CACHE_FIRST,
    ...rest
  } = props;

  const {ref, inView} = useInView({triggerOnce: true});

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
        : SCCommentsOrderBy.ADDED_AT_DESC,
    cacheStrategy
  });

  const objId = commentsObject.feedObject ? commentsObject.feedObject.id : null;
  const skeletonsCount = Math.min(5, commentsObject.feedObject ? commentsObject.feedObject.comment_count : 3);
  const existFeedObjectActivities = feedObjectActivities && feedObjectActivities.length > 0;

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
    if (objId && !commentsObject.comments.length && inView) {
      commentsObject.getNextPage();
    }
  }, [objId, inView]);

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
          <CommentsObject
            feedObject={commentsObject.feedObject}
            comments={commentsObject.comments}
            startComments={comments}
            next={commentsObject.next}
            isLoadingNext={commentsObject.isLoadingNext}
            handleNext={commentsObject.getNextPage}
            totalLoadedComments={commentsObject.comments.length + comments.length}
            totalComments={commentsObject.feedObject.comment_count}
            hideAdvertising
            CommentsObjectSkeletonProps={{count: skeletonsCount}}
            {...CommentsObjectProps}
          />
        )}
      </>
    );
  }

  /**
   * Renders root object
   */
  return (
    <Root id={id} className={classNames(classes.root, className)} {...rest} ref={ref}>
      {commentsObject.feedObject &&
      (Boolean(commentsObject.feedObject.comment_count) ||
        (feedObjectActivities && feedObjectActivities.length > 0) ||
        comments.length > 0 ||
        (feedObject && feedObject.comment_count > 0)) ? (
        <Box className={classes.activities} {...(existFeedObjectActivities ? {} : {style: {minHeight: `${skeletonsCount * 80}px`}})}>
          <ActivitiesMenu
            selectedActivities={selectedActivities}
            hideRelevantActivitiesItem={!existFeedObjectActivities}
            onChange={handleSelectActivitiesType}
          />
          {selectedActivities === SCFeedObjectActivitiesType.RELEVANCE_ACTIVITIES ? renderRelevantActivities() : renderComments()}
        </Box>
      ) : null}
    </Root>
  );
}
