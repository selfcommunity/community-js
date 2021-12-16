import React from 'react';
import {SCMediaObjectType} from '../../../types/media';
import PreviewComponent from './PreviewComponent';
import EditButton from './EditButton';
import EditComponent from './EditComponent';
import {MEDIA_TYPE_URL, MEDIA_EMBED_SC_VIMEO_TYPE} from '../../../constants/Media';
import {SCMediaType} from '@selfcommunity/core';

const Video: SCMediaObjectType = {
  name: 'video',
  previewComponent: (props) => <PreviewComponent {...props} />,
  editButton: (props) => <EditButton {...props} />,
  editComponent: (props) => <EditComponent {...props} />,
  filter: (media: SCMediaType): boolean => media.type === MEDIA_TYPE_URL && media.embed && media.embed.embed_type === MEDIA_EMBED_SC_VIMEO_TYPE
};

export default Video;
