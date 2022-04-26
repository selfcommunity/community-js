import React, {useEffect, useMemo, useState} from 'react';
import {styled} from '@mui/material/styles';
import CardContent from '@mui/material/CardContent';
import {Avatar, Box, Button, CardActions, CardHeader, CardProps, Collapse, Stack, Tooltip, Typography} from '@mui/material';
import FeedObjectSkeleton, {FeedObjectSkeletonProps} from './Skeleton';
import DateTimeAgo from '../../shared/DateTimeAgo';
import Bullet from '../../shared/Bullet';
import Tags from '../../shared/Tags';
import MediasPreview, {MediaPreviewProps} from '../../shared/MediasPreview';
import Actions, {ActionsProps} from './Actions';
import Icon from '@mui/material/Icon';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import PollObject, {PollObjectProps} from './Poll';
import ContributorsFeedObject, {ContributorsFeedObjectProps} from './Contributors';
import LazyLoad from 'react-lazyload';
import Composer from '../Composer';
import {SCFeedObjectActivitiesType, SCFeedObjectTemplateType} from '../../types/feedObject';
import MarkRead from '../../shared/MarkRead';
import classNames from 'classnames';
import ContributionActionsMenu, {ContributionActionsMenuProps} from '../../shared/ContributionActionsMenu';
import {getContributionHtml, getContributionRouteName, getContributionSnippet, getRouteData} from '../../utils/contribution';
import Follow, {FollowProps} from './Actions/Follow';
import Widget, {WidgetProps} from '../Widget';
import useThemeProps from '@mui/material/styles/useThemeProps';
import BaseItem from '../../shared/BaseItem';
import Activities, {ActivitiesProps} from './Activities';
import ReplyCommentObject, {ReplyCommentObjectProps} from '../CommentObject/ReplyComment';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {useSnackbar} from 'notistack';
import {AxiosResponse} from 'axios';
import {CommentObjectProps} from '../CommentObject';
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
  SCUserContextType,
  UserUtils,
  useSCContext,
  useSCFetchFeedObject,
  useSCRouting,
  useSCUser
} from '@selfcommunity/core';

const messages = defineMessages({
  visibleToAll: {
    id: 'ui.feedObject.visibleToAll',
    defaultMessage: 'ui.feedObject.visibleToAll'
  }
});

const PREFIX = 'SCFeedObject';

const classes = {
  root: `${PREFIX}-root`,
  deleted: `${PREFIX}-deleted`,
  header: `${PREFIX}-header`,
  category: `${PREFIX}-category`,
  username: `${PREFIX}-username`,
  activityAt: `${PREFIX}-activity-at`,
  tag: `${PREFIX}-tag`,
  content: `${PREFIX}-content`,
  titleSection: `${PREFIX}-title-section`,
  title: `${PREFIX}-title`,
  textSection: `${PREFIX}-text-section`,
  text: `${PREFIX}-text`,
  snippetContent: `${PREFIX}-snippet-content`,
  mediasSection: `${PREFIX}-medias-section`,
  pollsSection: `${PREFIX}-polls-section`,
  infoSection: `${PREFIX}-info-section`,
  actionsSection: `${PREFIX}-actions-section`,
  replyContent: `${PREFIX}-reply-content`,
  activitiesSection: `${PREFIX}-activities-section`,
  activitiesContent: `${PREFIX}-activities-content`,
  followButton: `${PREFIX}-follow-button`
};

const Root = styled(Widget, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  marginBottom: theme.spacing(2),
  [`&.${classes.root}`]: {
    width: '100%'
  },
  [`& .${classes.header}`]: {
    paddingBottom: 0
  },
  [`& .${classes.titleSection}`]: {
    '& a': {
      textDecoration: 'none'
    },
    '& a:hover': {
      textDecoration: 'underline'
    }
  },
  [`& .${classes.title}`]: {
    fontWeight: 600,
    color: '#3e3e3e',
    padding: `0px ${theme.spacing(2)}`
  },
  [`& .${classes.username}`]: {
    color: '#000',
    fontWeight: 600,
    fontSize: '15px',
    textDecoration: 'none'
  },
  [`& .${classes.header}`]: {
    '& .MuiCardHeader-subheader': {
      display: 'flex',
      alignItems: 'center'
    }
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
    },
    '& span': {
      textTransform: 'initial'
    }
  },
  [`& .${classes.content}`]: {
    padding: `${theme.spacing()} 0px`
  },
  [`& .${classes.textSection}`]: {
    '& a': {
      color: theme.palette.text.primary,
      textDecoration: 'none'
    }
  },
  [`& .${classes.text}`]: {
    padding: `${theme.spacing()} ${theme.spacing(2)}`,
    marginBottom: 0,
    '& a': {
      color: theme.palette.text.primary
    }
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
  [`& .${classes.actionsSection}`]: {
    padding: 0,
    display: 'flex',
    flexDirection: 'column'
  },
  [`& .${classes.replyContent}`]: {
    width: '100%',
    boxSizing: 'border-box',
    margin: 0,
    padding: theme.spacing(2)
  },
  [`& .${classes.activitiesContent}`]: {
    paddingTop: 3,
    paddingBottom: 3
  },
  [`& .${classes.infoSection}`]: {
    padding: `0px ${theme.spacing(2)}`
  },
  [`& .${classes.activityAt}`]: {
    textDecoration: 'none',
    color: 'inherit',
    marginTop: 3
  },
  [`& .${classes.deleted}`]: {
    opacity: 0.3,
    '&:hover': {
      opacity: 1
    }
  },
  '& .MuiIcon-root': {
    fontSize: '18px',
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
  template?: SCFeedObjectTemplateType;

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
   * Props to spread to ContributionActionsMenu component
   * @default {elevation: 0}
   */
  FeedObjectSkeletonProps?: FeedObjectSkeletonProps;

  /**
   * Props to spread to Follow button component
   * @default {}
   */
  FollowButtonProps?: FollowProps;

  /**
   * Props to spread to Actions component
   * @default {}
   */
  ActionsProps?: ActionsProps;

  /**
   * Props to spread to ContributionActionsMenu component
   * @default {}
   */
  ContributionActionsMenuProps?: ContributionActionsMenuProps;

  /**
   * Props to spread to Activities component
   * @default {}
   */
  ActivitiesProps?: ActivitiesProps;

  /**
   * Props to spread to MediasPreview component
   * @default {}
   */
  MediasPreviewProps?: MediaPreviewProps;

  /**
   * Props to spread to PollObject component
   * @default {}
   */
  PollObjectProps?: PollObjectProps;

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
   * Props to spread to ContributorsFeedObject component
   * @default {elevation: 0}
   */
  ContributorsFeedObjectProps?: ContributorsFeedObjectProps;

  /**
   * Props to spread to CommentObject component
   * @default {variant: 'outlined}
   */
  CommentComponentProps?: CommentObjectProps;

  /**
   * Props to spread to CommentObject component
   * @default {elevation: 0, variant: 'outlined'}
   */
  CommentObjectSkeletonProps?: any;

  /**
   * Callback on reply
   * @param SCCommentType
   */
  onReply?: (SCCommentType) => void;

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
 |header|.SCFeedObject-header|Styles applied to the header of the card.|
 |tag|.SCFeedObject-tag|Styles applied to the tag element.|
 |title-section|.SCFeedObject-title-section|Styles applied to the title section.|
 |title|.SCFeedObject-title|Styles applied to the title element.|
 |username|.SCFeedObject-username|Styles applied to the username element.|
 |category|.SCFeedObject-category|Styles applied to the category element.|
 |content|.SCFeedObject-content|Styles applied to the content section. Content section include: title-section, text-section, snippetContent, subContent, medias-section, polls-section, info-section.|
 |text-section|.SCFeedObject-text-section|Styles applied to the text section.|
 |text|.SCFeedObject-text|Styles applied to the text element.|
 |snippet-content|.SCFeedObject-snippet-content|Styles applied to snippet content element.|
 |medias-section|.SCFeedObject-medias-section|Styles applied to the medias section.|
 |polls-section|.SCFeedObject-polls-section|Styles applied to the polls section.|
 |info-section|.SCFeedObject-info-section|Styles applied to the info section.|
 |subContent|.SCFeedObject-sub-content|Styles applied to the sub content (container placed immediately after the content, similar to a footer). Wrap the contributors and the follow button.|
 |actions-section|.SCFeedObject-actions-section|Styles applied to the actions container.|
 |reply-content|.SCFeedObject-reply-content|Styles applied to the reply box.|
 |activitiesSection|.SCFeedObject-activities-section|Styles applied to the activities section element.|
 |activitiesContent|.SCFeedObject-activities-content|Styles applied to the activities content element.|
 |activityAt|.SCFeedObject-activity-at|Styles applied to the activity at section.|
 |deleted|.SCFeedObject-deleted|Styles applied to the feed obj when is deleted (visible only for admin and moderator).|

 * @param inProps
 */
export default function FeedObject(inProps: FeedObjectProps): JSX.Element {
  // PROPS
  const props: FeedObjectProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });

  const {
    id = `feed_object_${props.feedObjectId ? props.feedObjectId : props.feedObject ? props.feedObject.id : ''}`,
    className = null,
    feedObjectId = null,
    feedObject = null,
    feedObjectType = SCFeedObjectTypologyType.POST,
    feedObjectActivities = null,
    markRead = false,
    template = SCFeedObjectTemplateType.PREVIEW,
    hideFollowAction = false,
    hideParticipantsPreview = false,
    FollowButtonProps = {},
    FeedObjectSkeletonProps = {elevation: 0},
    ActionsProps = {},
    ReplyCommentComponent = ReplyCommentObject,
    ReplyCommentComponentProps = {ReplyBoxProps: {variant: 'outlined'}},
    CommentComponentProps = {variant: 'outlined'},
    CommentObjectSkeletonProps = {elevation: 0, WidgetProps: {variant: 'outlined'} as WidgetProps},
    ContributionActionsMenuProps = {},
    MediasPreviewProps = {},
    PollObjectProps = {elevation: 0},
    ContributorsFeedObjectProps = {},
    onReply,
    ...rest
  } = props;

  // CONTEXT
  const scContext: SCContextType = useSCContext();
  const scRoutingContext: SCRoutingContextType = useSCRouting();
  const scUserContext: SCUserContextType = useSCUser();
  const {enqueueSnackbar} = useSnackbar();

  // RETRIVE OBJECTS
  const {obj, setObj} = useSCFetchFeedObject({id: feedObjectId, feedObject, feedObjectType});
  const objId = obj ? obj.id : null;

  // STATE
  const [composerOpen, setComposerOpen] = useState<boolean>(false);
  const [expandedActivities, setExpandedActivities] = useState<boolean>(false);
  const [comments, setComments] = useState<SCCommentType[]>([]);
  const [isReplying, setIsReplying] = useState<boolean>(false);
  const [selectedActivities, setSelectedActivities] = useState<SCFeedObjectActivitiesType>(getInitialSelectedActivitiesType());

  // INTL
  const intl = useIntl();

  /**
   * Get initial expanded activities
   */
  function geExpandedActivities() {
    return obj && ((feedObjectActivities && feedObjectActivities.length > 0) || obj.comment_count > 0);
  }

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
   * Open expanded activities
   */
  useEffect(() => {
    setExpandedActivities(geExpandedActivities);
  }, [objId]);

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
   * else render ContributionActionsMenu
   */
  function renderHeaderAction() {
    return (
      <ContributionActionsMenu
        feedObject={obj}
        feedObjectType={feedObjectType}
        onEditContribution={handleToggleEdit}
        onHideContribution={handleHide}
        onDeleteContribution={handleDelete}
        onRestoreContribution={handleRestore}
        onSuspendNotificationContribution={handleSuspendNotification}
        {...ContributionActionsMenuProps}
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
   * Handle restore obj
   */
  function handleHide() {
    setObj((prev) => ({...prev, ...{collapsed: !prev.collapsed}}));
  }

  /**
   * Handle delete obj
   */
  function handleDelete() {
    setObj((prev) => ({...prev, ...{deleted: !prev.deleted}}));
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
   * Handle follow obj
   */
  function handleFollow(isFollow) {
    setObj((prev) => ({...prev, ...{followed: isFollow}}));
  }

  /**
   * Handle delete comment callback
   */
  function handleDeleteComment() {
    setObj((prev) => ({...prev, ...{comment_count: Math.max(prev.comment_count - 1, 0)}}));
  }

  /**
   * Handle select activities
   */
  function handleSelectedActivities(type) {
    setSelectedActivities(type);
    setComments([]);
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
    [objId]
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
          setIsReplying(false);
          setObj((prev) => ({...prev, ...{comment_count: prev.comment_count + 1}}));
          onReply && onReply(data);
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
   * Render the obj object
   * Manage variants:
   * SNIPPET, PREVIEW, DETAIL
   */
  let objElement;
  if (template === SCFeedObjectTemplateType.PREVIEW || template === SCFeedObjectTemplateType.DETAIL) {
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
              classes={{root: classes.header}}
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
                <>
                  <Link to={scRoutingContext.url(getContributionRouteName(obj), getRouteData(obj))} className={classes.activityAt}>
                    <DateTimeAgo component={'span'} date={obj.added_at} />
                  </Link>
                  <Bullet />
                  <Box className={classes.tag}>
                    {obj.addressing.length > 0 ? (
                      <Tags tags={obj.addressing} />
                    ) : (
                      <Tooltip title={`${intl.formatMessage(messages.visibleToAll)}`}>
                        <Icon color="disabled" fontSize="small">
                          public
                        </Icon>
                      </Tooltip>
                    )}
                  </Box>
                </>
              }
              action={renderHeaderAction()}
            />
            <CardContent classes={{root: classes.content}}>
              <Box className={classes.titleSection}>
                {'title' in obj && (
                  <>
                    {template === SCFeedObjectTemplateType.DETAIL ? (
                      <Typography variant="body1" gutterBottom className={classes.title}>
                        {obj.title}
                      </Typography>
                    ) : (
                      <Link to={scRoutingContext.url(getContributionRouteName(obj), getRouteData(obj))}>
                        <Typography variant="body1" gutterBottom className={classes.title}>
                          {obj.title}
                        </Typography>
                      </Link>
                    )}
                  </>
                )}
              </Box>
              <Box className={classes.textSection}>
                {template === SCFeedObjectTemplateType.DETAIL ? (
                  <Typography
                    component="div"
                    gutterBottom
                    className={classes.text}
                    dangerouslySetInnerHTML={{
                      __html: getContributionHtml(obj, scRoutingContext.url)
                    }}
                  />
                ) : (
                  <Link to={scRoutingContext.url(getContributionRouteName(obj), getRouteData(obj))}>
                    <Typography component="div" gutterBottom className={classes.text} dangerouslySetInnerHTML={{__html: obj.summary}} />
                  </Link>
                )}
              </Box>
              <Box className={classes.mediasSection}>
                <MediasPreview medias={obj.medias} {...MediasPreviewProps} />
              </Box>
              <Box className={classes.pollsSection}>
                {obj['poll'] && <PollObject feedObject={obj} pollObject={obj['poll']} onChange={handleChangePoll} {...PollObjectProps} />}
              </Box>
              <Box className={classes.infoSection}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                  {!hideParticipantsPreview && (
                    <LazyLoad once>
                      <ContributorsFeedObject feedObject={obj} feedObjectType={obj.type} {...ContributorsFeedObjectProps} />
                    </LazyLoad>
                  )}
                  {!hideFollowAction && <Follow feedObject={obj} feedObjectType={obj.type} handleFollow={handleFollow} {...FollowButtonProps} />}
                </Stack>
              </Box>
            </CardContent>
            <CardActions className={classes.actionsSection}>
              <Actions
                feedObject={obj}
                hideCommentAction={template === SCFeedObjectTemplateType.DETAIL}
                handleExpandActivities={handleExpandActivities}
                {...ActionsProps}
              />
              {scUserContext.user && (expandedActivities || template === SCFeedObjectTemplateType.DETAIL) && (
                <Box className={classes.replyContent}>
                  <ReplyCommentComponent
                    inline
                    onReply={handleReply}
                    readOnly={isReplying || !obj}
                    key={Number(isReplying)}
                    {...ReplyCommentComponentProps}
                  />
                </Box>
              )}
            </CardActions>
            {template === SCFeedObjectTemplateType.PREVIEW && (
              <Collapse in={expandedActivities} timeout="auto" unmountOnExit classes={{root: classes.activitiesSection}}>
                <CardContent className={classes.activitiesContent}>
                  <LazyLoad once>
                    <Activities
                      feedObject={obj}
                      feedObjectActivities={feedObjectActivities}
                      activitiesType={selectedActivities}
                      onSetSelectedActivities={handleSelectedActivities}
                      comments={comments}
                      CommentsObjectProps={{
                        CommentComponentProps: {...{onDelete: handleDeleteComment}, ...CommentComponentProps},
                        CommentObjectSkeletonProps: CommentObjectSkeletonProps
                      }}
                    />
                  </LazyLoad>
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
          <FeedObjectSkeleton template={template} {...FeedObjectSkeletonProps} />
        )}
      </React.Fragment>
    );
  } else if (template === SCFeedObjectTemplateType.SHARE) {
    objElement = (
      <React.Fragment>
        {obj ? (
          <React.Fragment>
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
              classes={{root: classes.header}}
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
                <Link to={scRoutingContext.url(getContributionRouteName(obj), getRouteData(obj))} className={classes.activityAt}>
                  <DateTimeAgo date={obj.added_at} />
                </Link>
              }
            />
            <CardContent classes={{root: classes.content}}>
              <Box className={classes.titleSection}>
                {'title' in obj && (
                  <Link to={scRoutingContext.url(getContributionRouteName(obj), getRouteData(obj))}>
                    <Typography variant="body1" gutterBottom className={classes.title}>
                      {obj.title}
                    </Typography>
                  </Link>
                )}
              </Box>
              <Box className={classes.textSection}>
                <Link to={scRoutingContext.url(getContributionRouteName(obj), getRouteData(obj))} className={classes.text}>
                  <Typography component="div" className={classes.text} variant="body2" gutterBottom dangerouslySetInnerHTML={{__html: obj.html}} />
                </Link>
              </Box>
              <Box className={classes.mediasSection}>
                <MediasPreview medias={obj.medias} {...PollObjectProps} />
              </Box>
              <Box className={classes.pollsSection}>
                {obj['poll'] && <PollObject feedObject={obj} pollObject={obj['poll']} onChange={handleChangePoll} {...PollObjectProps} />}
              </Box>
            </CardContent>
          </React.Fragment>
        ) : (
          <FeedObjectSkeleton template={template} {...FeedObjectSkeletonProps} />
        )}
      </React.Fragment>
    );
  } else {
    objElement = (
      <React.Fragment>
        {obj ? (
          <BaseItem
            elevation={0}
            image={
              <Link to={scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, obj.author)}>
                <Avatar alt={obj.author.username} variant="circular" src={obj.author.avatar} />
              </Link>
            }
            primary={
              <Link to={scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, obj.author)} className={classes.username}>
                {obj.author.username}
              </Link>
            }
            disableTypography
            secondary={
              <Box>
                <Typography variant="body2">
                  <Link to={scRoutingContext.url(getContributionRouteName(obj), getRouteData(obj))} className={classes.snippetContent}>
                    {getContributionSnippet(obj)}
                  </Link>
                </Typography>
                <Link to={scRoutingContext.url(getContributionRouteName(obj), getRouteData(obj))} className={classes.activityAt}>
                  <DateTimeAgo component="span" date={obj.added_at} />
                </Link>
              </Box>
            }
            actions={
              <Button component={Link} to={scRoutingContext.url(getContributionRouteName(obj), getRouteData(obj))} variant="outlined">
                <FormattedMessage id="ui.feedObject.comment" defaultMessage="ui.feedObject.comment" />
              </Button>
            }
          />
        ) : (
          <FeedObjectSkeleton {...FeedObjectSkeletonProps} />
        )}
      </React.Fragment>
    );
  }

  /**
   * Renders root object
   */
  return (
    <Root id={id} className={classNames(classes.root, className, `${PREFIX}-${template}`)} {...rest}>
      {obj && markRead && <MarkRead endpoint={Endpoints.FeedObjectMarkRead} data={{object: [obj.id]}} />}
      {objElement}
    </Root>
  );
}
