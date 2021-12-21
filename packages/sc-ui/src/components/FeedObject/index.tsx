import React, {useMemo, useState} from 'react';
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
import ReplyCommentObject from '../CommentObject/ReplyComment';
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
  maxWidth: 700,
  marginBottom: theme.spacing(2),
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
   * Id of feed object
   */
  feedObjectId?: number;

  /**
   * Feed Object
   */
  feedObject?: SCFeedObjectType;

  /**
   * Feed Object type
   */
  feedObjectType?: SCFeedObjectTypologyType;

  /**
   * Feed Object latest activities
   */
  feedObjectActivities?: any[];

  /**
   * Feed Object template type
   */
  template?: FeedObjectTemplateType;
}

export default function FeedObject(props: FeedObjectProps): JSX.Element {
  // PROPS
  const {
    feedObjectId = null,
    feedObject = null,
    feedObjectType = SCFeedObjectTypologyType.POST,
    feedObjectActivities = null,
    template = FeedObjectTemplateType.PREVIEW,
    ...rest
  } = props;

  // CONTEXT
  const scRoutingContext: SCRoutingContextType = useSCRouting();
  const scUserContext: SCUserContextType = useSCUser();
  const {obj, setObj} = useSCFetchFeedObject({id: feedObjectId, feedObject, feedObjectType});

  // STATE
  const [composerOpen, setComposerOpen] = useState<boolean>(false);
  const [expandedActivities, setExpandedActivities] = useState<boolean>(getInitialExpandedActivities());
  const [selectedActivities, setSelectedActivities] = useState<string>(getInitialSelectedActivitiesType());
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const intl = useIntl();

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
    setSelectedActivities(type);
  }

  /**
   * Render collapsed activities of the single feedObject
   */
  function renderActivities() {
    return (
      <>
        {<ReplyCommentObject inline variant={'outlined'} />}
        {(obj.comment_count || obj.lastest_activities) && (
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
        {obj.comment_count > 0 && (
          <LazyLoad once>
            <CommentsObject
              feedObject={obj}
              feedObjectType={feedObjectType}
              variant={'outlined'}
              infiniteScrolling={false}
              commentsPageCount={3}
              hidePrimaryReply={true}
              commentsOrderBy={_commentsOrderBy}
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
                <Link to={scRoutingContext.url(feedObjectType, {id: obj.id})}>
                  <Typography variant="body1" gutterBottom className={classes.title}>
                    {obj.title}
                  </Typography>
                </Link>
              )}
              <MediasPreview medias={obj.medias} />
              <Typography
                variant="body2"
                gutterBottom
                dangerouslySetInnerHTML={{__html: template === FeedObjectTemplateType.PREVIEW ? obj.summary : obj.html}}
              />
              {obj['poll'] && <PollObject feedObject={obj} pollObject={obj['poll']} onChange={handleChangePoll} elevation={0} />}
              <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                <LazyLoad once>
                  <ContributorsFeedObject feedObject={obj} feedObjectType={feedObjectType} sx={{padding: '6px'}} />
                </LazyLoad>
                {obj.author.id !== scUserContext.user.id && (
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
              <Actions feedObject={obj} feedObjectType={feedObjectType} handleExpandActivities={() => setExpandedActivities((prev) => !prev)} />
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
                feedObjectType={feedObjectType}
                feedObjectId={obj.id}
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
   * Render root object
   */
  return (
    <Root {...rest}>
      <div className={`${PREFIX}-${template}`}>{objElement}</div>
    </Root>
  );
}
