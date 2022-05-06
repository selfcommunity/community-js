import React from 'react';
import {SCMediaObjectType} from '../../../types/media';
import PreviewComponent from './PreviewComponent';
import {MEDIA_TYPE_SHARE} from '../../../constants/Media';
import {SCMediaType} from '@selfcommunity/types';

const Share: SCMediaObjectType = {
  name: 'share',
  previewComponent: (props) => <PreviewComponent {...props} />,
  editButton: null,
  editComponent: null,
  filter: (media: SCMediaType): boolean => media.type === MEDIA_TYPE_SHARE
};

export default Share;
