import React, { useCallback, useMemo, useState } from 'react';
import { styled } from '@mui/material/styles';
import Lightbox from './Lightbox';
import { Box, Grid, Typography } from '@mui/material';
import classNames from 'classnames';
import Icon from '@mui/material/Icon';
import { useInView } from 'react-intersection-observer';
import { PREFIX } from './constants';
import filter from './filter';

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
  iconFile: `${PREFIX}-icon-file`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'DisplayRoot'
})(({theme}) => ({

}));
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
  medias: Array<any>;
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
  const {ref, inView} = useInView({triggerOnce: false});

  // MEMO
  const _medias = useMemo(() => medias.filter(filter), [medias]);

  // HANDLERS
  const handleClose = () => {
    setPreview(-1);
  };

  // UTILS
  const getImageUrl = (image, original = false) => {
    if (typeof image === 'object') {
      const _image = image.image_thumbnail ? image.image_thumbnail.url : image.image ? image.image : '/static/frontend_v2/images/image.svg';
      return original && image.image ? image.image : _image;
    }
    return image;
  };

  const openPreviewImage = useCallback((index) => {
    if (gallery === false) {
      // Prevent gallery
      return;
    }

    setPreview(index);

    onMediaClick(_medias[index]);
  }, [_medias]);

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
      <React.Fragment>
        {o.title && (
          <div className={classes.title}>
            <Typography variant="subtitle2">
              {startAdornment} {o.title}
            </Typography>
          </div>
        )}
      </React.Fragment>
    );
  };

  const renderOne = () => {
    const overlay = _medias.length > maxVisible && maxVisible == 1 ? renderCountOverlay(true) : renderOverlay(0);
    const isGif = _medias[0].image_mimetype ? _medias[0].image_mimetype.includes('image/gif') : false;
    const isLandscape = _medias[0].image_height < _medias[0].image_width;
    return (
      <Grid
        container
        style={{
          ...(_medias[0].image_thumbnail && _medias[0].image_thumbnail.color ? {backgroundColor: _medias[0].image_thumbnail.color} : {})
        }}>
        <Grid
          item
          ref={ref}
          xs={12}
          classes={{
            root: classNames(classes.border, classes.heightOne, {
              ...(isGif || isLandscape ? {[classes.background]: true} : {[classes.backgroundPortrait]: true}),
              [classes.gallery]: gallery,
              [classes.heightHalfOne]: _medias.length > 1
            })
          }}
          onClick={() => openPreviewImage(0)}
          style={{
            background: `url(${getImageUrl(_medias[0], inView && isGif)})`,
            ...(isLandscape ? {paddingTop: `${(100 * _medias[0].image_height) / _medias[0].image_width}%`} : {})
          }}>
          {overlay}
          {renderTitle(_medias[0])}
        </Grid>
      </Grid>
    );
  };

  const renderTwo = () => {
    const overlay = _medias.length > maxVisible && [2, 3].includes(+maxVisible) ? renderCountOverlay(true) : renderOverlay(1);
    const conditionalRender = [3, 4].includes(_medias.length) || (_medias.length > +maxVisible && [3, 4].includes(+maxVisible));
    return (
      <Grid container>
        <Grid
          item
          xs={6}
          classes={{root: classNames(classes.border, classes.heightTwo, classes.background, {[classes.gallery]: gallery})}}
          onClick={() => openPreviewImage(conditionalRender ? 1 : 0)}
          style={{background: `url(${getImageUrl(conditionalRender ? _medias[1] : _medias[0])})`}}>
          {renderOverlay(conditionalRender ? 1 : 0)}
          {renderTitle(_medias[0])}
        </Grid>
        <Grid
          item
          xs={6}
          classes={{root: classNames(classes.border, classes.heightTwo, classes.background, {[classes.gallery]: gallery})}}
          onClick={() => openPreviewImage(conditionalRender ? 2 : 1)}
          style={{background: `url(${getImageUrl(conditionalRender ? _medias[2] : _medias[1])})`}}>
          {overlay}
          {renderTitle(_medias[1])}
        </Grid>
      </Grid>
    );
  };

  const renderThree = () => {
    const conditionalRender = _medias.length == 4 || (_medias.length > +maxVisible && +maxVisible == 4);
    const overlay =
      !maxVisible || maxVisible > 5 || (_medias.length > maxVisible && [4, 5].includes(+maxVisible))
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
          style={{background: `url(${getImageUrl(conditionalRender ? _medias[1] : _medias[2])})`}}>
          {renderOverlay(conditionalRender ? 1 : 2)}
          {renderTitle(_medias[1])}
        </Grid>
        <Grid
          item
          xs={4}
          md={4}
          classes={{root: classNames(classes.border, classes.heightThree, classes.background, {[classes.gallery]: gallery})}}
          onClick={() => openPreviewImage(conditionalRender ? 2 : 3)}
          style={{background: `url(${getImageUrl(conditionalRender ? _medias[2] : _medias[3])})`}}>
          {renderOverlay(conditionalRender ? 2 : 3)}
          {renderTitle(_medias[2])}
        </Grid>
        <Grid
          item
          xs={4}
          md={4}
          classes={{root: classNames(classes.border, classes.heightThree, classes.background, {[classes.gallery]: gallery})}}
          onClick={() => openPreviewImage(conditionalRender ? 3 : 4)}
          style={{background: `url(${getImageUrl(conditionalRender ? _medias[3] : _medias[4])})`}}>
          {overlay}
          {renderTitle(_medias[3])}
        </Grid>
      </Grid>
    );
  };

  const renderOverlay = (id) => {
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

  const renderCountOverlay = (more) => {
    const extra = _medias.length - (maxVisible && maxVisible > 5 ? 5 : maxVisible);

    return [
      more && <div key="count" className={classes.cover}></div>,
      more && (
        <div key="count-sub" className={classes.coverText} style={{fontSize: '200%'}}>
          <p>+{extra}</p>
        </div>
      )
    ];
  };

  const imagesToShow = [..._medias];
  if (maxVisible && _medias.length > maxVisible) {
    imagesToShow.length = maxVisible;
  }

  if (_medias.length === 0) {
    return null;
  }

  return (
    <Root className={classNames(classes.displayRoot, className)}>
      {[1, 3, 4].includes(imagesToShow.length) && renderOne()}
      {imagesToShow.length >= 2 && imagesToShow.length != 4 && renderTwo()}
      {imagesToShow.length >= 4 && renderThree()}

      {/* eslint-disable-next-line @typescript-eslint/unbound-method */}
      {preview !== -1 && <Lightbox onClose={handleClose} index={preview} medias={_medias} />}
    </Root>
  );
};
