import type { Meta, StoryObj } from '@storybook/react';
import EditGroupButton, { EditGroupButtonProps } from './index';

export default {
  title: 'Design System/React UI/Edit Group Button',
  component: EditGroupButton,
} as Meta<typeof EditGroupButton>;

const template = (args) => (
  <div style={{width: 800}}>
    <EditGroupButton {...args} />
  </div>
);

export const Base: StoryObj<EditGroupButtonProps> = {
  args: {
    groupId: 4
  },
  render: template
};