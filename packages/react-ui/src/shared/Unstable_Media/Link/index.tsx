import React from 'react';
import PreviewComponent from './PreviewComponent';
import EditButton from './EditButton';
import EditComponent from './EditComponent';
import {MEDIA_TYPE_URL, MEDIA_EMBED_SC_LINK_TYPE} from '../../../constants/Media';
import {SCMediaType} from '@selfcommunity/types';
import {SCMediaObjectType} from '../../../types/media';

const Link: SCMediaObjectType = {
  name: 'link',
  previewComponent: (props) => <PreviewComponent {...props} />,
  editButton: (props) => <EditButton {...props} />,
  editComponent: (props) => <EditComponent {...props} />,
  filter: (media: SCMediaType): boolean => media.type === MEDIA_TYPE_URL && media.embed && media.embed.embed_type === MEDIA_EMBED_SC_LINK_TYPE
};

export default Link;
