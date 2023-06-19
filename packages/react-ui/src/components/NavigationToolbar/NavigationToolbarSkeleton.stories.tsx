import type { Meta, StoryObj } from '@storybook/react';
import NavigationToolbarSkeleton from './index';
import { AppBar } from '@mui/material';

export default {
  title: 'Design System/React UI/Skeleton/Navigation Toolbar',
  component: NavigationToolbarSkeleton,
  argTypes: {},
  args: {}
} as Meta<typeof NavigationToolbarSkeleton>;

const MainTemplate: StoryObj<typeof NavigationToolbarSkeleton> = (args) => (
  <AppBar position="relative">
    <NavigationToolbarSkeleton {...args} />
  </AppBar>
);

export const Main = MainTemplate.bind({});

Main.args = {};
