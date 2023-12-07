import type { Meta, StoryObj } from '@storybook/react';
import UserConnectionsRequestsSentWidget from './index';

export default {
  title: 'Design System/React UI/User Connections Requests Sent Widget',
  component: UserConnectionsRequestsSentWidget,
  argTypes: {
    userId: {
      control: {type: 'number'},
      description: 'User Id',
      table: {defaultValue: {summary: 1}}
    }
  }
} as Meta<typeof UserConnectionsRequestsSentWidget>;


const template = (args) => (
  <div style={{width: 400}}>
    <UserConnectionsRequestsSentWidget {...args} />
  </div>
);

export const Base: StoryObj<UserConnectionsRequestsSentWidget> = {
  args: {
    userId: 153
  },
  render: template
};
