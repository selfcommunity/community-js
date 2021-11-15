import React, {useEffect, useState} from 'react';
import {styled} from '@mui/material/styles';
import List from '@mui/material/List';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import {Avatar, Box, Grid, Link, ListItem, ListItemAvatar, ListItemText, Typography} from '@mui/material';
import {Endpoints, http, Logger, SCUserType} from '@selfcommunity/core';
import FeedObjectSkeleton from '../Skeleton/FeedObjectSkeleton';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TimeAgo from 'timeago-react';
import {AxiosResponse} from 'axios';
import {SCOPE_SC_UI} from '../../constants/Errors';
import { SCFeedPostType } from '@selfcommunity/core';

const PREFIX = 'SCPost';

const Root = styled(Card, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  maxWidth: 700,
  marginBottom: theme.spacing(2)
}));

function Post({
  postObjectId = null,
  postObject = null,
  contained = true
}: {
  postObjectId?: number;
  postObject?: SCFeedPostType;
  contained: boolean;
  variant: string;
}): JSX.Element {
  const [post, setPost] = useState<SCFeedPostType>(postObject);

  /**
   * If postObjectId in props attempt to get it
   * by id if exist
   */
  function fetchPost() {
    return http
      .request({
        url: Endpoints.Post.url({id: postObjectId}),
        method: Endpoints.Post.method
      })
      .then((res: AxiosResponse<any>) => {
        if (res.status >= 300) {
          return Promise.reject(res);
        }
        return Promise.resolve(res.data);
      })
      .catch((error) => {
        console.log(error);
        Promise.reject(error);
      });
  }

  useEffect(() => {
    /**
     * If postObjectId retrive/refresh the post
     * on component mount
     */
    if (postObjectId) {
      fetchPost()
        .then((post) => setPost(post))
        .catch((err) => {
          Logger.error(SCOPE_SC_UI, `Post with id ${postObjectId} not found`);
        });
    }
  }, []);

  /**
   * Render the post object
   */
  const p = (
    <React.Fragment>
      {post ? (
        <ListItem button={true} alignItems="flex-start">
          <ListItemAvatar>
            <Avatar alt={post.author.username} variant="circular" src={post.author.avatar} />
          </ListItemAvatar>
          <ListItemText
            primary={
              <React.Fragment>
                <Typography component="span" sx={{display: 'inline'}} color="primary">
                  {post.author.username}
                </Typography>
              </React.Fragment>
            }
            secondary={
              <React.Fragment>
                {post.summary}
                <Box component="span" sx={{display: 'flex', justifyContent: 'flex-start', p: '2px'}}>
                  <Grid component="span" item={true} sm="auto" container direction="row" alignItems="center">
                    <AccessTimeIcon />
                    <TimeAgo datetime={post.added_at} />
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
        <FeedObjectSkeleton variant={'outlined'} />
      )}
    </React.Fragment>
  );

  /**
   * If contained=true in props render card container
   * that wrap the post content
   */
  if (contained) {
    return (
      <Root>
        <CardContent>
          <List>{p}</List>
        </CardContent>
      </Root>
    );
  }

  /**
   * If contained=false in props render the content post
   * without the wrap
   */
  return p;
}
export default Post;
