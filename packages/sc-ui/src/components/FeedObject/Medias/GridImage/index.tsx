import React, {Component, useState} from 'react';
import {styled} from '@mui/material/styles';
import PreviewImage from './PreviewImage';
import PropTypes from 'prop-types';
import {Grid, Typography, Box} from '@mui/material';
import classNames from 'classnames';
import ZoomOut from '@mui/icons-material/ZoomOutMap';
import {MAX_GRID_IMAGES} from '../../../../constants/Media';
import IconPdf from '@mui/icons-material/PictureAsPdf';
import IconGenericsFile from '@mui/icons-material/InsertDriveFileOutlined';

const PREFIX = 'SCGridImage';

const classes = {
  background: `${PREFIX}-background`,
  heightOne: `${PREFIX}-heightOne`,
  heightTwo: `${PREFIX}-heightTwo`,
  heightThree: `${PREFIX}-heightThree`,
  cover: `${PREFIX}-cover`,
  coverText: `${PREFIX}-coverText`,
  slide: `${PREFIX}-slide`,
  border: `${PREFIX}-border`,
  gallery: `${PREFIX}-gallery`,
  title: `${PREFIX}-title`,
  iconFile: `${PREFIX}-iconFile`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(() => ({
  textAlign: 'center',
  margin: 'auto',
  width: '100%',
  position: 'relative',

  [`& .${classes.background}`]: {
    backgroundSize: 'cover !important',
    backgroundPosition: 'center !important',
    backgroundRepeat: 'no-repeat !important',
    backgroundImage: 'url(/static/frontend_v2/images/image.svg)'
  },

  [`& .${classes.heightOne}`]: {
    width: '100%',
    paddingTop: '100%'
  },

  [`& .${classes.heightTwo}`]: {
    width: '50%',
    paddingTop: '50%'
  },

  [`& .${classes.heightThree}`]: {
    width: '33.3333%',
    paddingTop: '33.3333%'
  },

  [`& .${classes.cover}`]: {
    backgroundColor: 'rgba(102,102,102,0.7)',
    opacity: 0.8,
    position: 'absolute',
    right: 0,
    top: 0,
    left: 0,
    bottom: 0,
    borderRadius: 6
  },

  [`& .${classes.coverText}`]: {
    right: 0,
    left: 0,
    bottom: 0,
    color: '#FFF',
    fontSize: '7%',
    position: 'absolute',
    top: '50%',
    transform: 'translate(0%, -50%)',
    textAlign: 'center',
    '& > p': {
      margin: 0,
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)'
    }
  },

  [`& .${classes.slide}`]: {
    height: 0,
    bottom: '100%',
    transition: '.5s ease',
    overflow: 'hidden',
    fontSize: '3%',
    color: '#FFF'
  },

  [`& .${classes.border}`]: {
    position: 'relative',
    border: '2px solid white',
    borderRadius: 6,
    '&:hover > div': {
      bottom: 0,
      height: 'auto'
    },
    '&:hover > div.animate-text': {
      top: '62%'
    }
  },

  [`& .${classes.gallery}`]: {
    cursor: 'pointer'
  },

  [`& .${classes.title}`]: {
    color: '#FFF'
  },

  [`& .${classes.iconFile}`]: {
    fontSize: 14,
    position: 'relative',
    top: 2
  }
}));

export default function GridImages({
  images,
  gallery = true,
  adornment = null,
  onClick = null
}: {
  images: Array<any>;
  gallery?: boolean;
  adornment?: React.ReactNode;
  onClick?: (any) => void;
}): JSX.Element {
  const [preview, setPreview] = useState(-1);
  const [from, setFrom] = useState(0);
  const [conditionalRender, setConditionalRender] = useState(false);

  // HANDLERS
  const handleClose = () => {
    setPreview(-1);
  };

  // UTILS

  const getImageUrl = (image) => {
    if (typeof image === 'object') {
      return image.image ? image.image : '/static/frontend_v2/images/image.svg';
    }
    return image;
  };

  const openPreviewImage = (index) => {
    if (onClick) {
      return onClick({src: images[index], index});
    }

    if (gallery === false) {
      // Prevent gallery
      return;
    }

    setPreview(index);
  };

  // RENDERING

  const renderTitle = (o) => {
    if (!o) {
      return null;
    }
    let startAdornment = null;
    if (o.type) {
      switch (o.type) {
        case 'doc':
          startAdornment = <IconPdf className={classes.iconFile} />;
          break;
        default:
          startAdornment = <IconGenericsFile className={classes.iconFile} />;
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
    const overlay = images.length > from && from == 1 ? renderCountOverlay(true) : renderOverlay(0);

    return (
      <Grid container>
        <Grid
          item
          xs={12}
          classes={{root: classNames(classes.border, classes.heightOne, classes.background, {[classes.gallery]: gallery})}}
          onClick={() => openPreviewImage(0)}
          style={{background: `url(${getImageUrl(images[0])})`}}>
          {overlay}
          {renderTitle(images[0])}
        </Grid>
      </Grid>
    );
  };

  const renderTwo = () => {
    const overlay = images.length > from && [2, 3].includes(+from) ? renderCountOverlay(true) : renderOverlay(1);
    const conditionalRender = [3, 4].includes(images.length) || (images.length > +from && [3, 4].includes(+from));
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
          onClick={() => openPreviewImage(conditionalRender ? 1 : 0)}
          style={{background: `url(${getImageUrl(conditionalRender ? images[2] : images[1])})`}}>
          {overlay}
          {renderTitle(images[1])}
        </Grid>
      </Grid>
    );
  };

  const renderThree = () => {
    const conditionalRender = images.length == 4 || (images.length > +from && +from == 4);
    const overlay =
      !from || from > 5 || (images.length > from && [4, 5].includes(+from)) ? renderCountOverlay(true) : renderOverlay(conditionalRender ? 3 : 4);
    return (
      <Grid container>
        <Grid
          item
          xs={6}
          md={4}
          classes={{root: classNames(classes.border, classes.heightThree, classes.background, {[classes.gallery]: gallery})}}
          onClick={() => openPreviewImage(conditionalRender ? 1 : 2)}
          style={{background: `url(${getImageUrl(conditionalRender ? images[1] : images[2])})`}}>
          {renderOverlay(conditionalRender ? 1 : 2)}
          {renderTitle(images[1])}
        </Grid>
        <Grid
          item
          xs={6}
          md={4}
          classes={{root: classNames(classes.border, classes.heightThree, classes.background, {[classes.gallery]: gallery})}}
          onClick={() => openPreviewImage(conditionalRender ? 2 : 3)}
          style={{background: `url(${this.getImageUrl(conditionalRender ? images[2] : images[3])})`}}>
          {renderOverlay(conditionalRender ? 2 : 3)}
          {renderTitle(images[2])}
        </Grid>
        <Grid
          item
          xs={6}
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

  const renderOverlay = (id) => {
    return [
      <div key={`cover-${id}`} className={classNames(classes.cover, classes.slide)}></div>,
      <div key={`cover-text-${id}`} className={classNames(classes.coverText, classes.slide, 'animate-text')} style={{fontSize: '100%'}}>
        <ZoomOut />
      </div>
    ];
  };

  const renderCountOverlay = (more) => {
    const extra = images.length - (from && from > 5 ? 5 : from);

    return [
      more && <div key="count" className={classes.cover}></div>,
      more && (
        <div key="count-sub" className={classes.coverText} style={{fontSize: '200%'}}>
          <p>+{extra}</p>
        </div>
      )
    ];
  };

  const imagesToShow = [...images];
  if (from && images.length > from) {
    imagesToShow.length = from;
  }
  return (
    <Root>
      {adornment}
      {[1, 3, 4].includes(imagesToShow.length) && renderOne()}
      {imagesToShow.length >= 2 && imagesToShow.length != 4 && renderTwo()}
      {imagesToShow.length >= 4 && renderThree()}

      {/* eslint-disable-next-line @typescript-eslint/unbound-method */}
      {preview !== -1 && <PreviewImage onClose={handleClose} index={preview} images={images} />}
    </Root>
  );
}
