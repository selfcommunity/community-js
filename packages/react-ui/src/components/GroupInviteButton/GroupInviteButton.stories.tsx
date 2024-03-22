import type { Meta, StoryObj } from '@storybook/react';
import GroupInviteButton, { GroupInviteButtonProps } from './index';

export default {
  title: 'Design System/React UI/Group Invite Button',
  component: GroupInviteButton,
  args: {
    groupId: 1
  }
} as Meta<typeof GroupInviteButton>;

const template = (args) => (
  <div style={{width: 800}}>
    <GroupInviteButton {...args} />
  </div>
);

export const Base: StoryObj<GroupInviteButtonProps> = {
  args: {
    groupId: 1
  },
  render: template
};