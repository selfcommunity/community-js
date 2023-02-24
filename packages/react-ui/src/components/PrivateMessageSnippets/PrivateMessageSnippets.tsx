import React, {useEffect, useMemo, useRef, useState} from 'react';
import {styled} from '@mui/material/styles';
import {Button, CardContent, Icon, IconButton, List, TextField} from '@mui/material';
import Widget from '../Widget';
import {http, Endpoints, HttpResponse} from '@selfcommunity/api-services';
import {SCPrivateMessageSnippetType, SCNotificationTopicType, SCNotificationTypologyType} from '@selfcommunity/types';
import PrivateMessageSnippetsSkeleton from './Skeleton';
import PrivateMessageSnippetItem from '../PrivateMessageSnippetItem';
import classNames from 'classnames';
import {useThemeProps} from '@mui/system';
import PubSub from 'pubsub-js';
import HiddenPlaceholder from '../../shared/HiddenPlaceholder';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {Logger} from '@selfcommunity/utils';

const messages = defineMessages({
  placeholder: {
    id: 'ui.privateMessage.snippets.searchBar.placeholder',
    defaultMessage: 'ui.privateMessage.snippets.searchBar.placeholder'
  }
});
const PREFIX = 'SCPrivateMessageSnippets';

const classes = {
  root: `${PREFIX}-root`,
  searchBar: `${PREFIX}-search-bar`,
  icon: `${PREFIX}-icon`,
  input: `${PREFIX}-input`,
  clear: `${PREFIX}-clear`,
  newMessageButton: `${PREFIX}-new-message-button`
};

const Root = styled(Widget, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));

export interface PrivateMessageSnippetsProps {
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
   *
   */
  snippetActions?: {
    onSnippetClick?: (msg) => void;
    onNewMessageClick?: () => void;
    onMenuItemClick?: (msg) => void;
  };
  /**
   * Any other properties
   */
  [p: string]: any;
  /**
   * Clicked thread id
   * @default null
   */
  threadId?: number;
  /**
   * Callbacks to handle component update after thread delete, on message/new message sent
   */
  snippetCallbacksData?: {
    onDeleteThreadSuccess?: number;
    onMessageChanges?: {message: SCPrivateMessageSnippetType; reason: string};
  };
  /**
   * Prop to highlight selected snippet
   * @default null
   */
  //selected?: any;
}
/**
 *
 > API documentation for the Community-JS PrivateMessageSnippets component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {PrivateMessageSnippets} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCPrivateMessageSnippets` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCPrivateMessageSnippets-root|Styles applied to the root element.|
 |icon|.SCPrivateMessageSnippets-icon|Styles applied to the search icon element.|
 |input|.SCPrivateMessageSnippets-input|Styles applied to the search input element.|
 |clear|.SCPrivateMessageSnippets-clear|Styles applied to the search bar clear icon element.|
 |searchBar|.SCPrivateMessageSnippets-searchBar|Styles applied to the search bar element.|
 |newMessageButton|.SCPrivateMessageSnippets-new-message-button|Styles applied to new message button element.|

 * @param inProps
 */
export default function PrivateMessageSnippets(inProps: PrivateMessageSnippetsProps): JSX.Element {
  // PROPS
  const props: PrivateMessageSnippetsProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });

  const {autoHide = false, className = null, threadId, snippetActions, snippetCallbacksData, ...rest} = props;

  // STATE
  const [snippets, setSnippets] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  //const isNumber = typeof selected === 'number';
  const [search, setSearch] = useState<string>('');
  // REFS
  const refreshSubscription = useRef(null);

  // INTL
  const intl = useIntl();
  /**
   * Memoized fetchSnippets
   */
  const fetchSnippets = useMemo(
    () => () => {
      return http
        .request({
          url: Endpoints.GetSnippets.url(),
          method: Endpoints.GetSnippets.method
        })
        .then((res: HttpResponse<any>) => {
          if (res.status >= 300) {
            return Promise.reject(res);
          }
          return Promise.resolve(res.data);
        });
    },
    []
  );

  /**
   * On mount, fetches snippets
   */
  useEffect(() => {
    fetchSnippets()
      .then((data: any) => {
        setSnippets(data.results);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        Logger.error(SCOPE_SC_UI, {error});
      });
  }, []);

  /**
   * Updates snippet headline and status
   * @param id
   * @param headline
   * @param status
   */
  function updateSnippets(id, headline, status) {
    const newSnippets = [...snippets];
    const index = newSnippets.findIndex((s) => s.id === id);
    if (index !== -1) {
      newSnippets[index].headline = headline;
      newSnippets[index].thread_status = status;
      setSnippets(newSnippets);
    }
  }

  function updateSnippetsList(id) {
    const _snippets = snippets.filter((s) => s.id !== id);
    setSnippets(_snippets);
  }

  const handleChange = (event) => {
    setSearch(event.target.value);
  };
  const handleClear = () => {
    setSearch('');
  };
  const filteredSnippets = snippets.filter((el) => {
    if (search === '') {
      return el;
    }
    return el.receiver.username.toLowerCase().includes(search);
  });

  const handleOpenNewMessage = () => {
    snippetActions && snippetActions.onNewMessageClick();
    handleClear();
  };

  const handleDeleteConversation = (msg) => {
    snippetActions && snippetActions.onMenuItemClick(msg);
  };

  /**
   * Updates snippet status
   * @param id
   * @param status
   */
  function updateStatus(id, status) {
    const newSnippets = [...snippets];
    const index = newSnippets.findIndex((s) => s.id === id);
    if (index !== -1) {
      newSnippets[index].thread_status = status;
      setSnippets(newSnippets);
    }
  }

  /**
   * When a ws notification arrives, updates data
   */
  useEffect(() => {
    refreshSubscription.current = PubSub.subscribe(
      `${SCNotificationTopicType.INTERACTION}.${SCNotificationTypologyType.PRIVATE_MESSAGE}`,
      subscriber
    );
    return () => {
      PubSub.unsubscribe(refreshSubscription.current);
    };
  }, [snippets]);

  function updateSnippetsOnCallbacks(snippetCallbacksData) {
    //Removes deleted thread from snippet list
    if (snippetCallbacksData.onDeleteThreadSuccess) {
      updateSnippetsList(snippetCallbacksData.onDeleteThreadSuccess);
      handleClear();
    } else if (snippetCallbacksData.onMessageChanges) {
      //Updates snippet headline when a new message is sent or deleted
      const newSnippets = [...snippets];
      const inList = newSnippets.some((o) => o.receiver.id === snippetCallbacksData.onMessageChanges.receiver.id);
      if (inList) {
        const index = newSnippets.findIndex((s) => s.receiver.id === snippetCallbacksData.onMessageChanges.receiver.id);
        if (index !== -1) {
          newSnippets[index].headline = snippetCallbacksData.onMessageChanges.message;
          setSnippets(newSnippets);
        }
      } else {
        //Adds a new snippet when a new message is sent
        setSnippets((prev) => [...prev, snippetCallbacksData.onMessageChanges]);
      }
    }
  }
  /**
   * Updates snippets list when some message action is made inside thread component
   */
  useEffect(() => {
    updateSnippetsOnCallbacks(snippetCallbacksData);
  }, [snippetCallbacksData]);
  /**
   * Notification subscriber
   */
  const subscriber = (msg, data) => {
    const res = data.data;
    updateSnippets(res.thread_id, res.notification_obj.snippet.headline, res.notification_obj.snippet.thread_status);
  };

  /**
   * Handles thread opening
   */
  function handleOpenThread(msg) {
    snippetActions && snippetActions.onSnippetClick(msg);
    handleClear();
    updateStatus(msg.id, 'seen');
  }

  /**
   * Renders snippets skeleton when loading
   */
  if (loading) {
    return <PrivateMessageSnippetsSkeleton elevation={0} />;
  }

  /**
   * Renders the component (if not hidden by autoHide prop)
   */
  if (!autoHide) {
    return (
      <Root {...rest} className={classNames(classes.root, className)}>
        <CardContent>
          <Button variant="outlined" size="medium" className={classes.newMessageButton} onClick={handleOpenNewMessage}>
            <FormattedMessage id="ui.privateMessage.snippets.button.newMessage" defaultMessage="ui.privateMessage.snippets.button.newMessage" />
          </Button>
          {snippets.length !== 0 && (
            <>
              <TextField
                className={classes.searchBar}
                margin="normal"
                fullWidth
                id={`${PREFIX}-search`}
                placeholder={`${intl.formatMessage(messages.placeholder)}`}
                size="small"
                onChange={handleChange}
                value={search}
                InputProps={{
                  className: classes.input,
                  startAdornment: <Icon className={classes.icon}>search</Icon>,
                  endAdornment: (
                    <IconButton className={classes.clear} disabled={!search} onClick={handleClear} size="small">
                      <Icon>close</Icon>
                    </IconButton>
                  )
                }}
              />
              <List>
                {filteredSnippets.map((message: SCPrivateMessageSnippetType) => (
                  <PrivateMessageSnippetItem
                    message={message}
                    key={message.id}
                    actions={{onItemClick: () => handleOpenThread(message), onMenuClick: () => handleDeleteConversation(message)}}
                    selected={message.id === threadId}
                    // selected={
                    //   message.id === threadId ||
                    //   (!isNumber && selected ? message.receiver.id === selected.receiver.id : message.receiver.id === selected)
                    // }
                  />
                ))}
              </List>
            </>
          )}
        </CardContent>
      </Root>
    );
  }
  return <HiddenPlaceholder />;
}
