import React, {useEffect, useState} from 'react';
import {styled} from '@mui/material/styles';
import {Divider, Typography, Button, Box} from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import {Endpoints, http} from '@selfcommunity/core';
import {AxiosResponse} from 'axios';
import {SCPrivateMessageType} from '@selfcommunity/core/src/types';
import {FormattedMessage} from 'react-intl';
import SnippetsSkeleton from '../Skeleton/SnippetsSkeleton';
import Message from '../Message';
import Thread from '../Thread';
import NewMessage from '../NewMessage';

const PREFIX = 'SCSnippets';

const classes = {
  selected: `${PREFIX}-selected`
};

const Root = styled(Card, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  [`& .${classes.selected}`]: {
    backgroundColor: '#a0c7e9'
  }
}));

export interface SnippetsProps {
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
export default function Snippets(props: SnippetsProps): JSX.Element {
  //PROPS
  const {autoHide = false, className = null, ...rest} = props;

  // STATE
  const [snippets, setSnippets] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [openThread, setOpenThread] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [threadId, setThreadId] = useState<number>(null);
  const [unseen, setUnseen] = useState<boolean>(null);
  const [selected, setSelected] = useState<number>(null);

  /**
   * Fetches Snippets
   */
  function fetchSnippets() {
    http
      .request({
        url: Endpoints.GetSnippets.url(),
        method: Endpoints.GetSnippets.method
      })
      .then((res: AxiosResponse<any>) => {
        const data = res.data;
        setSnippets(data.results);
        setLoading(false);
        setTotal(data.count);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  /**
   * On mount, fetches snippets
   */
  useEffect(() => {
    fetchSnippets();
  }, []);

  /**
   * Handles thread opening
   */
  function handleOpenThread(id) {
    setOpenThread(true);
    setThreadId(id);
    setUnseen(false);
    setSelected(id);
  }

  /**
   * Renders snippets list
   */
  const c = (
    <React.Fragment>
      {loading ? (
        <SnippetsSkeleton elevation={0} />
      ) : (
        <CardContent>
          {!total ? (
            <Typography variant="body2">
              <FormattedMessage id="ui.categoriesSuggestion.noResults" defaultMessage="ui.categoriesSuggestion.noResults" />
            </Typography>
          ) : (
            <React.Fragment>
              <NewMessage />
              <Divider />
              {snippets.map((message: SCPrivateMessageType, index) => (
                <div key={index}>
                  <Message
                    elevation={0}
                    message={message}
                    key={message.id}
                    onClick={() => handleOpenThread(message.id)}
                    unseen={unseen === null ? message.thread_status === 'new' : unseen}
                    className={message.id === selected ? classes.selected : ''}
                  />
                  {index < total - 1 ? <Divider /> : null}
                </div>
              ))}
            </React.Fragment>
          )}
          {openThread && (
            <>
              <Thread id={threadId} open={openThread} />
            </>
          )}
        </CardContent>
      )}
    </React.Fragment>
  );

  /**
   * Renders the component (if not hidden by autoHide prop)
   */
  if (!autoHide) {
    return (
      <Root {...rest} className={className}>
        {c}
      </Root>
    );
  }
  return null;
}
