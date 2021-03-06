import {asUploadButton} from '@rpldy/upload-button';
import React, {forwardRef, SyntheticEvent, useContext, useState} from 'react';
import {Alert, AlertTitle, Box, Button as MuiButton, Fade, IconButton, ImageList, ImageListItem, ImageListItemBar, Typography} from '@mui/material';
import {FormattedMessage} from 'react-intl';
import {ReactSortable} from 'react-sortablejs';
import ChunkedUploady from '@rpldy/chunked-uploady';
import {SCMediaType} from '@selfcommunity/types';
import {Endpoints} from '@selfcommunity/api-services';
import {SCContext, SCContextType} from '@selfcommunity/react-core';
import {styled} from '@mui/material/styles';
import MediaChunkUploader from '../../MediaChunkUploader';
import {SCMediaChunkType} from '../../../types/media';
import Icon from '@mui/material/Icon';
import {ButtonProps} from '@mui/material/Button/Button';
import {EditMediaProps} from '../types';

const PREFIX = 'SCMediaActionDocument';

const classes = {
  preview: `${PREFIX}-preview`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  padding: theme.spacing(),
  [`& .${classes.preview}`]: {
    backgroundColor: theme.palette.background.default,
    height: 200,
    position: 'relative'
  }
}));

const UploadButton = asUploadButton(
  forwardRef((props: ButtonProps, ref: any) => (
    <MuiButton {...props} aria-label="upload document" ref={ref} variant="outlined" color="inherit">
      <Icon>picture_as_pdf</Icon> <FormattedMessage id="ui.composer.media.document.add" defaultMessage="ui.composer.media.document.add" />
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

export default (props: EditMediaProps): JSX.Element => {
  //PROPS
  const {medias = [], onProgress, onSuccess, onSort, onDelete} = props;

  // STATE
  const [uploading, setUploading] = useState({});
  const [errors, setErrors] = useState({});

  // CONTEXT
  const scContext: SCContextType = useContext(SCContext);

  // HANDLERS

  const handleSuccess = (media: SCMediaType) => {
    onSuccess(media);
  };

  const handleProgress = (chunks: any) => {
    setUploading({...chunks});
    onProgress && onProgress(Object.values(chunks));
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

  /**
   * Renders root object
   */
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
                  <IconButton onClick={onDelete(media.id)} size="small" sx={{color: 'rgba(255, 255, 255, 0.54)'}}>
                    <Icon>delete</Icon>
                  </IconButton>
                }
              />
            </ImageListItem>
          ))}
          {Object.values(uploading).map((media: SCMediaChunkType) => (
            <ImageListItem key={media.id} className={'ignore-elements'}>
              <Box className={classes.preview} sx={{backgroundImage: `url(${media.image})`}}>
                <Icon sx={{position: 'absolute', left: 0, top: 0, width: '100%', height: '100%'}}>picture_as_pdf</Icon>
              </Box>
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
          accept="application/pdf">
          <MediaChunkUploader onSuccess={handleSuccess} onProgress={handleProgress} onError={handleError} />
          <UploadButton inputFieldName="document" />
        </ChunkedUploady>
      </Typography>
    </Root>
  );
};
