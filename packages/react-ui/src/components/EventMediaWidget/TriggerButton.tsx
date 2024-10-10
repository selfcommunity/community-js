import { LoadingButton, LoadingButtonProps } from '@mui/lab';
import { Stack, StackProps, Typography } from '@mui/material';
import Icon from '@mui/material/Icon';
import { styled } from '@mui/material/styles';
import ChunkedUploady from '@rpldy/chunked-uploady';
import { Endpoints } from '@selfcommunity/api-services';
import { SCContextType, useSCContext } from '@selfcommunity/react-core';
import { SCMediaType } from '@selfcommunity/types';
import classNames from 'classnames';
import { useSnackbar } from 'notistack';
import { ForwardedRef, forwardRef, useCallback, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import MediaChunkUploader from '../../shared/MediaChunkUploader';
import { SCMediaChunkType } from '../../types';
import asUploadButton from './asUploadButton';
import { PREFIX } from './constants';

const classes = {
  triggerRoot: `${PREFIX}-trigger-root`,
  stack: `${PREFIX}-stack`
};

const Root = styled(LoadingButton, {
  name: PREFIX,
  slot: 'TriggerRoot',
  overridesResolver: (_props, styles) => styles.triggerRoot
})(() => ({}));

const GalleryUploadStack = asUploadButton(
  forwardRef((props: StackProps, ref: ForwardedRef<HTMLDivElement>) => <Stack {...props} aria-label="upload" ref={ref} />),
  { accept: 'image/*' }
);

export interface TriggerIconButtonProps extends LoadingButtonProps {
  /**
   * Callback triggered when a media is added
   * @param media
   */
  onAdd?: (media: SCMediaType) => void | null;
}

export default function TriggerButton(props: TriggerIconButtonProps) {
  // PROPS
  const { className, onAdd = null, ...rest } = props;

  // STATE
  const [isUploading, setIsUploading] = useState<boolean>(false);

  // CONTEXT
  const scContext: SCContextType = useSCContext();

  // HOOKS
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const handleFilterByMime = useCallback((file: File) => {
    return file.type.startsWith('image/');
  }, []);

  const handleSuccess = useCallback((media: SCMediaType) => {
    onAdd?.(media);
  }, []);

  const handleProgress = useCallback((chunks: SCMediaChunkType) => {
    setIsUploading(Object.keys(chunks).length > 0);
  }, []);

  const handleError = useCallback(
    (chunk: SCMediaChunkType, error: string) => {
      const _snackBar = enqueueSnackbar(`${chunk.name}: ${error}`, {
        variant: 'error',
        anchorOrigin: { horizontal: 'center', vertical: 'top' },
        autoHideDuration: 2000,
        SnackbarProps: {
          onClick: () => {
            closeSnackbar(_snackBar);
          }
        }
      });
    },
    [enqueueSnackbar]
  );

  return (
    <ChunkedUploady
      destination={{
        url: Endpoints.ComposerChunkUploadMedia.url(),
        method: Endpoints.ComposerChunkUploadMedia.method
      }}
      fileFilter={handleFilterByMime}
      chunkSize={204800}>
      <MediaChunkUploader onSuccess={handleSuccess} onProgress={handleProgress} onError={handleError} type="image" />
      <Root className={classNames(className, classes.triggerRoot)} {...rest} aria-label="add media" loading={isUploading}>
        <GalleryUploadStack className={classes.stack}>
          <Typography variant="caption" component="p">
            <FormattedMessage id="ui.eventMediaWidget.add" defaultMessage="ui.eventMediaWidget.add" />
          </Typography>
          <Icon fontSize="inherit">add</Icon>
        </GalleryUploadStack>
      </Root>
    </ChunkedUploady>
  );
}
