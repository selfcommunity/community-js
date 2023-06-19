import type { Meta, StoryObj } from '@storybook/react';
import UserSkeleton from './Skeleton';

export default {
  title: 'Design System/React UI/Skeleton/User',
  component: UserSkeleton
} as Meta<typeof UserSkeleton>;

const template = (args) => (
  <div style={{width: 400}}>
    <UserSkeleton {...args} />
  </div>
);

export const Base: StoryObj<UserSkeleton> = {
  args: {
    contained: true
  },
  render: template
};
