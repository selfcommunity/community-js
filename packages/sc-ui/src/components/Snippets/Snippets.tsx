import React, {useEffect, useRef, useState} from 'react';
import {styled} from '@mui/material/styles';
import {Divider, Typography, List} from '@mui/material';
import Widget from '../Widget';
import {Endpoints, http, SCNotificationTopicType, SCNotificationTypologyType} from '@selfcommunity/core';
import {AxiosResponse} from 'axios';
import {SCPrivateMessageType} from '@selfcommunity/core/src/types';
import {FormattedMessage} from 'react-intl';
import SnippetsSkeleton from './Skeleton';
import Message from '../Message';
import classNames from 'classnames';
import useThemeProps from '@mui/material/styles/useThemeProps';
import PubSub from 'pubsub-js';

const PREFIX = 'SCSnippets';

const classes = {
  root: `${PREFIX}-root`,
  selected: `${PREFIX}-selected`
};

const Root = styled(Widget, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  width: '500px',
  ['& .MuiCardContent-root']: {
    '&:last-child': {
      paddingBottom: 0
    }
  },
  [`& .${classes.selected}`]: {
    background: theme.palette.grey['A200']
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
  /**
   * *Callback on snippet click
   * @param msg
   */
  onSnippetClick?: (msg) => void;
  /**
   * Clicked thread id
   * @default null
   */
  threadId?: number;
}
/**
 *
 > API documentation for the Community-UI Snippets component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {Snippets} from '@selfcommunity/ui';
 ```

 #### Component Name

 The name `SCSnippets` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCSnippets-root|Styles applied to the root element.|
 |selected|.SCSnippets-selected|Styles applied to the selected element.|

 * @param inProps
 */
export default function Snippets(inProps: SnippetsProps): JSX.Element {
  // PROPS
  const props: SnippetsProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });

  const {autoHide = false, className = null, onSnippetClick, threadId, ...rest} = props;

  // STATE
  const [snippets, setSnippets] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [total, setTotal] = useState<number>(0);
  const [unseen, setUnseen] = useState<boolean>(null);

  // REFS
  const refreshSubscription = useRef(null);

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
   * When a ws notification arrives, update data
   */
  useEffect(() => {
    refreshSubscription.current = PubSub.subscribe(
      `${SCNotificationTopicType.INTERACTION}.${SCNotificationTypologyType.PRIVATE_MESSAGE}`,
      subscriber
    );
    return () => {
      PubSub.unsubscribe(refreshSubscription.current);
    };
  }, []);

  /**
   * Notification subscriber
   */
  const subscriber = (msg, data) => {
    console.log(data.data);
    //setSnippets((prev) => [...prev, data.data.notification_obj.snippet]);
  };

  /**
   * Handles thread opening
   */
  function handleOpenThread(msg) {
    onSnippetClick(msg);
    setUnseen(false);
  }

  /**
   * Renders snippets list
   */
  const c = (
    <React.Fragment>
      {loading ? (
        <SnippetsSkeleton elevation={0} />
      ) : (
        <>
          {!total ? (
            <Typography variant="body2">
              <FormattedMessage id="ui.categoriesSuggestion.noResults" defaultMessage="ui.categoriesSuggestion.noResults" />
            </Typography>
          ) : (
            <List>
              {snippets.map((message: SCPrivateMessageType, index) => (
                <div key={index}>
                  <Message
                    elevation={0}
                    message={message}
                    key={message.id}
                    onClick={() => handleOpenThread(message)}
                    unseen={unseen === null ? message.thread_status === 'new' : unseen}
                    className={message.id === threadId ? classes.selected : ''}
                  />
                  {index < total - 1 ? <Divider /> : null}
                </div>
              ))}
            </List>
          )}
        </>
      )}
    </React.Fragment>
  );

  /**
   * Renders the component (if not hidden by autoHide prop)
   */
  if (!autoHide) {
    return (
      <Root {...rest} className={classNames(classes.root, className)}>
        {c}
      </Root>
    );
  }
  return null;
}
