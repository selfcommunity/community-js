import React from 'react';
import {SCMediaObjectType} from '../../../types/media';
import PreviewComponent from './PreviewComponent';
import EditButton from './EditButton';
import EditComponent from './EditComponent';
import {MEDIA_TYPE_DOCUMENT} from '../../../constants/Media';
import {SCMediaType} from '@selfcommunity/core';

const Document: SCMediaObjectType = {
  name: 'document',
  previewComponent: (props) => <PreviewComponent {...props} />,
  editButton: (props) => <EditButton {...props} />,
  editComponent: (props) => <EditComponent {...props} />,
  filter: (media: SCMediaType): boolean => media.type === MEDIA_TYPE_DOCUMENT
};

export default Document;
