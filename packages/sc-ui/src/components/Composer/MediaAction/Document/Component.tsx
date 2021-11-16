import {asUploadButton} from '@rpldy/upload-button';
import React, {forwardRef, SyntheticEvent, useContext, useState} from 'react';
import {Alert, AlertTitle, Box, Button, Button as MuiButton, CircularProgress, Fade, Grid, Typography} from '@mui/material';
import {FormattedMessage} from 'react-intl';
import {ReactSortable} from 'react-sortablejs';
import classNames from 'classnames';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import ChunkedUploady from '@rpldy/chunked-uploady';
import {Endpoints, SCContext, SCContextType} from '@selfcommunity/core';
import {styled} from '@mui/material/styles';
import MediaChunkUploader from '../../../../shared/MediaChunkUploader';
import {SCMediaChunkType} from '../../../../types/media';
import DocumentIcon from '@mui/icons-material/PictureAsPdfOutlined';

const PREFIX = 'SCMediaActionDocument';

const classes = {
  sortableMedia: `${PREFIX}-sortableMedia`,
  sortableMediaCover: `${PREFIX}-sortableMediaCover`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  padding: theme.spacing(),
  [`& .${classes.sortableMedia}`]: {
    position: 'relative'
  },
  [`& .${classes.sortableMediaCover}`]: {
    backgroundSize: 'cover !important',
    backgroundPosition: 'center !important',
    backgroundRepeat: 'no-repeat !important',
    border: '2px solid white',
    borderRadius: 6,
    height: 300
  }
}));

const UploadButton = asUploadButton(
  forwardRef((props, ref) => (
    <MuiButton {...props} aria-label="upload document" ref={ref} variant="outlined">
      <DocumentIcon /> <FormattedMessage id="thread.dialog.media.documents.add" defaultMessage="thread.dialog.media.documents.add" />
    </MuiButton>
  ))
);

const SortableComponent = forwardRef<HTMLDivElement, any>((props, ref) => {
  return (
    <Grid container ref={ref}>
      {props.children}
    </Grid>
  );
});

export default ({
  medias = [],
  onSuccess,
  onSort,
  onDelete
}: {
  medias?: any[];
  onSuccess: (media: any) => void;
  onSort: (newSort: any[]) => void;
  onDelete: (id?: number) => (event: SyntheticEvent) => void;
}): JSX.Element => {
  // State variables
  const [uploading, setUploading] = useState({});
  const [errors, setErrors] = useState({});

  // Context
  const scContext: SCContextType = useContext(SCContext);

  // Handlers

  const handleSuccess = (media: any) => {
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
        <ReactSortable list={medias} setList={onSort} tag={SortableComponent}>
          {medias.map((media) => (
            <Grid
              key={media.id}
              item
              xs={6}
              className={classNames(classes.sortableMedia, classes.sortableMediaCover)}
              style={{backgroundImage: `url(${media.image})`}}>
              <Box sx={{textAlign: 'right'}} m={1}>
                <Button onClick={onDelete(media.id)} size="small" color="primary" variant="contained">
                  <DeleteIcon />
                </Button>
              </Box>
            </Grid>
          ))}
        </ReactSortable>
        <Grid container>
          {Object.values(uploading).map((media: SCMediaChunkType) => (
            <Grid
              key={media.id}
              item
              xs={6}
              className={classNames(classes.sortableMedia, classes.sortableMediaCover)}
              style={{backgroundImage: `url(${media.image})`}}>
              <Box>
                <CircularProgress variant="determinate" value={media.completed} />
                <Box top={0} left={0} bottom={0} right={0} position="absolute" display="flex" alignItems="center" justifyContent="center">
                  <Typography variant="caption" component="div" color="textSecondary">{`${Math.round(media.completed)}%`}</Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
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
