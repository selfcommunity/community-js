import {asUploadButton} from '@rpldy/upload-button';
import React, {forwardRef, SyntheticEvent, useContext, useState} from 'react';
import {
  Alert,
  AlertTitle,
  Box,
  Button as MuiButton,
  CardContent,
  CardHeader,
  Fade,
  IconButton,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Typography
} from '@mui/material';
import {ButtonProps} from '@mui/material/Button/Button';
import Icon from '@mui/material/Icon';
import ChunkedUploady from '@rpldy/chunked-uploady';
import {Endpoints, SCContext, SCContextType, SCMediaType, SCPrivateMessageFileType} from '@selfcommunity/core';
import {styled} from '@mui/material/styles';
import {SCMediaChunkType, SCMessageChunkType} from '../../../types/media';
import Widget from '../../Widget';
import MessageChunkUploader from '../../../shared/MessageChunkUploader';
import UploadPreview from '@rpldy/upload-preview';
import {ReactSortable} from 'react-sortablejs';

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
  mediaUploadSection: `${PREFIX}-media-upload-section`,
  uploadButton: `${PREFIX}-upload-button`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  [`& .${classes.previewContainer}`]: {
    display: 'flex',
    justifyContent: 'center',
    img: {
      maxWidth: '50%'
    },
    video: {
      maxWidth: '40%'
    }
  },
  [`& .${classes.mediaUploadSection}`]: {
    backgroundColor: theme.palette.grey['A200']
  },
  [`& .${classes.uploadButton}`]: {
    backgroundColor: theme.palette.common.white
  }
}));

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
}

export default function MessageMediaUploader(props: MessageMediaUploaderProps): JSX.Element {
  //PROPS
  const {forwardMessageFile, onClose, onFileUploaded} = props;

  // STATE
  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [uploading, setUploading] = useState({});
  const [errors, setErrors] = useState({});

  // CONTEXT
  const scContext: SCContextType = useContext(SCContext);

  // Chunk Upload handlers

  const handleSuccess = (media: SCPrivateMessageFileType) => {
    setFile(media);
    forwardMessageFile(media.file_uuid);
    onFileUploaded();
  };

  const handleProgress = (chunks: any) => {
    // setUploading({...chunks});
    // onProgress && onProgress(Object.values(chunks));
    console.log(chunks);
  };

  const handleError = (chunk: SCMessageChunkType, error: string) => {
    setErrors({...errors, [chunk.id]: {...chunk, error}});
  };

  const handleRemoveErrors = (id: string) => {
    return () => {
      delete errors[id];
      setErrors({...errors});
    };
  };

  /**
   * Renders root object
   */
  return (
    <Root>
      <Widget className={classes.mediaUploadSection}>
        <CardHeader action={<Icon onClick={onClose}>close</Icon>} />
        <CardContent sx={{display: 'flex', justifyContent: 'center'}}>
          <ChunkedUploady
            destination={{
              url: `${scContext.settings.portal}${Endpoints.PrivateMessageUploadMediaInChunks.url()}`,
              headers: {Authorization: `Bearer ${scContext.settings.session.authToken.accessToken}`},
              method: Endpoints.PrivateMessageUploadMediaInChunks.method
            }}
            chunkSize={2142880}
            chunked>
            <MessageChunkUploader onSuccess={handleSuccess} onProgress={handleProgress} onError={handleError} />
            {!file && <UploadButton className={classes.uploadButton} inputFieldName="qqfile" />}
            <Box className={classes.previewContainer}>
              <UploadPreview />
            </Box>
          </ChunkedUploady>
        </CardContent>
      </Widget>
    </Root>
  );
}
