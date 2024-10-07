import { CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useCallback, useState } from 'react';
import { PhotoSlider } from 'react-photo-view';
import { PhotoProviderBase } from 'react-photo-view/dist/types';
import { DataType } from '../../types/lightbox';

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
  const { images = [], index, onClose, visible = true, afterClose, onIndexChange, toolbarRender, toolbarButtons = [], ...rest } = props;

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
      loadingElement={<CircularProgress color={'primary'} />}
      toolbarRender={
        toolbarRender
          ? toolbarRender
          : () => {
            return <>{toolbarButtons}</>;
          }
      }
    />
  );
};

export default ReactImageLightbox;
