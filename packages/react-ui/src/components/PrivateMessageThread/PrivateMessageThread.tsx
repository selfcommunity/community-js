import React, {useContext, useEffect, useMemo, useState, useRef} from 'react';
import {styled} from '@mui/material/styles';
import Widget from '../Widget';
import {http, Endpoints, HttpResponse, PrivateMessageService, UserService} from '@selfcommunity/api-services';
import {
  SCFollowersManagerType,
  SCPreferences,
  SCPreferencesContext,
  SCPreferencesContextType,
  SCThemeType,
  SCUserContext,
  SCUserContextType,
  UserUtils
} from '@selfcommunity/react-core';
import {SCMessageFileType, SCNotificationTopicType, SCNotificationTypologyType, SCPrivateMessageThreadType} from '@selfcommunity/types';
import PrivateMessageThreadItem from '../PrivateMessageThreadItem';
import _ from 'lodash';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import {Box, CardContent, IconButton, List, ListSubheader, TextField, Typography, useMediaQuery, useTheme} from '@mui/material';
import ConfirmDialog from '../../shared/ConfirmDialog/ConfirmDialog';
import PrivateMessageEditor from '../PrivateMessageEditor';
import Autocomplete from '@mui/material/Autocomplete';
import classNames from 'classnames';
import {useSnackbar} from 'notistack';
import PubSub from 'pubsub-js';
import {useThemeProps} from '@mui/system';
import Icon from '@mui/material/Icon';
import PrivateMessageThreadSkeleton from './Skeleton';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {Logger} from '@selfcommunity/utils';
import HiddenPlaceholder from '../../shared/HiddenPlaceholder';

const messages = defineMessages({
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
  autocomplete: `${PREFIX}-autocomplete`
};

const Root = styled(Widget, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}: any) => ({}));

export interface PrivateMessageThreadProps {
  threadObj?: SCPrivateMessageThreadType;
  /**
   * User object (thread receiver)
   * default null
   */
  userObj?: SCPrivateMessageThreadType | number;
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
   * Opens new message screen
   * @default false
   */
  openNewMessage?: boolean;
  /**
   * Functions called on thread actions
   */
  threadCallbacks?: {
    /**
     * Callback fired when a  message is sent
     * @param data
     * @default null
     */
    onMessageSentOrDeleted?: (data) => void;
    /**
     * Callback fired only when exiting a thread.
     * @default null
     */
    onMessageBack?: (dispatch: any) => void;
  };
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
 |autocomplete|.SCPrivateMessageThread-autocomplete|Styles applied to new message user insertion autocomplete.|

 * @param inProps
 */
export default function PrivateMessageThread(inProps: PrivateMessageThreadProps): JSX.Element {
  // PROPS
  const props: PrivateMessageThreadProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {threadObj, autoHide, className, openNewMessage, threadCallbacks, ...rest} = props;

  // CONTEXT
  const scUserContext: SCUserContextType = useContext(SCUserContext);
  const {enqueueSnackbar, closeSnackbar} = useSnackbar();
  const scPreferencesContext: SCPreferencesContextType = useContext(SCPreferencesContext);
  const followEnabled =
    SCPreferences.CONFIGURATIONS_FOLLOW_ENABLED in scPreferencesContext.preferences &&
    scPreferencesContext.preferences[SCPreferences.CONFIGURATIONS_FOLLOW_ENABLED].value;

  // STATE
  const theme = useTheme<SCThemeType>();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const scFollowersManager: SCFollowersManagerType = scUserContext.managers.followers;
  const [loading, setLoading] = useState<boolean>(true);
  const [messageObjs, setMessageObjs] = useState<any[]>([]);
  const [isHovered, setIsHovered] = useState({});
  const [openDeleteMessageDialog, setOpenDeleteMessageDialog] = useState<boolean>(false);
  const [deletingMsg, setDeletingMsg] = useState(null);
  const [followers, setFollowers] = useState<any[]>([]);
  const [recipients, setRecipients] = useState([]);
  const [isFollower, setIsFollower] = useState<boolean>(false);
  const [receiver, setReceiver] = useState(null);
  const [newMessageThread, setNewMessageThread] = useState<boolean>(false);

  // REFS
  const refreshSubscription = useRef(null);
  const authUserId = scUserContext.user ? scUserContext.user.id : null;

  // INTL
  const intl = useIntl();

  // UTILS
  const format = (item) =>
    intl.formatDate(item.created_at, {
      year: 'numeric',
      day: 'numeric',
      month: 'long'
    });

  // HANDLERS

  const formatMessages = (messageObjs) => {
    return _.groupBy(messageObjs, format);
  };

  const formattedMessages = useMemo(() => {
    return formatMessages(messageObjs);
  }, [messageObjs]);

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

  const handleCloseDeleteDialog = () => {
    setOpenDeleteMessageDialog(false);
  };

  const handleOpenDeleteDialog = (msg) => {
    setOpenDeleteMessageDialog(true);
    setDeletingMsg(msg);
  };

  const selectRecipients = (event, recipient) => {
    setRecipients(recipient);
  };
  /**
   * Memoized message recipients ids
   */
  const ids = useMemo(() => {
    if (recipients !== null && openNewMessage) {
      return recipients.map((u) => {
        return parseInt(u.id, 10);
      });
    }
    if (newMessageThread && !openNewMessage) {
      return recipients;
    }
  }, [recipients]);

  /**
   * Handles the deletion of a single message
   */
  function handleDelete() {
    PrivateMessageService.deleteAMessage(deletingMsg.id)
      .then(() => {
        const result = messageObjs.filter((m) => m.id !== deletingMsg.id);
        setMessageObjs(result);
        threadCallbacks.onMessageSentOrDeleted(result.length >= 1 ? result.slice(-1)[0] : deletingMsg);
        handleCloseDeleteDialog();
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
   * Sends a message
   * @param m
   * @param f
   */
  function sendMessage(m, f) {
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
            recipients: openNewMessage ? ids : [typeof threadObj === 'number' ? threadObj : threadObj.receiver.id],
            //recipients: openNewMessage ? ids : [typeof userObj === 'number' ? userObj : userObj.receiver.id],
            message: m,
            file_uuid: f && !m ? f : null
          }
        })
        .then((res) => {
          setMessageObjs((prev) => [...prev, res.data]);
          threadCallbacks.onMessageSentOrDeleted(res.data);
          if (openNewMessage || newMessageThread) {
            setNewMessageThread(false);
            setRecipients([]);
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
    let u;
    // if (typeof userObj === 'number') {
    //   u = userObj;
    // } else {
    //   u = userObj.receiver.id;
    // }
    if (typeof threadObj === 'number') {
      u = threadObj;
    } else {
      u = threadObj.receiver.id;
    }
    http
      .request({
        url: Endpoints.GetAThread.url(),
        method: Endpoints.GetAThread.method,
        params: {
          user: u
        }
      })
      .then((res: HttpResponse<any>) => {
        const data = res.data;
        setMessageObjs(data.results);
        if (data.results.length) {
          if (data.results[0].receiver.id !== scUserContext.user.id) {
            setReceiver(data.results[0].receiver);
          } else {
            setReceiver(data.results[0].sender);
          }
          setNewMessageThread(false);
        } else {
          setNewMessageThread(true);
          setRecipients(u);
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
        Logger.error(SCOPE_SC_UI, {error});
      });
  }

  /**
   * On mount, fetches thread
   * if openNewMessage is true, fetches user followers too.
   */
  useEffect(() => {
    threadObj && fetchThread();
    openNewMessage && fetchFollowers();
  }, [threadObj, openNewMessage, authUserId]);

  /**
   * Checks is thread receiver is a user follower
   */
  useEffect(() => {
    if (receiver) {
      setIsFollower(scFollowersManager.isFollower(receiver));
    }
  });

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
  }, [messageObjs]);

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
   * Renders thread component
   * @return {JSX.Element}
   */
  function renderThread() {
    return (
      <CardContent>
        <List subheader={<li />}>
          {Object.keys(formattedMessages).map((key, index) => (
            <li key={key} className={classes.section}>
              <ul>
                <ListSubheader>
                  <Typography align="center" className={classes.subHeader}>
                    {key}
                  </Typography>
                </ListSubheader>
                {formattedMessages[key].map((msg: SCPrivateMessageThreadType, index) => (
                  <PrivateMessageThreadItem
                    className={scUserContext['user'].id === msg.sender.id ? classes.sender : classes.receiver}
                    message={msg}
                    key={msg.id}
                    mouseEvents={{onMouseEnter: () => handleMouseEnter(msg.id), onMouseLeave: () => handleMouseLeave(msg.id)}}
                    isHovering={isHovered[msg.id]}
                    showMenuIcon={scUserContext['user'].id === msg.sender.id}
                    onMenuIconClick={() => handleOpenDeleteDialog(msg)}
                  />
                ))}
              </ul>
            </li>
          ))}
        </List>
        <PrivateMessageEditor send={(m: string, f: SCMessageFileType) => sendMessage(m, f)} autoHide={!isFollower} onThreadChangeId={threadObj} />
        {openDeleteMessageDialog && (
          <ConfirmDialog
            open={openDeleteMessageDialog}
            title={<FormattedMessage id="ui.privateMessage.thread.message.dialog.msg" defaultMessage="ui.privateMessage.thread.message.dialog.msg" />}
            btnConfirm={
              <FormattedMessage
                id="ui.privateMessage.thread.message.dialog.confirm"
                defaultMessage="ui.privateMessage.thread.message.dialog.confirm"
              />
            }
            onConfirm={() => handleDelete()}
            onClose={handleCloseDeleteDialog}
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
        {openNewMessage || newMessageThread ? (
          <>
            <Box className={classes.newMessageHeader}>
              <Box className={classes.newMessageHeaderContent}>
                <Icon className={classes.newMessageHeaderIcon}>person</Icon>
                <Typography>
                  <FormattedMessage defaultMessage="ui.privateMessage.thread.newMessage.to" id="ui.privateMessage.thread.newMessage.to" />
                </Typography>
                <Autocomplete
                  className={classes.autocomplete}
                  multiple={!newMessageThread}
                  limitTags={3}
                  freeSolo
                  options={followers}
                  value={newMessageThread ? threadObj : recipients}
                  getOptionLabel={(option) => (option ? option.username : '...')}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder={`${intl.formatMessage(messages.placeholder)}`}
                      variant="standard"
                      InputProps={{
                        ...params.InputProps,
                        disableUnderline: true
                      }}
                    />
                  )}
                  onChange={selectRecipients}
                  disabled={!followers}
                />
              </Box>
              <IconButton size="small" onClick={threadCallbacks.onMessageBack}>
                <Icon fontSize="small">close</Icon>
              </IconButton>
            </Box>
            <PrivateMessageEditor send={(m: string, f: SCMessageFileType) => sendMessage(m, f)} autoHide={!followers} />
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
  if (!scUserContext.user) {
    return <HiddenPlaceholder />;
  }
  if (loading && threadObj) {
    return <PrivateMessageThreadSkeleton />;
  }

  /**
   * Renders the component (if not hidden by autoHide prop)
   */
  if (!autoHide) {
    return (
      <Root {...rest} className={classNames(classes.root, className)}>
        {threadObj && !newMessageThread ? renderThread() : renderNewOrNoMessageBox()}
      </Root>
    );
  }
  return null;
}
