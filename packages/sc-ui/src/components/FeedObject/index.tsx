import React, {useState} from 'react';
import {styled} from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import {
  Avatar,
  Box,
  Button,
  CardActions,
  CardHeader,
  Grid,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
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
import {defineMessages, useIntl} from 'react-intl';
import PollObject from './Poll';
import ContributorsFeedObject from './Contributors';
import LazyLoad from 'react-lazyload';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import {
  SCFeedObjectType,
  SCFeedObjectTypologyType,
  Link,
  useSCFetchFeedObject,
  SCPollType,
  SCUserContextType,
  useSCUser,
  SCRoutingContextType,
  useSCRouting,
  SCRoutes
} from '@selfcommunity/core';
import Composer from '../Composer';

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
  tag: `${PREFIX}-tag`
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
  '& .MuiSvgIcon-root': {
    width: '0.7em',
    marginBottom: '0.5px'
  }
}));

export enum FeedObjectTemplateType {
  SNIPPET = 'snippet',
  PREVIEW = 'preview',
  DETAIL = 'detail'
}

export default function FeedObject({
  feedObjectId = null,
  feedObject = null,
  feedObjectType = SCFeedObjectTypologyType.POST,
  template = FeedObjectTemplateType.PREVIEW,
  ...rest
}: {
  feedObjectId?: number;
  feedObject?: SCFeedObjectType;
  feedObjectType?: SCFeedObjectTypologyType;
  template?: FeedObjectTemplateType;
  [p: string]: any;
}): JSX.Element {
  const scRoutingContext: SCRoutingContextType = useSCRouting();
  const {obj, setObj} = useSCFetchFeedObject({id: feedObjectId, feedObject, feedObjectType});
  const [composerOpen, setComposerOpen] = useState<boolean>(false);
  const scUserContext: SCUserContextType = useSCUser();
  const intl = useIntl();

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
              <LazyLoad>
                <ContributorsFeedObject feedObject={obj} feedObjectType={feedObjectType} sx={{padding: '6px'}} />
              </LazyLoad>
            </CardContent>
            <CardActions>
              <Actions feedObject={obj} feedObjectType={feedObjectType} />
            </CardActions>
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
