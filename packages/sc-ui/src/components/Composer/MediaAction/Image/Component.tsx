import {asUploadButton} from '@rpldy/upload-button';
import React, {forwardRef, SyntheticEvent, useContext, useState} from 'react';
import {
  Alert,
  AlertTitle,
  Box,
  Button as MuiButton,
  CircularProgress,
  Fade,
  IconButton,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Typography
} from '@mui/material';
import ImageIcon from '@mui/icons-material/ImageOutlined';
import {FormattedMessage} from 'react-intl';
import {ReactSortable} from 'react-sortablejs';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import ChunkedUploady from '@rpldy/chunked-uploady';
import {
  Endpoints,
  SCContext,
  SCContextType,
  SCMediaType,
  SCPreferencesContext,
  SCPreferencesContextType,
  SCUserContext,
  SCUserContextType
} from '@selfcommunity/core';
import {styled} from '@mui/material/styles';
import MediaChunkUploader from '../../../../shared/MediaChunkUploader';
import {SCMediaChunkType} from '../../../../types/media';

const PREFIX = 'SCMediaActionImage';

const classes = {
  preview: `${PREFIX}-preview`,
  loadingText: `${PREFIX}-loadingText`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  padding: theme.spacing(),
  [`& .${classes.preview}`]: {
    backgroundSize: 'cover !important',
    backgroundPosition: 'center !important',
    backgroundRepeat: 'no-repeat !important',
    height: 200,
    position: 'relative'
  },
  [`& .${PREFIX}-loadingText`]: {
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,.8)',
    '& > *': {
      color: theme.palette.text.primary
    }
  }
}));

const UploadButton = asUploadButton(
  forwardRef((props, ref) => (
    <MuiButton {...props} aria-label="upload image" ref={ref} variant="outlined">
      <ImageIcon /> <FormattedMessage id="ui.composer.media.image.add" defaultMessage="ui.composer.media.image.add" />
    </MuiButton>
  ))
);

const SortableComponent = forwardRef<HTMLDivElement, any>(({children, ...props}, ref) => {
  return (
    <ImageList ref={ref} cols={3} {...props}>
      {children}
    </ImageList>
  );
});

export default ({
  medias = [],
  onSuccess,
  onSort,
  onDelete
}: {
  medias?: SCMediaType[];
  onSuccess: (media: SCMediaType) => void;
  onSort: (newSort: SCMediaType[]) => void;
  onDelete: (id?: number) => (event: SyntheticEvent) => void;
}): JSX.Element => {
  // State variables
  const [uploading, setUploading] = useState({});
  const [errors, setErrors] = useState({});

  // Context
  const scContext: SCContextType = useContext(SCContext);
  const scPrefernces: SCPreferencesContextType = useContext(SCPreferencesContext);
  const scAuthContext: SCUserContextType = useContext(SCUserContext);

  // Handlers

  const handleSuccess = (media: SCMediaType) => {
    onSuccess(media);
  };

  const handleProgress = (chunks: any) => {
    setUploading({...chunks});
  };

  const handleError = (chunk: SCMediaChunkType, error: string) => {
    setErrors({...errors, [chunk.id]: {...chunk, error}});
  };

  const handleRemoveErrors = (id: string) => {
    return () => {
      delete errors[id];
      setErrors({...errors});
    };
  };

  return (
    <Root>
      <Typography gutterBottom component="div">
        <ReactSortable
          list={[...medias, ...Object.values(uploading)] as any[]}
          setList={(newSort) => onSort(newSort.filter((s: any) => s.upload_id === undefined) as SCMediaType[])}
          tag={SortableComponent}>
          {medias.map((media: SCMediaType) => (
            <ImageListItem key={media.id}>
              <Box className={classes.preview} sx={{backgroundImage: `url(${media.image})`}}></Box>
              <ImageListItemBar
                position="top"
                actionIcon={
                  <IconButton onClick={onDelete(media.id)} size="small">
                    <DeleteIcon />
                  </IconButton>
                }
              />
            </ImageListItem>
          ))}
          {Object.values(uploading).map((media: SCMediaChunkType) => (
            <ImageListItem key={media.id} className={'ignore-elements'}>
              <Box className={classes.preview} sx={{backgroundImage: `url(${media.image})`}}></Box>
              <ImageListItemBar title={<Typography align="center">{`${Math.round(media.completed)}%`}</Typography>} position="top" />
            </ImageListItem>
          ))}
        </ReactSortable>
      </Typography>
      <Box>
        {Object.keys(errors).map((id: string) => (
          <Fade in key={id}>
            <Alert severity="error" onClose={handleRemoveErrors(id)}>
              <AlertTitle>{errors[id].name}</AlertTitle>
              {errors[id].error}
            </Alert>
          </Fade>
        ))}
      </Box>
      <Typography align="center" gutterBottom>
        <ChunkedUploady
          destination={{
            url: `${scContext.settings.portal}${Endpoints.ComposerChunkUploadMedia.url()}`,
            headers: {Authorization: `Bearer ${scContext.settings.session.authToken.accessToken}`},
            method: Endpoints.ComposerChunkUploadMedia.method
          }}
          chunkSize={2142880}
          multiple
          accept="image/*">
          <MediaChunkUploader onSuccess={handleSuccess} onProgress={handleProgress} onError={handleError} />
          <UploadButton inputFieldName="image" />
        </ChunkedUploady>
      </Typography>
    </Root>
  );
};
