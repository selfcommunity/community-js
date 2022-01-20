import React, {RefObject, useContext, useEffect, useRef, useState} from 'react';
import {styled} from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import {CardHeader, Divider, Grid, IconButton, Box, TextField, InputAdornment, Stack, Popover} from '@mui/material';
import {Endpoints, http, SCUserContext, SCUserContextType} from '@selfcommunity/core';
import CloseIcon from '@mui/icons-material/Close';
import {FormattedMessage} from 'react-intl';
import Autocomplete from '@mui/material/Autocomplete';
import {AxiosResponse} from 'axios';
import SendIcon from '@mui/icons-material/Send';
import EmojiIcon from '@mui/icons-material/SentimentSatisfiedOutlined';
import Picker from 'emoji-picker-react';
import {TMUIRichTextEditorRef} from 'mui-rte';

const PREFIX = 'SCPrivateMessageCard';

const classes = {
  header: `${PREFIX}-card-header`,
  input: `${PREFIX}-input`,
  recipient: `${PREFIX}-recipient`,
  messageBox: `${PREFIX}-message-box`,
  messageInput: `${PREFIX}-message-input`
};

const Root = styled(Card, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  minWidth: '275px',
  display: 'inline-block',
  [`& .${classes.header}`]: {
    '& .MuiTypography-root ': {
      fontSize: '1.2rem'
    }
  },
  [`& .${classes.input}`]: {
    '& .MuiSvgIcon-root ': {
      display: 'none'
    }
  },
  [`& .${classes.recipient}`]: {
    // width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  [`& .${classes.messageBox}`]: {
    margin: '20px'
    // position: 'absolute',
    // bottom: '0px'
  },
  [`& .${classes.messageInput}`]: {
    '& .MuiOutlinedInput-root': {
      borderRadius: '20px'
    }
  }
}));

export interface NewMessageProps {
  /**
   * Hides this component
   * @default false
   */
  autoHide?: boolean;
  /**
   * Handles new message card opening
   * @default null
   */
  open?: boolean;
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
  /**
   * Handles emoji editor
   * @default null
   */
  onRef?: (ref: RefObject<TMUIRichTextEditorRef>) => void;
  /**
   * Callback to close new message card section
   * @default null
   */
  onClose?: () => void;
  /**
   * Any other properties
   */
  [p: string]: any;
}

export default function NewMessageCard(props: NewMessageProps): JSX.Element {
  // PROPS
  const {autoHide = null, open = null, className = null, onClose = null, onRef = null, ...rest} = props;

  // CONTEXT
  const scUserContext: SCUserContextType = useContext(SCUserContext);

  // STATE
  const [followers, setFollowers] = useState<any[]>([]);
  const [recipients, setRecipients] = useState([]);
  const [message, setMessage] = useState<string>('');
  const [show, setShow] = useState(false);
  const [showBox, setShowBox] = useState(false);
  const [sending, setSending] = useState<boolean>(false);
  const [emojiAnchorEl, setEmojiAnchorEl] = React.useState<null | HTMLElement>(null);

  // REF
  const ref = useRef(null);

  // HANDLERS
  const ids = recipients.map((u) => {
    return parseInt(u.id, 10);
  });

  const selectRecipients = (event, recipient) => {
    setRecipients(recipient);
    setShowBox(true);
  };

  const handleMessageInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
    setShow(true);
  };

  const handleToggleEmoji = (event: React.MouseEvent<HTMLElement>) => {
    setEmojiAnchorEl(emojiAnchorEl ? null : event.currentTarget);
  };
  const handleEmojiClick = (event, emojiObject) => {
    const cursor = ref.current.selectionStart;
    const text = message.slice(0, cursor) + emojiObject.emoji;
    setMessage(text);
  };

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

  function sendMessage() {
    setSending(true);
    http
      .request({
        url: Endpoints.SendMessage.url(),
        method: Endpoints.SendMessage.method,
        data: {
          recipients: ids,
          message: message
        }
      })
      .then(() => {
        setSending(false);
        setMessage('');
        onClose();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    fetchFollowers();
  }, []);

  if (!autoHide) {
    return (
      <Root {...rest} className={className}>
        <React.Fragment>
          <CardHeader
            className={classes.header}
            action={
              <IconButton onClick={onClose}>
                <CloseIcon />
              </IconButton>
            }
            title={<FormattedMessage defaultMessage="ui.NewMessage.new" id="ui.NewMessage.new" />}
          />
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
                  //className={classes.input}
                  options={followers}
                  getOptionLabel={(option) => option.username}
                  // defaultValue={recipients}
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
            <Divider />
            {showBox && (
              <Box className={classes.messageBox}>
                <TextField
                  size="small"
                  ref={ref}
                  className={classes.messageInput}
                  multiline
                  placeholder="Aa"
                  value={message}
                  onChange={handleMessageInput}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Stack>
                          <div>
                            <IconButton size="small" onClick={handleToggleEmoji}>
                              <EmojiIcon />
                            </IconButton>
                            <Popover
                              open={Boolean(emojiAnchorEl)}
                              anchorEl={emojiAnchorEl}
                              onClose={handleToggleEmoji}
                              anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right'
                              }}
                              transformOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left'
                              }}
                              sx={(theme) => {
                                return {zIndex: theme.zIndex.tooltip};
                              }}>
                              <Picker onEmojiClick={handleEmojiClick} />
                            </Popover>
                          </div>
                        </Stack>
                        <IconButton disabled={sending} onClick={() => sendMessage()}>
                          {show && <SendIcon />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </Box>
            )}
          </CardContent>
        </React.Fragment>
      </Root>
    );
  }
  return null;
}
