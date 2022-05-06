import React from 'react';
import PreviewComponent from './PreviewComponent';
import EditButton from './EditButton';
import EditComponent from './EditComponent';
import {MEDIA_TYPE_IMAGE} from '../../../constants/Media';
import {SCMediaType} from '@selfcommunity/react-core';
import {SCMediaObjectType} from '../../../types/media';

const Image: SCMediaObjectType = {
  name: 'image',
  previewComponent: (props) => <PreviewComponent {...props} />,
  editButton: (props) => <EditButton {...props} />,
  editComponent: (props) => <EditComponent {...props} />,
  filter: (media: SCMediaType): boolean => media.type === MEDIA_TYPE_IMAGE
};

export default Image;
