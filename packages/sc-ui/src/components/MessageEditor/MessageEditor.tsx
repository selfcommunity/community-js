import React, {forwardRef, useContext, useRef, useState} from 'react';
import {styled} from '@mui/material/styles';
import {Box, Button, IconButton, InputAdornment, Popover, Stack, TextField} from '@mui/material';
import Icon from '@mui/material/Icon';
import Picker from 'emoji-picker-react';
import classNames from 'classnames';
import {SCContext, SCContextType} from '@selfcommunity/core';
import MessageMediaUploader from './MessageMediaUploader/index';
import {FormattedMessage} from 'react-intl';
import useThemeProps from '@mui/material/styles/useThemeProps';

const PREFIX = 'SCMessageEditor';

const classes = {
  root: `${PREFIX}-root`,
  messageInput: `${PREFIX}-message-input`,
  sendMediaSection: `${PREFIX}-send-media-section`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  width: '100%',
  display: 'inline-block',
  [`& .${classes.messageInput}`]: {
    width: '100%'
  },
  [`& .${classes.sendMediaSection}`]: {
    backgroundColor: theme.palette.grey['A200'],
    display: 'flex',
    justifyContent: 'center'
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
  /**
   * Callback to pass message file item
   * @param file
   */
  getMessageFile?: (file) => void;
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
 |sendMediaSection|.SCMessageEditor-send-media-section|Styles applied to the send media section.|

 * @param inProps
 */
export default function MessageEditor(inProps: MessageEditorProps): JSX.Element {
  // PROPS
  const props: MessageEditorProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {autoHide = null, className = null, send = null, isSending = null, getMessage = null, getMessageFile = null, ...rest} = props;

  // STATE
  const [message, setMessage] = useState<string>('');
  const [messageFile, setMessageFile] = useState(null);
  const [show, setShow] = useState(false);
  const [emojiAnchorEl, setEmojiAnchorEl] = React.useState<null | HTMLElement>(null);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [openMediaSection, setOpenMediaSection] = useState(false);

  // CONTEXT
  const scContext: SCContextType = useContext(SCContext);

  // REF
  const ref = useRef(null);

  // HANDLERS

  const handleMediaSectionClose = () => {
    setOpenMediaSection(false);
    setShow(false);
  };

  const handleMessageFile = (f) => {
    setMessageFile(f);
    getMessageFile(f);
  };

  const handleMessageSend = () => {
    send();
    setMessage('');
    setOpenMediaSection(false);
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
        {openMediaSection ? (
          <>
            <Box className={classes.sendMediaSection}>
              {show && (
                <Button disabled={!messageFile} onClick={handleMessageSend} variant="outlined">
                  <FormattedMessage id="ui.messageEditor.button.send" defaultMessage="ui.messageEditor.button.send" />
                </Button>
              )}
            </Box>
            <MessageMediaUploader
              open={openMediaSection}
              onClose={handleMediaSectionClose}
              forwardMessageFile={handleMessageFile}
              onFileUploaded={() => setShow(true)}
              onFileCleared={() => setShow(false)}
            />
          </>
        ) : (
          <>
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
                  <>
                    <InputAdornment position="end">
                      <IconButton onClick={() => setOpenMediaSection(true)}>
                        <Icon>attach_file</Icon>
                      </IconButton>
                    </InputAdornment>
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
                  </>
                )
              }}
            />
          </>
        )}
      </Root>
    );
  }
  return null;
}
