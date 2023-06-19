import type { Meta, StoryObj } from '@storybook/react';
import UserConnectionsRequestsWidget from './index';

export default {
  title: 'Design System/React UI/User Connections Requests Widget',
  component: UserConnectionsRequestsWidget,
} as Meta<typeof UserConnectionsRequestsWidget>;

const template = (args) => (
  <div style={{width: 400}}>
    <UserConnectionsRequestsWidget {...args} />
  </div>
);

export const Base: StoryObj<UserConnectionsRequestsWidget> = {
  args: {
    userId: 153
  },
  render: template
};
