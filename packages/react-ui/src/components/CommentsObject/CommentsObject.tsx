import React, {useMemo} from 'react';
import {styled} from '@mui/material/styles';
import {FormattedMessage} from 'react-intl';
import CommentObject, {CommentObjectProps, CommentObjectSkeleton} from '../CommentObject';
import Typography from '@mui/material/Typography';
import {Box, Button, Stack} from '@mui/material';
import classNames from 'classnames';
import CustomAdv from '../CustomAdv';
import useThemeProps from '@mui/material/styles/useThemeProps';
import {WidgetProps} from '../Widget';
import CommentsObjectSkeleton from './Skeleton';
import {InView} from 'react-intersection-observer';
import {getContributionRouteName, getRouteData} from '../../utils/contribution';
import {
  Link,
  SCPreferences,
  SCPreferencesContextType,
  SCRoutingContextType,
  SCUserContextType,
  useSCFetchFeedObject,
  useSCPreferences,
  useSCRouting,
  useSCUser
} from '@selfcommunity/react-core';
import {SCCommentType, SCCustomAdvPosition, SCFeedObjectType, SCFeedObjectTypologyType} from '@selfcommunity/types';
import {appendURLSearchParams} from '@selfcommunity/utils';

const PREFIX = 'SCCommentsObject';

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
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  boxShadow: 'none',
  position: 'relative',
  display: 'flex',
  flexWrap: 'wrap',
  width: '100%',
  [`& .${classes.loadNextCommentsButton}`]: {
    textTransform: 'initial'
  },
  [`& .${classes.loadPreviousCommentsButton}`]: {
    textTransform: 'initial'
  },
  [`& .${classes.commentsCounter}`]: {
    paddingRight: theme.spacing()
  },
  [`& .${classes.pagination}`]: {
    width: '100%'
  },
  [`& .${classes.paginationLink}`]: {
    display: 'none'
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
  CommentComponent?: (inProps: CommentObjectProps) => JSX.Element;

  /**
   * Props to spread to single comment object
   * @default {variant: 'outlined'}
   */
  CommentComponentProps?: CommentObjectProps;

  /**
   * Props to spread to CommentsObjectSkeleton
   * @default {}
   */
  CommentsObjectSkeletonProps?: any;

  /**
   * Props to spread to single comment object skeleton
   * @default {elevation: 0, WidgetProps: {variant: 'outlined'}},
   */
  CommentObjectSkeletonProps?: any;

  /**
   * Comments to show
   */
  comments?: SCCommentType[];

  /**
   * Next url
   * If exist show load next button
   */
  next?: string;

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
   * Previous url
   * If exist show load previous button
   */
  previous?: string;

  /**
   * Is loading previous comments
   * If exist load previous button is replaced by comment skeleton
   */
  isLoadingPrevious?: boolean;

  /**
   * Handle load previous comments callback
   */
  handlePrevious?: () => void;

  /**
   * Number of comments loaded
   */
  totalLoadedComments?: number;

  /**
   * Total number of comments
   */
  totalComments?: number;

  /**
   * Current page
   */
  page?: number;

  /**
   * Add/show other comments at the head of the component
   * Useful when there is a new comment (reply feed object)
   */
  startComments?: SCCommentType[];

  /**
   * Add/show other comments at the end of the component
   * Useful when there is a new comment (reply feed object)
   */
  endComments?: SCCommentType[];

  /**
   * Enable/disable infinite scrolling
   * If there is comments in startCommments/endComments infiniteScrolling will be disabled
   * @default true
   */
  infiniteScrolling?: boolean;

  /**
   * Other props
   */
  [p: string]: any;
}

const PREFERENCES = [SCPreferences.ADVERTISING_CUSTOM_ADV_ENABLED, SCPreferences.ADVERTISING_CUSTOM_ADV_ONLY_FOR_ANONYMOUS_USERS_ENABLED];
/**
 *> API documentation for the Community-JS Comments Object component. Learn about the available props and the CSS API.

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
 |pagination|.SCCommentsObject-pagination|Styles applied to the pagination controls.|
 |paginationLink|.SCCommentsObject-pagination-link|Styles applied to the pagination link.|
 |loadNextCommentsButton|.SCCommentsObject-load-next-comments-button|Styles applied to the load next comments button.|
 |loadPreviousCommentsButton|.SCCommentsObject-load-previous-comments-button|Styles applied to the load previous comments button.|
 |commentsCounter|.SCCommentsObject-comments-counter|Styles applied to the comments counter element.|

 * @param inProps
 */
export default function CommentsObject(inProps: CommentsObjectProps): JSX.Element {
  const props: CommentsObjectProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  // PROPS
  const {
    id = `comments_object_${props.feedObjectId ? props.feedObjectId : props.feedObject ? props.feedObject.id : ''}`,
    className,
    feedObjectId,
    feedObject,
    feedObjectType = SCFeedObjectTypologyType.POST,
    CommentComponent = CommentObject,
    CommentComponentProps = {variant: 'outlined'},
    CommentObjectSkeletonProps = {elevation: 0, WidgetProps: {variant: 'outlined'} as WidgetProps},
    CommentsObjectSkeletonProps = {},
    next,
    isLoadingNext,
    handleNext,
    previous,
    isLoadingPrevious,
    handlePrevious,
    totalLoadedComments,
    totalComments,
    page,
    comments = [],
    startComments = [],
    endComments = [],
    infiniteScrolling = false,
    hideAdvertising = false,
    ...rest
  } = props;

  // CONTEXT
  const scUserContext: SCUserContextType = useSCUser();
  const scPreferences: SCPreferencesContextType = useSCPreferences();
  const scRoutingContext: SCRoutingContextType = useSCRouting();
  const {obj} = useSCFetchFeedObject({id: feedObjectId, feedObject, feedObjectType});
  const commentsIds = comments.map((c) => c.id);

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
   * handle on scroll end
   * @param inView
   * @param entry
   */
  function handleScrollEnd(inView, entry) {
    if (infiniteScrolling && inView && !isLoadingNext) {
      handleNext && handleNext();
    }
  }

  /**
   * Check if show Comments counter
   */
  function showCommentsCounter() {
    return Boolean(totalComments && totalLoadedComments);
  }

  /**
   * Render button load previous comments
   */
  function renderLoadPreviousComments() {
    return (
      <Box className={classes.pagination}>
        {isLoadingPrevious && <CommentObjectSkeleton {...CommentObjectSkeletonProps} count={1} />}
        {!isLoadingPrevious && (
          <>
            <Button
              variant="text"
              onClick={handlePrevious}
              disabled={isLoadingPrevious}
              color="inherit"
              classes={{root: classes.loadPreviousCommentsButton}}>
              <FormattedMessage id="ui.commentsObject.loadPreviousComments" defaultMessage="ui.commentsObject.loadPreviousComments" />
            </Button>
            {page && (
              <Link
                to={`${appendURLSearchParams(scRoutingContext.url(getContributionRouteName(feedObject), getRouteData(feedObject)), [
                  {page: page - 1}
                ])}`}
                className={classes.paginationLink}>
                <FormattedMessage id="ui.commentsObject.previousComments" defaultMessage="ui.commentsObject.previousComments" />
              </Link>
            )}
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
      <Box className={classes.pagination}>
        {!isLoadingNext && (
          <InView as="div" onChange={handleScrollEnd} threshold={0.5}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
              <Button variant="text" onClick={handleNext} disabled={isLoadingNext} color="inherit" classes={{root: classes.loadNextCommentsButton}}>
                <FormattedMessage id="ui.commentsObject.loadMoreComments" defaultMessage="ui.commentsObject.loadMoreComments" />
              </Button>
              {page && (
                <Link
                  to={`${appendURLSearchParams(scRoutingContext.url(getContributionRouteName(feedObject), getRouteData(feedObject)), [
                    {page: page + 1}
                  ])}`}
                  className={classes.paginationLink}>
                  <FormattedMessage id="ui.commentsObject.nextComments" defaultMessage="ui.commentsObject.nextComments" />
                </Link>
              )}
              {showCommentsCounter() && (
                <Typography variant="body1" classes={{root: classes.commentsCounter}}>
                  <FormattedMessage
                    id="ui.commentsObject.numberOfComments"
                    defaultMessage="ui.commentsObject.numberOfComments"
                    values={{loaded: totalLoadedComments, total: totalComments}}
                  />
                </Typography>
              )}
            </Stack>
          </InView>
        )}
        {isLoadingNext && <CommentObjectSkeleton {...CommentObjectSkeletonProps} count={1} />}
      </Box>
    );
  }

  /**
   * Remove duplicate comments (from header or footer)
   * @param comments
   */
  function getFilteredComments(comments) {
    return comments.filter((c) => !commentsIds.includes(c.id));
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
              key={comment.id}
              commentObject={comment}
              onOpenReply={openReplyBox}
              feedObject={obj}
              {...CommentComponentProps}
              CommentObjectSkeletonProps={CommentObjectSkeletonProps}
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
  if (!obj || ((isLoadingPrevious || isLoadingNext) && !comments.length)) {
    /**
     * Until the contribution has not been founded and there are
     * no comments during loading render skeletons
     */
    commentsRendered = <CommentsObjectSkeleton CommentObjectSkeletonProps={CommentObjectSkeletonProps} {...CommentsObjectSkeletonProps} />;
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
        {previous && renderLoadPreviousComments()}
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
      {renderComments(getFilteredComments(startComments))}
      {commentsRendered}
      {renderComments(getFilteredComments(endComments))}
    </Root>
  );
}
