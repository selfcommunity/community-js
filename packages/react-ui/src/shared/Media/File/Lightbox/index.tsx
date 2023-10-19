import React, { useCallback } from 'react';
import { styled } from '@mui/material/styles';
import BaseLightbox from '../../../Lightbox';
import { SCMediaType } from '@selfcommunity/types/src/types';
import { PREFIX } from '../constants';
import { MEDIA_TYPE_DOCUMENT, MEDIA_TYPE_IMAGE } from '../../../../constants/Media';
import { DataType } from '../../../../types/lightbox';
import { Button, IconButton } from '@mui/material';
import { Link } from '@selfcommunity/react-core';
import { OverlayRenderProps } from 'react-photo-view/dist/types';
import Icon from '@mui/material/Icon';

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

  const mediaToDataTypeMap = useCallback((media: SCMediaType, index): DataType => {
    return {src: media.image, width: media.image_width, height: media.image_height, key: index};
  }, []);

  const toolbarRender = useCallback((props: OverlayRenderProps): React.ReactNode => {
    if (medias[props.index].type === MEDIA_TYPE_DOCUMENT) {
      return <IconButton component={Link} to={medias[props.index].url} target="_blank" color="inherit">
        <Icon>download</Icon>
      </IconButton>
    }
    return <></>;
  }, [medias]);

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
      toolbarRender={toolbarRender}
    />
  );
}
