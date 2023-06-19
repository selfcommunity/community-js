import type { Meta, StoryObj } from '@storybook/react';
import UserProfileEditSkeleton from './Skeleton';

export default {
  title: 'Design System/React UI/Skeleton/User Profile Edit',
  component: UserProfileEditSkeleton,
} as Meta<typeof UserProfileEditSkeleton>;

const template = (args) => (
  <div style={{width: '100%'}}>
    <UserProfileEditSkeleton {...args} />
  </div>
);

export const Base: StoryObj<UserProfileEditSkeleton> = {
  render: template
};
