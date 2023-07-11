import React, {useState} from 'react';
import {styled} from '@mui/material/styles';
import {PhotoSlider} from 'react-photo-view';

const PREFIX = 'SCLightbox';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(PhotoSlider, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(() => ({}));

const ReactImageLightbox = (props: ReactImageLightboxProps) => {
  const {images = [], index, onClose, visible, afterClose, onIndexChange, ...rest} = props;

  // STATE
  const [currentImages] = useState<any[]>(images || []);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(index || 0);

  /**
   * Renders root object
   */
  return (
    <Root
      {...rest}
      className={classes.root}
      images={currentImages}
      visible={visible && index !== -1}
      index={currentImageIndex}
      onIndexChange={setCurrentImageIndex}
      onClose={onClose}
      afterClose={afterClose}
    />
  );
};

export interface DataType {
  key: number | string;
  src?: string;
  render?: (props) => React.ReactNode;
  overlay?: React.ReactNode;
  width?: number;
  height?: number;
  originRef?: React.MutableRefObject<HTMLElement | null>;
}
export interface ReactImageLightboxProps {
  images: DataType[];
  index?: number;
  onIndexChange?: (index: number) => void;
  visible: boolean;
  onClose: (evt?: React.MouseEvent | React.TouchEvent) => void;
  afterClose?: () => void;
}
export default ReactImageLightbox;
