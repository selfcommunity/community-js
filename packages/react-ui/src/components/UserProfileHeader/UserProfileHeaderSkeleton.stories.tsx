import type { Meta, StoryObj } from '@storybook/react';
import UserProfileHeaderSkeleton from './Skeleton';

export default {
  title: 'Design System/React UI/Skeleton/User Profile AppBar',
  component: UserProfileHeaderSkeleton,
  argTypes: {},
  args: {}
} as Meta<typeof UserProfileHeaderSkeleton>;

const template = (args) => (
  <div style={{width: '100%'}}>
    <UserProfileHeaderSkeleton {...args} />
  </div>
);

export const Base: StoryObj<typeof UserProfileHeaderSkeleton> = {
  render: template
};
