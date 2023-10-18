import type { Meta, StoryObj } from '@storybook/react';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import BottomNavigation, { BottomNavigationProps } from './index';

export default {
  title: 'Design System/React UI/Bottom Navigation ',
  component: BottomNavigation,
  parameters: {
    // The viewports object from the Essentials addon
    viewport: {
      // The viewports you want to use
      viewports: INITIAL_VIEWPORTS,
    },
  },
} as Meta<typeof BottomNavigation>;

const template = (args) => (
  <BottomNavigation {...args} />
);

export const Base: StoryObj<BottomNavigationProps> = {
  args: {
    value: '/'
  },
  parameters: {
    viewport: {
      defaultViewport: 'iphone6',
    }
  },
  render: template
};
