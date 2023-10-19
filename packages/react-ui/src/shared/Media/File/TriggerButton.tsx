import React, { forwardRef, ReactElement, useCallback, useMemo, useState } from 'react';
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
} from '@mui/material';
import Icon from '@mui/material/Icon';
import { PREFIX } from './constants';
import { styled } from '@mui/material/styles';
import classNames from 'classnames';
import { SCContextType, SCThemeType, useSCContext } from '@selfcommunity/react-core';
import { FormattedMessage } from 'react-intl';
import MediaChunkUploader from '../../MediaChunkUploader';
import ChunkedUploady from '@rpldy/chunked-uploady';
import { SCMediaType } from '@selfcommunity/types';
import { Endpoints } from '@selfcommunity/api-services';
import asUploadButton from './asUploadButton';
import { useSnackbar } from 'notistack';
import {SCMediaChunkType} from '../../../types/media';

const classes = {
  triggerRoot: `${PREFIX}-trigger-root`,
  triggerDrawerRoot: `${PREFIX}-trigger-drawer-root`,
  triggerMenuRoot: `${PREFIX}-trigger-menu-root`,
  paper: `${PREFIX}-paper`,
  item: `${PREFIX}-item`,
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

const PhotoUploadListItemButton = asUploadButton(
  forwardRef((props: ListItemButtonProps, ref: any) => (
    <ListItemButton {...props} aria-label="upload" ref={ref} />
  )), {accept: 'image/*', capture: 'true'}
);

const GalleryUploadListItemButton = asUploadButton(
  forwardRef((props: ListItemButtonProps, ref: any) => (
    <ListItemButton {...props} aria-label="upload" ref={ref} />
  )), {accept: 'image/*', capture: 'false'}
);

const DocumentUploadListItemButton = asUploadButton(
  forwardRef((props: ListItemButtonProps, ref: any) => (
    <ListItemButton {...props} aria-label="upload" ref={ref} />
  )), {accept: 'application/pdf', capture: 'false'}
);

const GalleryUploadMenuItem = asUploadButton(
  forwardRef((props: MenuItemProps, ref: any) => (
    <MenuItem {...props} aria-label="upload" ref={ref} />
  )), {accept: 'image/*', capture: 'false'}
);

const DocumentUploadMenuItem = asUploadButton(
  forwardRef((props: MenuItemProps, ref: any) => (
    <MenuItem {...props} aria-label="upload" ref={ref} />
  )), {accept: 'application/pdf', capture: 'false'}
);

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

  // HOOKS
  const theme = useTheme<SCThemeType>();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const {enqueueSnackbar, closeSnackbar} = useSnackbar();

  // HANDLERS
  const handleOpen = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);
  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);
  const handleFilterByMime = useCallback((file) => {
    return file.type.startsWith('image/') || file.type === 'application/pdf';
  }, []);
  const handleSuccess = useCallback((media: SCMediaType) => {
    onAdd && onAdd(media);
  }, [onAdd]);
  const handleProgress = useCallback((chunks: any) => {
    console.log(chunks);
    setIsUploading(Object.keys(chunks).length > 0);
  }, []);
  const handleError = useCallback((chunk: SCMediaChunkType, error: string) => {
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
  }, [enqueueSnackbar]);

  const list = useMemo(() => {
    if (isMobile) {
      return [
        <ListItem className={classes.item} key="photo">
          <PhotoUploadListItemButton inputFieldName="image">
            <FormattedMessage id="ui.unstable_composer.media.file.photo" defaultMessage="ui.unstable_composer.media.file.photo" />
          </PhotoUploadListItemButton>
        </ListItem>,
        <ListItem className={classes.item} key="gallery">
          <GalleryUploadListItemButton inputFieldName="image">
            <FormattedMessage id="ui.unstable_composer.media.file.gallery" defaultMessage="ui.unstable_composer.media.file.gallery" />
          </GalleryUploadListItemButton>
        </ListItem>,
        <ListItem className={classes.item} key="document">
            <DocumentUploadListItemButton inputFieldName="document">
              <FormattedMessage id="ui.unstable_composer.media.file.document" defaultMessage="ui.unstable_composer.media.file.document" />
            </DocumentUploadListItemButton>
        </ListItem>
      ];
    } else {
      return [
        <GalleryUploadMenuItem extraProps={{className: classes.item}} inputFieldName="image" key="gallery">
          <FormattedMessage id="ui.unstable_composer.media.file.gallery" defaultMessage="ui.unstable_composer.media.file.gallery" />
        </GalleryUploadMenuItem>,
        <DocumentUploadMenuItem extraProps={{className: classes.item}} key="document" inputFieldName="document">
          <FormattedMessage id="ui.unstable_composer.media.file.document" defaultMessage="ui.unstable_composer.media.file.document" />
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
      multiple
    >
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
