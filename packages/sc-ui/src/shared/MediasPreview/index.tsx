import React from 'react';
import {styled} from '@mui/material/styles';
import Box from '@mui/material/Box';
import {SCMediaObjectType} from '../../../types/media';
import Document from '../Document';
import Image from '../Image';
import Link from '../Link';
import {MEDIA_TYPE_DOCUMENT, MEDIA_TYPE_IMAGE, MEDIA_TYPE_LINK, MEDIA_TYPE_VIDEO} from '../../../constants/Media';

const PREFIX = 'SCMedias';

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  position: 'relative',
  marginTop: 0,
  marginBottom: theme.spacing(),
  marginLeft: -23,
  marginRight: -23
}));

export default ({
  medias,
  mediaObjectTypes = [Image, Document, Link],
  GridImageProps = {},
  imagesAdornment = null,
  videosAdornment = null,
  documentsAdornment = null,
  linksAdornment = null,
  ...rest
}: {
  medias: Array<any>;
  mediaObjectTypes?: Array<SCMediaObjectType>;
  GridImageProps?: any;
  imagesAdornment?: React.ReactNode;
  videosAdornment?: React.ReactNode;
  documentsAdornment?: React.ReactNode;
  linksAdornment?: React.ReactNode;
  [p: string]: any;
}): JSX.Element => {
  if (!medias.length) {
    // Feed without any medias
    return null;
  }

  /**
   * Render list of media preview
   * The adornment prop
   */
  return (
    <Root {...rest}>
      {mediaObjectTypes.map((mediaObject: SCMediaObjectType) => {
        let adornment;
        switch (mediaObject.name) {
          case MEDIA_TYPE_IMAGE:
            adornment = imagesAdornment;
            break;
          case MEDIA_TYPE_DOCUMENT:
            adornment = documentsAdornment;
            break;
          case MEDIA_TYPE_LINK:
            adornment = linksAdornment;
            break;
          case MEDIA_TYPE_VIDEO:
            adornment = videosAdornment;
            break;
          default:
            adornment = null;
            break;
        }
        return (
          <div key={mediaObject.name}>
            <mediaObject.previewComponent medias={medias.filter(mediaObject.filter)} {...GridImageProps} adornment={adornment} />
          </div>
        );
      })}
    </Root>
  );
};
