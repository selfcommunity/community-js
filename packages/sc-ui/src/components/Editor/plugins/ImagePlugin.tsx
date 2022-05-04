import React, {forwardRef, useEffect, useState} from 'react';
import {$getSelection, $isRangeSelection, $isRootNode, COMMAND_PRIORITY_EDITOR, createCommand, LexicalCommand, LexicalEditor} from 'lexical';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {CircularProgress, Icon, IconButton, IconButtonProps} from '@mui/material';
import {styled} from '@mui/material/styles';
import ChunkedUploady from '@rpldy/chunked-uploady';
import {Endpoints, SCContextType, SCMediaType, SCUserContextType, useSCContext, useSCUser} from '@selfcommunity/core';
import MediaChunkUploader from '../../../shared/MediaChunkUploader';
import {SCMediaChunkType} from '@selfcommunity/ui';
import {asUploadButton} from '@rpldy/upload-button';
import {useSnackbar} from 'notistack';
import {$createImageNode, ImageNode} from '../nodes/ImageNode';

export interface InsertImagePayload {
  altText: string;
  src: string;
}

export const INSERT_IMAGE_COMMAND: LexicalCommand<InsertImagePayload> = createCommand();

const UploadButton = asUploadButton(
  forwardRef((props: IconButtonProps, ref: any) => (
    <IconButton {...props} aria-label="upload image" ref={ref} color="inherit">
      <Icon color="inherit">image</Icon>
    </IconButton>
  ))
);

function Image({editor, className = ''}: {editor: LexicalEditor; className?: string}): JSX.Element {
  // CONTEXT
  const scContext: SCContextType = useSCContext();
  const scUserContext: SCUserContextType = useSCUser();

  // STATE
  const [uploading, setUploading] = useState({});

  // HOOKS
  const {enqueueSnackbar} = useSnackbar();

  // HANDLERS
  const handleFileUploadFilter = (file: File, index: number, a: File[] | string[]): boolean => {
    return file.type.startsWith('image/');
  };

  const handleUploadSuccess = (media: SCMediaType) => {
    const data = {
      altText: media.title,
      src: media.image,
      width: media.image_width,
      height: media.image_height
    };
    editor.dispatchCommand(INSERT_IMAGE_COMMAND, data);
  };

  const handleUploadProgress = (chunks: any) => {
    setUploading({...chunks});
  };

  const handleUploadError = (chunk: SCMediaChunkType, error: string) => {
    enqueueSnackbar(error, {
      variant: 'error',
      autoHideDuration: 3000
    });
  };

  if (!scUserContext.user) {
    return null;
  }

  return (
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
      <UploadButton className={className} extraProps={{disabled: Object.keys(uploading).length !== 0}} />
    </ChunkedUploady>
  );
}

const PREFIX = 'SCEditorImagePlugin';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(Image, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));

export default function ImagePlugin(): JSX.Element {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([ImageNode])) {
      return;
    }

    return editor.registerCommand(
      INSERT_IMAGE_COMMAND,
      (payload: InsertImagePayload) => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          if ($isRootNode(selection.anchor.getNode())) {
            selection.insertParagraph();
          }
          const imageNode = $createImageNode(payload.src, payload.altText, '100%');
          selection.insertNodes([imageNode]);
        }
        return true;
      },
      COMMAND_PRIORITY_EDITOR
    );
  }, [editor]);

  if (!editor.hasNodes([ImageNode])) {
    return null;
  }
  return <Root editor={editor} className={classes.root} />;
}
