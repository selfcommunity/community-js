/* eslint-disable */
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {styled} from '@mui/material/styles';
import {defineMessages, FormattedMessage} from 'react-intl';
import CommentObject, {CommentObjectProps, CommentObjectSkeleton} from '../CommentObject';
import ReplyCommentObject, {ReplyCommentObjectProps} from '../CommentObject/ReplyComment';
import Typography from '@mui/material/Typography';
import {Box, Button, CardProps, Stack} from '@mui/material';
import {SCCommentsOrderBy} from '../../types/comments';
import classNames from 'classnames';
import CustomAdv from '../CustomAdv';
import useThemeProps from '@mui/material/styles/useThemeProps';
import {WidgetProps} from '../Widget';
import CommentsObjectSkeleton from './Skeleton';
import {
  SCCommentType,
  SCCustomAdvPosition,
  SCFeedObjectType,
  SCFeedObjectTypologyType,
  SCPreferences,
  SCPreferencesContextType,
  SCUserContextType,
  useSCFetchCommentObjects, useSCFetchFeedObject,
  useSCPreferences,
  useSCUser,
} from '@selfcommunity/core';

const PREFIX = 'SCCommentsObject';

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

export interface CommentsObjectProps {
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

  comments: SCCommentType[];
  next?: string;
  isLoadingNext?: boolean;
  handleNext?: () => void;
  previous?: string;
  isLoadingPrevious?: boolean;
  handlePrevious?: () => void;

  /**
   * enable/disable infinite scrolling
   * @default true
   */
  infiniteScrolling?: boolean;

  /**
   * number of box of skeleton loading to show during loading phase
   * @default 3
   */
  commentsLoadingBoxCount?: number;

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
export default function CommentsObject(inProps: CommentsObjectProps): JSX.Element {
  const props: CommentsObjectProps = useThemeProps({
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
    CommentObjectSkeletonProps = {elevation: 0, WidgetProps: {variant: 'outlined'} as WidgetProps},
    next,
    isLoadingNext,
    handleNext,
    previous,
    isLoadingPrevious,
    handlePrevious,
    totalComments,
    comments = [],
    infiniteScrolling = true,
    hideAdvertising = false,
    commentsLoadingBoxCount = 3,
    ...rest
  } = props;

  // CONTEXT
  const scUserContext: SCUserContextType = useSCUser();
  const scPreferences: SCPreferencesContextType = useSCPreferences();
  const {obj, setObj} = useSCFetchFeedObject({id: feedObjectId, feedObject, feedObjectType});

  /**
   * Compute preferences
   */
  const preferences = useMemo(() => {
    const _preferences = {};
    PREFERENCES.map((p) => (_preferences[p] = p in scPreferences.preferences ? scPreferences.preferences[p].value : null));
    return _preferences;
  }, [scPreferences.preferences]);

  /**
   * Render advertising above FeedObject Detail
   */
  const renderAdvertising = useMemo(
    () => () => {
      if (
        obj &&
        !hideAdvertising &&
        preferences[SCPreferences.ADVERTISING_CUSTOM_ADV_ENABLED] &&
        ((preferences[SCPreferences.ADVERTISING_CUSTOM_ADV_ONLY_FOR_ANONYMOUS_USERS_ENABLED] && scUserContext.user === null) ||
          !preferences[SCPreferences.ADVERTISING_CUSTOM_ADV_ONLY_FOR_ANONYMOUS_USERS_ENABLED])
      ) {
        return (
          <CustomAdv
            position={SCCustomAdvPosition.POSITION_IN_COMMENTS}
            {...(obj.categories.length && {categoriesId: obj.categories.map((c) => c.id)})}
          />
        );
      }
      return null;
    },
    [JSON.stringify(obj)]
  );

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
   * Render button load previous comments
   */
  function renderLoadPreviousComments() {
    return (
      <Box>
        {isLoadingPrevious && <CommentObjectSkeleton {...CommentObjectSkeletonProps} count={1} />}
        {Boolean(previous) && !isLoadingPrevious && (
          <>
            <Button variant="text" onClick={handlePrevious} disabled={isLoadingPrevious} color="inherit">
              <FormattedMessage id="ui.commentsObject.loadPreviousComments" defaultMessage="ui.commentsObject.loadPreviousComments" />
            </Button>
          </>
        )}
      </Box>
    );
  }

  /**
   * Footer with n comments of, only for load more pagination mode
   */
  function renderLoadNextComments() {
    return (
      <Box className={classes.paginationFooter}>
        {Boolean(next) && !isLoadingNext && (
          <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
            <Button variant="text" onClick={handleNext} disabled={isLoadingNext} color="inherit" classes={{root: classes.loadMoreCommentsButton}}>
              <FormattedMessage id="ui.commentsObject.loadMoreComments" defaultMessage="ui.commentsObject.loadMoreComments" />
            </Button>
            {Boolean(totalComments) && (
              <Typography variant="body1" classes={{root: classes.commentsCounter}}>
                <FormattedMessage
                  id="ui.commentsObject.numberOfComments"
                  defaultMessage="ui.commentsObject.numberOfComments"
                  values={{loaded: comments.length, total: totalComments}}
                />
              </Typography>
            )}
          </Stack>
        )}
        {isLoadingNext && <CommentObjectSkeleton {...CommentObjectSkeletonProps} count={1} />}
      </Box>
    );
  }

  /**
   * Render comments and load others with load more button
   */
  function renderComments(comments) {
    return (
      <>
        {comments.map((comment: SCCommentType, index) => (
          <React.Fragment key={index}>
            <CommentComponent
              id={comment.id}
              key={comment.id}
              commentObject={comment}
              onOpenReply={openReplyBox}
              feedObject={obj}
              feedObjectType={obj.type}
              {...CommentComponentProps}
            />
            {advPosition === index && renderAdvertising()}
          </React.Fragment>
        ))}
      </>
    );
  }

  /**
   * Render comments
   */
  const advPosition = Math.floor(Math.random() * (Math.min(totalComments, 5) - 1 + 1) + 1);
  let commentsRendered = <></>;

  if (!obj) {
    /**
     * Until the contribution has not been founded and there are
     * no comments during loading render the skeletons
     */
    commentsRendered = <CommentsObjectSkeleton CommentObjectSkeletonProps={CommentObjectSkeletonProps} elevation={0} />;
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
        {renderLoadPreviousComments()}
        {renderComments(comments)}
        {renderLoadNextComments()}
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
