import React, {useContext, useEffect, useState} from 'react';
import {styled} from '@mui/material/styles';
import Card from '@mui/material/Card';
import {Endpoints, http, SCPrivateMessageType, SCUserContext, SCUserContextType} from '@selfcommunity/core';
import {AxiosResponse} from 'axios';
import Message from '../Message';
import _ from 'lodash';
import {useIntl} from 'react-intl';
import {Typography} from '@mui/material';

const PREFIX = 'SCThread';

const classes = {
  sender: `${PREFIX}-sender`,
  receiver: `${PREFIX}-receiver`
};

const Root = styled(Card, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  maxWidth: 700,
  marginBottom: theme.spacing(2),
  [`& .${classes.sender}`]: {
    display: 'flex',
    justifyContent: 'flex-end',
    '& .SCMessage-messageBox': {
      backgroundColor: theme.palette.grey[400]
    }
  },
  [`& .${classes.receiver}`]: {
    '& .SCMessage-messageBox': {
      backgroundColor: theme.palette.grey['A200']
    },
    '& .SCMessage-messageTime': {
      display: 'flex',
      justifyContent: 'flex-start'
    }
  }
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
  const {id = null, autoHide, className, ...rest} = props;

  //CONTEXT
  const scUserContext: SCUserContextType = useContext(SCUserContext);

  // STATE
  const [loading, setLoading] = useState<boolean>(true);
  const [messages, setMessages] = useState<any[]>([]);
  const loggedUser = scUserContext['user'].id;

  // INTL
  const intl = useIntl();

  // UTILS
  const format = (item) =>
    intl.formatDate(item.created_at, {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });

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
        setMessages(_.groupBy(data.results, format));
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
      {Object.keys(messages).map((key, index) => (
        <div key={index}>
          <Typography component="h3" align="center">
            {key}
          </Typography>
          {messages[key].map((msg: SCPrivateMessageType, index) => (
            <div key={index} className={loggedUser === msg.sender_id ? classes.sender : classes.receiver}>
              <Message elevation={0} message={msg} key={msg.id} snippetType={false} />
            </div>
          ))}
        </div>
      ))}
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
