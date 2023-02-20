import {asUploadButton} from '@rpldy/upload-button';
import React, {forwardRef, useCallback, useContext, useRef, useState} from 'react';
import {Alert, AlertTitle, Box, CardContent, CardHeader, CircularProgress, Fade, IconButton, Typography} from '@mui/material';
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

const UploadButton = asUploadButton(
  forwardRef((props: ButtonProps, ref: any) => (
    <IconButton {...props} ref={ref}>
      <Icon>upload</Icon>
    </IconButton>
  ))
);

const PREFIX = 'SCMessageMediaUploader';

const classes = {
  previewContainer: `${PREFIX}-preview-container`,
  upload: `${PREFIX}-upload`,
  docPreview: `${PREFIX}-doc-preview`,
  docLoadingPreview: `${PREFIX}-doc-loading-preview`,
  progress: `${PREFIX}-progress`,
  clearMedia: `${PREFIX}-clear-media`
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
  /**
   * Once a file has been successfully uploaded, this callback shows the send button on the editor
   * @default false
   */
  onFileUploaded?: () => void;
  /**
   * Once a file has been cleared, this callback hides the send button on the editor
   * @default false
   */
  onFileCleared?: () => void;
}

export default function MessageMediaUploader(props: MessageMediaUploaderProps): JSX.Element {
  //PROPS
  const {forwardMessageFile, onClose, onFileUploaded, onFileCleared} = props;

  // STATE
  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [uploading, setUploading] = useState({});
  const previewMethodsRef = useRef();
  const [previews, setPreviews] = useState([]);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState({});

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
    setLoading(false);
    setFileType(null);
    forwardMessageFile(null);
    setLoaded(false);
    onFileCleared();
  }, [previewMethodsRef]);

  const handleSuccess = (media: SCPrivateMessageFileType) => {
    setLoaded(true);
    setLoading(false);
    setFile(media);
    forwardMessageFile(media.file_uuid);
    onFileUploaded();
  };

  const handleProgress = (chunks: any) => {
    setUploading({...chunks});
  };

  const handleStart = (type: any) => {
    setFileType(type);
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
      setLoading(false);
    };
  };

  /**
   * Renders root object
   */
  return (
    <Root>
      <CardHeader action={<Icon onClick={onClose}>close</Icon>} />
      <CardContent>
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
          chunked>
          <MessageChunkUploader onStart={handleStart} onSuccess={handleSuccess} onProgress={handleProgress} onError={handleError} />
          <Box className={classes.progress}>
            {Object.values(uploading).map((chunk: SCMessageChunkType, index) => (
              <React.Fragment key={index}>
                <Typography align="center">{`${Math.round(chunk.completed)}%`}</Typography>
              </React.Fragment>
            ))}
          </Box>
          <Box className={classes.upload}> {!file && !loading && <UploadButton inputFieldName="qqfile" />}</Box>
          <Box className={classes.clearMedia}>
            {previews.length && loaded ? (
              <IconButton onClick={onClear}>
                <Icon>close</Icon>
              </IconButton>
            ) : null}
          </Box>
          <Box className={classes.previewContainer}>
            {fileType && fileType.startsWith(SCMessageFileType.DOCUMENT) ? (
              <Box className={loaded ? classes.docPreview : classes.docLoadingPreview}>
                {file && loaded ? (
                  <iframe src={file.file_url} title="file" width="100%" height="100%" style={{resize: 'both'}} loading="lazy" />
                ) : (
                  <CircularProgress size={30} />
                )}
              </Box>
            ) : (
              <UploadPreview rememberPreviousBatches previewMethodsRef={previewMethodsRef} onPreviewsChanged={onPreviewsChanged} />
            )}
          </Box>
        </ChunkedUploady>
      </CardContent>
    </Root>
  );
}
