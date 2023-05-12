import React, {useEffect, useRef, useState} from 'react';
import {styled} from '@mui/material/styles';
import {Alert, Box, IconButton, TextField} from '@mui/material';
import Icon from '@mui/material/Icon';
import classNames from 'classnames';
import MessageMediaUploader from './MessageMediaUploader';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import {useThemeProps} from '@mui/system';
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
  uploadMediaSection: `${PREFIX}-upload-media-section`,
  emojiSection: `${PREFIX}-emoji-section`
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
  send?: (message?: string, file?: string) => void;
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
 |uploadMediaSection|.SCPrivateMessageEditor-upload-media-section|Styles applied to the upload media section.|
 |emojiSection|.SCPrivateMessageEditor-emoji-section|Styles applied to the emoji section.|

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
  const [message, setMessage] = useState<string>('');
  const [messageFiles, setMessageFiles] = useState([]);
  const [openMediaSection, setOpenMediaSection] = useState(false);
  const [openEmojiSection, setOpenEmojiSection] = useState(false);
  const [threadId, setThreadId] = useState<number>(null);
  const [uploading, setUploading] = useState(false);

  // INTL
  const intl = useIntl();
  // REF
  const ref = useRef(null);

  // HANDLERS

  const handleMediaSectionClose = () => {
    setOpenMediaSection(false);
  };

  const handleMessageFiles = (f) => {
    setMessageFiles(f);
  };

  const handleMessageSend = () => {
    if (messageFiles.length) {
      messageFiles.map((file) => {
        send(message, file.file_uuid);
      });
    } else {
      send(message, '');
    }
    setMessage('');
    setMessageFiles([]);
    setOpenMediaSection(false);
    setOpenEmojiSection(false);
  };

  const handleMessageInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
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
      setMessageFiles([]);
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
          <MessageMediaUploader
            className={classes.uploadMediaSection}
            open={openMediaSection}
            onClose={handleMediaSectionClose}
            forwardMessageFile={handleMessageFiles}
            isUploading={setUploading}
          />
        )}
        {openEmojiSection && <EmojiPicker className={classes.emojiSection} onEmojiClick={handleEmojiClick} width="100%" />}
        <TextField
          size="small"
          variant="filled"
          disabled={Boolean(messageFiles.length) || openMediaSection}
          ref={ref}
          className={classes.messageInput}
          multiline
          placeholder={`${intl.formatMessage(messages.placeholder)}`}
          value={message}
          onChange={handleMessageInput}
          maxRows={2}
          onSelect={() => setOpenEmojiSection(false)}
          InputProps={{
            disableUnderline: true,
            startAdornment: (
              <>
                <IconButton disabled={openMediaSection} onClick={() => setOpenEmojiSection(!openEmojiSection)}>
                  <Icon>sentiment_satisfied_alt</Icon>
                </IconButton>
                <IconButton disabled={message !== '' || openEmojiSection} onClick={() => setOpenMediaSection(true)}>
                  <Icon>attach_file</Icon>
                </IconButton>
              </>
            ),
            endAdornment: (
              <IconButton disabled={(!message && !messageFiles.length) || uploading} onClick={handleMessageSend}>
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
