import React, {useEffect, useRef, useState} from 'react';
import {styled} from '@mui/material/styles';
import {Alert, Box, Fade, IconButton, Popover, Stack, SwipeableDrawer, TextField, useMediaQuery, useTheme} from '@mui/material';
import Icon from '@mui/material/Icon';
import classNames from 'classnames';
import MessageMediaUploader from './MessageMediaUploader';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import {useThemeProps} from '@mui/system';
import {SCPrivateMessageFileType} from '@selfcommunity/types';
import {SCThemeType} from '@selfcommunity/react-core';
import {EmojiClickData} from 'emoji-picker-react';
import EmojiPicker from '../../shared/EmojiPicker';

const messages = defineMessages({
  placeholder: {
    id: 'ui.privateMessage.editor.placeholder',
    defaultMessage: 'ui.privateMessage.editor.placeholder'
  }
});

const PREFIX = 'SCPrivateMessageEditor';

const classes = {
  root: `${PREFIX}-root`,
  messageInput: `${PREFIX}-message-input`,
  sendMediaSection: `${PREFIX}-send-media-section`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));

export interface PrivateMessageEditorProps {
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
   * Callback to send the message
   */
  send?: (message?: string, file?: SCPrivateMessageFileType) => void;
  /**
   * If there's an error
   * @default false
   */
  error?: boolean;
  /**
   * Callback fired when removing error
   * @default null
   */
  onErrorRemove?: () => void;
  /**
   * Any other properties
   */
  [p: string]: any;
}

/**
 *
 > API documentation for the Community-JS Private Message Editor component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {PrivateMessageEditor} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCPrivateMessageEditor` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCPrivateMessageEditor-root|Styles applied to the root element.|
 |messageInput|.SCPrivateMessageEditor-card|Styles applied to the message input element.|
 |sendMediaSection|.SCPrivateMessageEditor-send-media-section|Styles applied to the send media section.|

 * @param inProps
 */
export default function PrivateMessageEditor(inProps: PrivateMessageEditorProps): JSX.Element {
  // PROPS
  const props: PrivateMessageEditorProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {autoHide = null, className = null, send = null, onThreadChangeId, error = false, onErrorRemove = null, ...rest} = props;

  // STATE
  const theme = useTheme<SCThemeType>();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [message, setMessage] = useState<string>('');
  const [messageFile, setMessageFile] = useState(null);
  const [emojiAnchorEl, setEmojiAnchorEl] = useState<any>(false);
  const [openMediaSection, setOpenMediaSection] = useState(false);
  const [threadId, setThreadId] = useState<number>(null);

  // INTL
  const intl = useIntl();
  // REF
  const ref = useRef(null);

  // HANDLERS

  const handleMediaSectionClose = () => {
    setOpenMediaSection(false);
  };

  const handleMessageFile = (f) => {
    setMessageFile(f);
  };

  const handleMessageSend = () => {
    send(message, messageFile);
    setMessage('');
    setMessageFile(null);
    setOpenMediaSection(false);
  };

  const handleMessageInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  const handleOpenEmoji = (event: React.MouseEvent<HTMLElement>) => {
    setEmojiAnchorEl(event.currentTarget);
  };
  const handleCloseEmoji = (event: React.MouseEvent<HTMLElement>) => {
    setEmojiAnchorEl(null);
  };

  const handleEmojiClick = (emojiData: EmojiClickData, event: MouseEvent) => {
    const cursor = ref.current.selectionStart;
    const text = message.slice(0, cursor) + emojiData.emoji;
    setMessage(text);
  };

  useEffect(() => {
    setThreadId(onThreadChangeId);
    if (threadId !== onThreadChangeId) {
      setMessage('');
      setMessageFile(null);
      setOpenMediaSection(false);
    }
  }, [onThreadChangeId]);

  if (autoHide) {
    return (
      <Alert severity="info">
        <FormattedMessage id="ui.privateMessage.editor.disabled.msg" defaultMessage="ui.privateMessage.editor.disabled.msg" />
      </Alert>
    );
  } else if (error) {
    return (
      <Alert
        severity="error"
        action={
          <IconButton color="inherit" size="small" onClick={onErrorRemove}>
            <Icon>close</Icon>
          </IconButton>
        }>
        <FormattedMessage id="ui.privateMessage.editor.error.send.msg" defaultMessage="ui.privateMessage.editor.error.send.msg" />
      </Alert>
    );
  }

  function renderContent() {
    return (
      <>
        {openMediaSection && (
          <MessageMediaUploader open={openMediaSection} onClose={handleMediaSectionClose} forwardMessageFile={handleMessageFile} />
        )}
        <TextField
          size="small"
          variant="filled"
          disabled={Boolean(messageFile)}
          ref={ref}
          className={classes.messageInput}
          multiline
          placeholder={`${intl.formatMessage(messages.placeholder)}`}
          value={message}
          onChange={handleMessageInput}
          maxRows={2}
          InputProps={{
            disableUnderline: true,
            startAdornment: (
              <>
                <Stack>
                  <IconButton onClick={handleOpenEmoji}>
                    <Icon>sentiment_satisfied_alt</Icon>
                  </IconButton>
                  {isMobile ? (
                    <SwipeableDrawer
                      open={Boolean(emojiAnchorEl)}
                      onClose={handleCloseEmoji}
                      onOpen={handleOpenEmoji}
                      anchor="bottom"
                      disableSwipeToOpen>
                      <EmojiPicker onEmojiClick={handleEmojiClick} width="100%" />
                    </SwipeableDrawer>
                  ) : (
                    <Popover
                      open={Boolean(emojiAnchorEl)}
                      anchorEl={emojiAnchorEl}
                      onClose={handleCloseEmoji}
                      TransitionComponent={Fade}
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
                      <EmojiPicker onEmojiClick={handleEmojiClick} />
                    </Popover>
                  )}
                </Stack>
                <IconButton disabled={message !== ''} onClick={() => setOpenMediaSection(true)}>
                  <Icon>attach_file</Icon>
                </IconButton>
              </>
            ),
            endAdornment: (
              <IconButton disabled={!message && !messageFile} onClick={handleMessageSend}>
                <Icon>send</Icon>
              </IconButton>
            )
          }}
        />
      </>
    );
  }
  return (
    <Root {...rest} className={classNames(classes.root, className)}>
      {renderContent()}
    </Root>
  );
}
