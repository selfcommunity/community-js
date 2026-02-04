import type { Meta, StoryObj } from '@storybook/react-webpack5';
import UserConnectionsWidget, { UserConnectionsWidgetProps } from './index';

export default {
  title: 'Design System/React UI/User Connections Widget',
  component: UserConnectionsWidget,
  argTypes: {
    userId: {
      control: {type: 'number'},
      description: 'User Id',
      table: {defaultValue: {summary: '1'}}
    }
  }
} as Meta<typeof UserConnectionsWidget>;

const template = (args: UserConnectionsWidgetProps) => (
  <div style={{width: 400}}>
    <UserConnectionsWidget {...args} />
  </div>
);

export const Base: StoryObj<typeof UserConnectionsWidget> = {
  args: {
    userId: 153
  },
  render: template
};

