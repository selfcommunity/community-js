import React, {useEffect, useRef, useState} from 'react';
import {styled} from '@mui/material/styles';
import {Box, Button, CardContent} from '@mui/material';
import {
  Endpoints,
  http,
  Logger,
  SCBroadcastMessageType,
  SCNotificationTopicType,
  SCNotificationTypologyType,
  SCUserContextType,
  useSCUser
} from '@selfcommunity/core';
import {SCOPE_SC_UI} from '../../constants/Errors';
import Message, {MessageProps} from './Message';
import classNames from 'classnames';
import {FormattedMessage} from 'react-intl';
import {MessageSkeleton} from './Skeleton';
import Widget from '../Widget';
import PubSub from 'pubsub-js';
import useThemeProps from '@mui/material/styles/useThemeProps';

const PREFIX = 'SCBroadcastMessages';

const classes = {
  root: `${PREFIX}-root`,
  boxLoadMore: `${PREFIX}-box-load-more`,
  buttonLoadMore: `${PREFIX}-button-load-more`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  [`& .${classes.boxLoadMore}`]: {
    '& > div': {
      paddingBottom: theme.spacing(2)
    },
    marginBottom: theme.spacing(2)
  },
  [`& .${classes.buttonLoadMore}`]: {
    textTransform: 'capitalize',
    marginLeft: -10
  }
}));

export interface BroadcastMessagesProps {
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
   * Any other properties
   */
  [p: string]: any;
}
/**
 > API documentation for the Community-UI Broadcast Messages component. Learn about the available props and the CSS API.
 > This component handles message broadcasts. It initially displays unseen messages. If all messages have been viewed it will show at most one message.
 *
 #### Import
 ```jsx
 import {BroadcastMessages} from '@selfcommunity/ui';
 ```
 #### Component Name
 The name `SCBroadcastMessages` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCBroadcastMessages-root|Styles applied to the root element.|
 |boxLoadMore|.SCBroadcastMessages-box-load-more|Styles applied to load more box.|
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
    ...rest
  } = props;

  // STATE
  const broadcastMessagesRefreshUrl = `${Endpoints.BroadcastMessagesList.url()}?limit=3`;
  const [loading, setLoading] = useState<boolean>(null);
  const [next, setNext] = useState<string>(broadcastMessagesRefreshUrl);
  const [messages, setMessages] = useState<SCBroadcastMessageType[]>([]);
  const [viewAll, setViewAll] = useState<boolean>(false);

  // CONTEXT
  const scUserContext: SCUserContextType = useSCUser();

  // CONST
  const authUserId = scUserContext.user ? scUserContext.user.id : null;
  const unViewedMessages = messages.filter((m) => !m.viewed_at);
  const viewedMessageCounter = messages.length - unViewedMessages.length;

  // REFS
  const refreshSubscription = useRef(null);

  const handleDisposeMessage = (message) => {
    setMessages(messages.filter((m) => m.id != message.id));
    if (messages.length <= 1) {
      fetchMessages(true);
    }
  };

  /**
   * Fetch broadcast messages
   * Loads until the messages are already seen
   */
  const performFetchMessages = async (next: string): Promise<{data: SCBroadcastMessageType[]; next: null}> => {
    const response = await http.request({
      url: next,
      method: Endpoints.BroadcastMessagesList.method
    });
    const data: any = response.data;
    if (data.next && !data.results[data.results.length - 1]['viewed_at']) {
      return {data: data.results.concat((await performFetchMessages(data.next)).data), next: data.next};
    }
    return {data: data.results, next: data.next};
  };

  /**
   * Fetch broadcast messages
   */
  const fetchMessages = (refresh = false) => {
    setLoading(true);
    performFetchMessages(refresh ? broadcastMessagesRefreshUrl : next)
      .then((res) => {
        setMessages(refresh ? res.data : [...messages, ...res.data]);
        setNext(res.next);
        setLoading(false);
      })
      .catch((error) => {
        Logger.error(SCOPE_SC_UI, error);
      });
  };

  /**
   * if messages.length < unViewedMessages.length show other message
   * if the difference between the 2 arrays is small fetch remote messages
   */
  const fetchOtherMessages = () => {
    setViewAll(true);
    if ((next && viewAll) || (next && !viewAll && viewedMessageCounter <= 2)) {
      fetchMessages();
    }
  };

  /**
   * On mount, fetch first page of notifications
   */
  useEffect(() => {
    if (authUserId !== null) {
      fetchMessages();
    }
  }, [authUserId]);

  /**
   * Notification subscriber
   */
  const subscriber = (msg, data) => {
    fetchMessages(true);
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

  console.log('---------');
  console.log(messages);
  const messagesToShow = [...unViewedMessages, ...messages.slice(unViewedMessages.length, viewAll ? viewedMessageCounter : 1)];
  console.log(messagesToShow);
  console.log('---------');
  return (
    <Root id={id} className={classNames(classes.root, className)} {...rest}>
      {messagesToShow.map((message, index) => (
        <Box key={index}>
          <Message message={message} {...MessageProps} onClose={handleDisposeMessage} />
        </Box>
      ))}
      {loading && <MessageSkeleton />}
      {loading !== null && !loading && (next || (viewedMessageCounter > 0 && !viewAll)) && (
        <Widget className={classes.boxLoadMore}>
          <CardContent>
            <Button variant="text" onClick={fetchOtherMessages} disabled={loading} color="inherit" classes={{root: classes.buttonLoadMore}}>
              <FormattedMessage id="ui.broadcastMessages.loadMore" defaultMessage="ui.broadcastMessages.loadMore" />
            </Button>
          </CardContent>
        </Widget>
      )}
    </Root>
  );
}
