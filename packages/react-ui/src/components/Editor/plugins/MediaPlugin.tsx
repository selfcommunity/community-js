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
import {$createDocNode, DocNode} from '../nodes/DocNode';
import {INSERT_IMAGE_COMMAND, InsertImagePayload} from './ImagePlugin';

export interface InsertDocPayload {
  src: string;
  name: string;
  type: string;
}

export const INSERT_DOC_COMMAND: LexicalCommand<InsertDocPayload> = createCommand();

interface UploadButtonProps extends IconButtonProps {
  progress?: number | null;
}

const UploadButton = asUploadButton(
  forwardRef(({progress = null, ...rest}: UploadButtonProps, ref: any) => (
    <IconButton {...rest} aria-label="upload image" ref={ref}>
      {progress ? <CircularProgress variant="determinate" value={progress} size="1rem" /> : <Icon color="inherit">attach_file</Icon>}
    </IconButton>
  ))
);

function Media({editor, className = ''}: {editor: LexicalEditor; className?: string}): JSX.Element {
  // CONTEXT
  const scContext: SCContextType = useSCContext();
  const scUserContext: SCUserContextType = useSCUser();

  // STATE
  const [uploading, setUploading] = useState<Record<string, SCMediaChunkType>>({});
  const [mediaType, setMediaType] = useState('');

  // HOOKS
  const {enqueueSnackbar} = useSnackbar();

  // HANDLERS
  const handleFileUploadFilter = (file: File): boolean => {
    if (file.type.startsWith('image/')) {
      setMediaType('image');
    } else {
      setMediaType('file');
    }
    return file.type.startsWith('image/') || file.type.startsWith('application/');
  };

  const handleUploadSuccess = (media: SCMediaType) => {
    if (media.type === 'image') {
      const data = {
        altText: media.title,
        src: media.image,
        width: media.image_width,
        height: media.image_height
      };
      editor.focus();
      editor.dispatchCommand(INSERT_IMAGE_COMMAND, data);
    } else {
      const data = {
        src: media.url || media.image,
        name: media.title,
        type: media.type
      };
      editor.focus();
      editor.dispatchCommand(INSERT_DOC_COMMAND, data);
    }
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
      accept="image/*,application/*"
      fileFilter={handleFileUploadFilter}>
      <MediaChunkUploader type={mediaType} onSuccess={handleUploadSuccess} onProgress={handleUploadProgress} onError={handleUploadError} />
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
  root: `${PREFIX}-media-plugin-root`
};

const Root = styled(Media, {
  name: PREFIX,
  slot: 'MediaPluginRoot'
})(() => ({}));

export default function MediaPlugin(): JSX.Element {
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

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    if (!editor.hasNodes([DocNode])) {
      return;
    }

    editor.registerCommand(
      INSERT_DOC_COMMAND,
      (payload: InsertDocPayload) => {
        const docNode = $createDocNode({
          src: payload.src,
          name: payload.name,
          type: payload.type
        });

        $insertNodeToNearestRoot(docNode);
        return true;
      },
      COMMAND_PRIORITY_EDITOR
    );
  }, [editor]);

  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  if (!editor.hasNodes([ImageNode, DocNode])) {
    return null;
  }

  return <Root editor={editor} className={classes.root} />;
}
