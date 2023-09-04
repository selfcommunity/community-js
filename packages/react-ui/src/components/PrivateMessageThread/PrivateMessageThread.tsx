import React, {useContext, useEffect, useMemo, useRef, useState} from 'react';
import {styled} from '@mui/material/styles';
import {Endpoints, http, HttpResponse, PrivateMessageService, SCPaginatedResponse} from '@selfcommunity/api-services';
import {
  SCPreferences,
  SCPreferencesContextType,
  SCUserContext,
  SCUserContextType,
  UserUtils,
  useSCFetchUser,
  useSCPreferences,
  SCConnectionsManagerType,
  SCFollowersManagerType
} from '@selfcommunity/react-core';
import {SCNotificationTopicType, SCNotificationTypologyType, SCPrivateMessageStatusType, SCPrivateMessageThreadType} from '@selfcommunity/types';
import PrivateMessageThreadItem, {PrivateMessageThreadItemSkeleton} from '../PrivateMessageThreadItem';
import PubSub from 'pubsub-js';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import {Box, Card, CardContent, CardProps, IconButton, List, ListSubheader, TextField, Typography} from '@mui/material';
import PrivateMessageEditor from '../PrivateMessageEditor';
import Autocomplete from '@mui/material/Autocomplete';
import classNames from 'classnames';
import {useThemeProps} from '@mui/system';
import Icon from '@mui/material/Icon';
import PrivateMessageThreadSkeleton from './Skeleton';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {groupBy, Logger} from '@selfcommunity/utils';
import {useSnackbar} from 'notistack';
import ConfirmDialog from '../../shared/ConfirmDialog/ConfirmDialog';
import InfiniteScroll from '../../shared/InfiniteScroll';

const translMessages = defineMessages({
  placeholder: {
    id: 'ui.privateMessage.thread.newMessage.autocomplete.placeholder',
    defaultMessage: 'ui.privateMessage.thread.newMessage.autocomplete.placeholder'
  },
  messageDeleted: {
    id: 'ui.privateMessage.thread.message.deleted',
    defaultMessage: 'ui.privateMessage.thread.message.deleted'
  }
});

const PREFIX = 'SCPrivateMessageThread';

const classes = {
  root: `${PREFIX}-root`,
  subHeader: `${PREFIX}-subheader`,
  section: `${PREFIX}-section`,
  emptyMessage: `${PREFIX}-empty-message`,
  newMessageHeader: `${PREFIX}-new-message-header`,
  newMessageHeaderContent: `${PREFIX}-new-message-header-content`,
  newMessageHeaderIcon: `${PREFIX}-new-message-header-icon`,
  newMessageContent: `${PREFIX}-new-message-content`,
  sender: `${PREFIX}-sender`,
  receiver: `${PREFIX}-receiver`,
  autocomplete: `${PREFIX}-autocomplete`,
  autocompleteDialog: `${PREFIX}-autocomplete-dialog`,
  editor: `${PREFIX}-editor`
};

const Root = styled(Card, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));

export interface PrivateMessageThreadProps extends CardProps {
  /**
   * Thread object or thread id
   * default null
   */
  userObj?: any;
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
  /**
   * If new message section is open
   * @default false
   */
  openNewMessage?: boolean;
  /**
   * Callback fired when new message is sent
   * @default null
   */
  onNewMessageSent?: (msg: any, isSingle?: boolean) => void;
  /**
   * Callback fired when new message section is closed
   * @default null
   */
  onNewMessageClose?: (dispatch: any) => void;
  /**
   * Callback fired when a single message section is open
   * @default null
   */
  onSingleMessageOpen?: (open: boolean) => void;
  /**
   * Any other properties
   */
  [p: string]: any;
}
/**
 * > API documentation for the Community-JS PrivateMessage Thread component. Learn about the available props and the CSS API.
 *
 *
 * This component renders the conversation between two users.
 * Take a look at our <strong>demo</strong> component [here](/docs/sdk/community-js/react-ui/Components/Thread)

 #### Import

 ```jsx
 import {PrivateMessageThread} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCPrivateMessageThread` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCPrivateMessageThread-root|Styles applied to the root element.|
 |subHeader|.SCPrivateMessageThread-subheader|Styles applied to thread list subheader element.|
 |section|.SCPrivateMessageThread-section|Styles applied to the list section|
 |emptyMessage|.SCPrivateMessageThread-empty-message|Styles applied to the empty message element.|
 |newMessageHeader|.SCPrivateMessageThread-new-message-header|Styles applied to the new message header section.|
 |newMessageHeaderContent|.SCPrivateMessageThread-new-message-header-content|Styles applied to the new message header content.|
 |newMessageHeaderIcon|.SCPrivateMessageThread-new-message-header-icon|Styles applied to the new message header icon element.|
 |newMessageContent|.SCPrivateMessageThread-new-message-content|Styles applied to the new message content.|
 |sender|.SCPrivateMessageThread-sender|Styles applied to the sender element.|
 |receiver|.SCPrivateMessageThread-receiver|Styles applied to the receiver element.|
 |autocomplete|.SCPrivateMessageThread-autocomplete|Styles applied to autocomplete element.|
 |autocompleteDialog|.SCPrivateMessageThread-autocomplete-dialog|Styles applied to autocomplete dialog element.|
 |editor|.SCPrivateMessageThread-editor|Styles applied to the editor element.|

 * @param inProps
 */
export default function PrivateMessageThread(inProps: PrivateMessageThreadProps): JSX.Element {
  // PROPS
  const props: PrivateMessageThreadProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {userObj, openNewMessage = false, onNewMessageClose = null, onNewMessageSent = null, onSingleMessageOpen = null, className, ...rest} = props;

  // CONTEXT
  const scUserContext: SCUserContextType = useContext(SCUserContext);
  const role = UserUtils.getUserRole(scUserContext['user']);
  const scPreferencesContext: SCPreferencesContextType = useSCPreferences();
  const followEnabled = useMemo(
    () =>
      SCPreferences.CONFIGURATIONS_FOLLOW_ENABLED in scPreferencesContext.preferences &&
      scPreferencesContext.preferences[SCPreferences.CONFIGURATIONS_FOLLOW_ENABLED].value,
    [scPreferencesContext.preferences]
  );
  const manager: SCFollowersManagerType | SCConnectionsManagerType = followEnabled
    ? scUserContext.managers.followers
    : scUserContext.managers.connections;
  function checkFollowerOrConnection(user) {
    if ('isFollower' in manager) {
      return manager.isFollower(user);
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    return manager.status(user);
  }

  // STATE
  const [value, setValue] = useState<string>('');
  const [previous, setPrevious] = useState<string>(null);
  const [messageObjs, setMessageObjs] = useState([]);
  const [loadingMessageObjs, setLoadingMessageObjs] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState({});
  const [followers, setFollowers] = useState<any[]>([]);
  const [isFollower, setIsFollower] = useState<boolean>(false);
  const isNew = userObj && userObj === SCPrivateMessageStatusType.NEW;
  const authUserId = scUserContext.user ? scUserContext.user.id : null;
  const [singleMessageUser, setSingleMessageUser] = useState(null);
  const [receiver, setReceiver] = useState(null);
  const [deletingMsg, setDeletingMsg] = useState(null);
  const [singleMessageThread, setSingleMessageThread] = useState<boolean>(false);
  const [openDeleteMessageDialog, setOpenDeleteMessageDialog] = useState<boolean>(false);
  const [recipients, setRecipients] = useState<any>([]);
  const {enqueueSnackbar, closeSnackbar} = useSnackbar();
  const isNumber = typeof userObj === 'number';
  const messageReceiver = (item, loggedUserId) => {
    return item?.receiver?.id !== loggedUserId ? item?.receiver?.id : item?.sender?.id;
  };
  const [error, setError] = useState<boolean>(false);
  // REFS
  const refreshSubscription = useRef(null);
  // INTL
  const intl = useIntl();
  // HOOKS
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  const {scUser} = useSCFetchUser({id: isNumber ? userObj : null, userObj});

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({block: 'end', behavior: 'instant'});
  };
  // UTILS
  const format = (item) =>
    intl.formatDate(item.created_at, {
      year: 'numeric',
      day: 'numeric',
      month: 'long'
    });

  // CONST
  const formattedMessages = useMemo(() => {
    const _messages = [...messageObjs];
    return groupBy(_messages, format);
  }, [messageObjs]);

  // HANDLERS
  const handleMouseEnter = (index) => {
    setIsHovered((prevState) => {
      return {...prevState, [index]: true};
    });
  };

  const handleMouseLeave = (index) => {
    setIsHovered((prevState) => {
      return {...prevState, [index]: false};
    });
  };

  /**
   * Handles delete message dialog opening
   * @param msg
   */
  const handleOpenDeleteMessageDialog = (msg) => {
    setOpenDeleteMessageDialog(true);
    setDeletingMsg(msg);
  };
  /**
   * Handles delete message dialog close
   */
  const handleCloseDeleteMessageDialog = () => {
    setOpenDeleteMessageDialog(false);
  };

  /**
   * Memoized message recipients ids
   */
  const ids = useMemo(() => {
    if (recipients && openNewMessage) {
      return recipients.map((u) => {
        return parseInt(u.id, 10);
      });
    }
    return [recipients];
  }, [recipients]);

  function fetchResults() {
    setLoading(true);
    PrivateMessageService.searchUser(value)
      .then((data) => {
        setLoading(false);
        setFollowers(data.results.filter((user) => user.id !== authUserId));
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  }

  const handleInputChange = (event, value, reason) => {
    switch (reason) {
      case 'input':
        setValue(value);
        !value && setFollowers([]);
        break;
      case 'reset':
        setValue(value);
        break;
    }
  };

  const handleChange = (event, value, reason) => {
    event.preventDefault();
    event.stopPropagation();
    switch (reason) {
      case 'selectOption':
        handleClear(event);
        setRecipients(value);
        break;
      case 'removeOption':
        handleClear(event, value);
        break;
    }
    return false;
  };

  const handleClear = (event?, value?) => {
    setValue('');
    setFollowers([]);
    setRecipients(value ?? []);
  };

  const handleNewMessageClose = () => {
    handleClear();
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    onNewMessageClose && onNewMessageClose();
  };

  function updateAndDeleteURLParameters(url, paramToUpdate, newValue, paramToDelete) {
    const urlObj = new URL(url);
    urlObj.searchParams.set(paramToUpdate, newValue);
    urlObj.searchParams.delete(paramToDelete);
    return urlObj.toString();
  }

  const handlePrevious = useMemo(
    () => () => {
      if (!previous) {
        return;
      }
      return http
        .request({
          url: previous,
          method: Endpoints.GetAThread.method
        })
        .then((res: HttpResponse<any>) => {
          const _prev = [...messageObjs];
          _prev.unshift(...res.data.results);
          setMessageObjs(_prev);
          setPrevious(res.data.next && updateAndDeleteURLParameters(res.data.next, 'before_message', res.data.results[0].id, 'offset'));
        })
        .catch((error) => console.log(error));
    },
    [previous, messageObjs]
  );

  /**
   * Fetches thread
   */
  function fetchThread() {
    if (userObj && typeof userObj !== 'string') {
      const _isFollower = (scUser && checkFollowerOrConnection(scUser)) || (scUser && scUser.community_badge);
      const _userObjId = isNumber ? userObj : messageReceiver(userObj, authUserId);
      PrivateMessageService.getAThread({user: _userObjId, limit: 10})
        .then((res: SCPaginatedResponse<SCPrivateMessageThreadType>) => {
          setMessageObjs(res.results);
          setPrevious(res.next && updateAndDeleteURLParameters(res.next, 'before_message', res.results[0].id, 'offset'));
          if (res.results.length) {
            if (res.results[0].receiver.id !== authUserId) {
              setReceiver(res.results[0].receiver);
            } else {
              setReceiver(res.results[0].sender);
            }
            setSingleMessageThread(false);
          } else {
            if (role || _isFollower) {
              setSingleMessageThread(true);
              setRecipients(_userObjId);
              onSingleMessageOpen(true);
              setSingleMessageUser(scUser);
            } else {
              setSingleMessageThread(false);
            }
          }
          setLoadingMessageObjs(false);
        })
        .catch((error) => {
          setLoadingMessageObjs(false);
          console.log(error);
          Logger.error(SCOPE_SC_UI, {error});
        });
    }
  }

  const isNewerThan60Seconds = (creationTime) => {
    const date = new Date(creationTime);
    const now = new Date();
    return now.getTime() - date.getTime() < 60000;
  };

  function updateMessageAfterDeletion(id: number) {
    const newMessageObjects = [...messageObjs];
    const index = newMessageObjects.findIndex((s) => s.id === id);
    if (index !== -1) {
      newMessageObjects[index].message = `${intl.formatMessage(translMessages.messageDeleted)}`;
      newMessageObjects[index].file = null;
      newMessageObjects[index].status = SCPrivateMessageStatusType.HIDDEN;
      setMessageObjs(newMessageObjects);
    }
  }

  /**
   * Handles the deletion of a single message
   */
  function handleDeleteMessage() {
    const toHide = isNewerThan60Seconds(deletingMsg.created_at);
    PrivateMessageService.deleteAMessage(deletingMsg.id)
      .then(() => {
        const result = messageObjs.filter((m) => m.id !== deletingMsg.id);
        toHide ? setMessageObjs(result) : updateMessageAfterDeletion(deletingMsg.id);
        handleSnippetsUpdate(
          (result.length >= 1 && toHide) || (!toHide && deletingMsg.id !== messageObjs.slice(-1)[0].id) ? result.slice(-1) : [deletingMsg]
        );
        handleCloseDeleteMessageDialog();
      })
      .catch((error) => {
        console.log(error);
        let _snackBar = enqueueSnackbar(
          <FormattedMessage id="ui.privateMessage.thread.error.delete.msg" defaultMessage="ui.privateMessage.thread.error.delete.msg" />,
          {
            variant: 'error',
            SnackbarProps: {
              onClick: () => {
                closeSnackbar(_snackBar);
              }
            }
          }
        );
      });
  }

  /**
   * Updates snippets list when a new message(or more) are sent or another one is deleted
   * @param message, it can be a single object or an array of objects
   */
  function handleSnippetsUpdate(message: any) {
    PubSub.publish('snippetsChannel', message);
  }

  /**
   * Handles message sending
   * @param message
   * @param file
   */
  function handleSend(message: string, file: string) {
    if (UserUtils.isBlocked(scUserContext.user)) {
      enqueueSnackbar(<FormattedMessage id="ui.common.userBlocked" defaultMessage="ui.common.userBlocked" />, {
        variant: 'warning',
        autoHideDuration: 3000
      });
    } else {
      http
        .request({
          url: Endpoints.SendMessage.url(),
          method: Endpoints.SendMessage.method,
          data: {
            recipients: openNewMessage || isNew || singleMessageThread ? ids : [isNumber && userObj ? userObj : messageReceiver(userObj, authUserId)],
            message: message,
            file_uuid: file && !message ? file : null
          }
        })
        .then((res: any) => {
          const isOne = res.data.length <= 1;
          isOne && setMessageObjs((prev) => [...prev, res.data[0]]);
          handleSnippetsUpdate(res.data);
          if (openNewMessage || singleMessageThread) {
            setSingleMessageThread(false);
            onSingleMessageOpen(false);
            setRecipients([]);
            onNewMessageSent(res.data[0], isOne);
          }
          scrollToBottom();
        })
        .catch((error) => {
          console.log(error);
          setError(true);
        });
    }
  }

  // EFFECTS

  /**
   * If a value is entered in new message field, it fetches user followers
   */
  useEffect(() => {
    if (value) {
      fetchResults();
    }
  }, [value]);

  /**
   * Checks is thread receiver is a user follower
   */
  useEffect(() => {
    if (receiver) {
      !receiver.community_badge && scUser ? setIsFollower(checkFollowerOrConnection(scUser)) : setIsFollower(true);
    }
  });

  /**
   * On mount, if obj, fetches thread
   */
  useEffect(() => {
    if (!authUserId) {
      return;
    }
    userObj && fetchThread();
  }, [userObj, authUserId, scUser]);

  /**
   * Notification subscriber
   */
  const subscriber = (msg, data) => {
    const res = data.data;
    const newMessages = [...messageObjs];
    const index = newMessages.findIndex((m) => m.thread_id === res.thread_id);
    const _message = res.notification_obj.message;
    _message.receiver = res.notification_obj.snippet.receiver;
    _message.thread_status = res.notification_obj.snippet.thread_status;
    handleSnippetsUpdate([_message]);
    if (index !== -1) {
      setMessageObjs((prev) => [...prev, res.notification_obj.message]);
    }
    if (isNumber ? userObj === res.thread_id : userObj.id === res.thread_id) {
      scrollToBottom();
    }
  };
  /**
   * When a ws notification arrives, updates thread and snippets data
   */
  useEffect(() => {
    refreshSubscription.current = PubSub.subscribe(
      `${SCNotificationTopicType.INTERACTION}.${SCNotificationTypologyType.PRIVATE_MESSAGE}`,
      subscriber
    );
    return () => {
      PubSub.unsubscribe(refreshSubscription.current);
    };
  }, [messageObjs]);

  /**
   * Renders thread component
   * @return {JSX.Element}
   */
  function renderThread() {
    if (loadingMessageObjs) {
      return <PrivateMessageThreadSkeleton />;
    }
    return (
      <CardContent>
        <InfiniteScroll
          height={'100%'}
          dataLength={messageObjs.length}
          previous={handlePrevious}
          inverse={true}
          hasMorePrevious={Boolean(previous)}
          loaderPrevious={<PrivateMessageThreadItemSkeleton />}>
          <List ref={messagesEndRef}>
            {Object.keys(formattedMessages).map((key) => (
              <li key={key} className={classes.section}>
                <ul>
                  <ListSubheader>
                    <Typography align="center" className={classes.subHeader}>
                      {key}
                    </Typography>
                  </ListSubheader>
                  {formattedMessages[key].map((msg: SCPrivateMessageThreadType) => (
                    <PrivateMessageThreadItem
                      className={authUserId === msg.sender.id ? classes.sender : classes.receiver}
                      message={msg}
                      key={msg.id}
                      mouseEvents={{
                        onMouseEnter: () => handleMouseEnter(msg.id),
                        onMouseLeave: () => handleMouseLeave(msg.id)
                      }}
                      isHovering={isHovered[msg.id]}
                      showMenuIcon={authUserId === msg.sender.id}
                      onMenuIconClick={() => handleOpenDeleteMessageDialog(msg)}
                    />
                  ))}
                </ul>
              </li>
            ))}
          </List>
        </InfiniteScroll>
        <PrivateMessageEditor
          className={classes.editor}
          send={handleSend}
          autoHide={!isFollower && !role}
          autoHideDeletion={receiver?.deleted || scUser?.deleted}
          onThreadChangeId={isNumber ? userObj : userObj.receiver.id}
          error={error}
          onErrorRemove={() => setError(false)}
        />
        {openDeleteMessageDialog && (
          <ConfirmDialog
            open={openDeleteMessageDialog}
            title={
              <FormattedMessage
                id="ui.privateMessage.component.delete.message.dialog.msg"
                defaultMessage="ui.privateMessage.component.delete.message.dialog.msg"
              />
            }
            btnConfirm={
              <FormattedMessage
                id="ui.privateMessage.component.delete.message.dialog.confirm"
                defaultMessage="ui.privateMessage.component.delete.message.dialog.confirm"
              />
            }
            onConfirm={handleDeleteMessage}
            onClose={handleCloseDeleteMessageDialog}
          />
        )}
      </CardContent>
    );
  }

  /**
   * Renders empty box (when there is no thread open) or new message box
   * @return {JSX.Element}
   */
  function renderNewOrNoMessageBox() {
    return (
      <CardContent>
        {isNew || singleMessageThread ? (
          <>
            <Box className={classes.newMessageHeader}>
              <Box className={classes.newMessageHeaderContent}>
                <Icon className={classes.newMessageHeaderIcon}>person</Icon>
                <Typography>
                  <FormattedMessage defaultMessage="ui.privateMessage.thread.newMessage.to" id="ui.privateMessage.thread.newMessage.to" />
                </Typography>
                <Autocomplete
                  className={classes.autocomplete}
                  loading={loading}
                  multiple={!singleMessageThread}
                  limitTags={3}
                  freeSolo
                  disableClearable
                  options={followers}
                  onChange={handleChange}
                  onInputChange={handleInputChange}
                  inputValue={value}
                  value={singleMessageThread ? singleMessageUser : recipients}
                  getOptionLabel={(option) => (option ? option.username : '...')}
                  isOptionEqualToValue={(option, value) => (option ? value.id === option.id : false)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder={singleMessageThread ? '...' : `${intl.formatMessage(translMessages.placeholder)}`}
                      variant="standard"
                      InputProps={{
                        ...params.InputProps,
                        disableUnderline: true
                      }}
                    />
                  )}
                  classes={{popper: classes.autocompleteDialog}}
                  disabled={Boolean(singleMessageUser)}
                />
              </Box>
              <IconButton size="small" onClick={handleNewMessageClose}>
                <Icon fontSize="small">close</Icon>
              </IconButton>
            </Box>
            <List className={classes.newMessageContent}></List>
            <PrivateMessageEditor
              className={classes.editor}
              send={handleSend}
              autoHide={!followers}
              error={error}
              onErrorRemove={() => setError(false)}
            />
          </>
        ) : (
          <Typography className={classes.emptyMessage}>
            <FormattedMessage id="ui.privateMessage.thread.emptyBox.message" defaultMessage="ui.privateMessage.thread.emptyBox.message" />
          </Typography>
        )}
      </CardContent>
    );
  }

  // Anonymous
  if (!authUserId) {
    return null;
  }
  /**
   * Renders the component
   */
  return (
    <Root {...rest} className={classNames(classes.root, className)}>
      {userObj !== null && !isNew && !singleMessageThread ? renderThread() : renderNewOrNoMessageBox()}
    </Root>
  );
}
