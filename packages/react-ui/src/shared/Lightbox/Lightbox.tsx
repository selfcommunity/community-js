import {styled} from '@mui/material';
import {SCMediaType} from '@selfcommunity/types/src/types';
import {useCallback} from 'react';
import {DataType} from '../../types/lightbox';
import BaseLightbox from './BaseLightbox';
import {PREFIX} from './constants';

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
   * @default 0
   */
  index: number;

  /**
   * Toolbar
   * @default undefined
   */
  toolbarButtons?: JSX.Element;

  /**
   * Handles on close
   * @default () => void
   */
  onClose: () => void;

  /**
   * Handles on index change
   * @default undefined
   */
  onIndexChange?: (index: number) => void;

  /**
   * Any other properties
   */
  [p: string]: any;
}

export default function Lightbox(props: LightboxProps) {
  // PROPS
  const {medias = [], index = 0, toolbarButtons, onClose, onIndexChange, ...rest} = props;

  const mediaToDataTypeMap = useCallback((media: SCMediaType, index: number): DataType => {
    return {src: media.image, width: media.image_width, height: media.image_height, key: index};
  }, []);

  /**
   * Renders root object
   */
  return (
    <Root
      {...rest}
      className={classes.root}
      images={medias.map(mediaToDataTypeMap)}
      visible={index !== -1}
      onClose={onClose}
      index={index}
      onIndexChange={onIndexChange}
      toolbarButtons={toolbarButtons}
    />
  );
}
