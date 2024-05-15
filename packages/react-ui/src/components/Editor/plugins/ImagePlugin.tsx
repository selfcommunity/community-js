import React, {forwardRef, useEffect, useState} from 'react';
import {COMMAND_PRIORITY_EDITOR, createCommand, LexicalCommand, LexicalEditor} from 'lexical';
import {$insertNodeToNearestRoot} from '@lexical/utils';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {CircularProgress, Icon, IconButton, IconButtonProps} from '@mui/material';
import {styled} from '@mui/material/styles';
import ChunkedUploady from '@rpldy/chunked-uploady';
import {Endpoints} from '@selfcommunity/api-services';
import {SCMediaType} from '@selfcommunity/types';
import {SCContextType, SCUserContextType, useSCContext, useSCUser} from '@selfcommunity/react-core';
import MediaChunkUploader from '../../../shared/MediaChunkUploader';
import {SCMediaChunkType} from '../../../types/media';
import {asUploadButton} from '@rpldy/upload-button';
import {useSnackbar} from 'notistack';
import {$createImageNode, ImageNode} from '../nodes/ImageNode';
import {PREFIX} from '../constants';

export interface InsertImagePayload {
  altText: string;
  src: string;
  width: number;
  height: number;
}

export const INSERT_IMAGE_COMMAND: LexicalCommand<InsertImagePayload> = createCommand();

interface UploadButtonProps extends IconButtonProps {
  progress?: number | null;
}

const UploadButton = asUploadButton(
  forwardRef(({progress = null, ...rest}: UploadButtonProps, ref: any) => (
    <IconButton {...rest} aria-label="upload image" ref={ref}>
      {progress ? <CircularProgress variant="determinate" value={progress} size="1rem" /> : <Icon color="inherit">image</Icon>}
    </IconButton>
  ))
);

function Image({editor, className = ''}: {editor: LexicalEditor; className?: string}): JSX.Element {
  // CONTEXT
  const scContext: SCContextType = useSCContext();
  const scUserContext: SCUserContextType = useSCUser();

  // STATE
  const [uploading, setUploading] = useState<Record<string, SCMediaChunkType>>({});

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
    editor.focus();
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
      chunkSize={204800}
      multiple
      accept="image/*"
      fileFilter={handleFileUploadFilter}>
      <MediaChunkUploader type="eimage" onSuccess={handleUploadSuccess} onProgress={handleUploadProgress} onError={handleUploadError} />
      <UploadButton
        className={className}
        extraProps={{
          disabled: Object.keys(uploading).length !== 0,
          progress: Object.keys(uploading).length !== 0 ? Object.values(uploading)[0].completed : null
        }}
      />
    </ChunkedUploady>
  );
}

const classes = {
  root: `${PREFIX}-image-plugin-root`
};

const Root = styled(Image, {
  name: PREFIX,
  slot: 'ImagePluginRoot'
})(() => ({}));

export default function ImagePlugin(): JSX.Element {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    if (!editor.hasNodes([ImageNode])) {
      return;
    }

    return editor.registerCommand(
      INSERT_IMAGE_COMMAND,
      (payload: InsertImagePayload) => {
        const imageNode = $createImageNode({
          src: payload.src,
          altText: payload.altText,
          maxWidth: '100%',
          width: payload.width,
          height: payload.height
        });
        // The image is not editable so it is better to position it near the root element
        $insertNodeToNearestRoot(imageNode);
        return true;
      },
      COMMAND_PRIORITY_EDITOR
    );
  }, [editor]);
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  if (!editor.hasNodes([ImageNode])) {
    return null;
  }
  return <Root editor={editor} className={classes.root} />;
}
