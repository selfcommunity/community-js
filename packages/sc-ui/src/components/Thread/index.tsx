import React, {useEffect, useState} from 'react';
import {styled} from '@mui/material/styles';
import Card from '@mui/material/Card';
import {Endpoints, http, SCPrivateMessageType} from '@selfcommunity/core';
import {AxiosResponse} from 'axios';
import Message from '../Message';

const PREFIX = 'SCThread';

const Root = styled(Card, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  maxWidth: 700,
  marginBottom: theme.spacing(2)
}));

export interface ThreadProps {
  /**
   * Thread id
   * @default null
   */
  id: number;
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
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
export default function Thread(props: ThreadProps): JSX.Element {
  // PROPS
  const {id = 29, autoHide, className, ...rest} = props;

  // STATE
  const [loading, setLoading] = useState<boolean>(true);
  const [messages, setMessages] = useState<any[]>([]);
  console.log(messages);

  /**
   * Fetches thread
   */
  function fetchThread() {
    http
      .request({
        url: Endpoints.GetAThread.url(),
        method: Endpoints.GetAThread.method,
        params: {
          thread: id
        }
      })
      .then((res: AxiosResponse<any>) => {
        const data = res.data;
        setMessages(data.results);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  /**
   * On mount, fetches thread
   */
  useEffect(() => {
    fetchThread();
  }, []);

  /**
   * Renders thread component
   */
  const t = (
    <React.Fragment>
      <React.Fragment>
        {messages.map((message: SCPrivateMessageType, index) => (
          <div key={index}>
            <Message elevation={0} message={message} key={message.id} />
          </div>
        ))}
      </React.Fragment>
    </React.Fragment>
  );

  /**
   * Renders the component (if not hidden by autoHide prop)
   */
  if (!autoHide) {
    return (
      <Root {...rest} className={className}>
        {t}
      </Root>
    );
  }
  return null;
}
