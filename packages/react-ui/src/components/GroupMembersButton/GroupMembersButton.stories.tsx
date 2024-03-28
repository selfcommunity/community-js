import type { Meta, StoryObj } from '@storybook/react';
import GroupMembersButton from './index';

export default {
  title: 'Design System/React UI/Group Members Button ',
  component: GroupMembersButton,
  argTypes: {
    groupId: {
      control: {type: 'number'},
      description: 'Group Id',
      table: {defaultValue: {summary: 1}}
    }
  }
} as Meta<typeof GroupMembersButton>;

const template = (args) => (
  <div style={{width: '100%'}}>
    <GroupMembersButton {...args} />
  </div>
);

export const Base: StoryObj<GroupMembersButton> = {
  args: {
    groupId: 1
  },
  render: template
}