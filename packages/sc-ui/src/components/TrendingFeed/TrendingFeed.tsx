import React, {useEffect, useState} from 'react';
import {styled} from '@mui/material/styles';
import List from '@mui/material/List';
import {Button, CardContent, Typography} from '@mui/material';
import Widget from '../Widget';
import {Endpoints, http, Logger, SCFeedObjectType} from '@selfcommunity/core';
import {AxiosResponse} from 'axios';
import {SCOPE_SC_UI} from '../../constants/Errors';
import FeedObject from '../FeedObject';
import {FormattedMessage} from 'react-intl';
import {SCFeedObjectTemplateType} from '../../types/feedObject';
import classNames from 'classnames';
import BaseDialog from '../../shared/BaseDialog';
import CentralProgress from '../../shared/CentralProgress';
import InfiniteScroll from 'react-infinite-scroll-component';
import Skeleton from './Skeleton';

const PREFIX = 'SCTrendingFeed';

const classes = {
  root: `${PREFIX}-root`,
  title: `${PREFIX}-title`,
  noResults: `${PREFIX}-noResults`,
  trendingItem: `${PREFIX}-trending-item`
};

const Root = styled(Widget, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  maxWidth: 700,
  marginBottom: theme.spacing(2),
  [`& .${classes.trendingItem}`]: {
    marginBottom: 0
  }
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
  template?: SCFeedObjectTemplateType;
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
 |title|.SCTrendingFeed-title|Styles applied to the title element.|
 |noResults|.SCTrendingFeed-noResults|Styles applied to noResults section.|

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
  const [next, setNext] = useState<string>(`${Endpoints.CategoryTrendingFeed.url({id: categoryId})}?limit=10`);

  /**
   * Fetches a list of trending posts
   */
  function fetchTrendingPost() {
    if (next) {
      http
        .request({
          url: next,
          method: Endpoints.CategoryTrendingFeed.method
        })
        .then((res: AxiosResponse<any>) => {
          const data = res.data;
          setPosts([...posts, ...data.results]);
          setHasMore(data.count > visible);
          setLoading(false);
          setTotal(data.count);
          setNext(data['next']);
        })
        .catch((error) => {
          setLoading(false);
          Logger.error(SCOPE_SC_UI, error);
        });
    }
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
        <Skeleton elevation={0} />
      ) : (
        <CardContent>
          <Typography className={classes.title} variant="body1">
            <FormattedMessage id="ui.trendingFeed.title" defaultMessage="ui.trendingFeed.title" />
          </Typography>
          {!total ? (
            <Typography className={classes.noResults} variant="body2">
              <FormattedMessage id="ui.trendingFeed.noResults" defaultMessage="ui.trendingFeed.noResults" />
            </Typography>
          ) : (
            <React.Fragment>
              <List>
                {posts.slice(0, visible).map((obj: SCFeedObjectType, index) => (
                  <div key={index}>
                    <FeedObject elevation={0} feedObject={obj[obj.type]} key={obj.id} template={template} className={classes.trendingItem} />
                  </div>
                ))}
              </List>
              {hasMore && (
                <Button size="small" onClick={() => setOpenTrendingPostDialog(true)}>
                  <FormattedMessage id="ui.trendingFeed.button.showMore" defaultMessage="ui.trendingFeed.button.showMore" />
                </Button>
              )}
            </React.Fragment>
          )}
          {openTrendingPostDialog && (
            <BaseDialog
              title={<FormattedMessage id="ui.trendingFeed.title" defaultMessage="ui.trendingFeed.title" />}
              onClose={() => setOpenTrendingPostDialog(false)}
              open={openTrendingPostDialog}>
              {loading ? (
                <CentralProgress size={50} />
              ) : (
                <InfiniteScroll
                  dataLength={posts.length}
                  next={fetchTrendingPost}
                  hasMore={Boolean(next)}
                  loader={<CentralProgress size={30} />}
                  height={400}
                  endMessage={
                    <p style={{textAlign: 'center'}}>
                      <b>
                        <FormattedMessage id="ui.trendingFeed.noMoreResults" defaultMessage="ui.trendingFeed.noMoreResults" />
                      </b>
                    </p>
                  }>
                  <List>
                    {posts.map((obj: SCFeedObjectType, index) => (
                      <div key={index}>
                        <FeedObject elevation={0} feedObject={obj[obj.type]} key={obj.id} template={template} className={classes.trendingItem} />
                      </div>
                    ))}
                  </List>
                </InfiniteScroll>
              )}
            </BaseDialog>
          )}
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
