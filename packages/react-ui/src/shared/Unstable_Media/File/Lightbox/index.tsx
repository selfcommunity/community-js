import React from 'react';
import {styled} from '@mui/material/styles';
import BaseLightbox from '../../../Lightbox';
import { SCMediaType } from '@selfcommunity/types/src/types';
import { PREFIX } from '../constants';

const classes = {
  root: `${PREFIX}-lightbox-root`
};

const Root = styled(BaseLightbox, {
  name: PREFIX,
  slot: 'LightboxRoot'
})(() => ({}));

export interface LightboxProps {
  /**
   * Images objs
   * @default []
   */
  medias: SCMediaType[];
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

export default function Lightbox(props: LightboxProps) {
  // PROPS
  const {medias = [], index = 0, onClose, onIndexChange, ...rest} = props;

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
      className={classes.root}
      images={medias.map((item, index) => ({src: getImageUrl(item), key: index}))}
      visible={index !== -1}
      onClose={onClose}
      index={index}
      onIndexChange={onIndexChange}
    />
  );
}
