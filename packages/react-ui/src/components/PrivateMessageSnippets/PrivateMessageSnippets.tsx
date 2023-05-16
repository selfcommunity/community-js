import React, {useContext, useEffect, useRef, useState} from 'react';
import {styled} from '@mui/material/styles';
import {Button, Card, CardContent, CardProps, Icon, IconButton, List, TextField} from '@mui/material';
import PubSub from 'pubsub-js';
import {SCNotificationTopicType, SCNotificationTypologyType, SCPrivateMessageSnippetType, SCPrivateMessageStatusType} from '@selfcommunity/types';
import PrivateMessageSnippetsSkeleton from './Skeleton';
import PrivateMessageSnippetItem from '../PrivateMessageSnippetItem';
import classNames from 'classnames';
import {useThemeProps} from '@mui/system';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import {SCUserContext, SCUserContextType, useSCFetchPrivateMessageSnippets} from '@selfcommunity/react-core';
import {CacheStrategies} from '@selfcommunity/utils';
import PrivateMessageSettingsIconButton from '../PrivateMessageSettingsIconButton';

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

const Root = styled(Card, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));

export interface PrivateMessageSnippetsProps extends CardProps {
  /**
   * Snippets list
   * @default[]
   */
  snippets?: SCPrivateMessageSnippetType[];
  /**
   * Loading state
   *
   */
  loading?: boolean;
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
  /**
   *
   */
  snippetActions?: {
    onSnippetClick?: (msg) => void;
    onNewMessageClick?: () => void;
    onDeleteConfirm?: (msg) => void;
  };
  /**
   * Any other properties
   */
  [p: string]: any;
  /**
   * thread user object
   * @default null
   */
  userObj?: any;
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

  const {className = null, userObj = null, snippetActions, clearSearch, ...rest} = props;

  // STATE
  const {data, updateSnippets} = useSCFetchPrivateMessageSnippets({cacheStrategy: CacheStrategies.CACHE_FIRST});
  const [search, setSearch] = useState<string>('');
  const isObj = typeof userObj === 'object';
  const scUserContext: SCUserContextType = useContext(SCUserContext);
  const authUserId = scUserContext.user ? scUserContext.user.id : null;

  // INTL
  const intl = useIntl();

  // REFS
  const refreshSubscription = useRef(null);

  // CONST
  const filteredSnippets = data.snippets.filter((el) => {
    if (search === '') {
      return el;
    } else if (el.receiver.id === authUserId) {
      return el.sender.username.includes(search.toLowerCase());
    }
    return el.receiver.username.includes(search.toLowerCase());
  });
  const messageReceiver = (item, loggedUserId) => {
    return item?.receiver?.id !== loggedUserId ? item?.receiver?.id : item?.sender?.id;
  };

  //HANDLERS
  const handleChange = (event) => {
    setSearch(event.target.value);
  };
  const handleClear = () => {
    setSearch('');
  };

  const handleOpenNewMessage = () => {
    snippetActions && snippetActions.onNewMessageClick();
    handleClear();
  };

  const handleDeleteConversation = (msg) => {
    snippetActions && snippetActions.onDeleteConfirm(msg);
  };

  function handleOpenThread(msg) {
    snippetActions && snippetActions.onSnippetClick(msg);
    handleClear();
    updateSnippetsParams(msg.id, 'seen');
  }

  /**
   * Updates snippet headline and status or just snippet status
   * @param threadId
   * @param status
   * @param headline
   */
  function updateSnippetsParams(threadId: number, status: string, headline?: string) {
    const newSnippets = [...data.snippets];
    const index = newSnippets.findIndex((s) => s.id === threadId);
    if (index !== -1) {
      newSnippets[index].headline = headline ?? newSnippets[index].headline;
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      newSnippets[index].thread_status = status;
      updateSnippets(newSnippets);
    }
  }

  function handleSnippetsUpdate(message: any, forDeletion?: boolean) {
    const newSnippets = [...data.snippets];
    if (forDeletion) {
      const _snippets = newSnippets.filter((s) => messageReceiver(s, authUserId) !== message);
      updateSnippets(_snippets);
    } else {
      let temp = [...data.snippets];
      message.map((m) => {
        const idx = newSnippets.findIndex((s) =>
          // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
          // @ts-ignore
          Object.prototype.hasOwnProperty.call(s, 'thread_id') ? s.thread_id === m.thread_id : s.id === m.thread_id
        );
        if (idx !== -1) {
          temp[idx].headline = m.message;
          temp[idx].thread_status = m.status;
        } else {
          temp = [...temp, m];
        }
        updateSnippets(temp);
      });
    }
  }

  /**
   * Notification subscriber
   */
  const subscriber = (msg, data) => {
    const res = data.data;
    updateSnippetsParams(res.thread_id, res.notification_obj.snippet.thread_status, res.notification_obj.snippet.headline);
  };

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
  }, [data.snippets]);

  useEffect(() => {
    if (clearSearch) handleClear();
  }, [clearSearch]);

  /**
   * Thread/ Private Message Component subscribtions handlers
   */
  useEffect(() => {
    const threadSubscriber = PubSub.subscribe('snippetsChannel', (msg, data) => {
      handleSnippetsUpdate(data);
    });
    const snippetsSubscriber = PubSub.subscribe('snippetsChannelDelete', (msg, data) => {
      handleSnippetsUpdate(data, true);
    });

    return () => {
      PubSub.unsubscribe(threadSubscriber);
      PubSub.unsubscribe(snippetsSubscriber);
    };
  }, [data.snippets]);

  //RENDERING

  /**
   * Renders snippets skeleton when loading
   */
  if (data.isLoading) {
    return <PrivateMessageSnippetsSkeleton elevation={0} />;
  }

  /**
   * Renders the component
   */
  return (
    <Root {...rest} className={classNames(classes.root, className)}>
      <CardContent>
        <Button variant="outlined" size="medium" className={classes.newMessageButton} onClick={handleOpenNewMessage}>
          <FormattedMessage id="ui.privateMessage.snippets.button.newMessage" defaultMessage="ui.privateMessage.snippets.button.newMessage" />
        </Button>
        {data.snippets.length !== 0 && (
          <>
            <TextField
              className={classes.searchBar}
              variant="filled"
              margin="normal"
              fullWidth
              id={`${PREFIX}-search`}
              placeholder={`${intl.formatMessage(messages.placeholder)}`}
              size="small"
              onChange={handleChange}
              value={search}
              InputProps={{
                disableUnderline: true,
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
                  onItemClick={() => handleOpenThread(message)}
                  secondaryAction={
                    <PrivateMessageSettingsIconButton
                      threadToDelete={messageReceiver(message, authUserId)}
                      onItemDeleteConfirm={() => handleDeleteConversation(messageReceiver(message, authUserId))}
                    />
                  }
                  selected={
                    userObj !== SCPrivateMessageStatusType.NEW &&
                    messageReceiver(message, authUserId) === (isObj ? messageReceiver(userObj, authUserId) : userObj)
                  }
                />
              ))}
            </List>
          </>
        )}
      </CardContent>
    </Root>
  );
}
