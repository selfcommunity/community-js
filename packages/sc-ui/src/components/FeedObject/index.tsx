import React from 'react';
import {styled} from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  CardActions,
  CardHeader,
  Grid,
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
import Medias from './Medias';
import ReportingFlagMenu from '../../shared/ReportingFlagMenu';
import Actions from './Actions';
import WorldIcon from '@mui/icons-material/Public';
import {defineMessages, useIntl} from 'react-intl';
import PollObject from './Poll';
import {SCFeedObjectType, SCFeedObjectTypologyType, Link, useSCFetchFeedObject, SCPollType} from '@selfcommunity/core';
import ContributorsFeedObject from './Contributors';

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
    fontWeight: 600
  },
  [`& .${classes.username}`]: {
    color: '#000',
    fontWeight: 700,
    fontSize: '1.1em'
  },
  [`& .${classes.category}`]: {
    textAlign: 'center',
    color: '#939598',
    borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
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
  [`& .${classes.tag}`]: {
    display: 'inline-block',
    position: 'relative',
    top: 6
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
  const {obj, setObj} = useSCFetchFeedObject({id: feedObjectId, feedObject, feedObjectType});
  const intl = useIntl();

  /**
   * Handle change poll
   */
  function handleChangePoll(pollObject: SCPollType) {
    const newObj = obj;
    obj['poll'] = pollObject;
    setObj(newObj);
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
            <div className={classes.category}>
              {obj.categories.map((c) => (
                <Link key={c.id}>
                  <Typography variant="overline">{c.name}</Typography>
                </Link>
              ))}
            </div>
            <CardHeader
              avatar={
                <Link>
                  <Avatar aria-label="recipe" src={obj.author.avatar}>
                    {obj.author.username}
                  </Avatar>
                </Link>
              }
              title={<span className={classes.username}>{obj.author.username}</span>}
              subheader={
                <React.Fragment>
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
                </React.Fragment>
              }
              action={<ReportingFlagMenu feedObject={obj} feedObjectType={feedObjectType} />}
            />
            <CardContent classes={{root: classes.content}}>
              {'title' in obj && (
                <Typography variant="body1" gutterBottom className={classes.title}>
                  {obj.title}
                </Typography>
              )}
              <Medias medias={obj.medias} />
              <Typography
                variant="body2"
                gutterBottom
                dangerouslySetInnerHTML={{__html: template === FeedObjectTemplateType.PREVIEW ? obj.summary : obj.html}}
              />
              {obj['poll'] && (
                <PollObject feedObject={obj} feedObjectType={feedObjectType} pollObject={obj['poll']} onChange={handleChangePoll} elevation={0} />
              )}
              <ContributorsFeedObject feedObject={obj} feedObjectType={feedObjectType} />
            </CardContent>
            <CardActions>
              <Actions feedObject={obj} feedObjectType={feedObjectType} />
            </CardActions>
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
          <ListItem button={true} alignItems="flex-start">
            <ListItemAvatar>
              <Avatar alt={obj.author.username} variant="circular" src={obj.author.avatar} />
            </ListItemAvatar>
            <ListItemText
              primary={
                <Typography component="span" sx={{display: 'inline'}} color="primary">
                  {obj.author.username}
                </Typography>
              }
              secondary={
                <React.Fragment>
                  {obj.summary}
                  <Box component="span" sx={{display: 'flex', justifyContent: 'flex-start', p: '2px'}}>
                    <Grid component="span" item={true} sm="auto" container direction="row" alignItems="center">
                      <AccessTimeIcon sx={{paddingRight: '2px'}} />
                      <TimeAgo datetime={obj.added_at} />
                      <Bullet sx={{paddingLeft: '4px', paddingTop: '1px'}} />
                      <Button variant={'text'} sx={{marginTop: '-1px'}}>
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
