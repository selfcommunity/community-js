import React, {RefObject, useContext, useEffect, useRef, useState} from 'react';
import {styled} from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import {CardHeader, Divider, Grid, IconButton, Box, TextField, Typography, InputAdornment, Stack, Popover} from '@mui/material';
import {Endpoints, http, SCLocaleContextType, SCUserContext, SCUserContextType, useSCLocale} from '@selfcommunity/core';
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

export default function PrivateMessageCard({
  autoHide = null,
  open = null,
  className = '',
  onClose = null,
  onRef = null,
  ...props
}: {
  autoHide?: boolean;
  open?: boolean;
  className?: string;
  onRef?: (ref: RefObject<TMUIRichTextEditorRef>) => void;
  onClose?: () => void;
}): JSX.Element {
  const scUserContext: SCUserContextType = useContext(SCUserContext);
  const scLocaleContext: SCLocaleContextType = useSCLocale();
  const language = scLocaleContext.locale;
  const [followers, setFollowers] = useState<any[]>([]);
  const [recipientId, setRecipientId] = useState<any[]>(null);
  const [message, setMessage] = useState<string>('');
  const [show, setShow] = useState(false);
  const [showBox, setShowBox] = useState(false);
  const [sending, setSending] = useState<boolean>(false);
  const selectRecipients = (event, recipient) => {
    if (recipient !== null) {
      const rId = recipient.id;
      setRecipientId(rId);
      setShowBox(true);
    }
  };
  const handleMessageInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
    setShow(true);
  };
  const ref = useRef(null);
  const [emojiAnchorEl, setEmojiAnchorEl] = React.useState<null | HTMLElement>(null);
  const handleToggleEmoji = (event: React.MouseEvent<HTMLElement>) => {
    setEmojiAnchorEl(emojiAnchorEl ? null : event.currentTarget);
  };
  const handleEmojiClick = (event, emojiObject) => {
    const cursor = ref.current.selectionStart;
    const text = message.slice(0, cursor) + emojiObject.emoji + message.slice(cursor);
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
          recipients: [recipientId],
          message: message
        }
      })
      .then(() => {
        setSending(false);
        setMessage('');
        setRecipientId(null);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    fetchFollowers();
    onRef && onRef(ref);
  }, []);

  if (!autoHide) {
    return (
      <Root {...props} className={className}>
        <React.Fragment>
          <CardHeader
            className={classes.header}
            action={
              <IconButton onClick={onClose}>
                <CloseIcon />
              </IconButton>
            }
            title={<FormattedMessage defaultMessage="ui.PrivateMessage.new" id="ui.PrivateMessage.new" />}
          />
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <b>To:</b>
              </Grid>
              <Grid item xs={8}>
                <Autocomplete
                  className={classes.input}
                  disableClearable
                  getOptionLabel={(option) => option.username}
                  options={followers}
                  renderInput={(params) => (
                    <TextField
                      variant="standard"
                      {...params}
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
