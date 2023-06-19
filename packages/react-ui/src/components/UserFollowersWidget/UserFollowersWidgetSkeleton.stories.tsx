import type { Meta, StoryObj } from '@storybook/react';
import UserFollowersSkeleton from './Skeleton';

export default {
  title: 'Design System/React UI/Skeleton/User Followers Widget',
  component: UserFollowersSkeleton
} as Meta<typeof UserFollowersSkeleton>;

const template = (args) => (
  <div style={{width: 400}}>
    <UserFollowersSkeleton {...args} />
  </div>
);

export const Base: StoryObj<UserFollowersSkeleton> = {
  render: template
};

