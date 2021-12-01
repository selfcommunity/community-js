import React, {FunctionComponent, RefObject, useContext, useEffect, useMemo, useRef, useState} from 'react';
import {styled} from '@mui/material/styles';
import {ContentState, convertFromHTML, convertToRaw, EditorState} from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import {defineMessages, useIntl} from 'react-intl';
import MUIRichTextEditor, {TAsyncAtomicBlockResponse, TAutocompleteItem, TMUIRichTextEditorRef} from 'mui-rte';
import {Alert, AlertTitle, Avatar, Box, Fade, LinearProgress, ListItemAvatar, ListItemText, Stack} from '@mui/material';
import {Endpoints, http, SCContext, SCContextType, SCMediaType, SCUserType} from '@selfcommunity/core';
import {AxiosResponse} from 'axios';
import MediaChunkUploader from '../../shared/MediaChunkUploader';
import ChunkedUploady from '@rpldy/chunked-uploady';
import {SCMediaChunkType} from '../../types/media';
import UploadDropZone from '@rpldy/upload-drop-zone';

const PREFIX = 'SCEditor';

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  boxSizing: 'border-box',
  cursor: 'text',
  padding: theme.spacing(2),
  minHeight: 100
}));

const messages = defineMessages({
  placeholder: {
    id: 'ui.editor.placeholder',
    defaultMessage: 'ui.editor.placeholder'
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
  const {blockProps} = props;
  return <img {...blockProps} />;
};

export default function Editor({
  className = '',
  defaultValue = '',
  readOnly = false,
  onChange = null,
  onRef = null
}: {
  className?: string;
  defaultValue?: string;
  readOnly?: boolean;
  onChange?: (value: string) => void;
  onRef?: (editor: RefObject<TMUIRichTextEditorRef>) => void;
}): JSX.Element {
  const editorId = useMemo(() => `editor${(Math.random() + 1).toString(36).substring(7)}`, []);

  // Refs
  const editor = useRef<TMUIRichTextEditorRef>(null);

  // INTL
  const intl = useIntl();

  // Context
  const scContext: SCContextType = useContext(SCContext);

  // State
  const [uploading, setUploading] = useState({});
  const [errors, setErrors] = useState({});

  /**
   * On mount if onRef in props
   * forward editor ref
   */
  useEffect(() => {
    onRef && onRef(editor);
  }, []);

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
      width: 300,
      height: 200
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

  return (
    <ChunkedUploady
      destination={{
        url: `${scContext.settings.portal}${Endpoints.ComposerChunkUploadMedia.url()}`,
        headers: {Authorization: `Bearer ${scContext.settings.session.authToken.accessToken}`},
        method: Endpoints.ComposerChunkUploadMedia.method
      }}
      chunkSize={2142880}
      multiple
      accept="image/*"
      fileFilter={handleFileUploadFilter}>
      <MediaChunkUploader type="eimage" onSuccess={handleUploadSuccess} onProgress={handleUploadProgress} onError={handleUploadError} />
      <UploadDropZone onDragOverClassName="drag-over" inputFieldName="image">
        <Root className={className}>
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
        </Root>
      </UploadDropZone>
    </ChunkedUploady>
  );
}
