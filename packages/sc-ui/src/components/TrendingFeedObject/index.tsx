import React, {useEffect, useState} from 'react';
import {styled} from '@mui/material/styles';
import List from '@mui/material/List';
import {Button, Typography} from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import {Endpoints, http, Logger, SCFeedObjectType} from '@selfcommunity/core';
import TrendingPostSkeleton from '../Skeleton/TrendingFeedSkeleton';
import {AxiosResponse} from 'axios';
import {SCOPE_SC_UI} from '../../constants/Errors';
import FeedObject from '../FeedObject';
import {FormattedMessage} from 'react-intl';
import {FeedObjectTemplateType} from '../../types/feedObject';

const PREFIX = 'SCTrendingFeed';

const Root = styled(Card, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  maxWidth: 700,
  marginBottom: theme.spacing(2)
}));

export default function TrendingFeedObject({
  categoryId = null,
  template = null,
  autoHide = null,
  ...props
}: {
  categoryId?: number;
  template?: FeedObjectTemplateType;
  autoHide?: boolean;
}): JSX.Element {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [openTrendingPostDialog, setOpenTrendingPostDialog] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [visible, setVisible] = useState<number>(4);

  function fetchTrendingPost() {
    http
      .request({
        url: Endpoints.CategoryTrendingFeed.url({id: categoryId}),
        method: Endpoints.CategoryTrendingFeed.method
      })
      .then((res: AxiosResponse<any>) => {
        const data = res.data;
        setPosts(getAlltypes(data.results));
        setHasMore(data.count > visible);
        setLoading(false);
        setTotal(data.count);
      })
      .catch((error) => {
        Logger.error(SCOPE_SC_UI, error);
      });
  }
  function loadMore() {
    setVisible((prevVisible) => prevVisible + 4);
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

  const f = (
    <React.Fragment>
      {loading ? (
        <TrendingPostSkeleton elevation={0} />
      ) : (
        <CardContent>
          <Typography variant="body1">
            <FormattedMessage id="ui.TrendingFeed.title" defaultMessage="ui.TrendingFeed.title" />
          </Typography>
          {!total ? (
            <Typography variant="body2">
              <FormattedMessage id="ui.TrendingFeed.noResults" defaultMessage="ui.TrendingFeed.noResults" />
            </Typography>
          ) : (
            <React.Fragment>
              <List>
                {posts.slice(0, 4).map((obj: SCFeedObjectType, index) => (
                  <div key={index}>
                    <FeedObject elevation={0} feedObject={obj} key={obj.id} template={template} />
                  </div>
                ))}
              </List>
              {hasMore && (
                <Button size="small" onClick={() => loadMore()}>
                  <FormattedMessage id="ui.TrendingFeed.button.showMore" defaultMessage="ui.TrendingFeed.button.showMore" />
                </Button>
              )}
            </React.Fragment>
          )}
          {openTrendingPostDialog && <></>}
        </CardContent>
      )}
    </React.Fragment>
  );
  /**
   * Renders the component (if not hidden by autoHide prop)
   */
  if (!autoHide) {
    return <Root {...props}>{f}</Root>;
  }
  return null;
}
