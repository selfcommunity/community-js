import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import NavigationToolbarSkeleton from './index';
import { AppBar } from '@mui/material';

export default {
  title: 'Design System/React UI/Skeleton/Navigation Toolbar',
  component: NavigationToolbarSkeleton,
  argTypes: {},
  args: {}
} as ComponentMeta<typeof NavigationToolbarSkeleton>;

const MainTemplate: ComponentStory<typeof NavigationToolbarSkeleton> = (args) => (
  <AppBar position="relative">
    <NavigationToolbarSkeleton {...args} />
  </AppBar>
);

export const Main = MainTemplate.bind({});

Main.args = {};
