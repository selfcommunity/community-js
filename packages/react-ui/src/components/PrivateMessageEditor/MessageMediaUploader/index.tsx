import {asUploadButton} from '@rpldy/upload-button';
import React, {forwardRef, useContext, useState} from 'react';
import {Alert, AlertTitle, CardContent, Fade, IconButton, ImageListItemBar, List, ListItem, Typography, Box, CardHeader} from '@mui/material';
import {ButtonProps} from '@mui/material/Button/Button';
import Icon from '@mui/material/Icon';
import ChunkedUploady from '@rpldy/chunked-uploady';
import {SCMessageFileType, SCPrivateMessageUploadThumbnailType} from '@selfcommunity/types';
import {Endpoints} from '@selfcommunity/api-services';
import {SCContext, SCContextType} from '@selfcommunity/react-core';
import {styled} from '@mui/material/styles';
import {SCMessageChunkType} from '../../../types/media';
import Widget from '../../Widget';
import MessageChunkUploader from '../../../shared/MessageChunkUploader';
import UploadDropZone from '@rpldy/upload-drop-zone';
import {FormattedMessage} from 'react-intl';
import {pdfImagePlaceholder} from '../../../utils/thumbnailCoverter';
import classNames from 'classnames';
import {bytesToSize} from '../../../utils/sizeCoverter';

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
  closeButton: `${PREFIX}-close-button`,
  previewContent: `${PREFIX}-preview-content`,
  previewItem: `${PREFIX}-preview-item`,
  previewActions: `${PREFIX}-preview-actions`,
  progress: `${PREFIX}-progress`,
  previewInfo: `${PREFIX}-preview-info`
};

const Root = styled(Widget, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));

export interface MessageMediaUploaderProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
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
   * On messsage media upload  isUploading callback function
   * @default false
   */
  isUploading?: (boolean) => void;
}

export default function MessageMediaUploader(props: MessageMediaUploaderProps): JSX.Element {
  //PROPS
  const {className, forwardMessageFile, onClose, isUploading} = props;

  // STATE
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState({});
  const [previews, setPreviews] = useState([]);
  const [errors, setErrors] = useState({});
  const [isHovered, setIsHovered] = useState({});

  // CONTEXT
  const scContext: SCContextType = useContext(SCContext);
  // HANDLERS
  const update = (list, itemId) => {
    return list.filter((i) => i.file_uuid != itemId);
  };

  const handleClear = (itemId?: string) => {
    if (itemId) {
      setPreviews((prev) => update(prev, itemId));
      setFiles((prev) => update(prev, itemId));
      forwardMessageFile(update(files, itemId));
    } else {
      setFiles([]);
      setPreviews([]);
      forwardMessageFile([]);
    }
    setUploading({});
  };

  const handleSuccess = (media: SCPrivateMessageUploadThumbnailType) => {
    setFiles((prev) => [...prev, media]);
  };

  const forwardFiles = () => {
    forwardMessageFile(files);
  };

  const handleProgress = (chunks: any) => {
    setUploading({...chunks});
    setPreviews([...files, ...Object.values(chunks)]);
    isUploading(Object.keys(chunks).length !== 0);
    Object.keys(chunks).length === 0 && Object.keys(uploading).length !== 0 && forwardFiles();
  };

  const handleError = (chunk: SCMessageChunkType, error: string) => {
    setErrors({...errors, [chunk.id]: {...chunk, error}});
    handleClear();
  };

  const handleRemoveErrors = (id: string) => {
    return () => {
      delete errors[id];
      setErrors({...errors});
      setFiles([]);
      setPreviews([]);
    };
  };
  const handleMouseEnter = (index) => {
    setIsHovered((prevState) => {
      return {...prevState, [index]: true};
    });
  };

  const handleMouseLeave = (index) => {
    setIsHovered((prevState) => {
      return {...prevState, [index]: false};
    });
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
    <Root className={classNames(classes.root, className)}>
      <CardHeader
        action={
          <Icon fontSize={'small'} onClick={onClose} className={classes.closeButton}>
            close
          </Icon>
        }
      />
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
          multiple
          chunked
          maxConcurrent={2}
          fileFilter={filterBySizeAndType}>
          <MessageChunkUploader onSuccess={handleSuccess} onProgress={handleProgress} onError={handleError} />
          {!files.length && Object.keys(uploading).length === 0 && Object.keys(errors).length === 0 && (
            <UploadDropZone className={classes.uploadSection}>
              <UploadButton inputFieldName="file" className={classes.uploadButton} />
              <Typography textAlign={'center'} fontWeight={'medium'}>
                <FormattedMessage id="ui.privateMessage.editor.media.uploader.msg" defaultMessage="ui.privateMessage.editor.media.uploader.msg" />
              </Typography>
            </UploadDropZone>
          )}
          <List className={classes.previewContent}>
            {previews.length !== 0 &&
              previews.map((item) => (
                <ListItem
                  className={classes.previewItem}
                  key={item.id ?? item.file_uuid}
                  {...getMouseEvents(
                    () => handleMouseEnter(item.file_uuid),
                    () => handleMouseLeave(item.file_uuid)
                  )}>
                  {'video_url' in item ? (
                    <video src={item.video_url} />
                  ) : (
                    <img src={item.file.type.startsWith(SCMessageFileType.DOCUMENT) && !item.file_url ? pdfImagePlaceholder : item.file_url} />
                  )}
                  <ImageListItemBar
                    className={classNames(classes.previewActions, {[classes.progress]: item.completed})}
                    title={
                      typeof item.completed !== 'undefined' &&
                      item.completed !== 0 && <Typography textAlign="center">{`${Math.round(item.completed)}%`}</Typography>
                    }
                    actionIcon={
                      <>
                        {isHovered[item.file_uuid] && Object.keys(uploading).length === 0 && (
                          <IconButton onClick={() => handleClear(item.file_uuid)} size="small">
                            <Icon>delete</Icon>
                          </IconButton>
                        )}
                      </>
                    }
                  />
                  {isHovered[item.file_uuid] && (
                    <Box component={'span'} className={classes.previewInfo}>
                      <Typography noWrap textAlign={'center'}>
                        {item.file.name}
                      </Typography>
                      <Typography textAlign={'center'} fontWeight={'light'}>
                        {bytesToSize(item.file.size)}
                      </Typography>
                    </Box>
                  )}
                </ListItem>
              ))}
          </List>
        </ChunkedUploady>
      </CardContent>
    </Root>
  );
}
