import type { Meta, StoryObj } from '@storybook/react';
import UserProfileInfoSkeleton from './Skeleton';

export default {
  title: 'Design System/React UI/Skeleton/User Profile Info',
  component: UserProfileInfoSkeleton
} as Meta<typeof UserProfileInfoSkeleton>;

const template = (args) => (
  <div style={{width: '100%'}}>
    <UserProfileInfoSkeleton {...args} />
  </div>
);

export const Base: StoryObj<UserProfileInfoSkeleton> = {
  render: template
};
