import React, {forwardRef, ReactElement, useCallback, useMemo, useState} from 'react';
import {
  CircularProgress,
  IconButton,
  IconButtonProps,
  List,
  ListItem,
  ListItemButton,
  ListItemButtonProps,
  Menu,
  MenuItem,
  MenuItemProps,
  SwipeableDrawer,
  useMediaQuery,
  useTheme,
  Icon,
  styled
} from '@mui/material';
import {PREFIX} from './constants';
import classNames from 'classnames';
import {SCContextType, SCPreferences, SCThemeType, useSCContext, useSCPreferences} from '@selfcommunity/react-core';
import {FormattedMessage} from 'react-intl';
import MediaChunkUploader from '../../MediaChunkUploader';
import ChunkedUploady from '@rpldy/chunked-uploady';
import {SCMediaType} from '@selfcommunity/types';
import {Endpoints} from '@selfcommunity/api-services';
import asUploadButton from './asUploadButton';
import {useSnackbar} from 'notistack';
import {SCMediaChunkType} from '../../../types/media';

const classes = {
  triggerRoot: `${PREFIX}-trigger-root`,
  triggerDrawerRoot: `${PREFIX}-trigger-drawer-root`,
  triggerMenuRoot: `${PREFIX}-trigger-menu-root`,
  paper: `${PREFIX}-paper`,
  item: `${PREFIX}-item`
};

const Root = styled(IconButton, {
  name: PREFIX,
  slot: 'TriggerRoot'
})(() => ({}));

const SwipeableDrawerRoot = styled(SwipeableDrawer, {
  name: PREFIX,
  slot: 'TriggerDrawerRoot'
})(() => ({}));

const MenuRoot = styled(Menu, {
  name: PREFIX,
  slot: 'TriggerMenuRoot'
})(() => ({}));

export interface TriggerIconButtonProps extends IconButtonProps {
  /**
   * Callback triggered when a media is added
   * @param media
   */
  onAdd?: (media: SCMediaType) => void;
}

export default ({className, onAdd = null, ...rest}: TriggerIconButtonProps): ReactElement => {
  // STATE
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  // CONTEXT
  const scContext: SCContextType = useSCContext();
  const {preferences} = useSCPreferences();

  // HOOKS
  const theme = useTheme<SCThemeType>();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const {enqueueSnackbar, closeSnackbar} = useSnackbar();

  const acceptedMediaMimetypes = useMemo(
    () =>
      preferences &&
      SCPreferences.CONFIGURATIONS_ACCEPTED_MEDIA_MIMETYPES in preferences &&
      preferences[SCPreferences.CONFIGURATIONS_ACCEPTED_MEDIA_MIMETYPES].value,
    [preferences]
  );

  const mimeTypesArray: string[] = useMemo(() => acceptedMediaMimetypes.split(','), [acceptedMediaMimetypes]);
  const {imageMimeTypes, documentMimeTypes} = useMemo(
    () =>
      mimeTypesArray.reduce(
        (acc: {imageMimeTypes: string; documentMimeTypes: string}, type: string): {imageMimeTypes: string; documentMimeTypes: string} => {
          if (type.startsWith('image/')) {
            acc = {
              ...acc,
              imageMimeTypes: acc.imageMimeTypes.concat(`${type},`)
            };
          } else {
            acc = {
              ...acc,
              documentMimeTypes: acc.documentMimeTypes.concat(`${type},`)
            };
          }
          return acc;
        },
        {imageMimeTypes: '', documentMimeTypes: ''}
      ),
    [mimeTypesArray]
  );
  const formattedImageMimeTypes = useMemo(() => imageMimeTypes.substring(0, imageMimeTypes.length - 1), [imageMimeTypes]);
  const formattedDocumentMimeTypes = useMemo(() => documentMimeTypes.substring(0, documentMimeTypes.length - 1), [documentMimeTypes]);

  const PhotoUploadListItemButton = asUploadButton(
    forwardRef((props: ListItemButtonProps, ref: any) => <ListItemButton {...props} aria-label="upload" ref={ref} />),
    {accept: formattedImageMimeTypes, capture: 'camera'}
  );

  const GalleryUploadListItemButton = asUploadButton(
    forwardRef((props: ListItemButtonProps, ref: any) => <ListItemButton {...props} aria-label="upload" ref={ref} />),
    {accept: formattedImageMimeTypes}
  );

  const DocumentUploadListItemButton = asUploadButton(
    forwardRef((props: ListItemButtonProps, ref: any) => <ListItemButton {...props} aria-label="upload" ref={ref} />),
    {accept: formattedDocumentMimeTypes}
  );

  const GalleryUploadMenuItem = asUploadButton(
    forwardRef((props: MenuItemProps, ref: any) => <MenuItem {...props} aria-label="upload" ref={ref} />),
    {accept: formattedImageMimeTypes}
  );

  const DocumentUploadMenuItem = asUploadButton(
    forwardRef((props: MenuItemProps, ref: any) => <MenuItem {...props} aria-label="upload" ref={ref} />),
    {accept: formattedDocumentMimeTypes}
  );

  // HANDLERS
  const handleOpen = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleFilterByMime = useCallback(
    (file: File) => {
      if (acceptedMediaMimetypes.includes(file.type)) {
        return true;
      }

      const _snackBar = enqueueSnackbar(<FormattedMessage id="ui.composer.media.file.error" defaultMessage="ui.composer.media.file.error" />, {
        variant: 'error',
        anchorOrigin: {horizontal: 'center', vertical: 'top'},
        autoHideDuration: 5000,
        SnackbarProps: {
          onClick: () => {
            closeSnackbar(_snackBar);
          }
        }
      });

      return false;
    },
    [acceptedMediaMimetypes]
  );

  const handleSuccess = useCallback(
    (media: SCMediaType) => {
      onAdd && onAdd(media);
    },
    [onAdd]
  );

  const handleProgress = useCallback((chunks: any) => {
    //console.log(chunks);
    setIsUploading(Object.keys(chunks).length > 0);
  }, []);

  const handleError = useCallback(
    (chunk: SCMediaChunkType, error: string) => {
      const _snackBar = enqueueSnackbar(`${chunk.name}: ${error}`, {
        variant: 'error',
        anchorOrigin: {horizontal: 'center', vertical: 'top'},
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

  const list = useMemo(() => {
    if (isMobile) {
      return [
        <ListItem className={classes.item} key="photo">
          <PhotoUploadListItemButton inputFieldName="image">
            <FormattedMessage id="ui.composer.media.file.photo" defaultMessage="ui.composer.media.file.photo" />
          </PhotoUploadListItemButton>
        </ListItem>,
        <ListItem className={classes.item} key="gallery">
          <GalleryUploadListItemButton inputFieldName="image">
            <FormattedMessage id="ui.composer.media.file.gallery" defaultMessage="ui.composer.media.file.gallery" />
          </GalleryUploadListItemButton>
        </ListItem>,
        <ListItem className={classes.item} key="document">
          <DocumentUploadListItemButton inputFieldName="document">
            <FormattedMessage id="ui.composer.media.file.document" defaultMessage="ui.composer.media.file.document" />
          </DocumentUploadListItemButton>
        </ListItem>
      ];
    } else {
      return [
        <GalleryUploadMenuItem extraProps={{className: classes.item}} inputFieldName="image" key="gallery">
          <FormattedMessage id="ui.composer.media.file.gallery" defaultMessage="ui.composer.media.file.gallery" />
        </GalleryUploadMenuItem>,
        <DocumentUploadMenuItem extraProps={{className: classes.item}} key="document" inputFieldName="document">
          <FormattedMessage id="ui.composer.media.file.document" defaultMessage="ui.composer.media.file.document" />
        </DocumentUploadMenuItem>
      ];
    }
  }, [isMobile, handleFilterByMime, handleSuccess, handleProgress, handleError]);

  return (
    <ChunkedUploady
      destination={{
        url: `${scContext.settings.portal}${Endpoints.ComposerChunkUploadMedia.url()}`,
        method: Endpoints.ComposerChunkUploadMedia.method
      }}
      fileFilter={handleFilterByMime}
      chunkSize={204800}
      multiple>
      <MediaChunkUploader onSuccess={handleSuccess} onProgress={handleProgress} onError={handleError} />
      <Root className={classNames(className, classes.triggerRoot)} {...rest} aria-label="add media" disabled={isUploading} onClick={handleOpen}>
        {isUploading ? <CircularProgress size={20} /> : <Icon>photo_file</Icon>}
      </Root>
      {isMobile ? (
        <SwipeableDrawerRoot
          onClick={() => setAnchorEl(null)}
          className={classes.triggerDrawerRoot}
          anchor="bottom"
          open={Boolean(anchorEl)}
          onClose={handleClose}
          onOpen={handleOpen}
          PaperProps={{className: classes.paper}}
          disableSwipeToOpen>
          <List>{list}</List>
        </SwipeableDrawerRoot>
      ) : (
        <MenuRoot
          onClick={() => setAnchorEl(null)}
          className={classes.triggerMenuRoot}
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          PaperProps={{className: classes.paper}}>
          {list}
        </MenuRoot>
      )}
    </ChunkedUploady>
  );
};
