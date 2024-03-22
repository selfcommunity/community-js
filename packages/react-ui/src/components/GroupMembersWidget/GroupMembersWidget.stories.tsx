import type { Meta, StoryObj } from '@storybook/react';
import GroupMembersWidget from './index';

export default {
  title: 'Design System/React UI/Group Members Widget',
  component: GroupMembersWidget,
  argTypes: {
    userId: {
      control: {type: 'number'},
      description: 'Group Id',
      table: {defaultValue: {summary: 1}}
    }
  }
} as Meta<typeof GroupMembersWidget>;


const template = (args) => (
  <div style={{width: 400}}>
    <GroupMembersWidget {...args} />
  </div>
);

export const Base: StoryObj<GroupMembersWidget> = {
  args: {
    groupId: 1
  },
  render: template
};

