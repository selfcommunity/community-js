import React, {useEffect, useMemo, useState} from 'react';
import {styled} from '@mui/material/styles';
import {Box, List, ListItem, Typography} from '@mui/material';
import {
  http,
  Logger,
  SCFeedUnitType,
  SCNotificationAggregatedType,
  SCPreferences,
  SCPreferencesContextType,
  useSCPreferences
} from '@selfcommunity/core';
import {AxiosResponse} from 'axios';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {FormattedMessage} from 'react-intl';
import {FeedObjectSkeleton} from '../Skeleton';
import InfiniteScroll from 'react-infinite-scroll-component';
import FeedObject, {FeedObjectProps} from '../FeedObject';
import {FeedObjectTemplateType} from '../../types/feedObject';
import {EndpointType} from '@selfcommunity/core/src/constants/Endpoints';

const PREFIX = 'SCFeed';

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2)
}));

export interface FeedProps {
  /**
   * Override or extend the styles applied to the component.
   */
  className?: string;

  /**
   * Feed API Endpoint
   */
  endpoint: EndpointType;

  /**
   * Props to spread to single feed object
   */
  FeedObjectProps?: FeedObjectProps;
}

const PREFERENCES = [SCPreferences.ADVERTISING_CUSTOM_ADV_ENABLED, SCPreferences.ADVERTISING_CUSTOM_ADV_ONLY_FOR_ANONYMOUS_USERS_ENABLED];

export default function Feed(props: FeedProps): JSX.Element {
  // PROPS
  const {className, endpoint, FeedObjectProps = {}} = props;

  // STATE
  const [feedData, setFeedData] = useState([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [next, setNext] = useState<string>(endpoint.url({}));

  // CONTEXT
  const scPreferences: SCPreferencesContextType = useSCPreferences();

  /*
   * Compute preferences
   */
  const preferences = useMemo(() => {
    const _preferences = {};
    PREFERENCES.map((p) => (_preferences[p] = p in scPreferences.preferences ? scPreferences.preferences[p].value : null));
    return _preferences;
  }, [scPreferences.preferences]);

  /**
   * Fetch main feed
   * Manage pagination, infinite scrolling
   */
  function fetch() {
    http
      .request({
        url: next,
        method: endpoint.method
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
    fetch();
  }, []);

  return (
    <Root className={className}>
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
              next={fetch}
              hasMore={Boolean(next)}
              loader={
                <ListItem sx={{width: '100%'}}>
                  <FeedObjectSkeleton template={FeedObjectTemplateType.PREVIEW} {...FeedObjectProps} />
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
                    <FeedObject
                      feedObject={n[n.type]}
                      feedObjectType={n.type}
                      feedObjectActivities={n.activities ? n.activities : null}
                      {...FeedObjectProps}
                      sx={{width: '100%'}}
                    />
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
