import React, {useContext, useEffect, useMemo, useState} from 'react';
import {styled} from '@mui/material/styles';
import Card from '@mui/material/Card';
import {Endpoints, http, SCPrivateMessageType, SCUserContext, SCUserContextType} from '@selfcommunity/core';
import {AxiosResponse} from 'axios';
import Message from '../Message';
import _ from 'lodash';
import {FormattedMessage, useIntl} from 'react-intl';
import {Box, Divider, Grid, ListSubheader, TextField, Typography} from '@mui/material';
import ConfirmDialog from '../../shared/ConfirmDialog/ConfirmDialog';
import MessageEditor from '../MessageEditor';
import CardContent from '@mui/material/CardContent';
import Autocomplete from '@mui/material/Autocomplete';

const PREFIX = 'SCThread';

const classes = {
  emptyBox: `${PREFIX}-emptyBox`,
  sender: `${PREFIX}-sender`,
  receiver: `${PREFIX}-receiver`,
  center: `${PREFIX}-center`
};

const Root = styled(Card, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  width: '500px',
  maxWidth: '500px',
  display: 'inline-block',
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
  [`& .${classes.sender}`]: {
    display: 'flex',
    justifyContent: 'flex-end',
    '& .SCMessage-messageBox': {
      backgroundColor: theme.palette.grey[400]
    }
  },
  [`& .${classes.receiver}`]: {
    display: 'flex',
    justifyContent: 'flex-start',
    '& .SCMessage-messageBox': {
      backgroundColor: theme.palette.grey['A200']
    },
    '& .SCMessage-messageTime': {
      display: 'flex',
      justifyContent: 'flex-start'
    }
  },
  [`& .${classes.center}`]: {
    display: 'flex',
    justifyContent: 'center'
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
}
export default function Thread(props: ThreadProps): JSX.Element {
  // PROPS
  const {id, receiverId, autoHide, className, openNewMessage, ...rest} = props;

  //CONTEXT
  const scUserContext: SCUserContextType = useContext(SCUserContext);

  // STATE
  const [loading, setLoading] = useState<boolean>(true);
  const [messages, setMessages] = useState<any[]>([]);
  const loggedUser = scUserContext['user'].id;
  const [isHovered, setIsHovered] = useState({});
  const [openDeleteMessageDialog, setOpenDeleteMessageDialog] = useState<boolean>(false);
  const [deletingMsg, setDeletingMsg] = useState(null);
  const [message, setMessage] = useState<string>('');
  const [sending, setSending] = useState<boolean>(false);
  const [followers, setFollowers] = useState<any[]>([]);
  const [recipients, setRecipients] = useState([]);

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
      });
  }

  function sendMessage() {
    setSending(true);
    http
      .request({
        url: Endpoints.SendMessage.url(),
        method: Endpoints.SendMessage.method,
        data: {
          recipients: openNewMessage ? ids : [receiverId],
          message: message
        }
      })
      .then((res) => {
        setMessages((prev) => [...prev, res.data]);
        setSending(false);
      })
      .catch((error) => {
        console.log(error);
      });
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
   * if openNewMessage is true, fetches user follwers too.
   */
  useEffect(() => {
    if (openNewMessage) {
      fetchFollowers();
    }
    fetchThread();
  }, [id, openNewMessage]);

  /**
   * Renders thread component
   * @return {JSX.Element}
   */
  function renderThread() {
    return (
      <React.Fragment>
        {openDeleteMessageDialog && (
          <ConfirmDialog
            open={openDeleteMessageDialog}
            title={<FormattedMessage id="ui.Message.dialog.msg" defaultMessage="ui.Message.dialog.msg" />}
            btnConfirm={<FormattedMessage id="ui.Message.dialog.confirm" defaultMessage="ui.Message.dialog.confirm" />}
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
        <MessageEditor send={() => sendMessage()} isSending={sending} getMessage={handleMessage} />
      </React.Fragment>
    );
  }

  /**
   * Renders empty box (when there is no thread open)
   * @return {JSX.Element}
   */
  function renderEmptyBox() {
    return (
      <Box className={classes.emptyBox}>
        {openNewMessage ? (
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <b>
                  <FormattedMessage defaultMessage="ui.NewMessage.to" id="ui.NewMessage.to" />
                </b>
              </Grid>
              <Grid item xs={8}>
                <Autocomplete
                  multiple
                  freeSolo
                  options={followers}
                  getOptionLabel={(option) => option.username}
                  renderInput={(params) => (
                    <TextField
                      {...params}
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
            <MessageEditor send={() => sendMessage()} isSending={sending} getMessage={handleMessage} />
          </CardContent>
        ) : (
          <Typography component="h3">
            <FormattedMessage id="ui.Thread.emptyBox.message" defaultMessage="ui.Thread.emptyBox.message" />
          </Typography>
        )}
      </Box>
    );
  }

  /**
   * Renders the component (if not hidden by autoHide prop)
   */
  if (!autoHide) {
    return (
      <Root {...rest} className={className}>
        {id ? renderThread() : renderEmptyBox()}
      </Root>
    );
  }
  return null;
}
