import type { Meta, StoryObj } from '@storybook/react-webpack5';
import UserConnectionsRequestsSentSkeleton from './Skeleton';

export default {
  title: 'Design System/React UI/Skeleton/User Connections Requests Sent Widget',
  component: UserConnectionsRequestsSentSkeleton
} as Meta<typeof UserConnectionsRequestsSentSkeleton>;

const template = (args) => (
  <div style={{width: 400}}>
    <UserConnectionsRequestsSentSkeleton {...args} />
  </div>
);

export const Base: StoryObj<UserConnectionsRequestsSentSkeleton> = {
  render: template
};