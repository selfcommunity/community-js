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
import classNames from 'classnames';

const PREFIX = 'SCTrendingFeed';

const classes = {
  root: `${PREFIX}-root`
};

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

/**
 * > API documentation for the Community-UI Trending Feed component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {TrendingFeed} from '@selfcommunity/ui';
 ```

 #### Component Name

 The name `SCTrendingFeed` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCTrendingFeed-root|Styles applied to the root element.|

 * @param props
 */
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
   * Renders root object (if results and autoHide prop is set to false, otherwise component is hidden)
   */
  if (autoHide && !total) {
    return null;
  }
  return (
    <Root className={classNames(classes.root, className)} {...rest}>
      {f}
    </Root>
  );
}
