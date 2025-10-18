import type { Meta, StoryObj } from '@storybook/react-webpack5';
import Groups from './index';

export default {
  title: 'Design System/React UI/Groups',
  component: Groups,
  args: {
    general: true,
    showFilters: 1,
  }
} as Meta<typeof Groups>;


const template = (args) => (
    <Groups {...args} />
);

export const Base: StoryObj<Groups> = {
  args: {
    general: true
  },
  render: template
};

export const UserGroups: StoryObj<Groups> = {
  args: {
    general: false
  },
  render: template
};


