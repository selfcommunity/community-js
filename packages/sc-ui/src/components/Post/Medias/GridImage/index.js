import React, {Component} from 'react';
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

class GridImages extends Component {
  constructor(props) {
    super(props);

    this.state = {
      previewImageOpen: false,
      countFrom: props.countFrom > 0 && props.countFrom < 5 ? props.countFrom : 5,
      conditionalRender: false
    };

    this.openPreviewImage = this.openPreviewImage.bind(this);
    this.handleClose = this.handleClose.bind(this);

    if (props.countFrom <= 0 || props.countFrom > 5) {
      console.warn('countFrom is limited to 5!');
    }

    this.renderOne = this.renderOne.bind(this);
    this.renderTwo = this.renderTwo.bind(this);
    this.renderThree = this.renderThree.bind(this);
    this.renderOverlay = this.renderOverlay.bind(this);
    this.renderCountOverlay = this.renderCountOverlay.bind(this);
    this.renderTitle = this.renderTitle.bind(this);
  }

  openPreviewImage(index) {
    const {onClickEach, images, gallery} = this.props;

    if (onClickEach) {
      return onClickEach({src: images[index], index});
    }

    if (gallery === false) {
      // Prevent gallery
      return;
    }

    this.setState({previewImageOpen: true, index});
  }

  handleClose() {
    this.setState({previewImageOpen: false});
  }

  getImageUrl(image) {
    if (typeof image === 'object') {
      return image.image ? image.image : '/static/frontend_v2/images/image.svg';
    }
    return image;
  }

  renderTitle(o) {
    if (!o) {
      return null;
    }
    const {title, titleBackgroundColor} = this.props;
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
        {title && (
          <div className={classes.title} style={{backgroundColor: titleBackgroundColor}}>
            <Typography variant="subtitle2">
              {startAdornment} {o.title}
            </Typography>
          </div>
        )}
      </React.Fragment>
    );
  }

  renderOne() {
    const {images, gallery} = this.props;
    const {countFrom} = this.state;
    const overlay = images.length > countFrom && countFrom == 1 ? this.renderCountOverlay(true) : this.renderOverlay();

    return (
      <Grid container>
        <Grid
          item
          xs={12}
          classes={{root: classNames(classes.border, classes.heightOne, classes.background, {[classes.gallery]: gallery})}}
          onClick={this.openPreviewImage.bind(this, 0)}
          style={{background: `url(${this.getImageUrl(images[0])})`}}>
          {overlay}
          {this.renderTitle(images[0])}
        </Grid>
      </Grid>
    );
  }

  renderTwo() {
    const {images, gallery} = this.props;
    const {countFrom} = this.state;
    const overlay = images.length > countFrom && [2, 3].includes(+countFrom) ? this.renderCountOverlay(true) : this.renderOverlay();
    const conditionalRender = [3, 4].includes(images.length) || (images.length > +countFrom && [3, 4].includes(+countFrom));
    return (
      <Grid container>
        <Grid
          item
          xs={6}
          classes={{root: classNames(classes.border, classes.heightTwo, classes.background, {[classes.gallery]: gallery})}}
          onClick={this.openPreviewImage.bind(this, conditionalRender ? 1 : 0)}
          style={{background: `url(${this.getImageUrl(conditionalRender ? images[1] : images[0])})`}}>
          {this.renderOverlay()}
          {this.renderTitle(images[0])}
        </Grid>
        <Grid
          item
          xs={6}
          classes={{root: classNames(classes.border, classes.heightTwo, classes.background, {[classes.gallery]: gallery})}}
          onClick={this.openPreviewImage.bind(this, conditionalRender ? 1 : 0)}
          style={{background: `url(${this.getImageUrl(conditionalRender ? images[2] : images[1])})`}}>
          {overlay}
          {this.renderTitle(images[1])}
        </Grid>
      </Grid>
    );
  }

  renderThree() {
    const {images, gallery} = this.props;
    const {countFrom} = this.state;
    const overlay =
      !countFrom || countFrom > 5 || (images.length > countFrom && [4, 5].includes(+countFrom))
        ? this.renderCountOverlay(true)
        : this.renderOverlay(conditionalRender ? 3 : 4);
    const conditionalRender = images.length == 4 || (images.length > +countFrom && +countFrom == 4);
    return (
      <Grid container>
        <Grid
          item
          xs={6}
          md={4}
          classes={{root: classNames(classes.border, classes.heightThree, classes.background, {[classes.gallery]: gallery})}}
          onClick={this.openPreviewImage.bind(this, conditionalRender ? 1 : 2)}
          style={{background: `url(${this.getImageUrl(conditionalRender ? images[1] : images[2])})`}}>
          {this.renderOverlay(conditionalRender ? 1 : 2)}
          {this.renderTitle(images[1])}
        </Grid>
        <Grid
          item
          xs={6}
          md={4}
          classes={{root: classNames(classes.border, classes.heightThree, classes.background, {[classes.gallery]: gallery})}}
          onClick={this.openPreviewImage.bind(this, conditionalRender ? 2 : 3)}
          style={{background: `url(${this.getImageUrl(conditionalRender ? images[2] : images[3])})`}}>
          {this.renderOverlay(conditionalRender ? 2 : 3)}
          {this.renderTitle(images[2])}
        </Grid>
        <Grid
          item
          xs={6}
          md={4}
          classes={{root: classNames(classes.border, classes.heightThree, classes.background, {[classes.gallery]: gallery})}}
          onClick={this.openPreviewImage.bind(this, conditionalRender ? 3 : 4)}
          style={{background: `url(${this.getImageUrl(conditionalRender ? images[3] : images[4])})`}}>
          {overlay}
          {this.renderTitle(images[3])}
        </Grid>
      </Grid>
    );
  }

  renderOverlay(id) {
    const {overlay, renderOverlay, overlayBackgroundColor} = this.props;
    if (!overlay) {
      return false;
    }
    return [
      <div key={`cover-${id}`} className={classNames(classes.cover, classes.slide)} style={{backgroundColor: overlayBackgroundColor}}></div>,
      <div key={`cover-text-${id}`} className={classNames(classes.coverText, classes.slide, 'animate-text')} style={{fontSize: '100%'}}>
        {renderOverlay()}
      </div>
    ];
  }

  renderCountOverlay(more) {
    const {images} = this.props;
    const {countFrom} = this.state;
    const extra = images.length - (countFrom && countFrom > 5 ? 5 : countFrom);

    return [
      more && <div key="count" className={classes.cover}></div>,
      more && (
        <div key="count-sub" className={classes.coverText} style={{fontSize: '200%'}}>
          <p>+{extra}</p>
        </div>
      )
    ];
  }

  render() {
    const {previewImageOpen, index, countFrom} = this.state;
    const {images, adornment} = this.props;
    const imagesToShow = [...images];
    if (countFrom && images.length > countFrom) {
      imagesToShow.length = countFrom;
    }
    return (
      <Root>
        {adornment}
        {[1, 3, 4].includes(imagesToShow.length) && this.renderOne()}
        {imagesToShow.length >= 2 && imagesToShow.length != 4 && this.renderTwo()}
        {imagesToShow.length >= 4 && this.renderThree()}

        {/* eslint-disable-next-line @typescript-eslint/unbound-method */}
        {previewImageOpen && <PreviewImage onClose={this.handleClose} index={index} images={images} />}
      </Root>
    );
  }
}

GridImages.defaultProps = {
  gallery: true,
  images: [],
  overlay: true,
  renderOverlay: () => <ZoomOut />,
  overlayBackgroundColor: 'rgba(70, 66, 66, 0.45)',
  titleBackgroundColor: 'rgba(70, 66, 66, 0.45)',
  onClickEach: null,
  countFrom: MAX_GRID_IMAGES,
  adornment: null
};

GridImages.propTypes = {
  images: PropTypes.array.isRequired,
  gallery: PropTypes.bool,
  overlay: PropTypes.bool,
  title: PropTypes.bool,
  titleBackgroundColor: PropTypes.string,
  renderOverlay: PropTypes.func,
  overlayBackgroundColor: PropTypes.string,
  adornment: PropTypes.node,
  onClickEach: PropTypes.func,
  countFrom: PropTypes.number,
  classes: PropTypes.object
};
export default GridImages;
