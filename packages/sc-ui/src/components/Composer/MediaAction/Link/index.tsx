import React from 'react';
import {SCComposerMediaActionType} from '../../../../types/composer';
import Button from './Button';
import Component from './Component';
import {MEDIA_TYPE_URL, MEDIA_EMBED_SC_LINK_TYPE} from '../../../../constants/Media';

const Link: SCComposerMediaActionType = {
  name: 'link',
  button: (props) => <Button {...props} />,
  component: (props) => <Component {...props} />,
  filter: (media: any): boolean => media.type === MEDIA_TYPE_URL && media.embed && media.embed.embed_type === MEDIA_EMBED_SC_LINK_TYPE
};

export default Link;
