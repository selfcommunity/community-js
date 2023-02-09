import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import NavigationToolbarMobileSkeleton from './index';
import { AppBar } from '@mui/material';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';

export default {
  title: 'Design System/React UI/Skeleton/Navigation Toolbar Mobile',
  component: NavigationToolbarMobileSkeleton,
  argTypes: {},
  args: {},
  parameters: {
    // The viewports object from the Essentials addon
    viewport: {
      // The viewports you want to use
      viewports: INITIAL_VIEWPORTS,
    },
  },
} as ComponentMeta<typeof NavigationToolbarMobileSkeleton>;

const Template: ComponentStory<typeof NavigationToolbarMobileSkeleton> = (args) => (
  <AppBar position="relative">
    <NavigationToolbarMobileSkeleton {...args} />
  </AppBar>
);

export const Base = Template.bind({});

Base.args = {};


Base.parameters = {
  viewport: {
    defaultViewport: 'iphone6',
  }
}
