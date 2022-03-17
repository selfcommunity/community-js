import React, {useState} from 'react';
import Lightbox from '../../../Lightbox';
import {styled} from '@mui/material/styles';

const PREFIX = 'SCPreviewImage';

const Root = styled(Lightbox, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(() => ({}));

export interface PreviewImageProps {
  /**
   * Images objs
   * @default []
   */
  images: any[];
  /**
   * Obj index
   * @default null
   */
  index: number;
  /**
   * Handles on close
   * @default null
   */
  onClose: () => void;
  /**
   * Any other properties
   */
  [p: string]: any;
}

export default function PreviewImage(props: PreviewImageProps) {
  // PROPS
  const {images = [], index = null, onClose = null, ...rest} = props;

  // STATE
  const [currentImages, setCurrentImages] = useState<any[]>(images || []);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(index);

  /**
   * Handles Prev image
   */
  function onMovePrevRequest() {
    setCurrentImageIndex((currentImageIndex + currentImages.length - 1) % currentImages.length);
  }

  /**
   * Handles next image
   */
  function onMoveNextRequest() {
    setCurrentImageIndex((currentImageIndex + 1) % currentImages.length);
  }

  /**
   * Gets image url
   * @param image
   */
  function getImageUrl(image) {
    if (typeof image === 'object') {
      return image.image ? image.image : '/static/frontend_v2/images/image.svg';
    }
    return image;
  }

  /**
   * Renders root object
   */
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
