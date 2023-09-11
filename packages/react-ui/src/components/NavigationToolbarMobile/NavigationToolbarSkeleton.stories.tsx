import type { Meta, StoryObj } from '@storybook/react';
import NavigationToolbarMobileSkeleton from './Skeleton';
import { AppBar } from '@mui/material';
import {INITIAL_VIEWPORTS} from '@storybook/addon-viewport';

export default {
  title: 'Design System/React UI/Skeleton/Navigation Toolbar Mobile',
  component: NavigationToolbarMobileSkeleton,
  parameters: {
    // The viewports object from the Essentials addon
    viewport: {
      // The viewports you want to use
      viewports: INITIAL_VIEWPORTS,
    },
  },
} as Meta<typeof NavigationToolbarMobileSkeleton>;

const template = (args) => (
  <AppBar position="relative">
    <NavigationToolbarMobileSkeleton {...args} />
  </AppBar>
);

export const Base: StoryObj<NavigationToolbarMobileSkeleton> = {
  parameters: {
    viewport: {
      defaultViewport: 'iphone6',
    }
  },
  render: template
};

