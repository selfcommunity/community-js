import type { Meta, StoryObj } from '@storybook/react';
import UserConnectionsRequestsSkeleton from './Skeleton';

export default {
  title: 'Design System/React UI/Skeleton/User Connections Requests Widget',
  component: UserConnectionsRequestsSkeleton
} as Meta<typeof UserConnectionsRequestsSkeleton>;

const template = (args) => (
  <div style={{width: 400}}>
    <UserConnectionsRequestsSkeleton {...args} />
  </div>
);

export const Base: StoryObj<UserConnectionsRequestsSkeleton> = {
  render: template
};
