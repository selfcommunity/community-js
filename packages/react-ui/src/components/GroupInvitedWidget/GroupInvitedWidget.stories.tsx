import type { Meta, StoryObj } from '@storybook/react-webpack5';
import GroupInvitedWidget from './index';

export default {
  title: 'Design System/React UI/Group Invited Widget',
  component: GroupInvitedWidget,
  argTypes: {
    userId: {
      control: {type: 'number'},
      description: 'Group Id',
      table: {defaultValue: {summary: 3}}
    }
  }
} as Meta<typeof GroupInvitedWidget>;


const template = (args) => (
  <div style={{width: 400}}>
    <GroupInvitedWidget {...args} />
  </div>
);

// @ts-ignore
export const Base: StoryObj<GroupInvitedWidget> = {
  args: {
    groupId: 3
  },
  render: template
};

