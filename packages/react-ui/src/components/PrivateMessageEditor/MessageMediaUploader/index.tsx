import {asUploadButton} from '@rpldy/upload-button';
import React, {forwardRef, useCallback, useContext, useRef, useState} from 'react';
import {Alert, AlertTitle, Box, CardContent, Fade, IconButton, Typography} from '@mui/material';
import {ButtonProps} from '@mui/material/Button/Button';
import Icon from '@mui/material/Icon';
import ChunkedUploady from '@rpldy/chunked-uploady';
import {SCMessageFileType, SCPrivateMessageFileType} from '@selfcommunity/types';
import {Endpoints} from '@selfcommunity/api-services';
import {SCContext, SCContextType} from '@selfcommunity/react-core';
import {styled} from '@mui/material/styles';
import {SCMessageChunkType} from '../../../types/media';
import Widget from '../../Widget';
import MessageChunkUploader from '../../../shared/MessageChunkUploader';
import UploadPreview from '@rpldy/upload-preview';
import UploadDropZone from '@rpldy/upload-drop-zone';
import {FormattedMessage} from 'react-intl';
import {bytesToSize} from '../../../utils/sizeCoverter';
import {fallbackImage} from '../../../utils/thumbnailCoverter';

const MAX_FILE_SIZE = 10485760;

const UploadButton = asUploadButton(
  forwardRef((props: ButtonProps, ref: any) => (
    <IconButton {...props} ref={ref} color="inherit">
      <Icon>upload</Icon>
    </IconButton>
  ))
);

const PREFIX = 'SCMessageMediaUploader';

const classes = {
  root: `${PREFIX}-root`,
  uploadSection: `${PREFIX}-upload-section`,
  uploadButton: `${PREFIX}-upload-button`,
  previewContent: `${PREFIX}-preview-content`,
  previewActions: `${PREFIX}-preview-actions`,
  progress: `${PREFIX}-progress`,
  previewInfo: `${PREFIX}-preview-info`,
  close: `${PREFIX}-close`
};

const Root = styled(Widget, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));

export interface MessageMediaUploaderProps {
  /**
   * Callback to pass message file item
   * @param file
   */
  forwardMessageFile?: (file) => void;
  /**
   * On messsage media upload close callback function
   * @default null
   */
  onClose?: () => void;
  /**
   * On messsage media upload open callback function
   * @default false
   */
  open?: boolean;
}

export default function MessageMediaUploader(props: MessageMediaUploaderProps): JSX.Element {
  //PROPS
  const {forwardMessageFile, onClose} = props;

  // STATE
  const [file, setFile] = useState(null);
  const [batchFile, setBatchFile] = useState(null);
  const [uploading, setUploading] = useState({});
  const previewMethodsRef = useRef();
  const [previews, setPreviews] = useState([]);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [errors, setErrors] = useState({});
  const [isHovered, setIsHovered] = useState(false);
  // CONTEXT
  const scContext: SCContextType = useContext(SCContext);

  // Chunk Upload handlers

  const onPreviewsChanged = useCallback((previews) => {
    setPreviews(previews);
  }, []);

  const onClear = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    if (previewMethodsRef.current?.clear) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      previewMethodsRef.current.clear();
    }
    setPreviews([]);
    setFile(null);
    setBatchFile(null);
    forwardMessageFile(null);
    setLoaded(false);
  }, [previewMethodsRef]);

  const handleSuccess = (media: SCPrivateMessageFileType) => {
    setLoaded(true);
    setFile(media);
    forwardMessageFile(media.file_uuid);
  };

  const handleProgress = (chunks: any) => {
    setUploading({...chunks});
  };

  const handleStart = (item: any) => {
    setBatchFile(item.file);
  };

  const handleError = (chunk: SCMessageChunkType, error: string) => {
    setErrors({...errors, [chunk.id]: {...chunk, error}});
    onClear();
  };

  const handleRemoveErrors = (id: string) => {
    return () => {
      delete errors[id];
      setErrors({...errors});
      setFile(null);
    };
  };

  const getMouseEvents = (mouseEnter, mouseLeave) => ({
    onMouseEnter: mouseEnter,
    onMouseLeave: mouseLeave,
    onTouchStart: mouseEnter,
    onTouchMove: mouseLeave
  });

  /**
   * Renders root object
   */
  const filterBySizeAndType = (file) => {
    return (
      file.size < MAX_FILE_SIZE &&
      (file.type.startsWith(SCMessageFileType.IMAGE) || file.type.startsWith(SCMessageFileType.VIDEO) || file.type.startsWith(SCMessageFileType.PDF))
    );
  };

  return (
    <Root className={classes.root}>
      <CardContent>
        <Typography component={'span'} className={classes.close} textAlign={loaded ? 'right' : 'left'}>
          <Icon fontSize={'small'} onClick={onClose}>
            close
          </Icon>
        </Typography>
        {Object.keys(errors).map((id: string) => (
          <Fade in key={id}>
            <Alert severity="error" onClose={handleRemoveErrors(id)}>
              <AlertTitle>{errors[id].name}</AlertTitle>
              {errors[id].error}
            </Alert>
          </Fade>
        ))}
        <ChunkedUploady
          destination={{
            url: `${scContext.settings.portal}${Endpoints.PrivateMessageUploadMediaInChunks.url()}`,
            headers: {Authorization: `Bearer ${scContext.settings.session.authToken.accessToken}`},
            method: Endpoints.PrivateMessageUploadMediaInChunks.method
          }}
          chunkSize={204800}
          multiple
          chunked
          fileFilter={filterBySizeAndType}>
          <MessageChunkUploader onStart={handleStart} onSuccess={handleSuccess} onProgress={handleProgress} onError={handleError} />
          {!file && Object.keys(uploading).length === 0 && Object.keys(errors).length === 0 && (
            <UploadDropZone className={classes.uploadSection}>
              <UploadButton inputFieldName="file" className={classes.uploadButton} />
              <Typography textAlign={'center'} fontWeight={'medium'}>
                <FormattedMessage id="ui.privateMessage.editor.media.uploader.msg" defaultMessage="ui.privateMessage.editor.media.uploader.msg" />
              </Typography>
            </UploadDropZone>
          )}
          <Box
            className={classes.previewContent}
            {...getMouseEvents(
              () => setIsHovered(true),
              () => setIsHovered(false)
            )}>
            <UploadPreview
              rememberPreviousBatches
              previewMethodsRef={previewMethodsRef}
              onPreviewsChanged={onPreviewsChanged}
              fallbackUrl={fallbackImage}
            />
            {batchFile && (
              <Box className={classes.previewActions}>
                {Object.values(uploading).map((chunk: SCMessageChunkType) => (
                  <Box key={chunk.id} className={classes.progress}>
                    <Typography textAlign="center">{`${Math.round(chunk.completed)}%`}</Typography>
                  </Box>
                ))}
                {loaded && isHovered && (
                  <IconButton onClick={onClear} size="small">
                    <Icon>delete</Icon>
                  </IconButton>
                )}
              </Box>
            )}
          </Box>
          {loaded && isHovered && (
            <Box className={classes.previewInfo}>
              <Typography textAlign={'center'}>{batchFile?.name}</Typography>
              <Typography textAlign={'center'} fontWeight={'light'}>
                {batchFile && bytesToSize(batchFile.size)}
              </Typography>
            </Box>
          )}
        </ChunkedUploady>
      </CardContent>
    </Root>
  );
}
