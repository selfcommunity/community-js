import React, {useEffect, useState} from 'react';
import {styled} from '@mui/material/styles';
import {Box, Button, capitalize, Card, CardActions, CardContent, List, ListItem, Typography} from '@mui/material';
import {Endpoints, http, Logger, SCFeedObjectType, SCFeedUnitType} from '@selfcommunity/core';
import {AxiosResponse} from 'axios';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {FormattedMessage} from 'react-intl';
import {FeedObjectSkeleton} from '../Skeleton';
import InfiniteScroll from 'react-infinite-scroll-component';
import {SCNotificationAggregatedType} from '@selfcommunity/core';
import FeedObject, {FeedObjectTemplateType} from '../FeedObject';
import {SCFeedTypologyType} from '@selfcommunity/core';

const PREFIX = 'SCFeed';

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2)
}));

export default function Feed({type = SCFeedTypologyType.MAIN, ...rest}: {type?: SCFeedTypologyType; [p: string]: any}): JSX.Element {
  const [feedData, setFeedData] = useState([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [next, setNext] = useState<string>(Endpoints[`${capitalize(type)}Feed`].url({}));

  /**
   * Fetch main feed
   * Manage pagination, infinite scrolling
   */
  function fetchFeedData() {
    http
      .request({
        url: next,
        method: Endpoints[`${capitalize(type)}Feed`].method
      })
      .then((res: AxiosResponse<{next?: string; previous?: string; results: SCNotificationAggregatedType[]}>) => {
        const data = res.data;
        setFeedData([...feedData, ...data.results]);
        setNext(data.next);
        setLoading(false);
      })
      .catch((error) => {
        Logger.error(SCOPE_SC_UI, error);
      });
  }

  /**
   * On mount, fetch first page of notifications
   */
  useEffect(() => {
    fetchFeedData();
  }, []);

  return (
    <Root>
      {loading ? (
        <>
          {[...Array(Math.floor(Math.random() * 5) + 3)].map((x, i) => (
            <FeedObjectSkeleton key={i} template={FeedObjectTemplateType.PREVIEW} />
          ))}
        </>
      ) : (
        <Box>
          {feedData.length <= 0 ? (
            <Typography variant="body2">
              <FormattedMessage id="ui.feed.noFeedObject" defaultMessage="ui.feed.noFeedObject" />
            </Typography>
          ) : (
            <InfiniteScroll
              dataLength={feedData.length}
              next={fetchFeedData}
              hasMore={Boolean(next)}
              loader={
                <ListItem sx={{width: '100%'}}>
                  <FeedObjectSkeleton template={FeedObjectTemplateType.PREVIEW} {...rest} />
                </ListItem>
              }
              pullDownToRefreshThreshold={10}
              endMessage={
                <p style={{textAlign: 'center'}}>
                  <b>
                    <FormattedMessage id="ui.feed.noOtherFeedObject" defaultMessage="ui.feed.noOtherFeedObject" />
                  </b>
                </p>
              }>
              <List>
                {feedData.map((n: SCFeedUnitType, i) => (
                  <ListItem key={i}>
                    <FeedObject feedObject={n[n.type]} feedObjectType={n.type} {...rest} sx={{width: '100%'}} />
                  </ListItem>
                ))}
              </List>
            </InfiniteScroll>
          )}
        </Box>
      )}
    </Root>
  );
}
