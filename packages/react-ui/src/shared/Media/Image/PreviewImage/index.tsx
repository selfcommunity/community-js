import React from 'react';
import {styled} from '@mui/material/styles';
import Lightbox from '../../../Lightbox';

const PREFIX = 'SCPreviewImage';

const classes = {
  root: `${PREFIX}-root`
};

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
   * Handles on index change
   * @default null
   */
  onIndexChange?: (index: number) => void;
  /**
   * Any other properties
   */
  [p: string]: any;
}

export default function PreviewImage(props: PreviewImageProps) {
  // PROPS
  const {images = [], index = 0, onClose, onIndexChange, ...rest} = props;

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
   * Gets image key identifier
   * @param image
   */
  function getImageId(image) {
    return image.id;
  }

  /**
   * Renders root object
   */
  return (
    <Root
      {...rest}
      className={classes.root}
      images={images.map((item, index) => ({src: getImageUrl(item), key: index}))}
      visible={index !== -1}
      onClose={onClose}
      index={index}
      onIndexChange={onIndexChange}
    />
  );
}
