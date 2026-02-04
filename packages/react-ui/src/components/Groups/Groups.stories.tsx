import type { Meta, StoryObj } from '@storybook/react-webpack5';
import Groups, { GroupsProps } from './index';

export default {
  title: 'Design System/React UI/Groups',
  component: Groups,
  args: {
    general: true,
    showFilters: true,
  }
} as Meta<typeof Groups>;


const template = (args: GroupsProps) => (
    <Groups {...args} />
);

export const Base: StoryObj<typeof Groups> = {
  args: {
    general: true
  },
  render: template
};

export const UserGroups: StoryObj<typeof Groups> = {
  args: {
    general: false
  },
  render: template
};


