import React, {useState} from 'react';
import {styled} from '@mui/material/styles';
import PreviewImage from './PreviewImage';
import {Grid, Typography, Box} from '@mui/material';
import classNames from 'classnames';
import Icon from '@mui/material/Icon';

const PREFIX = 'SCPreviewMediaImage';

const classes = {
  root: `${PREFIX}-root`,
  background: `${PREFIX}-background`,
  heightOne: `${PREFIX}-heightOne`,
  heightHalfOne: `${PREFIX}-heightHalfOne`,
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
})(({theme}) => ({
  textAlign: 'center',
  margin: 'auto',
  width: '100%',
  position: 'relative',
  minHeight: 400,
  [theme.breakpoints.down('md')]: {
    minHeight: 170
  },

  [`& .${classes.background}`]: {
    backgroundSize: 'cover !important',
    backgroundPosition: 'center !important',
    backgroundRepeat: 'no-repeat !important'
  },

  [`& .${classes.heightOne}`]: {
    width: '100%',
    paddingTop: '100%'
  },

  [`& .${classes.heightHalfOne}`]: {
    paddingTop: '50%'
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
    backgroundColor: 'rgba(102,102,102,0.2)',
    opacity: 0.8,
    position: 'absolute',
    right: 0,
    top: 0,
    left: 0,
    bottom: 0
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
    overflow: 'hidden',
    fontSize: '3%',
    color: '#FFF'
  },

  [`& .${classes.border}`]: {
    position: 'relative',
    '&:hover > div': {
      bottom: 0,
      height: 'auto'
    },
    '&:hover > div.animate-text': {
      top: '66%'
    }
  },

  [`& .${classes.gallery}`]: {
    cursor: 'pointer'
  },

  [`& .${classes.title} .MuiTypography-root`]: {
    color: '#FFF',
    backgroundColor: theme.palette.getContrastText('#FFF'),
    opacity: 0.6
  },

  [`& .${classes.iconFile}`]: {
    fontSize: 14,
    position: 'relative',
    top: 2
  }
}));
export interface ImagePreviewComponentProps {
  /**
   * Class name to apply to the root object
   * @default empty string
   */
  className: string;
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
   * Component adornments
   * @default null
   */
  adornment?: React.ReactNode;
  /**
   * Handles on click
   */
  onClick?: (any) => void;
  /**
   * Handles on media click
   */
  onMediaClick?: (any) => void;
}
export default (props: ImagePreviewComponentProps): JSX.Element => {
  // PROPS
  const {className = '', medias = [], maxVisible = 5, gallery = true, adornment = null, onClick = null, onMediaClick = null} = props;

  // STATE
  const [preview, setPreview] = useState(-1);

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
      return onClick({src: medias[index], index});
    }

    if (gallery === false) {
      // Prevent gallery
      return;
    }

    setPreview(index);
    onMediaClick(medias[index]);
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
    const overlay = medias.length > maxVisible && maxVisible == 1 ? renderCountOverlay(true) : renderOverlay(0);

    return (
      <Grid container>
        <Grid
          item
          xs={12}
          classes={{
            root: classNames(classes.border, classes.heightOne, classes.background, {
              [classes.gallery]: gallery,
              [classes.heightHalfOne]: medias.length > 1
            })
          }}
          onClick={() => openPreviewImage(0)}
          style={{background: `url(${getImageUrl(medias[0])})`}}>
          {overlay}
          {renderTitle(medias[0])}
        </Grid>
      </Grid>
    );
  };

  const renderTwo = () => {
    const overlay = medias.length > maxVisible && [2, 3].includes(+maxVisible) ? renderCountOverlay(true) : renderOverlay(1);
    const conditionalRender = [3, 4].includes(medias.length) || (medias.length > +maxVisible && [3, 4].includes(+maxVisible));
    return (
      <Grid container>
        <Grid
          item
          xs={6}
          classes={{root: classNames(classes.border, classes.heightTwo, classes.background, {[classes.gallery]: gallery})}}
          onClick={() => openPreviewImage(conditionalRender ? 1 : 0)}
          style={{background: `url(${getImageUrl(conditionalRender ? medias[1] : medias[0])})`}}>
          {renderOverlay(conditionalRender ? 1 : 0)}
          {renderTitle(medias[0])}
        </Grid>
        <Grid
          item
          xs={6}
          classes={{root: classNames(classes.border, classes.heightTwo, classes.background, {[classes.gallery]: gallery})}}
          onClick={() => openPreviewImage(conditionalRender ? 2 : 1)}
          style={{background: `url(${getImageUrl(conditionalRender ? medias[2] : medias[1])})`}}>
          {overlay}
          {renderTitle(medias[1])}
        </Grid>
      </Grid>
    );
  };

  const renderThree = () => {
    const conditionalRender = medias.length == 4 || (medias.length > +maxVisible && +maxVisible == 4);
    console.log();
    const overlay =
      !maxVisible || maxVisible > 5 || (medias.length > maxVisible && [4, 5].includes(+maxVisible))
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
          style={{background: `url(${getImageUrl(conditionalRender ? medias[1] : medias[2])})`}}>
          {renderOverlay(conditionalRender ? 1 : 2)}
          {renderTitle(medias[1])}
        </Grid>
        <Grid
          item
          xs={4}
          md={4}
          classes={{root: classNames(classes.border, classes.heightThree, classes.background, {[classes.gallery]: gallery})}}
          onClick={() => openPreviewImage(conditionalRender ? 2 : 3)}
          style={{background: `url(${getImageUrl(conditionalRender ? medias[2] : medias[3])})`}}>
          {renderOverlay(conditionalRender ? 2 : 3)}
          {renderTitle(medias[2])}
        </Grid>
        <Grid
          item
          xs={4}
          md={4}
          classes={{root: classNames(classes.border, classes.heightThree, classes.background, {[classes.gallery]: gallery})}}
          onClick={() => openPreviewImage(conditionalRender ? 3 : 4)}
          style={{background: `url(${getImageUrl(conditionalRender ? medias[3] : medias[4])})`}}>
          {overlay}
          {renderTitle(medias[3])}
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
    const extra = medias.length - (maxVisible && maxVisible > 5 ? 5 : maxVisible);

    return [
      more && <div key="count" className={classes.cover}></div>,
      more && (
        <div key="count-sub" className={classes.coverText} style={{fontSize: '200%'}}>
          <p>+{extra}</p>
        </div>
      )
    ];
  };

  const imagesToShow = [...medias];
  if (maxVisible && medias.length > maxVisible) {
    imagesToShow.length = maxVisible;
  }

  return (
    <>
      {medias.length > 0 && (
        <Root className={classNames(classes.root, className)}>
          {adornment}
          {[1, 3, 4].includes(imagesToShow.length) && renderOne()}
          {imagesToShow.length >= 2 && imagesToShow.length != 4 && renderTwo()}
          {imagesToShow.length >= 4 && renderThree()}

          {/* eslint-disable-next-line @typescript-eslint/unbound-method */}
          {preview !== -1 && <PreviewImage onClose={handleClose} index={preview} images={medias} />}
        </Root>
      )}
    </>
  );
};
