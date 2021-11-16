import React from 'react';
import {styled} from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import {Avatar, Box, CardHeader, Collapse, Grid, ListItem, ListItemAvatar, ListItemText, Typography} from '@mui/material';
import FeedObjectSkeleton from '../Skeleton/FeedObjectSkeleton';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TimeAgo from 'timeago-react';
import DateTimeAgo from '../../shared/DateTimeAgo';
import Bullet from '../../shared/Bullet';
import UserTags from '../../shared/UserTags';
import Medias from './Medias';
import ReportingFlagMenu from '../ReportingFlagMenu';
import {SCFeedObjectType, SCFeedObjectTypologyType, Link, useSCFetchFeedObject} from '@selfcommunity/core';

const PREFIX = 'SCFeedObject';

const classes = {
  root: `${PREFIX}-root`,
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
    top: 5
  }
}));

export enum FeedObjectComponentType {
  SNIPPET = 'snippet',
  PREVIEW = 'preview',
  DETAIL = 'detail'
}

export default function FeedObject({
  id = null,
  feedObject = null,
  feedObjectType = SCFeedObjectTypologyType.POST,
  type = FeedObjectComponentType.PREVIEW,
  ...rest
}: {
  id?: number;
  feedObject?: SCFeedObjectType;
  feedObjectType?: SCFeedObjectTypologyType;
  type?: FeedObjectComponentType;
  [p: string]: any;
}): JSX.Element {
  const {obj, setObj} = useSCFetchFeedObject({id, feedObject, feedObjectType});

  /**
   * Render the obj object
   * Manage variants:
   * SNIPPET, PREVIEW, DETAIL
   */
  let objElement = <></>;
  if (type === FeedObjectComponentType.SNIPPET) {
    objElement = (
      <React.Fragment>
        {obj ? (
          <ListItem button={true} alignItems="flex-start">
            <ListItemAvatar>
              <Avatar alt={obj.author.username} variant="circular" src={obj.author.avatar} />
            </ListItemAvatar>
            <ListItemText
              primary={
                <React.Fragment>
                  <Typography component="span" sx={{display: 'inline'}} color="primary">
                    {obj.author.username}
                  </Typography>
                </React.Fragment>
              }
              secondary={
                <React.Fragment>
                  {obj.summary}
                  <Box component="span" sx={{display: 'flex', justifyContent: 'flex-start', p: '2px'}}>
                    <Grid component="span" item={true} sm="auto" container direction="row" alignItems="center">
                      <AccessTimeIcon />
                      <TimeAgo datetime={obj.added_at} />
                    </Grid>
                    <Link component="button" variant="body1" underline="none" sx={{marginLeft: '10px'}}>
                      Comment
                    </Link>
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
  } else if (type === FeedObjectComponentType.PREVIEW || type === FeedObjectComponentType.DETAIL) {
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
                  {
                    <div className={classes.tag}>
                      <UserTags user={obj.author} />
                    </div>
                  }
                </React.Fragment>
              }
              action={<ReportingFlagMenu object={obj} />}
            />
            <CardContent classes={{root: classes.content}}>
              {'title' in obj && (
                <Typography variant="body1" gutterBottom className={classes.title}>
                  {obj.title}
                </Typography>
              )}
              <Medias medias={obj.medias} />
              <Typography variant="body2" gutterBottom dangerouslySetInnerHTML={{__html: obj.summary}}></Typography>
            </CardContent>
          </React.Fragment>
        ) : (
          <FeedObjectSkeleton type={type} elevation={0} />
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
                <React.Fragment>
                  <Typography component="span" sx={{display: 'inline'}} color="primary">
                    {obj.author.username}
                  </Typography>
                </React.Fragment>
              }
              secondary={
                <React.Fragment>
                  {obj.summary}
                  <Box component="span" sx={{display: 'flex', justifyContent: 'flex-start', p: '2px'}}>
                    <Grid component="span" item={true} sm="auto" container direction="row" alignItems="center">
                      <AccessTimeIcon />
                      <TimeAgo datetime={obj.added_at} />
                    </Grid>
                    <Link component="button" variant="body1" underline="none" sx={{marginLeft: '10px'}}>
                      Comment
                    </Link>
                  </Box>
                </React.Fragment>
              }
            />
          </ListItem>
        ) : (
          <FeedObjectSkeleton type={type} elevation={0} />
        )}
      </React.Fragment>
    );
  }

  /**
   * Render object
   */
  return (
    <Root {...rest}>
      <div className={`${PREFIX}-${type}`}>{objElement}</div>
    </Root>
  );
}
