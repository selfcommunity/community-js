import React, {useEffect, useState} from 'react';
import {styled} from '@mui/material/styles';
import List from '@mui/material/List';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import {Avatar, Box, Grid, Link, ListItem, ListItemAvatar, ListItemText, Typography} from '@mui/material';
import {Endpoints, http, SCUserType} from '@selfcommunity/core';
import {PostBoxSkeleton} from '@selfcommunity/ui';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TimeAgo from 'timeago-react';
import {AxiosResponse} from 'axios';

const PREFIX = 'SCPost';

const Root = styled(Card, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  maxWidth: 700,
  marginBottom: theme.spacing(2)
}));

export interface SCPostType {
  title: string;
  summary?: string;
  added_at?: string;
  author?: SCUserType;
}

function Post({scCategoryId = null, scPost = null, contained = true}: {scCategoryId?: number; scPost?: SCPostType; contained: boolean}): JSX.Element {
  const [post, setPost] = useState<SCPostType>(scPost);

  /**
   * If post not in props, attempt to get it by category id (in props) if exist
   */
  function fetchPost() {
    http
      .request({
        url: Endpoints.CategoryTrendingFeed.url({id: scCategoryId}),
        method: Endpoints.CategoryTrendingFeed.method
      })
      .then((res: AxiosResponse<any>) => {
        const data = res.data;
        setPost(selectPost(data.results));
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function selectPost(results) {
    const res = results[Math.floor(Math.random() * results.length)];
    const type = res.type;
    return res[type];
  }

  useEffect(() => {
    if (!post) {
      fetchPost();
    }
  }, []);

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
                  {post.author.username} - {post.title}
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
        <PostBoxSkeleton contained />
      )}
    </React.Fragment>
  );

  if (contained) {
    return (
      <Root variant="outlined">
        <CardContent>
          <List>{p}</List>
        </CardContent>
      </Root>
    );
  }
  return p;
}
export default Post;
