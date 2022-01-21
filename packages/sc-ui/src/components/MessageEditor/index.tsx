import React, {RefObject, useContext, useRef, useState} from 'react';
import {styled} from '@mui/material/styles';
import Card from '@mui/material/Card';
import {Box, IconButton, InputAdornment, Popover, Stack, TextField} from '@mui/material';
import {Endpoints, http, SCUserContext, SCUserContextType} from '@selfcommunity/core';
import SendIcon from '@mui/icons-material/Send';
import EmojiIcon from '@mui/icons-material/SentimentSatisfiedOutlined';
import Picker from 'emoji-picker-react';
import {TMUIRichTextEditorRef} from 'mui-rte';

const PREFIX = 'SCMessageEditor';

const classes = {
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
  [`& .${classes.messageBox}`]: {
    margin: '20px'
  },
  [`& .${classes.messageInput}`]: {
    '& .MuiOutlinedInput-root': {
      borderRadius: '20px'
    }
  }
}));

export interface MessageEditorProps {
  /**
   * The message receiver
   * @default null
   */
  recipient?: number;
  /**
   * Hides this component
   * @default false
   */
  autoHide?: boolean;
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
   * Any other properties
   */
  [p: string]: any;
}

export default function MessageEditor(props: MessageEditorProps): JSX.Element {
  // PROPS
  const {autoHide = null, className = null, onRef = null, recipient = null, ...rest} = props;

  // CONTEXT
  const scUserContext: SCUserContextType = useContext(SCUserContext);

  // STATE
  const [message, setMessage] = useState<string>('');
  const [show, setShow] = useState(false);
  const [sending, setSending] = useState<boolean>(false);
  const [emojiAnchorEl, setEmojiAnchorEl] = React.useState<null | HTMLElement>(null);

  // REF
  const ref = useRef(null);

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

  function sendMessage() {
    setSending(true);
    http
      .request({
        url: Endpoints.SendMessage.url(),
        method: Endpoints.SendMessage.method,
        data: {
          recipients: [recipient],
          message: message
        }
      })
      .then(() => {
        setSending(false);
        setMessage('');
      })
      .catch((error) => {
        console.log(error);
      });
  }

  if (!autoHide && recipient) {
    return (
      <Root {...rest} className={className}>
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
                  <IconButton disabled={sending || !recipient} onClick={() => sendMessage()}>
                    {show && <SendIcon />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        </Box>
      </Root>
    );
  }
  return null;
}
