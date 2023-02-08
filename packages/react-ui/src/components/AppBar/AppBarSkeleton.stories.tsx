import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import AppBar, {NavigationToolbarSkeleton, NavigationToolbarMobileSkeleton} from './index';

export default {
  title: 'Design System/React UI/Skeleton/AppBar',
  component: AppBar,
  argTypes: {},
  args: {}
} as ComponentMeta<typeof AppBar>;

const DesktopTemplate: ComponentStory<typeof AppBar> = (args) => (
  <AppBar position="relative">
    <NavigationToolbarSkeleton {...args} />
  </AppBar>
);

export const Desktop = DesktopTemplate.bind({});

Desktop.args = {};

const MobileTemplate: ComponentStory<typeof AppBar> = (args) => (
  <AppBar position="relative">
    <NavigationToolbarMobileSkeleton {...args} />
  </AppBar>
);

export const Mobile = MobileTemplate.bind({});

Mobile.args = {};

Mobile.parameters = {
  viewport: {
    defaultViewport: 'iphone6',
  }
}
