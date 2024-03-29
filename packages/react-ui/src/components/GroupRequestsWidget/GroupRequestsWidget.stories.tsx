import type { Meta, StoryObj } from '@storybook/react';
import GroupRequestsWidget from './index';

export default {
  title: 'Design System/React UI/Group Requests Widget',
  component: GroupRequestsWidget,
  argTypes: {
    userId: {
      control: {type: 'number'},
      description: 'Group Id',
      table: {defaultValue: {summary: 4}}
    }
  }
} as Meta<typeof GroupRequestsWidget>;


const template = (args) => (
  <div style={{width: 400}}>
    <GroupRequestsWidget {...args} />
  </div>
);

export const Base: StoryObj<GroupRequestsWidget> = {
  args: {
    groupId: 4
  },
  render: template
};

