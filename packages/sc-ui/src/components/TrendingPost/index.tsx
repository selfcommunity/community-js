import React, {useEffect, useState} from 'react';
import {styled} from '@mui/material/styles';
import List from '@mui/material/List';
import {Button, Typography} from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import {Endpoints, http} from '@selfcommunity/core';
import Post from '../Post';
import TrendingPostSkeleton from '../Skeleton/TrendingPostSkeleton';

const PREFIX = 'SCTrendingPost';

const Root = styled(Card, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  maxWidth: 700,
  marginBottom: theme.spacing(2)
}));

export default function SCTrendingPost({scInterestId = null}: {scInterestId?: number}): JSX.Element {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [openTrendingPostDialog, setOpenTrendingPostDialog] = useState<boolean>(false);

  function fetchTrendingPost() {
    http
      .request({
        url: Endpoints.CategoryTrendingFeed.url({id: scInterestId}),
        method: Endpoints.CategoryTrendingFeed.method
      })
      .then((res) => {
        const data = res.data;
        setPosts(getAlltypes(data.results));
        setHasMore(data.count > 4);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function getAlltypes(data) {
    const discussion = data.map((t) => t.discussion);
    const post = data.map((t) => t.post);
    return discussion.concat(post);
  }

  useEffect(() => {
    fetchTrendingPost();
  }, []);

  if (loading) {
    return <TrendingPostSkeleton />;
  }
  return (
    <Root variant={'outlined'}>
      <CardContent>
        <Typography variant="body1">Trending Feed</Typography>
        <List>
          {posts.slice(0, 4).map((post: {title: string}, index) => (
            <Post contained={false} scPost={post} key={index} />
          ))}
        </List>
        {hasMore && (
          <Button size="small" onClick={() => setOpenTrendingPostDialog(true)}>
            Show More
          </Button>
        )}
        {openTrendingPostDialog && <></>}
      </CardContent>
    </Root>
  );
}
