import React, {Component} from 'react';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import PropTypes from 'prop-types';

class PreviewImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      images: props.images || [],
      currentImageIndex: props.index
    };

    this.onMovePrevRequest = this.onMovePrevRequest.bind(this);
    this.onMoveNextRequest = this.onMoveNextRequest.bind(this);
  }

  onMovePrevRequest() {
    const {currentImageIndex, images} = this.state;

    this.setState({
      currentImageIndex: (currentImageIndex + images.length - 1) % images.length
    });
  }

  onMoveNextRequest() {
    const {currentImageIndex, images} = this.state;

    this.setState({
      currentImageIndex: (currentImageIndex + 1) % images.length
    });
  }

  getImageUrl(image) {
    if (typeof image === 'object') {
      return image.image ? image.image : '/static/frontend_v2/images/image.svg';
    }
    return image;
  }

  render() {
    const {onClose} = this.props;
    const {images, currentImageIndex} = this.state;

    return (
      <Lightbox
        mainSrc={this.getImageUrl(images[currentImageIndex])}
        nextSrc={this.getImageUrl(images[(currentImageIndex + 1) % images.length])}
        prevSrc={this.getImageUrl(images[(currentImageIndex + images.length - 1) % images.length])}
        onCloseRequest={onClose}
        onMovePrevRequest={this.onMovePrevRequest}
        onMoveNextRequest={this.onMoveNextRequest}
      />
    );
  }
}

PreviewImage.propTypes = {
  images: PropTypes.array.isRequired,
  index: PropTypes.number.isRequired,
  onClose: PropTypes.func
};

export default PreviewImage;
