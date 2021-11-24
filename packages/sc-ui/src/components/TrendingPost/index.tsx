import React, {useEffect, useState} from 'react';
import {styled} from '@mui/material/styles';
import List from '@mui/material/List';
import {Button, Typography} from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import {Endpoints, http, Logger, SCFeedObjectType, SCFeedUnitType} from '@selfcommunity/core';
import TrendingPostSkeleton from '../Skeleton/TrendingPostSkeleton';
import {AxiosResponse} from 'axios';
import {SCOPE_SC_UI} from '../../constants/Errors';
import FeedObject from '../FeedObject';
import {FormattedMessage} from 'react-intl';

const PREFIX = 'SCTrendingPost';

const Root = styled(Card, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  maxWidth: 700,
  marginBottom: theme.spacing(2)
}));

function TrendingPost({scCategoryId = null, ...props}: {scCategoryId?: number}): JSX.Element {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [openTrendingPostDialog, setOpenTrendingPostDialog] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);

  function fetchTrendingPost() {
    http
      .request({
        url: Endpoints.CategoryTrendingFeed.url({id: scCategoryId}),
        method: Endpoints.CategoryTrendingFeed.method
      })
      .then((res: AxiosResponse<any>) => {
        const data = res.data;
        setPosts(getAlltypes(data.results));
        setHasMore(data.count > 4);
        setLoading(false);
        setTotal(data.count);
      })
      .catch((error) => {
        Logger.error(SCOPE_SC_UI, error);
      });
  }

  function getAlltypes(data) {
    const discussion = data.map((t) => t.discussion);
    const post = data.map((t) => t.post);
    const status = data.map((s) => s.status);
    const array = discussion.concat(post).concat(status);
    return array.filter(function (el) {
      return el != null;
    });
  }

  useEffect(() => {
    fetchTrendingPost();
  }, []);

  return (
    <Root {...props}>
      {loading ? (
        <TrendingPostSkeleton elevation={0} />
      ) : (
        <CardContent>
          <Typography variant="body1">
            <FormattedMessage id="ui.TrendingPost.title" defaultMessage="ui.TrendingPost.title" />
          </Typography>
          {!total ? (
            <Typography variant="body2">
              <FormattedMessage id="ui.TrendingPost.noResults" defaultMessage="ui.TrendingPost.noResults" />
            </Typography>
          ) : (
            <React.Fragment>
              <List>
                {posts.slice(0, 4).map((feedUnit: SCFeedUnitType, index) => {
                  const feedObject: SCFeedObjectType = feedUnit[feedUnit.type];
                  <FeedObject feedObject={feedObject} key={index} elevation={0} />;
                })}
              </List>
              {hasMore && (
                <Button size="small" onClick={() => setOpenTrendingPostDialog(true)}>
                  <FormattedMessage id="ui.TrendingPost.button.showMore" defaultMessage="ui.TrendingPost.button.showMore" />
                </Button>
              )}
            </React.Fragment>
          )}
          {openTrendingPostDialog && <></>}
        </CardContent>
      )}
    </Root>
  );
}
export default TrendingPost;
