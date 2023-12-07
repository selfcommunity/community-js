import type { Meta, StoryObj } from '@storybook/react';
import UserFollowedUsersWidgetSkeleton from './Skeleton';

export default {
  title: 'Design System/React UI/Skeleton/User Followed Users Widget',
  component: UserFollowedUsersWidgetSkeleton
} as Meta<typeof UserFollowedUsersWidgetSkeleton>;

const template = (args) => (
  <div style={{width: 400}}>
    <UserFollowedUsersWidgetSkeleton {...args} />
  </div>
);

export const Base: StoryObj<UserFollowedUsersWidgetSkeleton> = {
  render: template
};
