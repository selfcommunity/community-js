import React, {useEffect, useMemo, useRef, useState} from 'react';
import {styled} from '@mui/material/styles';
import {Avatar, Box, Button, CardContent} from '@mui/material';
import PubSub from 'pubsub-js';
import {useThemeProps} from '@mui/system';
import {VirtualScrollerItemProps} from '../../types/virtualScroller';
import {SCBroadcastMessageType, SCNotificationTopicType, SCNotificationTypologyType} from '@selfcommunity/types';
import {CacheStrategies} from '@selfcommunity/utils';
import {
  SCPreferences,
  SCPreferencesContextType,
  SCUserContextType,
  useSCFetchBroadcastMessages,
  useSCPreferences,
  useSCUser
} from '@selfcommunity/react-core';
import Message, {MessageProps} from './Message';
import classNames from 'classnames';
import {FormattedMessage} from 'react-intl';
import {MessageSkeleton} from './Skeleton';
import Widget from '../Widget';

const PREFIX = 'SCBroadcastMessages';

const classes = {
  root: `${PREFIX}-root`,
  boxLoadMore: `${PREFIX}-box-load-more`,
  avatarLoadMore: `${PREFIX}-avatar-load-more`,
  buttonLoadMore: `${PREFIX}-button-load-more`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  [`& .${classes.boxLoadMore}`]: {
    textAlign: 'center',
    '& > div': {
      paddingBottom: theme.spacing(2)
    },
    marginBottom: theme.spacing(2)
  },
  [`& .${classes.avatarLoadMore}`]: {
    width: theme.spacing(4),
    height: theme.spacing(4),
    marginRight: theme.spacing()
  },
  [`& .${classes.buttonLoadMore}`]: {
    textTransform: 'capitalize',
    marginLeft: -10
  }
}));

export interface BroadcastMessagesProps extends VirtualScrollerItemProps {
  /**
   * Id of the BroadcastMessages
   * @default 'broadcast_messages'
   */
  id?: string;

  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;

  /**
   * Props to forward to Message component
   * @default empty
   */
  MessageProps?: MessageProps;

  /**
   * Subscription channel for updates notification
   * When receive this event the component reacts updating data
   * @default `interaction.notification_banner`
   */
  subscriptionChannel?: string;

  /**
   * Caching strategies
   * @default CacheStrategies.CACHE_FIRST
   */
  cacheStrategy?: CacheStrategies;

  /**
   * Disable skeleton loader
   * @default false
   */
  disableLoader?: boolean;

  /**
   * View all messages initially loaded
   * @default false
   */
  viewAllMessages?: boolean;

  /**
   * Any other properties
   */
  [p: string]: any;
}

const PREFERENCES = [SCPreferences.LOGO_NAVBAR_LOGO_MOBILE, SCPreferences.TEXT_APPLICATION_NAME];

/**
 * > API documentation for the Community-JS Broadcast Messages component. Learn about the available props and the CSS API.
 *
 *
 * This component handles message broadcasts. It initially displays unseen messages. If all messages have been viewed it will show at most one message.
 * Take a look at our <strong>demo</strong> component [here](/docs/sdk/community-js/react-ui/Components/BroadcastMessages)

 #### Import
 ```jsx
 import {BroadcastMessages} from '@selfcommunity/react-ui';
 ```
 #### Component Name
 The name `SCBroadcastMessages` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCBroadcastMessages-root|Styles applied to the root element.|
 |boxLoadMore|.SCBroadcastMessages-box-load-more|Styles applied to load more box.|
 |avatarLoadMore|.SCBroadcastMessages-avatar-load-more|Styles applied to load more avatar.|
 |buttonLoadMore|.SCBroadcastMessages-button-load-more|Styles applied to load more button.|

 * @param inProps
 */
export default function BroadcastMessages(inProps: BroadcastMessagesProps): JSX.Element {
  // PROPS
  const props: BroadcastMessagesProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });

  const {
    id = 'broadcast_messages',
    className = null,
    MessageProps = {},
    subscriptionChannel = `${SCNotificationTopicType.INTERACTION}.${SCNotificationTypologyType.NOTIFICATION_BANNER}`,
    disableLoader = false,
    viewAllMessages = false,
    cacheStrategy = CacheStrategies.NETWORK_ONLY,
    onStateChange,
    onHeightChange,
    ...rest
  } = props;

  // CONTEXT
  const scUserContext: SCUserContextType = useSCUser();
  // Compute preferences
  const scPreferences: SCPreferencesContextType = useSCPreferences();
  const preferences = useMemo(() => {
    const _preferences = {};
    PREFERENCES.map((p) => (_preferences[p] = p in scPreferences.preferences ? scPreferences.preferences[p].value : null));
    return _preferences;
  }, [scPreferences.preferences]);

  // REFS
  const refreshSubscription = useRef(null);

  // STATE
  const [viewAll, setViewAll] = useState<boolean>(viewAllMessages);
  const {data, loading, fetchMessages, setMessages} = useSCFetchBroadcastMessages({cacheStrategy});

  // CONST
  const authUserId = scUserContext.user ? scUserContext.user.id : null;
  const unViewedMessages = data.results.filter((m: SCBroadcastMessageType) => !m.viewed_at);
  const viewedMessageCounter = data.count - unViewedMessages.length + 1;

  /**
   * Dispose a broadcast message
   * @param message
   */
  const handleDisposeMessage = (message) => {
    const _data = setMessages(data.results.filter((m: SCBroadcastMessageType) => m.id != message.id));
    if (_data.results.length <= 1) {
      fetchMessages(true);
    }
  };

  /**
   * Handle mark read message
   * @param message
   */
  const handleMarkRead = (message) => {
    const _data = [...data.results];
    data.results.map((m, i) => {
      if (m.id === message.id) {
        _data[i] = {...m, viewed_at: new Date()};
      }
    });
    scUserContext.setUnseenNotificationBannersCounter(scUserContext.user.unseen_notification_banners_counter - 1);
    setMessages(_data);
  };

  /**
   * if messages.length < unViewedMessages.length show other message
   * if the difference between the 2 arrays is small fetch remote messages
   */
  const fetchOtherMessages = useMemo(
    () => () => {
      setViewAll(true);
      if ((data.next && viewAll) || (data.next && !viewAll && viewedMessageCounter <= 2)) {
        fetchMessages();
      }
    },
    [setViewAll, viewAll, viewedMessageCounter, data.next, fetchMessages]
  );

  /**
   * On mount, fetch first page of notifications
   */
  useEffect(() => {
    let _t;
    if (authUserId !== null && cacheStrategy !== CacheStrategies.CACHE_FIRST) {
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      _t = setTimeout(fetchMessages);
      return (): void => {
        _t && clearTimeout(_t);
      };
    }
  }, [authUserId]);

  /**
   * Notification subscriber
   */
  const subscriber = (msg, data) => {
    fetchMessages(true);
    setViewAll(false);
  };

  /**
   * When a ws notification arrives, update data
   */
  useEffect(() => {
    refreshSubscription.current = PubSub.subscribe(subscriptionChannel, subscriber);
    return () => {
      PubSub.unsubscribe(refreshSubscription.current);
    };
  }, []);

  /**
   * Feed virtual update
   */
  useEffect(() => {
    onStateChange && onStateChange({viewAllMessages: viewAll, cacheStrategy: CacheStrategies.CACHE_FIRST, disableLoader: true});
    onHeightChange && onHeightChange();
  }, [data.results.length, loading, viewAll, cacheStrategy]);

  const messagesToShow = [...unViewedMessages, ...data.results.slice(unViewedMessages.length, viewAll ? viewedMessageCounter : 1)];
  return (
    <Root id={id} className={classNames(classes.root, className)} {...rest}>
      {messagesToShow.map((message, index) => (
        <Box key={index}>
          <Message message={message} {...MessageProps} onClose={handleDisposeMessage} onRead={handleMarkRead} />
        </Box>
      ))}
      {loading && !disableLoader && <MessageSkeleton />}
      {loading !== null && !loading && (data.next || (data.count > 1 && viewedMessageCounter > 0 && !viewAll)) && (
        <Widget className={classes.boxLoadMore}>
          <CardContent>
            <Button variant="text" onClick={fetchOtherMessages} disabled={loading} color="inherit" classes={{root: classes.buttonLoadMore}}>
              <Avatar
                component="span"
                className={classes.avatarLoadMore}
                alt={preferences[SCPreferences.TEXT_APPLICATION_NAME]}
                src={preferences[SCPreferences.LOGO_NAVBAR_LOGO_MOBILE]}
              />
              <FormattedMessage id="ui.broadcastMessages.loadMore" defaultMessage="ui.broadcastMessages.loadMore" />
            </Button>
          </CardContent>
        </Widget>
      )}
    </Root>
  );
}
