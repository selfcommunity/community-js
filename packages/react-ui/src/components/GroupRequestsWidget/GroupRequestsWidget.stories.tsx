import type { Meta, StoryObj } from '@storybook/react-webpack5';
import GroupRequestsWidget, { GroupRequestsWidgetProps } from './index';

export default {
  title: 'Design System/React UI/Group Requests Widget',
  component: GroupRequestsWidget,
  argTypes: {
    userId: {
      control: {type: 'number'},
      description: 'Group Id',
      table: {defaultValue: {summary: '3'}}
    }
  }
} as Meta<typeof GroupRequestsWidget>;


const template = (args: GroupRequestsWidgetProps) => (
  <div style={{width: 400}}>
    <GroupRequestsWidget {...args} />
  </div>
);

// @ts-ignore
export const Base: StoryObj<typeof GroupRequestsWidget> = {
  args: {
    groupId: 7,
		autoHide: false
  },
  render: template
};

