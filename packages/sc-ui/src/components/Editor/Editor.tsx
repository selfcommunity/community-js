import React, {FunctionComponent, RefObject, SyntheticEvent, useContext, useEffect, useMemo, useRef, useState} from 'react';
import {styled} from '@mui/material/styles';
import {ContentState, convertFromHTML, convertToRaw, EditorState} from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import {defineMessages, useIntl} from 'react-intl';
import MUIRichTextEditor, {TAutocompleteItem, TMUIRichTextEditorRef} from 'mui-rte';
import {Alert, AlertTitle, Avatar, Box, Fade, IconButton, LinearProgress, ListItemAvatar, ListItemText, Popover, Stack} from '@mui/material';
import {Endpoints, http, SCContextType, SCMediaType, SCUserContext, SCUserContextType, SCUserType, useSCContext} from '@selfcommunity/core';
import {AxiosResponse} from 'axios';
import MediaChunkUploader from '../../shared/MediaChunkUploader';
import ChunkedUploady from '@rpldy/chunked-uploady';
import {SCMediaChunkType} from '../../types/media';
import UploadDropZone from '@rpldy/upload-drop-zone';
import Icon from '@mui/material/Icon';
import Picker from 'emoji-picker-react';
import {random} from '../../utils/string';
import classNames from 'classnames';

const PREFIX = 'SCEditor';

const classes = {
  root: `${PREFIX}-root`,
  drop: `${PREFIX}-drop`,
  actions: `${PREFIX}-actions`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  boxSizing: 'border-box',
  cursor: 'text',
  padding: theme.spacing(1),
  minHeight: 59,
  position: 'relative',
  [`& .${classes.drop}`]: {
    position: 'relative',
    '&::before': {
      content: 'attr(data-content)',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      zIndex: 2,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }
  },
  [`& .${classes.actions}`]: {
    position: 'absolute',
    bottom: 0,
    right: 0
  }
}));

const messages = defineMessages({
  placeholder: {
    id: 'ui.editor.placeholder',
    defaultMessage: 'ui.editor.placeholder'
  },
  drop: {
    id: 'ui.editor.drop',
    defaultMessage: 'ui.editor.drop'
  }
});

type TUser = {
  avatar: string;
  username: string;
  realName?: string;
};

const User: FunctionComponent<TUser> = (props) => {
  return (
    <>
      <ListItemAvatar>
        <Avatar alt={props.username} src={props.avatar}>
          {props.username.substr(0, 1)}
        </Avatar>
      </ListItemAvatar>
      <ListItemText primary={props.username} secondary={props.realName} />
    </>
  );
};

const EditorImage: FunctionComponent<any> = (props) => {
  // Props
  const {blockProps} = props;
  const {src, width, height, rest} = blockProps;

  // Utils
  const calculateAspectRatioFit = (srcWidth, srcHeight, maxWidth, maxHeight) => {
    const ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
    return {width: srcWidth * ratio, height: srcHeight * ratio};
  };

  return <img src={src} {...calculateAspectRatioFit(width, height, 300, 300)} {...rest} />;
};

export interface EditorProps {
  /**
   * Id of the feed object
   * @default 'poll'
   */
  id?: string;

  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;

  /**
   * Default value for the editor
   * @default null
   */
  defaultValue?: string;

  /**
   * Is the content of the editor read only
   * @default false
   */
  readOnly?: boolean;

  /**
   * Handler for change event of the editor
   * @default null
   * */
  onChange?: (value: string) => void;

  /**
   * Handler for ref forwarding of the MUIRichTextEditor
   * @default null
   */
  onRef?: (editor: RefObject<TMUIRichTextEditorRef>) => void;
}

/**
 * > API documentation for the Community-UI Editor component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {Editor} from '@selfcommunity/ui';
 ```

 #### Component Name

 The name `SCEditor` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCEditor-root|Styles applied to the root element.|
 |drop|.SCEditor-drop|Styles applied to the drop element.|
 |actions|.SCEditor-actions|Styles applied to the actions section.|

 * @param props
 */
export default function Editor(props: EditorProps): JSX.Element {
  const editorId = useMemo(() => `editor${random()}`, []);

  // PROPS
  const {id = 'editor', className = null, defaultValue = '', readOnly = false, onChange = null, onRef = null} = props;

  // Refs
  const editor = useRef<TMUIRichTextEditorRef>(null);

  // INTL
  const intl = useIntl();

  // Context
  const scContext: SCContextType = useSCContext();
  const scUserContext: SCUserContextType = useContext(SCUserContext);

  // State
  const [uploading, setUploading] = useState({});
  const [errors, setErrors] = useState({});
  const [emojiAnchorEl, setEmojiAnchorEl] = React.useState<null | HTMLElement>(null);

  /**
   * On mount if onRef in props
   * forward editor ref
   */
  useEffect(() => {
    onRef && onRef(editor);
  });

  // Default editor content
  const content: string = useMemo(() => {
    const contentHTML = convertFromHTML(defaultValue);
    const state = ContentState.createFromBlockArray(contentHTML.contentBlocks, contentHTML.entityMap);
    return JSON.stringify(convertToRaw(state));
  }, []);

  // UTILITY
  const searchMentions = async (query: string): Promise<TAutocompleteItem[]> => {
    const response: AxiosResponse<any> = await http.request({
      url: Endpoints.UserSearch.url(),
      method: Endpoints.UserSearch.method,
      params: {user: query, limit: 7}
    });
    return response.data.results.map((user: SCUserType) => {
      return {
        keys: [user.email, user.username, user.real_name],
        value: `@${user.username}`,
        content: <User username={user.username} realName={user.real_name} avatar={user.avatar} />
      };
    });
  };

  // HANDLERS

  const handleUploadSuccess = (media: SCMediaType) => {
    const data = {
      src: media.image,
      width: media.image_width,
      height: media.image_height
    };
    editor.current?.insertAtomicBlockSync('sc-image', data);
  };

  const handleUploadProgress = (chunks: any) => {
    setUploading({...chunks});
  };

  const handleUploadError = (chunk: SCMediaChunkType, error: string) => {
    setErrors({...errors, [chunk.id]: {...chunk, error}});
  };

  const handleRemoveUploadErrors = (id: string) => {
    return () => {
      delete errors[id];
      setErrors({...errors});
    };
  };

  const handleChange = (editor: EditorState) => {
    onChange && onChange(draftToHtml(convertToRaw(editor.getCurrentContent())));
  };

  const handleFileUploadFilter = (file: File, index: number, a: File[] | string[]): boolean => {
    return file.type.startsWith('image/');
  };

  const handleToggleEmoji = (event: React.MouseEvent<HTMLElement>) => {
    setEmojiAnchorEl(emojiAnchorEl ? null : event.currentTarget);
  };

  const handleEmojiClick = (event: SyntheticEvent, emoji) => {
    editor.current?.insertText(emoji.emoji);
  };

  return (
    <Root id={id} className={classNames(classes.root, className)}>
      {scUserContext.user && (
        <ChunkedUploady
          destination={{
            url: `${scContext.settings.portal}${Endpoints.ComposerChunkUploadMedia.url()}`,
            headers: {
              ...(scContext.settings.session &&
                scContext.settings.session.authToken && {
                  Authorization: `Bearer ${scContext.settings.session.authToken.accessToken}`
                })
            },
            method: Endpoints.ComposerChunkUploadMedia.method
          }}
          chunkSize={2142880}
          multiple
          accept="image/*"
          fileFilter={handleFileUploadFilter}>
          <MediaChunkUploader type="eimage" onSuccess={handleUploadSuccess} onProgress={handleUploadProgress} onError={handleUploadError} />
          <UploadDropZone onDragOverClassName={classes.drop} inputFieldName="image" extraProps={{'data-content': intl.formatMessage(messages.drop)}}>
            <MUIRichTextEditor
              id={editorId}
              readOnly={readOnly}
              label={intl.formatMessage(messages.placeholder)}
              onChange={handleChange}
              ref={editor}
              defaultValue={content}
              inlineToolbarControls={['bold', 'italic', 'underline', 'strikethrough', 'highlight', 'link', 'clear']}
              customControls={[
                {
                  name: 'sc-image',
                  type: 'atomic',
                  atomicComponent: EditorImage
                }
              ]}
              toolbar={false}
              inlineToolbar={true}
              autocomplete={{
                strategies: [
                  {
                    asyncItems: searchMentions,
                    triggerChar: '@'
                  }
                ]
              }}
            />
            {(uploading || errors) && (
              <Stack>
                {Object.values(uploading).map((chunk: SCMediaChunkType) => (
                  <Fade in key={chunk.id}>
                    <Box>
                      {chunk.name}
                      <LinearProgress variant="determinate" value={chunk.completed} />
                    </Box>
                  </Fade>
                ))}
                {Object.keys(errors).map((id: string) => (
                  <Fade in key={id}>
                    <Alert severity="error" onClose={handleRemoveUploadErrors(id)}>
                      <AlertTitle>{errors[id].name}</AlertTitle>
                      {errors[id].error}
                    </Alert>
                  </Fade>
                ))}
              </Stack>
            )}
          </UploadDropZone>
        </ChunkedUploady>
      )}
      <Stack className={classes.actions}>
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
    </Root>
  );
}
