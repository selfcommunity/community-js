import {styled, Grid, Typography, Icon, Stack} from '@mui/material';
import classNames from 'classnames';
import {Fragment, useCallback, useMemo, useState} from 'react';
import {useInView} from 'react-intersection-observer';
import {Lightbox} from '../../Lightbox';
import {PREFIX} from './constants';
import DocComponent from './DocComponent';
import {filteredDocs, filteredImages} from './filter';
import {SCMediaType} from '@selfcommunity/types';
import {http, HttpResponse} from '@selfcommunity/api-services';
import {Logger} from '@selfcommunity/utils';
import {SCOPE_SC_UI} from '../../../constants/Errors';

const classes = {
  displayRoot: `${PREFIX}-display-root`,
  background: `${PREFIX}-background`,
  backgroundPortrait: `${PREFIX}-background-portrait`,
  heightOne: `${PREFIX}-height-one`,
  heightHalfOne: `${PREFIX}-height-half-one`,
  heightTwo: `${PREFIX}-height-two`,
  heightThree: `${PREFIX}-height-three`,
  cover: `${PREFIX}-cover`,
  coverText: `${PREFIX}-cover-text`,
  slide: `${PREFIX}-slide`,
  border: `${PREFIX}-border`,
  gallery: `${PREFIX}-gallery`,
  title: `${PREFIX}-title`,
  iconFile: `${PREFIX}-icon-file`,
  docsWrapper: `${PREFIX}-docs-wrapper`
};

const Root = styled(Stack, {
  name: PREFIX,
  slot: 'DisplayRoot'
})(() => ({}));

export interface ImagePreviewComponentProps {
  /**
   * Class name to apply to the root object
   * @default empty string
   */
  className?: string;
  /**
   * Medias objs
   * @default []
   */
  medias: SCMediaType[];
  /**
   * Maximum number of visible media
   * @default 5
   */
  maxVisible?: number;
  /**
   * Gallery view
   * @default true
   */
  gallery?: boolean;
  /**
   * Handles on media click
   */
  onMediaClick?: (any) => void;
}
export default (props: ImagePreviewComponentProps): JSX.Element => {
  // PROPS
  const {className = '', medias = [], maxVisible = 5, gallery = true, onMediaClick = null} = props;

  // STATE
  const [preview, setPreview] = useState(-1);
  const [toolbarButtons, setToolbarButtons] = useState(undefined);
  const {ref, inView} = useInView({triggerOnce: false});

  // MEMO
  const images = useMemo(() => medias.filter(filteredImages), [medias]);
  const docs = useMemo(() => medias.filter(filteredDocs), [medias]);

  // HANDLERS
  const handleClose = () => {
    setPreview(-1);
    setToolbarButtons(undefined);
  };

  // UTILS
  const getImageUrl = (image, original = false) => {
    if (typeof image === 'object') {
      const _image = image.image_thumbnail ? image.image_thumbnail.url : image.image ? image.image : '/static/frontend_v2/images/image.svg';
      return original && image.image ? image.image : _image;
    }
    return image;
  };

  const openPreviewImage = useCallback(
    (index: number) => {
      if (gallery === false) {
        // Prevent gallery
        return;
      }

      setPreview(index);
      onMediaClick(images[index]);
    },
    [gallery, setPreview, images, onMediaClick]
  );

  // RENDERING

  const renderTitle = (o) => {
    if (!o) {
      return null;
    }
    let startAdornment = null;
    if (o.type) {
      switch (o.type) {
        case 'doc':
          startAdornment = <Icon className={classes.iconFile}>picture_as_pdf</Icon>;
          break;
        default:
          startAdornment = <Icon className={classes.iconFile}>insert_drive_file</Icon>;
          break;
      }
    }
    return (
      <Fragment>
        {o.title && (
          <div className={classes.title}>
            <Typography variant="subtitle2">
              {startAdornment} {o.title}
            </Typography>
          </div>
        )}
      </Fragment>
    );
  };

  const renderOne = () => {
    const overlay = images.length > maxVisible && maxVisible == 1 ? renderCountOverlay(true) : renderOverlay(0);
    const isGif = images[0]['image_mimetype'] ? images[0]['image_mimetype'].includes('image/gif') : false;
    const isLandscape = images[0].image_height < images[0].image_width;
    return (
      <Grid
        container
        style={{
          ...(images[0].image_thumbnail && images[0].image_thumbnail.color ? {backgroundColor: images[0].image_thumbnail.color} : {})
        }}>
        <Grid
          item
          ref={ref}
          xs={12}
          classes={{
            root: classNames(classes.border, classes.heightOne, {
              ...(isGif || isLandscape ? {[classes.background]: true} : {[classes.backgroundPortrait]: true}),
              [classes.gallery]: gallery,
              [classes.heightHalfOne]: images.length > 1
            })
          }}
          onClick={() => openPreviewImage(0)}
          style={{
            background: `url(${getImageUrl(images[0], inView && isGif)})`,
            ...(isLandscape ? {paddingTop: `${(100 * images[0].image_height) / images[0].image_width}%`} : {})
          }}>
          {overlay}
          {renderTitle(images[0])}
        </Grid>
      </Grid>
    );
  };

  const renderTwo = () => {
    const overlay = images.length > maxVisible && [2, 3].includes(+maxVisible) ? renderCountOverlay(true) : renderOverlay(1);
    const conditionalRender = [3, 4].includes(images.length) || (images.length > +maxVisible && [3, 4].includes(+maxVisible));
    return (
      <Grid container>
        <Grid
          item
          xs={6}
          classes={{root: classNames(classes.border, classes.heightTwo, classes.background, {[classes.gallery]: gallery})}}
          onClick={() => openPreviewImage(conditionalRender ? 1 : 0)}
          style={{background: `url(${getImageUrl(conditionalRender ? images[1] : images[0])})`}}>
          {renderOverlay(conditionalRender ? 1 : 0)}
          {renderTitle(images[0])}
        </Grid>
        <Grid
          item
          xs={6}
          classes={{root: classNames(classes.border, classes.heightTwo, classes.background, {[classes.gallery]: gallery})}}
          onClick={() => openPreviewImage(conditionalRender ? 2 : 1)}
          style={{background: `url(${getImageUrl(conditionalRender ? images[2] : images[1])})`}}>
          {overlay}
          {renderTitle(images[1])}
        </Grid>
      </Grid>
    );
  };

  const renderThree = () => {
    const conditionalRender = images.length == 4 || (images.length > +maxVisible && +maxVisible == 4);
    const overlay =
      !maxVisible || maxVisible > 5 || (images.length > maxVisible && [4, 5].includes(+maxVisible))
        ? renderCountOverlay(true)
        : renderOverlay(conditionalRender ? 3 : 4);
    return (
      <Grid container>
        <Grid
          item
          xs={4}
          md={4}
          classes={{root: classNames(classes.border, classes.heightThree, classes.background, {[classes.gallery]: gallery})}}
          onClick={() => openPreviewImage(conditionalRender ? 1 : 2)}
          style={{background: `url(${getImageUrl(conditionalRender ? images[1] : images[2])})`}}>
          {renderOverlay(conditionalRender ? 1 : 2)}
          {renderTitle(images[1])}
        </Grid>
        <Grid
          item
          xs={4}
          md={4}
          classes={{root: classNames(classes.border, classes.heightThree, classes.background, {[classes.gallery]: gallery})}}
          onClick={() => openPreviewImage(conditionalRender ? 2 : 3)}
          style={{background: `url(${getImageUrl(conditionalRender ? images[2] : images[3])})`}}>
          {renderOverlay(conditionalRender ? 2 : 3)}
          {renderTitle(images[2])}
        </Grid>
        <Grid
          item
          xs={4}
          md={4}
          classes={{root: classNames(classes.border, classes.heightThree, classes.background, {[classes.gallery]: gallery})}}
          onClick={() => openPreviewImage(conditionalRender ? 3 : 4)}
          style={{background: `url(${getImageUrl(conditionalRender ? images[3] : images[4])})`}}>
          {overlay}
          {renderTitle(images[3])}
        </Grid>
      </Grid>
    );
  };

  const renderOverlay = (id: number) => {
    if (!gallery) {
      return null;
    }
    return [
      <div key={`cover-${id}`} className={classNames(classes.cover, classes.slide)}></div>,
      <div key={`cover-text-${id}`} className={classNames(classes.coverText, classes.slide, 'animate-text')} style={{fontSize: '100%'}}>
        <Icon>zoom_out_map</Icon>
      </div>
    ];
  };

  const renderCountOverlay = (more: boolean) => {
    const extra = images.length - (maxVisible && maxVisible > 5 ? 5 : maxVisible);

    return [
      more && <div key="count" className={classes.cover}></div>,
      more && (
        <div key="count-sub" className={classes.coverText} style={{fontSize: '200%'}}>
          <p>+{extra}</p>
        </div>
      )
    ];
  };

  const handleDownload = useCallback(
    async (index: number) => {
      try {
        const response: HttpResponse<Blob> = await http.request({url: docs[index].url, responseType: 'blob'});
        const blob = new Blob([response.data], {type: 'application/pdf'});
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = docs[index].title;
        link.click();
        // Cleanup
        window.URL.revokeObjectURL(url);

        onMediaClick?.(docs[index]);
      } catch (error) {
        Logger.error(SCOPE_SC_UI, error);
      }
    },
    [onMediaClick]
  );

  const imagesToShow = [...images];
  if (maxVisible && images.length > maxVisible) {
    imagesToShow.length = maxVisible;
  }

  if (medias.length === 0) {
    return null;
  }

  return (
    <Root className={classNames(classes.displayRoot, className)}>
      {[1, 3, 4].includes(imagesToShow.length) && renderOne()}
      {imagesToShow.length >= 2 && imagesToShow.length < 4 && renderTwo()}
      {imagesToShow.length >= 4 && renderThree()}

      {preview !== -1 && <Lightbox onClose={handleClose} index={preview} medias={images} toolbarButtons={toolbarButtons} />}

      <Stack className={classes.docsWrapper}>
        {docs.map((doc, i) => (
          <DocComponent key={doc.id} document={doc} index={i} handleDownload={handleDownload} onMediaClick={onMediaClick} />
        ))}
      </Stack>
    </Root>
  );
};
