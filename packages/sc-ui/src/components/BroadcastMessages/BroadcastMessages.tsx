import React, {useEffect, useState} from 'react';
import {styled} from '@mui/material/styles';
import {Box} from '@mui/material';
import {Endpoints, http, Logger, SCBroadcastMessageType} from '@selfcommunity/core';
import {AxiosResponse} from 'axios';
import {SCOPE_SC_UI} from '../../constants/Errors';
import Message, {MessageProps} from './Message';
import classNames from 'classnames';

const PREFIX = 'SCBroadcastMessages';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));

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

 * @param props
 */
export default function BroadcastMessages(props: BroadcastMessagesProps): JSX.Element {
  // PROPS
  const {id = 'broadcast_messages', className = null, MessageProps = {}, ...rest} = props;

  // STATE
  const [loading, setLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<SCBroadcastMessageType[]>([]);

  /**
   * Fetch main feed
   * Manage pagination, infinite scrolling
   */
  const fetch = () => {
    setLoading(true);
    http
      .request({
        url: Endpoints.BroadcastMessagesList.url(),
        method: Endpoints.BroadcastMessagesList.method
      })
      .then((res: AxiosResponse<{next?: string; previous?: string; results: SCBroadcastMessageType[]}>) => {
        const data = res.data;
        setMessages([...data.results]);
      })
      .catch((error) => {
        Logger.error(SCOPE_SC_UI, error);
      })
      .then(() => setLoading(false));
  };

  // On mount, fetch first page of notifications
  useEffect(() => {
    fetch();
  }, []);

  if (loading) {
    return null;
  }

  return (
    <Root id={id} className={classNames(classes.root, className)} {...rest}>
      {messages.map((message) => (
        <Message key={message.id} message={message} {...MessageProps} />
      ))}
    </Root>
  );
}
