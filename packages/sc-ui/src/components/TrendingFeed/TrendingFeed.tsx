import React, {useEffect, useState} from 'react';
import {styled} from '@mui/material/styles';
import List from '@mui/material/List';
import {Button, Typography} from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import {Endpoints, http, Logger, SCFeedObjectType} from '@selfcommunity/core';
import TrendingPostSkeleton from './Skeleton';
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
export interface TrendingFeedProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
  /**
   * Id of category
   * @default null
   */
  categoryId?: number;
  /**
   * Feed Object template type
   * @default 'preview'
   */
  template?: FeedObjectTemplateType;
  /**
   * Hides this component
   * @default false
   */
  autoHide?: boolean;
  /**
   * Any other properties
   */
  [p: string]: any;
}
export default function TrendingFeed(props: TrendingFeedProps): JSX.Element {
  //CONST
  const limit = 4;

  // PROPS
  const {className = null, categoryId = null, template = null, autoHide = null, ...rest} = props;

  // STATE
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [openTrendingPostDialog, setOpenTrendingPostDialog] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [visible, setVisible] = useState<number>(limit);

  /**
   * Fetches a list of trending posts
   */
  function fetchTrendingPost() {
    http
      .request({
        url: Endpoints.CategoryTrendingFeed.url({id: categoryId}),
        method: Endpoints.CategoryTrendingFeed.method
      })
      .then((res: AxiosResponse<any>) => {
        const data = res.data;
        setPosts(data.results);
        setHasMore(data.count > visible);
        setLoading(false);
        setTotal(data.count);
      })
      .catch((error) => {
        Logger.error(SCOPE_SC_UI, error);
      });
  }

  /**
   * Loads more posts
   */
  function loadMore() {
    const newIndex = visible + limit;
    const newHasMore = newIndex < posts.length - 1;
    setVisible(newIndex);
    setHasMore(newHasMore);
  }

  /**
   * On mount, fetches trending posts list
   */
  useEffect(() => {
    fetchTrendingPost();
  }, []);

  /**
   * Renders the list
   */
  const f = (
    <React.Fragment>
      {loading ? (
        <TrendingPostSkeleton elevation={0} />
      ) : (
        <CardContent>
          <Typography variant="body1">
            <FormattedMessage id="ui.trendingFeed.title" defaultMessage="ui.trendingFeed.title" />
          </Typography>
          {!total ? (
            <Typography variant="body2">
              <FormattedMessage id="ui.trendingFeed.noResults" defaultMessage="ui.trendingFeed.noResults" />
            </Typography>
          ) : (
            <React.Fragment>
              <List>
                {posts.slice(0, visible).map((obj: SCFeedObjectType, index) => (
                  <div key={index}>
                    <FeedObject elevation={0} feedObject={obj[obj.type]} key={obj.id} template={template} />
                  </div>
                ))}
              </List>
              {hasMore && (
                <Button size="small" onClick={() => loadMore()}>
                  <FormattedMessage id="ui.trendingFeed.button.showMore" defaultMessage="ui.trendingFeed.button.showMore" />
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
   * Renders root object (if not hidden by autoHide prop)
   */
  if (!autoHide) {
    return (
      <Root className={className} {...rest}>
        {f}
      </Root>
    );
  }
  return null;
}
