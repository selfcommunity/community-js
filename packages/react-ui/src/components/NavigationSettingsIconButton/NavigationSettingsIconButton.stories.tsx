import type { Meta, StoryObj } from '@storybook/react';
import NavigationSettingsIconButton from './index';
import {IconButton} from '@mui/material';
import Icon from '@mui/material/Icon';
import React from 'react';

export default {
  title: 'Design System/React UI/Navigation Settings Icon Button',
  component: NavigationSettingsIconButton,
} as Meta<typeof NavigationSettingsIconButton>;


const template = (args) => (
  <div style={{width: '100%'}}>
    <NavigationSettingsIconButton {...args} />
  </div>
);

export const Base: StoryObj<NavigationSettingsIconButton> = {
  args: {
    items: [
      {label: 'test', href: '/test'},
      {label: 'test1', href: '/test1'}
    ]
  },
  render: template
};

