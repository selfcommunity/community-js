import React from 'react';
import {SCComposerMediaActionType} from '../../../../types/composer';
import Button from './Button';
import Component from './Component';
import {MEDIA_TYPE_IMAGE} from '../../../../constants/Media';

const Image: SCComposerMediaActionType = {
  name: 'image',
  button: (props) => <Button {...props} />,
  component: (props) => <Component {...props} />,
  filter: (media: any): boolean => media.type === MEDIA_TYPE_IMAGE
};

export default Image;
