import React, {useEffect, useMemo, useState} from 'react';
import {styled} from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import {
  Avatar,
  Box,
  Button,
  CardActions,
  CardHeader,
  CardProps,
  Collapse,
  Grid,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  Tooltip,
  Typography
} from '@mui/material';
import FeedObjectSkeleton from './Skeleton';
import DateTimeAgo from '../../shared/DateTimeAgo';
import Bullet from '../../shared/Bullet';
import Tags from '../../shared/Tags';
import MediasPreview from '../../shared/MediasPreview';
import Actions from './Actions';
import WorldIcon from '@mui/icons-material/Public';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import PollObject from './Poll';
import ContributorsFeedObject from './Contributors';
import LazyLoad from 'react-lazyload';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import {
  Endpoints,
  http,
  Link,
  Logger,
  SCCommentType,
  SCContextType,
  SCFeedObjectType,
  SCFeedObjectTypologyType,
  SCPollType,
  SCRoutes,
  SCRoutingContextType,
  SCTagType,
  SCUserContextType,
  useSCContext,
  useSCFetchFeedObject,
  useSCRouting,
  useSCUser
} from '@selfcommunity/core';
import Composer from '../Composer';
import CommentsObject from '../CommentsObject';
import ActivitiesMenu from './ActivitiesMenu';
import {CommentsOrderBy} from '../../types/comments';
import {FeedObjectActivitiesType, FeedObjectTemplateType} from '../../types/feedObject';
import RelevantActivities from './RelevantActivities';
import ReplyCommentObject from '../CommentObject/ReplyComment';
import {LoadingButton} from '@mui/lab';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {AxiosResponse} from 'axios';
import MarkRead from '../../shared/MarkRead';
import classNames from 'classnames';
import ContributionActionsMenu from '../../shared/ContributionActionsMenu';
import {getContributionHtml} from '../../utils/contribute';

const messages = defineMessages({
  comment: {
    id: 'ui.feedObject.comment',
    defaultMessage: 'ui.feedObject.comment'
  },
  visibleToAll: {
    id: 'ui.feedObject.visibleToAll',
    defaultMessage: 'ui.feedObject.visibleToAll'
  }
});

const PREFIX = 'SCFeedObject';

const classes = {
  root: `${PREFIX}-root`,
  title: `${PREFIX}-title`,
  username: `${PREFIX}-username`,
  category: `${PREFIX}-category`,
  content: `${PREFIX}-content`,
  text: `${PREFIX}-text`,
  snippetContent: `${PREFIX}-snippet-content`,
  tag: `${PREFIX}-tag`,
  activitiesContent: `${PREFIX}-activities-content`,
  followButton: `${PREFIX}-follow-button`,
  activityAt: `${PREFIX}-activity-at`,
  sharedContentFeedObject: `${PREFIX}-shared-content-feed-object`,
  deleted: `${PREFIX}-deleted`
};

const Root = styled(Card, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  marginBottom: theme.spacing(2),
  [`& .${PREFIX}-share`]: {
    backgroundColor: '#f8f8f8'
  },
  [`& .${classes.title}`]: {
    fontWeight: 600,
    color: '#3e3e3e'
  },
  [`& .${classes.username}`]: {
    color: '#000',
    fontWeight: 600,
    fontSize: '15px',
    textDecoration: 'none'
  },
  [`& .${classes.category}`]: {
    textAlign: 'center',
    color: '#939598',
    borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
    '& a': {
      textDecoration: 'none',
      color: '#3e3e3e'
    },
    '& a::after': {
      content: '"\\2022"',
      padding: theme.spacing()
    },
    '& a:last-child::after': {
      display: 'none'
    }
  },
  [`& .${classes.content}`]: {
    paddingTop: 0,
    paddingBottom: 0
  },
  [`& .${classes.text}`]: {
    padding: '5px 1px',
    marginBottom: 0
  },
  [`& .${classes.snippetContent}`]: {
    textDecoration: 'none',
    color: '#3e3e3e'
  },
  [`& .${classes.tag}`]: {
    display: 'inline-block',
    position: 'relative',
    top: 3
  },
  [`& .${classes.activitiesContent}`]: {
    paddingBottom: '3px'
  },
  [`& .${classes.followButton}`]: {
    backgroundColor: theme.palette.grey[100],
    color: theme.palette.grey[700],
    boxShadow: 'none',
    '&:hover': {
      backgroundColor: theme.palette.grey[300],
      boxShadow: 'none'
    }
  },
  [`& .${classes.activityAt}`]: {
    textDecoration: 'none',
    color: '#939598'
  },
  [`& .${classes.sharedContentFeedObject}`]: {
    textDecoration: 'none',
    color: theme.palette.grey[700]
  },
  [`& .${classes.deleted}`]: {
    opacity: 0.3,
    '&:hover': {
      opacity: 1
    }
  },
  '& .MuiSvgIcon-root': {
    width: '0.7em',
    marginBottom: '0.5px'
  }
}));

export interface FeedObjectProps extends CardProps {
  /**
   * Id of the feedObject
   * @default `feed_object_<feedObjectType>_<feedObjectId | feedObject.id>`
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
   * Feed Object
   * @default null
   */
  feedObject?: SCFeedObjectType;

  /**
   * Feed Object type
   * @default 'post'
   */
  feedObjectType?: SCFeedObjectTypologyType;

  /**
   * Mark the FeedObject as read when enter in viewport
   * @default false
   */
  markRead?: boolean;

  /**
   * Feed Object latest activities
   * @default null
   */
  feedObjectActivities?: any[];

  /**
   * Feed Object template type
   * @default 'preview'
   */
  template?: FeedObjectTemplateType;

  /**
   * Hide share action object
   * @default false
   */
  hideShareAction?: boolean;

  /**
   * Hide follow action object
   * @default false
   */
  hideFollowAction?: boolean;

  /**
   * Hide Participants preview
   * @default false
   */
  hideParticipantsPreview?: boolean;

  /**
   * Other props
   */
  [p: string]: any;
}

/**
 * > API documentation for the Community-UI Feed Object component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {FeedObject} from '@selfcommunity/ui';
 ```

 #### Component Name

 The name `SCFeedObject` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCFeedObject-root|Styles applied to the root element.|
 |title|.SCFeedObject-title|Styles applied to the title element.|
 |username|.SCFeedObject-username|Styles applied to the username element.|
 |category|.SCFeedObject-category|Styles applied to the category element.|
 |content|.SCFeedObject-content|Styles applied to the content section.|
 |text|.SCFeedObject-text|Styles applied to the text element.|
 |snippetContent|.SCFeedObject-snippet-content|Styles applied to snippet content element.|
 |tag|.SCFeedObject-tag|Styles applied to the tag element.|
 |activitiesContent|.SCFeedObject-activities-content|Styles applied to the activities content element.|
 |followButton|.SCFeedObject-follow-button|Styles applied to the follow button element.|
 |activityAt|.SCFeedObject-activity-at|Styles applied to the activity at section.|
 |sharedContentFeedObject|.SCFeedObject-shared-content-feed-object|Styles applied to the feed obj shared content element.|

 * @param props
 */
export default function FeedObject(props: FeedObjectProps): JSX.Element {
  // PROPS
  const {
    id = `feed_object_${props.feedObjectType}_${props.feedObjectId ? props.feedObjectId : props.feedObject ? props.feedObject.id : ''}`,
    className = null,
    feedObjectId = null,
    feedObject = null,
    feedObjectType = SCFeedObjectTypologyType.POST,
    feedObjectActivities = null,
    markRead = false,
    template = FeedObjectTemplateType.PREVIEW,
    hideShareAction = false,
    hideFollowAction = false,
    hideParticipantsPreview = false,
    ...rest
  } = props;

  // CONTEXT
  const scContext: SCContextType = useSCContext();
  const scRoutingContext: SCRoutingContextType = useSCRouting();
  const scUserContext: SCUserContextType = useSCUser();

  // RETRIVE OBJECTS
  const {obj, setObj} = useSCFetchFeedObject({id: feedObjectId, feedObject, feedObjectType});

  // STATE
  const [composerOpen, setComposerOpen] = useState<boolean>(false);
  const [comments, setComments] = useState<SCCommentType[]>([]);
  const [expandedActivities, setExpandedActivities] = useState<boolean>(getInitialExpandedActivities());
  const [selectedActivities, setSelectedActivities] = useState<string>(getInitialSelectedActivitiesType());
  const [isReplying, setIsReplying] = useState<boolean>(false);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);

  // INTL
  const intl = useIntl();

  /**
   * Set:
   * - expandedActivities
   * - selectedActivities
   * when update the current obj
   */
  useEffect(() => {
    if (obj) {
      setExpandedActivities(getInitialExpandedActivities());
    }
  }, [obj]);

  /**
   * Get initial expanded activities
   */
  function getInitialExpandedActivities() {
    return obj && ((feedObjectActivities && feedObjectActivities.length > 0) || obj.comment_count > 0);
  }

  /**
   * Get initial selected activities section
   */
  function getInitialSelectedActivitiesType() {
    if (feedObjectActivities && feedObjectActivities.length > 0) {
      return FeedObjectActivitiesType.RELEVANCE_ACTIVITIES;
    }
    return FeedObjectActivitiesType.RECENT_COMMENTS;
  }

  /**
   * Handle change/update poll: votes
   */
  function handleChangePoll(pollObject: SCPollType) {
    const newObj = obj;
    obj['poll'] = pollObject;
    setObj(newObj);
  }

  /**
   * Render header action
   * if author = authenticated user -> render edit action
   * else render ReportingMenu
   */
  function renderHeaderAction() {
    return (
      <ContributionActionsMenu
        feedObject={obj}
        feedObjectType={feedObjectType}
        onEditContribution={handleToggleEdit}
        onDeleteContribution={handleDelete}
        onRestoreContribution={handleRestore}
        onSuspendNotificationContribution={handleSuspendNotification}
      />
    );
  }

  /**
   * Handle restore obj
   */
  function handleRestore() {
    setObj((prev) => ({...prev, ...{deleted: false}}));
  }

  /**
   * Handle delete obj
   */
  function handleDelete() {
    setObj((prev) => ({...prev, ...{deleted: true}}));
  }

  /**
   * Handle suspend notification obj
   */
  function handleSuspendNotification() {
    setObj((prev) => ({...prev, ...{suspended: !prev.suspended}}));
  }

  /**
   * Handle initial edit
   * Open composer
   */
  function handleToggleEdit() {
    setComposerOpen((prev) => !prev);
  }

  /**
   * handle edit success
   */
  function handleEditSuccess(data) {
    setObj(data);
    setComposerOpen(false);
  }

  /**
   * Perform follow/unfollow
   * Post, Discussion, Status
   */
  const performFollow = useMemo(
    () => () => {
      return http
        .request({
          url: Endpoints.FollowContribution.url({type: feedObjectType, id: obj.id}),
          method: Endpoints.FollowContribution.method
        })
        .then((res: AxiosResponse<SCTagType>) => {
          if (res.status >= 300) {
            return Promise.reject(res);
          }
          return Promise.resolve(res.data);
        });
    },
    [obj]
  );

  /**
   * Handle follow object
   */
  function handleFollow() {
    setIsFollowing(true);
    performFollow()
      .then((data) => {
        setObj(Object.assign({}, obj, {followed: !obj.followed}));
        setIsFollowing(false);
      })
      .catch((error) => {
        Logger.error(SCOPE_SC_UI, error);
      });
  }

  /**
   * Handle change activities type
   * @param type
   */
  function handleSelectActivitiesType(type) {
    setComments([]);
    setSelectedActivities(type);
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
            [`${feedObjectType}`]: obj.id,
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
    [obj]
  );

  /**
   * Handle comment
   */
  function handleReply(comment) {
    setIsReplying(true);
    performReply(comment)
      .then((data: SCCommentType) => {
        if (selectedActivities !== FeedObjectActivitiesType.RECENT_COMMENTS || obj.comment_count === 0) {
          setObj(Object.assign({}, obj, {comment_count: obj.comment_count + 1}));
          setComments([]);
          setSelectedActivities(FeedObjectActivitiesType.RECENT_COMMENTS);
        } else {
          setComments([...[data], ...comments]);
        }
        setIsReplying(false);
      })
      .catch((error) => {
        Logger.error(SCOPE_SC_UI, error);
      });
  }

  /**
   * Render collapsed activities of the single feedObject
   */
  function renderActivities() {
    return (
      <>
        {scUserContext.user && (
          <ReplyCommentObject inline variant={'outlined'} onReply={handleReply} isLoading={isReplying} key={Number(isReplying)} />
        )}
        {(obj.comment_count || feedObjectActivities || comments.length > 0) && (
          <ActivitiesMenu
            selectedActivities={selectedActivities}
            hideRelevantActivitiesItem={!(feedObjectActivities && feedObjectActivities.length > 0)}
            onChange={handleSelectActivitiesType}
          />
        )}
        {selectedActivities === FeedObjectActivitiesType.RELEVANCE_ACTIVITIES ? renderRelevantActivities() : renderComments()}
      </>
    );
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
    const _commentsOrderBy =
      selectedActivities === FeedObjectActivitiesType.CONNECTIONS_COMMENTS
        ? CommentsOrderBy.CONNECTION_DESC
        : selectedActivities === FeedObjectActivitiesType.FIRST_COMMENTS
        ? CommentsOrderBy.ADDED_AT_ASC
        : CommentsOrderBy.ADDED_AT_DESC;
    return (
      <>
        {(obj.comment_count > 0 || comments.length > 0) && (
          <LazyLoad once>
            <CommentsObject
              key={_commentsOrderBy}
              feedObject={obj}
              feedObjectType={feedObjectType}
              variant={'outlined'}
              infiniteScrolling={false}
              commentsPageCount={3}
              hidePrimaryReply={true}
              commentsOrderBy={_commentsOrderBy}
              additionalHeaderComments={comments}
              hideAdvertising={true}
              CommentObjectProps={{variant: 'outlined'}}
            />
          </LazyLoad>
        )}
      </>
    );
  }

  /**
   * Expand activities if the user is logged
   */
  function handleExpandActivities() {
    if (scUserContext.user) {
      setExpandedActivities((prev) => !prev);
    } else {
      scContext.settings.handleAnonymousAction();
    }
  }

  /**
   * Render the obj object
   * Manage variants:
   * SNIPPET, PREVIEW, DETAIL
   */
  let objElement;
  if (template === FeedObjectTemplateType.PREVIEW || template === FeedObjectTemplateType.DETAIL) {
    objElement = (
      <React.Fragment>
        {obj ? (
          <Box className={classNames({[classes.deleted]: obj && obj.deleted})}>
            {obj.categories.length > 0 && (
              <div className={classes.category}>
                {obj.categories.map((c) => (
                  <Link to={scRoutingContext.url(SCRoutes.CATEGORY_ROUTE_NAME, c)} key={c.id}>
                    <Typography variant="overline">{c.name}</Typography>
                  </Link>
                ))}
              </div>
            )}
            <CardHeader
              avatar={
                <Link to={scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, obj.author)}>
                  <Avatar aria-label="recipe" src={obj.author.avatar}>
                    {obj.author.username}
                  </Avatar>
                </Link>
              }
              title={
                <Link to={scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, obj.author)} className={classes.username}>
                  {obj.author.username}
                </Link>
              }
              subheader={
                <Grid component="span" item={true} sm="auto" container direction="row" alignItems="center">
                  <Link to={scRoutingContext.url(feedObjectType, obj)} className={classes.activityAt}>
                    <DateTimeAgo date={obj.added_at} />
                  </Link>
                  <Bullet />
                  <div className={classes.tag}>
                    {obj.addressing.length > 0 ? (
                      <Tags tags={obj.addressing} />
                    ) : (
                      <Tooltip title={`${intl.formatMessage(messages.visibleToAll)}`}>
                        <WorldIcon color="disabled" fontSize="small" />
                      </Tooltip>
                    )}
                  </div>
                </Grid>
              }
              action={renderHeaderAction()}
            />
            <CardContent classes={{root: classes.content}}>
              {'title' in obj && (
                <>
                  {template === FeedObjectTemplateType.DETAIL ? (
                    <Typography variant="body1" gutterBottom className={classes.title}>
                      {obj.title}
                    </Typography>
                  ) : (
                    <Link to={scRoutingContext.url(feedObjectType, obj)}>
                      <Typography variant="body1" gutterBottom className={classes.title}>
                        {obj.title}
                      </Typography>
                    </Link>
                  )}
                </>
              )}
              <Typography
                component="div"
                gutterBottom
                className={classes.text}
                dangerouslySetInnerHTML={{
                  __html: template === FeedObjectTemplateType.PREVIEW ? obj.summary : getContributionHtml(obj, scRoutingContext.url)
                }}
              />
              <MediasPreview medias={obj.medias} />
              {obj['poll'] && <PollObject feedObject={obj} pollObject={obj['poll']} onChange={handleChangePoll} elevation={0} />}
              <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                {!hideParticipantsPreview && (
                  <LazyLoad once>
                    <ContributorsFeedObject feedObject={obj} feedObjectType={obj.type} sx={{padding: '6px'}} />
                  </LazyLoad>
                )}
                {scUserContext.user && obj.author.id !== scUserContext.user.id && !hideFollowAction && (
                  <LoadingButton
                    classes={{root: classes.followButton}}
                    loading={isFollowing}
                    variant="contained"
                    size="small"
                    disabled={isFollowing}
                    onClick={handleFollow}>
                    {obj.followed ? (
                      <FormattedMessage id="ui.feedObject.unfollow" defaultMessage="ui.feedObject.unfollow" />
                    ) : (
                      <FormattedMessage id="ui.feedObject.follow" defaultMessage="ui.feedObject.follow" />
                    )}
                  </LoadingButton>
                )}
              </Stack>
            </CardContent>
            <CardActions sx={{padding: '1px 8px'}}>
              <Actions
                feedObject={obj}
                feedObjectType={feedObjectType}
                hideShareAction={hideShareAction}
                hideCommentAction={template === FeedObjectTemplateType.DETAIL}
                handleExpandActivities={handleExpandActivities}
              />
            </CardActions>
            {template === FeedObjectTemplateType.PREVIEW && (
              <Collapse in={expandedActivities} timeout="auto" unmountOnExit>
                <CardContent className={classes.activitiesContent} sx={{paddingTop: 0}}>
                  {renderActivities()}
                </CardContent>
              </Collapse>
            )}
            {composerOpen && (
              <Composer
                open={composerOpen}
                feedObject={obj}
                onClose={handleToggleEdit}
                onSuccess={handleEditSuccess}
                maxWidth="sm"
                fullWidth
                scroll="body"
              />
            )}
          </Box>
        ) : (
          <FeedObjectSkeleton template={template} elevation={0} />
        )}
      </React.Fragment>
    );
  } else if (template === FeedObjectTemplateType.SHARE) {
    objElement = (
      <React.Fragment>
        {obj ? (
          <React.Fragment>
            {obj.categories && (
              <div className={classes.category}>
                {obj.categories.map((c) => (
                  <Link to={scRoutingContext.url(SCRoutes.CATEGORY_ROUTE_NAME, c)} key={c.id}>
                    <Typography variant="overline">{c.name}</Typography>
                  </Link>
                ))}
              </div>
            )}
            <CardHeader
              avatar={
                <Link to={scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, obj.author)} className={classes.username}>
                  <Avatar aria-label="recipe" src={obj.author.avatar}>
                    {obj.author.username}
                  </Avatar>
                </Link>
              }
              title={
                <Link to={scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, obj.author)} className={classes.username}>
                  {obj.author.username}
                </Link>
              }
              subheader={
                <Grid component="span" item={true} sm="auto" container direction="row" alignItems="center">
                  <Link to={scRoutingContext.url(feedObjectType, obj)} className={classes.activityAt}>
                    <DateTimeAgo date={obj.added_at} />
                  </Link>
                </Grid>
              }
            />
            <CardContent classes={{root: classes.content}}>
              {'title' in obj && (
                <Link to={scRoutingContext.url(feedObjectType, obj)}>
                  <Typography variant="body1" gutterBottom className={classes.title}>
                    {obj.title}
                  </Typography>
                </Link>
              )}
              <MediasPreview medias={obj.medias} />
              <Link to={scRoutingContext.url(feedObjectType, obj)} className={classes.sharedContentFeedObject}>
                <Typography component="div" className={classes.text} variant="body2" gutterBottom dangerouslySetInnerHTML={{__html: obj.html}} />
              </Link>
              {obj['poll'] && <PollObject feedObject={obj} pollObject={obj['poll']} onChange={handleChangePoll} elevation={0} />}
            </CardContent>
          </React.Fragment>
        ) : (
          <FeedObjectSkeleton template={template} elevation={0} />
        )}
      </React.Fragment>
    );
  } else {
    objElement = (
      <React.Fragment>
        {obj ? (
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
              <Link to={scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, obj.author)}>
                <Avatar alt={obj.author.username} variant="circular" src={obj.author.avatar} />
              </Link>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Link to={scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, obj.author)} className={classes.username}>
                  {obj.author.username}
                </Link>
              }
              secondary={
                <React.Fragment>
                  <Link to={scRoutingContext.url(feedObjectType, obj)} className={classes.snippetContent}>
                    {obj.summary}
                  </Link>
                  <Box component="span" sx={{display: 'flex', justifyContent: 'flex-start', p: '2px'}}>
                    <Grid component="span" item={true} sm="auto" container direction="row" alignItems="center">
                      <Link to={scRoutingContext.url(feedObjectType, obj)} className={classes.activityAt}>
                        <DateTimeAgo component="span" date={obj.added_at} />
                      </Link>
                      <Bullet sx={{paddingLeft: '4px', paddingTop: '1px'}} />
                      <Button component={Link} to={scRoutingContext.url(feedObjectType, obj)} variant={'text'} sx={{marginTop: '-1px'}}>
                        {intl.formatMessage(messages.comment)}
                      </Button>
                    </Grid>
                  </Box>
                </React.Fragment>
              }
            />
          </ListItem>
        ) : (
          <FeedObjectSkeleton elevation={0} />
        )}
      </React.Fragment>
    );
  }

  /**
   * Renders root object
   */
  return (
    <Root id={id} className={classNames(classes.root, className)} {...rest}>
      {obj && markRead && <MarkRead endpoint={Endpoints.FeedObjectMarkRead} data={{object: [obj.id]}} />}
      <Box className={`${PREFIX}-${template}`}>{objElement}</Box>
    </Root>
  );
}
