import React from 'react';
import {styled} from '@mui/material/styles';
import classNames from 'classnames';
import Box from '@mui/material/Box';
import {SCMediaObjectType} from '../../../types/media';
import Document from '../Document';
import Image from '../Image';
import Link from '../Link';

const PREFIX = 'SCMedias';

const classes = {
  medias: `${PREFIX}-medias`,
  videos: `${PREFIX}-videos`,
  links: `${PREFIX}-links`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  [`& .${classes.medias}`]: {
    position: 'relative',
    marginTop: 0,
    marginBottom: theme.spacing(),
    marginLeft: -23,
    marginRight: -23
  },

  [`& .${classes.videos}`]: {
    marginLeft: -11,
    marginRight: -11
  },

  [`& .${classes.links}`]: {
    marginTop: 0,
    marginBottom: theme.spacing(),
    marginLeft: theme.spacing(-1.5),
    marginRight: theme.spacing(-1.5)
  }
}));

export default ({
  medias,
  mediaObjectTypes = [Image, Document, Link],
  GridImageProps = {},
  imagesAdornment = null,
  videosAdornment = null,
  documentsAdornment = null,
  linksAdornment = null
}: {
  medias: Array<any>;
  mediaObjectTypes?: Array<SCMediaObjectType>;
  GridImageProps?: any;
  imagesAdornment?: React.ReactNode;
  videosAdornment?: React.ReactNode;
  documentsAdornment?: React.ReactNode;
  linksAdornment?: React.ReactNode;
}): JSX.Element => {
  if (!medias.length) {
    // Feed without any medias
    return null;
  }

  return (
    <Root>
      {mediaObjectTypes.map((mediaObject: SCMediaObjectType) => {
        let adornment;
        switch (mediaObject.name) {
          case 'image':
            adornment = imagesAdornment;
            break;
          case 'video':
            adornment = videosAdornment;
            break;
          case 'document':
            adornment = documentsAdornment;
            break;
          case 'link':
            adornment = linksAdornment;
            break;
          default:
            adornment = null;
            break;
        }
        return (
          <div className={classNames(classes.medias)} key={mediaObject.name}>
            <mediaObject.previewComponent medias={medias.filter(mediaObject.filter)} {...GridImageProps} adornment={adornment} />
          </div>
        );
      })}
    </Root>
  );
};
