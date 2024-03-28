import type { Meta, StoryObj } from '@storybook/react';
import CreateGroupButton, { CreateGroupButtonProps } from './index';

export default {
  title: 'Design System/React UI/Create Group Button',
  component: CreateGroupButton,
} as Meta<typeof CreateGroupButton>;

const template = (args) => (
  <div style={{width: 800}}>
    <CreateGroupButton {...args} />
  </div>
);

export const Base: StoryObj<CreateGroupButtonProps> = {
  args: {},
  render: template
};