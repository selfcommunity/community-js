import type { Meta, StoryObj } from '@storybook/react-webpack5';
import GroupMembersButton, { GroupMembersButtonProps } from './index';

export default {
  title: 'Design System/React UI/Group Members Button ',
  component: GroupMembersButton,
  argTypes: {
    groupId: {
      control: {type: 'number'},
      description: 'Group Id',
      table: {defaultValue: {summary: '1'}}
    }
  }
} as Meta<typeof GroupMembersButton>;

const template = (args: GroupMembersButtonProps) => (
  <div style={{width: '100%'}}>
    <GroupMembersButton {...args} />
  </div>
);

export const Base: StoryObj<typeof GroupMembersButton> = {
  args: {
    groupId: 1
  },
  render: template
}