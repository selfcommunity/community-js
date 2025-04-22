import React, {forwardRef, useEffect, useState} from 'react';
import {COMMAND_PRIORITY_EDITOR, createCommand, LexicalCommand} from 'lexical';
import {$insertNodeToNearestRoot} from '@lexical/utils';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {Box, CircularProgress, Icon, IconButton, IconButtonProps, styled} from '@mui/material';
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
import {INSERT_IMAGE_COMMAND, InsertImagePayload} from './ImagePlugin';
import classNames from 'classnames';

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
const classes = {
  root: `${PREFIX}-media-plugin-root`
};

export interface MediaPluginProps {
  className?: string;
  onMediaAdd?: (media: SCMediaType) => void | null;
  isUploading?: (boolean) => void;
}

const Root = styled(Box, {
  name: PREFIX,
  slot: 'MediaPluginRoot'
})(() => ({}));

export default function MediaPlugin(props: MediaPluginProps) {
  const {className = '', onMediaAdd = null, isUploading} = props;

  // STATE
  const [uploading, setUploading] = useState<Record<string, SCMediaChunkType>>({});
  const [mediaType, setMediaType] = useState('');
  const [editor] = useLexicalComposerContext();

  // CONTEXT
  const scContext: SCContextType = useSCContext();
  const scUserContext: SCUserContextType = useSCUser();

  // HOOKS
  const {enqueueSnackbar} = useSnackbar();

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
      onMediaAdd && onMediaAdd(media);
    }
  };

  const handleUploadProgress = (chunks: any) => {
    setUploading({...chunks});
    isUploading && isUploading(Object.keys(chunks).length !== 0);
  };

  const handleUploadError = (chunk: SCMediaChunkType, error: string) => {
    enqueueSnackbar(error, {
      variant: 'error',
      autoHideDuration: 3000
    });
  };

  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  if (!scUserContext.user || !editor.hasNodes([ImageNode])) {
    return null;
  }

  return (
    <Root className={classNames(classes.root, className)}>
      <ChunkedUploady
        destination={{
          url: `${scContext.settings.portal}${Endpoints.ComposerChunkUploadMedia.url()}`,
          headers: scContext.settings.session?.authToken ? {Authorization: `Bearer ${scContext.settings.session.authToken.accessToken}`} : {},
          method: Endpoints.ComposerChunkUploadMedia.method
        }}
        chunkSize={204800}
        accept="image/*,application/*"
        fileFilter={handleFileUploadFilter}
        multiple>
        <MediaChunkUploader type={mediaType} onSuccess={handleUploadSuccess} onProgress={handleUploadProgress} onError={handleUploadError} />
        <UploadButton
          className={className}
          extraProps={{
            disabled: Object.keys(uploading).length !== 0,
            progress: Object.keys(uploading).length !== 0 ? Object.values(uploading)[0].completed : null
          }}
        />
      </ChunkedUploady>
    </Root>
  );
}
