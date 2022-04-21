/* eslint-disable */
import React, { useEffect, useState } from 'react';
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
import Composer from '../Composer';
import CommentsObject from '../CommentsObject';
import ActivitiesMenu from './ActivitiesMenu';
import {SCCommentsOrderBy} from '../../types/comments';
import {SCFeedObjectActivitiesType, SCFeedObjectTemplateType} from '../../types/feedObject';
import RelevantActivities from './RelevantActivities';
import ReplyCommentObject from '../CommentObject/ReplyComment';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {AxiosResponse} from 'axios';
import MarkRead from '../../shared/MarkRead';
import classNames from 'classnames';
import ContributionActionsMenu, {ContributionActionsMenuProps} from '../../shared/ContributionActionsMenu';
import {getContributionHtml, getContributionRouteName, getContributionSnippet, getRouteData} from '../../utils/contribution';
import {useSnackbar} from 'notistack';
import Follow, {FollowProps} from './Actions/Follow';
import Widget from '../Widget';
import useThemeProps from '@mui/material/styles/useThemeProps';
import BaseItem from '../../shared/BaseItem';
import FeedObjectActivities from './FeedObjectActivities';

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
  actions: `${PREFIX}-actions`,
  activities: `${PREFIX}-activities`,
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
  [`& .${classes.activitiesContent}`]: {
    paddingBottom: '3px'
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
  [`& .${classes.actions}`]: {
    paddingBottom: 10
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
   * Props to spread to ContributorsFeedObject component
   * @default {elevation: 0}
   */
  ContributorsFeedObjectProps?: ContributorsFeedObjectProps;

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
 |snippetContent|.SCFeedObject-snippet-content|Styles applied to snippet content element.|
 |medias-section|.SCFeedObject-medias-section|Styles applied to the medias section.|
 |polls-section|.SCFeedObject-polls-section|Styles applied to the polls section.|
 |info-section|.SCFeedObject-info-section|Styles applied to the info section.|
 |subContent|.SCFeedObject-sub-content|Styles applied to the sub content (container placed immediately after the content, similar to a footer). Wrap the contributors and the follow button.|
 |actions|.SCFeedObject-actions|Styles applied to the actions container.|
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
    ContributionActionsMenuProps = {},
    MediasPreviewProps = {},
    PollObjectProps = {elevation: 0},
    ContributorsFeedObjectProps = {},
    ...rest
  } = props;

  // CONTEXT
  const scContext: SCContextType = useSCContext();
  const scRoutingContext: SCRoutingContextType = useSCRouting();
  const scUserContext: SCUserContextType = useSCUser();

  // RETRIVE OBJECTS
  const {obj, setObj} = useSCFetchFeedObject({id: feedObjectId, feedObject, feedObjectType});
  const objId = obj ? obj.id : null;

  // STATE
  const [composerOpen, setComposerOpen] = useState<boolean>(false);
  const [expandedActivities, setExpandedActivities] = useState<boolean>(false);

  // INTL
  const intl = useIntl();

  /**
   * Get initial expanded activities
   */
  function geExpandedActivities() {
    return obj && ((feedObjectActivities && feedObjectActivities.length > 0) || obj.comment_count > 0);
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
            <CardActions className={classes.actions}>
              <Actions
                feedObject={obj}
                feedObjectType={feedObjectType}
                hideCommentAction={template === SCFeedObjectTemplateType.DETAIL}
                handleExpandActivities={handleExpandActivities}
                {...ActionsProps}
              />
            </CardActions>
            {template === SCFeedObjectTemplateType.PREVIEW && (
              <Collapse in={expandedActivities} timeout="auto" unmountOnExit classes={{root: classes.activities}}>
                <CardContent className={classes.activitiesContent} sx={{paddingTop: 0}}>
                  <FeedObjectActivities feedObject={obj} feedObjectType={feedObjectType} />
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
