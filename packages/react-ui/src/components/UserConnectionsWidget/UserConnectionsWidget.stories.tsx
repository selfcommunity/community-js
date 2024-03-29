import type { Meta, StoryObj } from '@storybook/react';
import UserConnectionsWidget from './index';

export default {
  title: 'Design System/React UI/User Connections Widget',
  component: UserConnectionsWidget,
  argTypes: {
    userId: {
      control: {type: 'number'},
      description: 'User Id',
      table: {defaultValue: {summary: 1}}
    }
  }
} as Meta<typeof UserConnectionsWidget>;

const template = (args) => (
  <div style={{width: 400}}>
    <UserConnectionsWidget {...args} />
  </div>
);

export const Base: StoryObj<UserConnectionsWidget> = {
  args: {
    userId: 153
  },
  render: template
};

