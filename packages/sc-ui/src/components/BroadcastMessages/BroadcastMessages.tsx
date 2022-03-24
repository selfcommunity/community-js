import React, {useEffect, useMemo, useState} from 'react';
import {styled} from '@mui/material/styles';
import {Box, Button, CardContent} from '@mui/material';
import {Endpoints, http, Logger, SCBroadcastMessageType, SCUserContextType, useSCUser} from '@selfcommunity/core';
import {SCOPE_SC_UI} from '../../constants/Errors';
import Message, {MessageProps} from './Message';
import classNames from 'classnames';
import {FormattedMessage} from 'react-intl';
import {MessageSkeleton} from './Skeleton';
import Widget from '../Widget';

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
    textTransform: 'capitalize'
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

 * @param props
 */
export default function BroadcastMessages(props: BroadcastMessagesProps): JSX.Element {
  // PROPS
  const {id = 'broadcast_messages', className = null, MessageProps = {}, ...rest} = props;

  // STATE
  const [loading, setLoading] = useState<boolean>(null);
  const [next, setNext] = useState<string>(`${Endpoints.BroadcastMessagesList.url()}?limit=3`);
  const [messages, setMessages] = useState<SCBroadcastMessageType[]>([]);
  const [viewAll, setViewAll] = useState<boolean>(false);

  // CONTEXT
  const scUserContext: SCUserContextType = useSCUser();

  // CONST
  const authUserId = scUserContext.user ? scUserContext.user.id : null;
  const unViewedMessages = messages.filter((m) => !m.viewed_at);
  const viewedMessageCounter = messages.length - unViewedMessages.length;

  const handleDisposeMessage = (message) => {
    setMessages(messages.filter((m) => m.id != message.id));
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
      return {data: data.results.concat(await performFetchMessages(data.next)), next: data.next};
    }
    return {data: data.results, next: data.next};
  };

  /**
   * Fetch broadcast messages
   */
  const fetchMessages = () => {
    setLoading(true);
    performFetchMessages(next)
      .then((res) => {
        setMessages([...messages, ...res.data]);
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

  // On mount, fetch first page of notifications
  useEffect(() => {
    if (authUserId !== null) {
      fetchMessages();
    }
  }, [authUserId]);

  return (
    <Root id={id} className={classNames(classes.root, className)} {...rest}>
      {[...unViewedMessages, ...messages.slice(unViewedMessages.length, viewAll ? viewedMessageCounter : 1)].map((message) => (
        <Message key={message.id} message={message} {...MessageProps} onClose={handleDisposeMessage} />
      ))}
      {loading && <MessageSkeleton />}
      {loading !== null && !loading && (next || (viewedMessageCounter >= 0 && !viewAll)) && (
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
