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
import FeedObjectSkeleton from '../Skeleton/FeedObjectSkeleton';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TimeAgo from 'timeago-react';
import DateTimeAgo from '../../shared/DateTimeAgo';
import Bullet from '../../shared/Bullet';
import Tags from '../../shared/Tags';
import MediasPreview from '../../shared/MediasPreview';
import ReportingFlagMenu from '../../shared/ReportingFlagMenu';
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
  SCFeedObjectType,
  SCFeedObjectTypologyType,
  SCPollType,
  SCRoutes,
  SCRoutingContextType,
  SCTagType,
  SCUserContextType,
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
import ReplyCommentObject, { ReplyCommentObjectProps } from '../CommentObject/ReplyComment';
import {LoadingButton} from '@mui/lab';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {AxiosResponse} from 'axios';

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
  title: `${PREFIX}-title`,
  username: `${PREFIX}-username`,
  category: `${PREFIX}-category`,
  content: `${PREFIX}-content`,
  text: `${PREFIX}-text`,
  snippetContent: `${PREFIX}-snippet-content`,
  tag: `${PREFIX}-tag`,
  activitiesContent: `${PREFIX}-activities-content`,
  followButton: `${PREFIX}-follow-button`
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
  '& .MuiSvgIcon-root': {
    width: '0.7em',
    marginBottom: '0.5px'
  }
}));

export interface FeedObjectProps extends CardProps {
  /**
   * Id of the feedObject
   * @default 'feed_object_<feedObjectType>_<feedObjectId | feedObject.id>'
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

export default function FeedObject(props: FeedObjectProps): JSX.Element {
  // PROPS
  const {
    id = `feed_object_${props.feedObjectType}_${props.feedObjectId ? props.feedObjectId : props.feedObject ? props.feedObject.id : ''}`,
    className = null,
    feedObjectId = null,
    feedObject = null,
    feedObjectType = SCFeedObjectTypologyType.POST,
    feedObjectActivities = null,
    template = FeedObjectTemplateType.PREVIEW,
    hideShareAction = false,
    hideFollowAction = false,
    hideParticipantsPreview = false,
    ...rest
  } = props;

  // CONTEXT
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
    if (scUserContext.user.id === obj.author.id) {
      return (
        <IconButton aria-haspopup="true" onClick={handleToggleEdit} size="medium">
          <EditOutlinedIcon />
        </IconButton>
      );
    }
    return <ReportingFlagMenu feedObject={obj} feedObjectType={feedObjectType} />;
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
        {<ReplyCommentObject inline variant={'outlined'} onReply={handleReply} isLoading={isReplying} key={Number(isReplying)} />}
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
   * Render the obj object
   * Manage variants:
   * SNIPPET, PREVIEW, DETAIL
   */
  let objElement;
  if (template === FeedObjectTemplateType.PREVIEW || template === FeedObjectTemplateType.DETAIL) {
    objElement = (
      <React.Fragment>
        {obj ? (
          <React.Fragment>
            {obj.categories && (
              <div className={classes.category}>
                {obj.categories.map((c) => (
                  <Link to={scRoutingContext.url(SCRoutes.CATEGORY_ROUTE_NAME, {id: c.id})} key={c.id}>
                    <Typography variant="overline">{c.name}</Typography>
                  </Link>
                ))}
              </div>
            )}
            <CardHeader
              avatar={
                <Link to={scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, {id: obj.author.id})}>
                  <Avatar aria-label="recipe" src={obj.author.avatar}>
                    {obj.author.username}
                  </Avatar>
                </Link>
              }
              title={
                <Link to={scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, {id: obj.author.id})} className={classes.username}>
                  {obj.author.username}
                </Link>
              }
              subheader={
                <Grid component="span" item={true} sm="auto" container direction="row" alignItems="center">
                  <DateTimeAgo date={obj.last_activity_at} />
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
                    <Link to={scRoutingContext.url(feedObjectType, {id: obj.id})}>
                      <Typography variant="body1" gutterBottom className={classes.title}>
                        {obj.title}
                      </Typography>
                    </Link>
                  )}
                </>
              )}
              <MediasPreview medias={obj.medias} />
              <Typography
                component="div"
                gutterBottom
                className={classes.text}
                dangerouslySetInnerHTML={{__html: template === FeedObjectTemplateType.PREVIEW ? obj.summary : obj.html}}
              />
              {obj['poll'] && <PollObject feedObject={obj} pollObject={obj['poll']} onChange={handleChangePoll} elevation={0} />}
              <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                {!hideParticipantsPreview && (
                  <LazyLoad once>
                    <ContributorsFeedObject feedObject={obj} feedObjectType={feedObjectType} sx={{padding: '6px'}} />
                  </LazyLoad>
                )}
                {obj.author.id !== scUserContext.user.id && !hideFollowAction && (
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
                handleExpandActivities={() => setExpandedActivities((prev) => !prev)}
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
          </React.Fragment>
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
                  <Typography variant="overline">{c.name}</Typography>
                ))}
              </div>
            )}
            <CardHeader
              avatar={
                <Avatar aria-label="recipe" src={obj.author.avatar}>
                  {obj.author.username}
                </Avatar>
              }
              title={obj.author.username}
              subheader={
                <Grid component="span" item={true} sm="auto" container direction="row" alignItems="center">
                  <DateTimeAgo date={obj.last_activity_at} />
                </Grid>
              }
            />
            <CardContent classes={{root: classes.content}}>
              {'title' in obj && (
                <Typography variant="body1" gutterBottom className={classes.title}>
                  {obj.title}
                </Typography>
              )}
              <MediasPreview medias={obj.medias} />
              <Typography component="div" className={classes.text} variant="body2" gutterBottom dangerouslySetInnerHTML={{__html: obj.html}} />
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
              <Link to={scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, {id: obj.author.id})}>
                <Avatar alt={obj.author.username} variant="circular" src={obj.author.avatar} />
              </Link>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Link to={scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, {id: obj.author.id})} className={classes.username}>
                  {obj.author.username}
                </Link>
              }
              secondary={
                <React.Fragment>
                  <Link to={scRoutingContext.url(feedObjectType, {id: obj.id})} className={classes.snippetContent}>
                    {obj.summary}
                  </Link>
                  <Box component="span" sx={{display: 'flex', justifyContent: 'flex-start', p: '2px'}}>
                    <Grid component="span" item={true} sm="auto" container direction="row" alignItems="center">
                      <AccessTimeIcon sx={{paddingRight: '2px'}} />
                      <TimeAgo datetime={obj.added_at} />
                      <Bullet sx={{paddingLeft: '4px', paddingTop: '1px'}} />
                      <Button component={Link} to={scRoutingContext.url(feedObjectType, {id: obj.id})} variant={'text'} sx={{marginTop: '-1px'}}>
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
    <Root id={id} className={className} {...rest}>
      <Box className={`${PREFIX}-${template}`}>{objElement}</Box>
    </Root>
  );
}
