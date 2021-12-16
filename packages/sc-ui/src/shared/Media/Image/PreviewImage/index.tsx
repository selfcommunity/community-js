import React, {useState} from 'react';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import {styled} from '@mui/material/styles';

const PREFIX = 'SCPreviewImage';

const Root = styled(Lightbox, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(() => ({}));

export default function PreviewImage({
  images = [],
  index = null,
  onClose = null,
  ...rest
}: {
  images: any[];
  index: number;
  onClose: () => void;
  [p: string]: any;
}) {
  const [currentImages, setCurrentImages] = useState<any[]>(images || []);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(index);

  /**
   * Handle Prev image
   */
  function onMovePrevRequest() {
    setCurrentImageIndex((currentImageIndex + currentImages.length - 1) % currentImages.length);
  }

  /**
   * Handle next image
   */
  function onMoveNextRequest() {
    setCurrentImageIndex((currentImageIndex + 1) % currentImages.length);
  }

  /**
   * Get image url
   * @param image
   */
  function getImageUrl(image) {
    if (typeof image === 'object') {
      return image.image ? image.image : '/static/frontend_v2/images/image.svg';
    }
    return image;
  }

  return (
    <Root
      {...rest}
      mainSrc={getImageUrl(images[currentImageIndex])}
      nextSrc={getImageUrl(images[(currentImageIndex + 1) % currentImages.length])}
      prevSrc={getImageUrl(images[(currentImageIndex + currentImages.length - 1) % currentImages.length])}
      onCloseRequest={onClose}
      onMovePrevRequest={onMovePrevRequest}
      onMoveNextRequest={onMoveNextRequest}
    />
  );
}
