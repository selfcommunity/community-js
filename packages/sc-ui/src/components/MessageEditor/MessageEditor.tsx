import React, {forwardRef, useContext, useRef, useState} from 'react';
import {styled} from '@mui/material/styles';
import {Box, IconButton, InputAdornment, Popover, Stack, TextField, CardHeader, CardContent, Button, CircularProgress} from '@mui/material';
import Icon from '@mui/material/Icon';
import Picker from 'emoji-picker-react';
import classNames from 'classnames';
import Widget from '../Widget';
import ChunkedUploady from '@rpldy/chunked-uploady';
import {Endpoints, SCContext, SCContextType, SCMediaType, SCPrivateMessageFileType} from '@selfcommunity/core';
import MessageChunkUploader from '../../shared/MessageChunkUploader';
import {asUploadButton} from '@rpldy/upload-button';
import {ButtonProps} from '@mui/material/Button/Button';
import {SCMessageChunkType} from '../../types/media';

const PREFIX = 'SCMessageEditor';

const classes = {
  root: `${PREFIX}-root`,
  messageInput: `${PREFIX}-message-input`,
  mediaUploadSection: `${PREFIX}-media-upload-section`
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
  [`& .${classes.mediaUploadSection}`]: {
    backgroundColor: theme.palette.grey['A200']
  }
}));

const UploadButton = asUploadButton(
  forwardRef((props: ButtonProps, ref: any) => (
    <Button {...props} aria-label="upload" ref={ref} variant="outlined" color="inherit">
      <Icon>upload_file</Icon>
    </Button>
  ))
);

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

 * @param props
 */
export default function MessageEditor(props: MessageEditorProps): JSX.Element {
  // PROPS
  const {autoHide = null, className = null, send = null, isSending = null, getMessage = null, getMessageFile = null, ...rest} = props;

  // STATE
  const [message, setMessage] = useState<string>('');
  const [messageFile, setMessageFile] = useState(null);
  const [show, setShow] = useState(false);
  const [emojiAnchorEl, setEmojiAnchorEl] = React.useState<null | HTMLElement>(null);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [openMediaSection, setOpenMediaSection] = useState(false);
  const [uploading, setUploading] = useState<boolean>(false);
  const [errors, setErrors] = useState({});
  //console.log(messageFile);

  // CONTEXT
  const scContext: SCContextType = useContext(SCContext);

  // REF
  const ref = useRef(null);

  // Chunk Upload handlers

  const handleSuccess = (media: SCPrivateMessageFileType) => {
    setUploading(false);
    setMessageFile(media.file_uuid);
    getMessageFile(media.file_uuid);
    console.log(media);
  };

  const handleProgress = () => {
    setUploading(true);
  };

  const handleError = (chunk: SCMessageChunkType, error: string) => {
    setErrors({...errors, [chunk.id]: {...chunk, error}});
  };

  // HANDLERS

  // const handleClick = (event: React.MouseEvent<HTMLElement>) => {
  //   setAnchorEl(event.currentTarget);
  // };
  // const handleClose = () => {
  //   setAnchorEl(null);
  // };
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
        {openMediaSection ? (
          <Widget className={classes.mediaUploadSection}>
            <CardHeader action={<Icon onClick={() => setOpenMediaSection(false)}>close</Icon>} />
            <CardContent sx={{display: 'flex', justifyContent: 'center'}}>
              <>
                {uploading ? (
                  <CircularProgress size={15} />
                ) : (
                  <IconButton disabled={isSending} onClick={handleMessageSend}>
                    <Icon>send</Icon>
                  </IconButton>
                )}
                <ChunkedUploady
                  destination={{
                    url: `${scContext.settings.portal}${Endpoints.PrivateMessageUploadMediaInChunks.url()}`,
                    headers: {Authorization: `Bearer ${scContext.settings.session.authToken.accessToken}`},
                    method: Endpoints.PrivateMessageUploadMediaInChunks.method
                  }}
                  chunkSize={2142880}
                  chunked>
                  <MessageChunkUploader onSuccess={handleSuccess} onProgress={handleProgress} onError={handleError} />
                  <UploadButton inputFieldName="qqfile" />
                </ChunkedUploady>
              </>
            </CardContent>
          </Widget>
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
