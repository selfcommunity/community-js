import React, {useContext, useEffect, useMemo, useRef, useState} from 'react';
import {styled} from '@mui/material/styles';
import Widget from '../Widget';
import {Endpoints, http, HttpResponse, PrivateMessageService, UserService} from '@selfcommunity/api-services';
import {
  SCFollowersManagerType,
  SCPreferences,
  SCPreferencesContext,
  SCPreferencesContextType,
  SCUserContext,
  SCUserContextType,
  UserUtils
} from '@selfcommunity/react-core';
import {
  SCNotificationTopicType,
  SCNotificationTypologyType,
  SCPrivateMessageFileType,
  SCPrivateMessageStatusType,
  SCPrivateMessageThreadType
} from '@selfcommunity/types';
import PrivateMessageThreadItem from '../PrivateMessageThreadItem';
import PubSub from 'pubsub-js';
import _ from 'lodash';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import {Box, CardContent, IconButton, List, ListSubheader, TextField, Typography} from '@mui/material';
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
  autocompleteDialog: `${PREFIX}-autocomplete-dialog`
};

const Root = styled(Widget, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));

export interface PrivateMessageThreadProps {
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
  onNewMessageSent?: (msg) => void;
  /**
   * Callback fired when new message section is closed
   * @default null
   */
  onNewMessageClose?: (dispatch: any) => void;
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
  const {userObj, openNewMessage = false, onNewMessageClose = null, onNewMessageSent = null, autoHide, className, ...rest} = props;

  // CONTEXT
  const scUserContext: SCUserContextType = useContext(SCUserContext);
  const role = UserUtils.getUserRole(scUserContext['user']);
  const scPreferencesContext: SCPreferencesContextType = useContext(SCPreferencesContext);
  const followEnabled =
    SCPreferences.CONFIGURATIONS_FOLLOW_ENABLED in scPreferencesContext.preferences &&
    scPreferencesContext.preferences[SCPreferences.CONFIGURATIONS_FOLLOW_ENABLED].value;

  // STATE
  const scFollowersManager: SCFollowersManagerType = scUserContext.managers.followers;
  const [messageObjs, setMessageObjs] = useState<any[]>([]);
  const [loadingMessageObjs, setLoadingMessageObjs] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);
  const [isHovered, setIsHovered] = useState({});
  const [followers, setFollowers] = useState<any[]>([]);
  const [isFollower, setIsFollower] = useState<boolean>(false);
  const isNew = userObj && userObj === SCPrivateMessageStatusType.NEW;
  const authUserId = scUserContext.user ? scUserContext.user.id : null;
  const [singleMessageUser, setSingleMessageUser] = useState('');
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
  // REFS
  const refreshSubscription = useRef(null);
  // INTL
  const intl = useIntl();

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
   * Handles autocomplete recipients selection
   * @param event
   * @param recipient
   */
  const handleRecipientSelect = (event, recipient) => {
    setRecipients(recipient);
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

  /**
   * Memoized fetchFollowers
   */
  const fetchFollowers = useMemo(
    () => () => {
      let fetch;
      if (followEnabled) {
        fetch = UserService.getUserFollowers(authUserId);
      } else {
        fetch = UserService.getUserConnections(authUserId);
      }
      return fetch
        .then((data: any) => {
          setFollowers(data.results);
          setLoading(false);
          const _user = data.results.find((o) => o.id === userObj);
          setSingleMessageUser(_user);
        })
        .catch((error) => {
          setLoading(false);
          console.log(error);
          Logger.error(SCOPE_SC_UI, {error});
        });
    },
    []
  );

  /**
   * Fetches thread
   */
  function fetchThread() {
    setLoadingMessageObjs(false);
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
            setSingleMessageThread(true);
            setRecipients(_userObjId);
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
        let _snackBar = enqueueSnackbar(<FormattedMessage id="ui.common.error" defaultMessage="ui.common.error" />, {
          variant: 'error',
          onClick: () => {
            closeSnackbar(_snackBar);
          }
        });
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
  function handleSend(message: string, file: SCPrivateMessageFileType) {
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
          const single = res.data.length <= 1;
          single && setMessageObjs((prev) => [...prev, res.data[0]]);
          handleSnippetsUpdate(res.data);
          if (openNewMessage || singleMessageThread) {
            setSingleMessageThread(false);
            setRecipients([]);
            onNewMessageSent(res.data[0]);
          }
        })
        .catch((error) => {
          console.log(error);
          let _snackBar = enqueueSnackbar(<FormattedMessage id="ui.common.error.messageError" defaultMessage="ui.common.error.messageError" />, {
            variant: 'error',
            onClick: () => {
              closeSnackbar(_snackBar);
            }
          });
        });
    }
  }

  /**
   * Fetches followers when a new message is selected
   */
  useEffect(() => {
    if (isNew || singleMessageThread) {
      fetchFollowers();
    }
  }, [isNew, singleMessageThread, authUserId]);

  /**
   * Checks is thread receiver is a user follower
   */
  useEffect(() => {
    if (receiver) {
      setIsFollower(scFollowersManager.isFollower(receiver));
    }
  });

  /**
   * On mount, if obj, fetches thread
   */
  useEffect(() => {
    userObj && fetchThread();
  }, [userObj, authUserId]);

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
        <List subheader={<li />}>
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
        <PrivateMessageEditor send={handleSend} autoHide={!isFollower && !role} onThreadChangeId={isNumber ? userObj : userObj.receiver.id} />
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
                  onChange={handleRecipientSelect}
                  disabled={!followers}
                />
              </Box>
              <IconButton size="small" onClick={onNewMessageClose}>
                <Icon fontSize="small">close</Icon>
              </IconButton>
            </Box>
            <PrivateMessageEditor send={handleSend} autoHide={!followers} />
          </>
        ) : (
          <Typography component="span" className={classes.emptyMessage}>
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
