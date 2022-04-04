import React, {useContext, useEffect, useMemo, useState, useRef} from 'react';
import {styled} from '@mui/material/styles';
import Widget from '../Widget';
import {
  Endpoints,
  http,
  SCNotificationTopicType,
  SCNotificationTypologyType,
  SCPrivateMessageType,
  SCUserContext,
  SCUserContextType,
  UserUtils
} from '@selfcommunity/core';
import {AxiosResponse} from 'axios';
import Message from '../Message';
import _ from 'lodash';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import {Box, Grid, ListSubheader, TextField, Typography} from '@mui/material';
import ConfirmDialog from '../../shared/ConfirmDialog/ConfirmDialog';
import MessageEditor from '../MessageEditor';
import Autocomplete from '@mui/material/Autocomplete';
import classNames from 'classnames';
import {useSnackbar} from 'notistack';
import PubSub from 'pubsub-js';
import useThemeProps from '@mui/material/styles/useThemeProps';
import Icon from '@mui/material/Icon';

const smessages = defineMessages({
  placeholder: {
    id: 'ui.thread.newMessage.autocomplete.placeholder',
    defaultMessage: 'ui.thread.newMessage.autocomplete.placeholder'
  }
});

const PREFIX = 'SCThread';

const classes = {
  root: `${PREFIX}-root`,
  threadBox: `${PREFIX}-thread-box`,
  emptyBox: `${PREFIX}-empty-box`,
  newMessageBox: `${PREFIX}-new-message-box`,
  newMessageEditor: `${PREFIX}-new-message-editor`,
  newMessageEmptyBox: `${PREFIX}-new-message-empty-box`,
  newMessageHeader: `${PREFIX}-new-message-header`,
  sender: `${PREFIX}-sender`,
  receiver: `${PREFIX}-receiver`,
  center: `${PREFIX}-center`,
  autocomplete: `${PREFIX}-autocomplete`
};

const Root = styled(Widget, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  width: '600px',
  height: '100%',
  [`& .${classes.threadBox}`]: {
    display: 'inline-block',
    maxHeight: '600px',
    width: 'inherit',
    overflow: 'auto'
  },
  [`& .${classes.emptyBox}`]: {
    display: 'flex',
    height: '100%',
    background: theme.palette.grey['A200'],
    justifyContent: 'center',
    alignItems: 'center',
    '& .MuiTypography-root': {
      fontSize: '1.5rem'
    }
  },
  [`& .${classes.newMessageBox}`]: {
    display: 'flex',
    flexFlow: 'column',
    height: '100%'
  },
  [`& .${classes.newMessageEditor}`]: {
    flexGrow: 0,
    flexShrink: 1,
    flexBasis: '40px'
  },
  [`& .${classes.newMessageEmptyBox}`]: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 'auto'
  },
  [`& .${classes.sender}`]: {
    display: 'flex',
    justifyContent: 'flex-end',
    '& .SCMessage-message-box': {
      backgroundColor: theme.palette.grey[400]
    }
  },
  [`& .${classes.receiver}`]: {
    display: 'flex',
    justifyContent: 'flex-start',
    '& .SCMessage-message-box': {
      backgroundColor: theme.palette.grey['A200']
    },
    '& .SCMessage-message-time': {
      display: 'flex',
      justifyContent: 'flex-start'
    }
  },
  [`& .${classes.center}`]: {
    display: 'flex',
    justifyContent: 'center'
  },
  [`& .${classes.newMessageHeader}`]: {
    marginLeft: theme.spacing(1),
    marginTop: theme.spacing(1)
  },
  [`& .${classes.autocomplete}`]: {
    marginRight: theme.spacing(1)
  }
}));

export interface ThreadProps {
  /**
   * Thread id
   * @default null
   */
  id?: number;
  /**
   * Message receiver id
   * @default null
   */
  receiverId?: number;
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
   * Opens new message screen
   * @default false
   */
  openNewMessage?: boolean;
  /**
   * Callback fired when a new message is sent
   * @default null
   */
  onNewMessageSent?: (dispatch: any) => void;
  /**
   * Callback fired when a  message is sent
   * @param data
   * @default null
   */
  onMessageSent?: (data) => void;
  /**
   * Callback fired only when a new message is sent to update snippets component
   * @default null
   */
  shouldUpdate?: (dispatch: any) => void;
}
/**
 *
 > API documentation for the Community-UI Thread component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {Thread} from '@selfcommunity/ui';
 ```

 #### Component Name

 The name `SCThread` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCThread-root|Styles applied to the root element.|
 |emptyBox|.SCThread-empty-box|Styles applied to the empty box element.|
 |sender|.SCThread-sender|Styles applied to the sender element.|
 |receiver|.SCThread-receiver|Styles applied to the receiver element.|
 |center|.SCThread-center|Styles applied to the center section.|
 |threadBox|.SCThread-thread-box|Styles applied to the thread box element.|
 |emptyBox|.SCThread-empty-box|Styles applied to the empty box element.|
 |newMessageBox|.SCThread-new-message-box|Styles applied to the new message box element.|
 |newMessageEditor|.SCThread-new-message-editor|Styles applied to the new message editor.|
 |newMessageEmptyBox|.SCThread-new-message-empty-box|Styles applied to the new message empty box element.|
 |newMessageHeader|.SCThread-new-message-header|Styles applied to the new message header section.|
 |autocomplete|.SCThread-autocomplete|Styles applied to new message user insertion autocomplete.|

 * @param inProps
 */
export default function Thread(inProps: ThreadProps): JSX.Element {
  // PROPS
  const props: ThreadProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {id, receiverId, autoHide, className, openNewMessage, onNewMessageSent, onMessageSent, shouldUpdate, ...rest} = props;

  // CONTEXT
  const scUserContext: SCUserContextType = useContext(SCUserContext);
  const {enqueueSnackbar, closeSnackbar} = useSnackbar();

  // STATE
  const [loading, setLoading] = useState<boolean>(true);
  const [messages, setMessages] = useState<any[]>([]);
  const loggedUser = scUserContext.user && scUserContext.user.id;
  const [isHovered, setIsHovered] = useState({});
  const [openDeleteMessageDialog, setOpenDeleteMessageDialog] = useState<boolean>(false);
  const [deletingMsg, setDeletingMsg] = useState(null);
  const [message, setMessage] = useState<string>('');
  const [messageFile, setMessageFile] = useState(null);
  const [sending, setSending] = useState<boolean>(false);
  const [followers, setFollowers] = useState<any[]>([]);
  const [recipients, setRecipients] = useState([]);

  // REFS
  const refreshSubscription = useRef(null);

  // INTL
  const intl = useIntl();

  // UTILS
  const format = (item) =>
    intl.formatDate(item.created_at, {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });

  // HANDLERS

  const formatMessages = (messages) => {
    return _.groupBy(messages, format);
  };

  const formattedMessages = useMemo(() => {
    return formatMessages(messages);
  }, [messages]);

  const handleMessage = (m) => {
    setMessage(m);
  };

  const handleMessageFile = (f) => {
    setMessageFile(f);
  };

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

  const handleClose = () => {
    setOpenDeleteMessageDialog(false);
  };

  function handleDeleteDialog(msg) {
    setOpenDeleteMessageDialog(true);
    setDeletingMsg(msg);
  }

  const selectRecipients = (event, recipient) => {
    setRecipients(recipient);
  };

  const ids = useMemo(() => {
    if (recipients !== null) {
      return recipients.map((u) => {
        return parseInt(u.id, 10);
      });
    }
  }, [recipients]);

  /**
   * Handles deletion of a single message
   * @param id
   */
  function handleDelete() {
    http
      .request({
        url: Endpoints.DeleteASingleMessage.url({id: deletingMsg.id}),
        method: Endpoints.DeleteASingleMessage.method
      })
      .then(() => {
        const result = messages.filter((m) => m.id !== deletingMsg.id);
        setMessages(result);
        handleClose();
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

  function sendMessage() {
    if (UserUtils.isBlocked(scUserContext.user)) {
      enqueueSnackbar(<FormattedMessage id="ui.common.userBlocked" defaultMessage="ui.common.userBlocked" />, {
        variant: 'warning'
      });
    } else {
      http
        .request({
          url: Endpoints.SendMessage.url(),
          method: Endpoints.SendMessage.method,
          data: {
            recipients: openNewMessage ? ids : [receiverId],
            message: message,
            file_uuid: messageFile ?? null
          }
        })
        .then((res) => {
          setMessages((prev) => [...prev, res.data]);
          setSending(false);
          onMessageSent(res.data);
          shouldUpdate(false);
          if (openNewMessage) {
            onNewMessageSent(res.data);
            shouldUpdate(true);
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
   * Fetches user followers
   */
  function fetchFollowers() {
    http
      .request({
        url: Endpoints.UserFollowers.url({id: scUserContext['user'].id}),
        method: Endpoints.UserFollowers.method
      })
      .then((res: AxiosResponse<any>) => {
        const data = res.data;
        setFollowers(data.results);
      })
      .catch((error) => {
        console.log(error);
      });
  }

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
   * if openNewMessage is true, fetches user followers too.
   */
  useEffect(() => {
    if (openNewMessage) {
      fetchFollowers();
    }
    fetchThread();
  }, [id, openNewMessage]);

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
  }, [messages]);

  /**
   * Notification subscriber
   */
  const subscriber = (msg, data) => {
    const res = data.data;
    const newMessages = [...messages];
    const index = newMessages.findIndex((m) => m.sender_id === res.notification_obj.message.sender_id);
    if (index !== -1) {
      setMessages((prev) => [...prev, res.notification_obj.message]);
    }
  };

  /**
   * Renders thread component
   * @return {JSX.Element}
   */
  function renderThread() {
    return (
      <Box className={classes.threadBox}>
        {openDeleteMessageDialog && (
          <ConfirmDialog
            open={openDeleteMessageDialog}
            title={<FormattedMessage id="ui.thread.message.dialog.msg" defaultMessage="ui.thread.message.dialog.msg" />}
            btnConfirm={<FormattedMessage id="ui.thread.message.dialog.confirm" defaultMessage="ui.thread.message.dialog.confirm" />}
            onConfirm={() => handleDelete()}
            onClose={handleClose}
          />
        )}
        {Object.keys(formattedMessages).map((key, index) => (
          <div key={index}>
            <ListSubheader className={classes.center}>{key}</ListSubheader>
            {formattedMessages[key].map((msg: SCPrivateMessageType, index) => (
              <div key={index} className={loggedUser === msg.sender_id ? classes.sender : classes.receiver}>
                <Message
                  elevation={0}
                  message={msg}
                  key={msg.id}
                  snippetType={false}
                  loggedUser={loggedUser}
                  onMouseEnter={() => handleMouseEnter(msg.id)}
                  onMouseLeave={() => handleMouseLeave(msg.id)}
                  isHovering={isHovered[msg.id]}
                  onDeleteIconClick={() => handleDeleteDialog(msg)}
                />
              </div>
            ))}
          </div>
        ))}
        <MessageEditor send={() => sendMessage()} isSending={sending} getMessage={handleMessage} getMessageFile={handleMessageFile} />
      </Box>
    );
  }

  /**
   * Renders empty box (when there is no thread open) or new message box
   * @return {JSX.Element}
   */
  function renderNewOrNoMessageBox() {
    return (
      <React.Fragment>
        {openNewMessage ? (
          <Box className={classes.newMessageBox}>
            <Box sx={{flexGrow: 0, flexShrink: 1, flexBasis: 'auto'}}>
              <Grid container className={classes.newMessageHeader}>
                <Grid item xs={4} sx={{display: 'flex', alignItems: 'center'}}>
                  <Icon sx={{marginRight: '8px'}} fontSize="small">
                    person
                  </Icon>
                  <Typography sx={{fontWeight: 'bold'}}>
                    <FormattedMessage defaultMessage="ui.thread.newMessage.to" id="ui.thread.newMessage.to" />
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <Autocomplete
                    className={classes.autocomplete}
                    multiple
                    freeSolo
                    options={followers}
                    getOptionLabel={(option) => option.username}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder={`${intl.formatMessage(smessages.placeholder)}`}
                        variant="standard"
                        InputProps={{
                          ...params.InputProps,
                          disableUnderline: true
                        }}
                      />
                    )}
                    onChange={selectRecipients}
                  />
                </Grid>
              </Grid>
            </Box>
            <Box className={classes.newMessageEmptyBox} />
            <Box className={classes.newMessageEditor}>
              <MessageEditor send={() => sendMessage()} isSending={sending} getMessage={handleMessage} getMessageFile={handleMessageFile} />
            </Box>
          </Box>
        ) : (
          <Box className={classes.emptyBox}>
            <Typography component="h3">
              <FormattedMessage id="ui.thread.emptyBox.message" defaultMessage="ui.thread.emptyBox.message" />
            </Typography>
          </Box>
        )}
      </React.Fragment>
    );
  }

  // Anonymous
  if (!scUserContext.user) {
    return null;
  }

  /**
   * Renders the component (if not hidden by autoHide prop)
   */
  if (!autoHide) {
    return (
      <Root {...rest} className={classNames(classes.root, className)}>
        {id ? renderThread() : renderNewOrNoMessageBox()}
      </Root>
    );
  }
  return null;
}
