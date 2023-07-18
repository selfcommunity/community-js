import React, {useState} from 'react';
import {styled} from '@mui/material/styles';
import {PhotoSlider} from 'react-photo-view';
import {DataType} from '../../types/lightbox';
import {CircularProgress} from '@mui/material';
import {PhotoProviderBase} from 'react-photo-view/dist/types';

const PREFIX = 'SCLightbox';

const classes = {
  root: `${PREFIX}-root`
};

/**
 * Overrides/extends the styles applied to the component.
 * @default null
 */
export interface ReactImageLightboxProps extends PhotoProviderBase {
  className?: string;
  images: DataType[];
  index?: number;
  onIndexChange?: (index: number) => void;
  visible?: boolean;
  onClose?: (evt?: React.MouseEvent | React.TouchEvent) => void;
  afterClose?: () => void;
  toolbarButtons?: React.ReactNode[];
}

const Root = styled(PhotoSlider, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(() => ({}));

const ReactImageLightbox = (props: ReactImageLightboxProps) => {
  const {images = [], index, onClose, visible = true, afterClose, onIndexChange, toolbarButtons = [], ...rest} = props;

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
      loadingElement={<CircularProgress color={'primary'} />}
      toolbarRender={() => {
        return <>{toolbarButtons}</>;
      }}
    />
  );
};

export default ReactImageLightbox;
