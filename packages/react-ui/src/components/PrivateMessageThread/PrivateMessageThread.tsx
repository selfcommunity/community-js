import React, {useContext, useEffect, useMemo, useRef, useState} from 'react';
import {styled} from '@mui/material/styles';
import {Endpoints, http, HttpResponse, PrivateMessageService} from '@selfcommunity/api-services';
import {SCFollowersManagerType, SCUserContext, SCUserContextType, UserUtils, useSCFetchUser} from '@selfcommunity/react-core';
import {SCNotificationTopicType, SCNotificationTypologyType, SCPrivateMessageStatusType, SCPrivateMessageThreadType} from '@selfcommunity/types';
import PrivateMessageThreadItem from '../PrivateMessageThreadItem';
import PubSub from 'pubsub-js';
import _ from 'lodash';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import {Box, Card, CardContent, CardProps, IconButton, List, ListSubheader, TextField, Typography} from '@mui/material';
import PrivateMessageEditor from '../PrivateMessageEditor';
import Autocomplete from '@mui/material/Autocomplete';
import classNames from 'classnames';
import {useThemeProps} from '@mui/system';
import Icon from '@mui/material/Icon';
import PrivateMessageThreadSkeleton from './Skeleton';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {Logger} from '@selfcommunity/utils';
import HiddenPlaceholder from '../../shared/HiddenPlaceholder';
import {useSnackbar} from 'notistack';
import ConfirmDialog from '../../shared/ConfirmDialog/ConfirmDialog';

const translMessages = defineMessages({
  placeholder: {
    id: 'ui.privateMessage.thread.newMessage.autocomplete.placeholder',
    defaultMessage: 'ui.privateMessage.thread.newMessage.autocomplete.placeholder'
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
   * Hides this component
   * @default false
   */
  autoHide?: boolean;
  /**
   * Any other properties
   */
  [p: string]: any;
}
/**
 *
 > API documentation for the Community-JS PrivateMessage Thread component. Learn about the available props and the CSS API.

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
 |section|.SCPrivateMessageThread-section|Styles applied to the list section|
 |emptyMessage|.SCPrivateMessageThread-empty-message|Styles applied to the empty message element.|
 |newMessageHeader|.SCPrivateMessageThread-new-message-header|Styles applied to the new message header section.|
 |newMessageHeaderIcon|.SCPrivateMessageThread-new-message-header-icon|Styles applied to the new message header icon element.|
 |newMessageHeaderContent|.SCPrivateMessageThread-new-message-header-content|Styles applied to the new message header content.|
 |subHeader|.SCPrivateMessageThread-subheader|Styles applied to thread list subheader element.|
 |sender|.SCPrivateMessageThread-sender|Styles applied to the sender element.|
 |receiver|.SCPrivateMessageThread-receiver|Styles applied to the receiver element.|
 |autocomplete|.SCPrivateMessageThread-autocomplete|Styles applied to autocomplete element.|
 |autocompleteDialog|.SCPrivateMessageThread-autocomplete-dialog|Styles applied to autocomplete dialog element.|

 * @param inProps
 */
export default function PrivateMessageThread(inProps: PrivateMessageThreadProps): JSX.Element {
  // PROPS
  const props: PrivateMessageThreadProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {
    userObj,
    openNewMessage = false,
    onNewMessageClose = null,
    onNewMessageSent = null,
    onSingleMessageOpen = null,
    autoHide,
    className,
    ...rest
  } = props;

  // CONTEXT
  const scUserContext: SCUserContextType = useContext(SCUserContext);
  const role = UserUtils.getUserRole(scUserContext['user']);

  // STATE
  const scFollowersManager: SCFollowersManagerType = scUserContext.managers.followers;
  const [value, setValue] = useState<string>('');
  const [messageObjs, setMessageObjs] = useState<any[]>([]);
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
  const {scUser} = useSCFetchUser({id: userObj, userObj});

  // UTILS
  const format = (item) =>
    intl.formatDate(item.created_at, {
      year: 'numeric',
      day: 'numeric',
      month: 'long'
    });

  const formatMessages = (messages) => {
    return _.groupBy(messages, format);
  };

  // CONST
  const formattedMessages = useMemo(() => {
    return formatMessages(messageObjs);
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
        setFollowers(data.results);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  }
  useEffect(() => {
    if (value) {
      fetchResults();
    }
  }, [value]);

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
  /**
   * Fetches thread
   */
  function fetchThread() {
    const _isFollower = (scUser && scFollowersManager.isFollower(scUser)) || (scUser && scUser.community_badge);
    if (userObj && typeof userObj !== 'string') {
      const _userObjId = isNumber ? userObj : messageReceiver(userObj, authUserId);
      http
        .request({
          url: Endpoints.GetAThread.url(),
          method: Endpoints.GetAThread.method,
          params: {
            user: _userObjId
          }
        })
        .then((res: HttpResponse<any>) => {
          const data = res.data;
          setMessageObjs(data.results);
          if (data.results.length) {
            if (data.results[0].receiver.id !== authUserId) {
              setReceiver(data.results[0].receiver);
            } else {
              setReceiver(data.results[0].sender);
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
  /**
   * Handles the deletion of a single message
   */
  function handleDeleteMessage() {
    PrivateMessageService.deleteAMessage(deletingMsg.id)
      .then(() => {
        const result = messageObjs.filter((m) => m.id !== deletingMsg.id);
        setMessageObjs(result);
        handleSnippetsUpdate(result.length >= 1 ? result.slice(-1) : deletingMsg);
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
        })
        .catch((error) => {
          console.log(error);
          setError(true);
        });
    }
  }

  /**
   * Checks is thread receiver is a user follower
   */
  useEffect(() => {
    if (receiver) {
      !receiver.community_badge ? setIsFollower(scFollowersManager.isFollower(receiver)) : setIsFollower(true);
    }
  });

  /**
   * On mount, if obj, fetches thread
   */
  useEffect(() => {
    userObj && fetchThread();
  }, [userObj, authUserId, scUser]);

  /**
   * Notification subscriber
   */
  const subscriber = (msg, data) => {
    const res = data.data;
    const newMessages = [...messageObjs];
    const index = newMessages.findIndex((m) => m.sender.id === res.notification_obj.message.sender.id);
    if (index !== -1) {
      setMessageObjs((prev) => [...prev, res.notification_obj.message]);
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
        <List>
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
        <PrivateMessageEditor
          className={classes.editor}
          send={handleSend}
          autoHide={!isFollower && !role}
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
                  options={followers}
                  onChange={handleChange}
                  onInputChange={handleInputChange}
                  inputValue={value}
                  value={singleMessageUser ?? recipients}
                  getOptionLabel={(option) => (option ? option.username : '...')}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder={`${intl.formatMessage(translMessages.placeholder)}`}
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
            <List></List>
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
    return <HiddenPlaceholder />;
  }
  /**
   * Renders the component (if not hidden by autoHide prop)
   */
  if (!autoHide) {
    return (
      <Root {...rest} className={classNames(classes.root, className)}>
        {userObj !== null && !isNew && !singleMessageThread ? renderThread() : renderNewOrNoMessageBox()}
      </Root>
    );
  }
  return <HiddenPlaceholder />;
}
