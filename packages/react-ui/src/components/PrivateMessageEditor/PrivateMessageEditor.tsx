import React, {useEffect, useMemo, useRef, useState} from 'react';
import {styled} from '@mui/material/styles';
import {Alert, Box, IconButton, TextField} from '@mui/material';
import Icon from '@mui/material/Icon';
import classNames from 'classnames';
import MessageMediaUploader from './MessageMediaUploader';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import {useThemeProps} from '@mui/system';
import {EmojiClickData} from 'emoji-picker-react';
import EmojiPicker from '../../shared/EmojiPicker';
import {iOS} from '@selfcommunity/utils';
import {PREFIX} from './constants';

const messages = defineMessages({
  placeholder: {
    id: 'ui.privateMessage.editor.placeholder',
    defaultMessage: 'ui.privateMessage.editor.placeholder'
  }
});

const classes = {
  root: `${PREFIX}-root`,
  ios: `${PREFIX}-ios`,
  messageInput: `${PREFIX}-message-input`,
  mediaUploader: `${PREFIX}-media-uploader`,
  emojiSection: `${PREFIX}-emoji-section`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root'
})(() => ({}));

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
 * > API documentation for the Community-JS Private Message Editor component. Learn about the available props and the CSS API.

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
 |mediaUploader|.SCPrivateMessageEditor-media-uploader|Styles applied to the message media uploader section.|
 |emojiSection|.SCPrivateMessageEditor-emoji-section|Styles applied to the emoji section.|

 * @param inProps
 */
export default function PrivateMessageEditor(inProps: PrivateMessageEditorProps): JSX.Element {
  // PROPS
  const props: PrivateMessageEditorProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {autoHide = null, className = null, send = null, onThreadChangeId, error = false, onErrorRemove = null, autoHideDeletion, ...rest} = props;

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
    setMessageFiles([]);
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
    const cursorPosition = ref.current.selectionEnd;
    const start = ref.current.value.substring(0, ref.current.selectionStart);
    const end = ref.current.value.substring(ref.current.selectionStart);
    setMessage(start + emojiData.emoji + end);
    setTimeout(() => {
      ref.current.selectionStart = ref.current.selectionEnd = cursorPosition + emojiData.emoji.length;
    }, 50);
  };

  // EFFECTS

  useEffect(() => {
    setThreadId(onThreadChangeId);
    if (threadId !== onThreadChangeId) {
      setMessage('');
      setMessageFiles([]);
      setOpenMediaSection(false);
    }
  }, [onThreadChangeId]);

  // MEMO
  const isIOS = useMemo(() => iOS(), []);

  /**
   * Rendering
   */
  if (autoHide || autoHideDeletion) {
    return (
      <Alert severity={autoHideDeletion ? 'warning' : 'info'}>
        {autoHideDeletion ? (
          <FormattedMessage id="ui.privateMessage.editor.disabled.deleted.msg" defaultMessage="ui.privateMessage.editor.disabled.deleted.msg" />
        ) : (
          <FormattedMessage id="ui.privateMessage.editor.disabled.msg" defaultMessage="ui.privateMessage.editor.disabled.msg" />
        )}
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
        {openMediaSection ? (
          <MessageMediaUploader
            className={classes.mediaUploader}
            open={openMediaSection}
            onClose={handleMediaSectionClose}
            forwardMessageFile={handleMessageFiles}
            isUploading={setUploading}
            action={
              <IconButton disabled={(!message && !messageFiles.length) || uploading} onClick={handleMessageSend}>
                <Icon>send</Icon>
              </IconButton>
            }
          />
        ) : (
          <>
            {openEmojiSection && <EmojiPicker className={classes.emojiSection} onEmojiClick={handleEmojiClick} width="100%" searchDisabled />}
            <TextField
              size="small"
              inputRef={ref}
              disabled={Boolean(messageFiles.length) || openMediaSection}
              className={classes.messageInput}
              multiline
              placeholder={`${intl.formatMessage(messages.placeholder)}`}
              value={message}
              onChange={handleMessageInput}
              maxRows={2}
              onSelect={() => setOpenEmojiSection(false)}
              InputProps={{
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
        )}
      </>
    );
  }

  return (
    <Root {...rest} className={classNames(classes.root, className, {[classes.ios]: isIOS})}>
      {renderContent()}
    </Root>
  );
}
