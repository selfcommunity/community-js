import {styled, CircularProgress} from '@mui/material';
import {MouseEvent, TouchEvent, useCallback, useState} from 'react';
import {PhotoSlider} from 'react-photo-view';
import {PhotoProviderBase} from 'react-photo-view/dist/types';
import {DataType} from '../../types/lightbox';
import {PREFIX} from './constants';

const classes = {
  root: `${PREFIX}-root`
};

/**
 * Overrides/extends the styles applied to the component.
 * @default null
 */
export interface BaseLightboxProps extends PhotoProviderBase {
  className?: string;
  images: DataType[];
  index?: number;
  onIndexChange?: (index: number) => void;
  visible?: boolean;
  onClose?: (evt?: MouseEvent | TouchEvent) => void;
  afterClose?: () => void;
  toolbarButtons?: JSX.Element;
}

const Root = styled(PhotoSlider, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (_props, styles) => styles.root
})(() => ({}));

const BaseLightbox = (props: BaseLightboxProps) => {
  const {images = [], index, onClose, visible = true, afterClose, onIndexChange, toolbarRender, toolbarButtons, ...rest} = props;

  // STATE
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(index || 0);

  const handleIndexChange = useCallback(
    (index: number) => {
      onIndexChange?.(index);
      setCurrentImageIndex(index);
    },
    [onIndexChange, setCurrentImageIndex]
  );

  /**
   * Renders root object
   */
  return (
    <Root
      {...rest}
      className={classes.root}
      images={images}
      visible={visible && index !== -1}
      index={currentImageIndex}
      onIndexChange={handleIndexChange}
      onClose={onClose}
      afterClose={afterClose}
      loadingElement={<CircularProgress color="primary" />}
      toolbarRender={
        toolbarRender
          ? toolbarRender
          : () => {
              return toolbarButtons;
            }
      }
    />
  );
};

export default BaseLightbox;
