import React, {RefObject, useContext, useRef, useState} from 'react';
import {styled} from '@mui/material/styles';
import Card from '@mui/material/Card';
import {IconButton, InputAdornment, Popover, Stack, TextField} from '@mui/material';
import {SCUserContext, SCUserContextType} from '@selfcommunity/core';
import Icon from '@mui/material/Icon';
import Picker from 'emoji-picker-react';
import {TMUIRichTextEditorRef} from 'mui-rte';
import classNames from 'classnames';

const PREFIX = 'SCMessageEditor';

const classes = {
  root: `${PREFIX}-root`,
  messageInput: `${PREFIX}-message-input`
};

const Root = styled(Card, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  width: '100%',
  display: 'inline-block',
  [`& .${classes.messageInput}`]: {
    width: '100%'
  }
}));

export interface MessageEditorProps {
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
  /**
   * Callback to send the message
   */
  send?: () => void;
  /**
   * Callback to pass message item
   * @param message
   */
  getMessage?: (message) => void;
}

/**
 *
 > API documentation for the Community-UI Message Editor component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {MessageEditor} from '@selfcommunity/ui';
 ```

 #### Component Name

 The name `SCMessageEditor` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCMessageEditor-root|Styles applied to the root element.|
 |messageInput|.SCMessageEditor-card|Styles applied to the message input element.|

 * @param props
 */
export default function MessageEditor(props: MessageEditorProps): JSX.Element {
  // PROPS
  const {autoHide = null, className = null, onRef = null, send = null, isSending = null, getMessage = null, ...rest} = props;

  // CONTEXT
  const scUserContext: SCUserContextType = useContext(SCUserContext);

  // STATE
  const [message, setMessage] = useState<string>('');
  const [show, setShow] = useState(false);
  const [emojiAnchorEl, setEmojiAnchorEl] = React.useState<null | HTMLElement>(null);

  // REF
  const ref = useRef(null);

  // HANDLERS
  const handleMessageSend = () => {
    send();
    setMessage('');
    setShow(false);
  };
  const handleMessageInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
    setShow(true);
    getMessage(event.target.value);
  };

  const handleToggleEmoji = (event: React.MouseEvent<HTMLElement>) => {
    setEmojiAnchorEl(emojiAnchorEl ? null : event.currentTarget);
  };
  const handleEmojiClick = (event, emojiObject) => {
    const cursor = ref.current.selectionStart;
    const text = message.slice(0, cursor) + emojiObject.emoji;
    setMessage(text);
    getMessage(text);
    setShow(true);
  };

  if (!autoHide) {
    return (
      <Root {...rest} className={classNames(classes.root, className)}>
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
                      <Icon>sentiment_satisfied_alt</Icon>
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
                <IconButton disabled={isSending} onClick={handleMessageSend}>
                  {show && <Icon>send</Icon>}
                </IconButton>
              </InputAdornment>
            )
          }}
        />
      </Root>
    );
  }
  return null;
}
