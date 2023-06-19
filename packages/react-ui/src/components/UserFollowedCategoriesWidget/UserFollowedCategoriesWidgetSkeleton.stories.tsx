import type { Meta, StoryObj } from '@storybook/react';
import UserFollowedCategoriesWidgetSkeleton from './Skeleton';

export default {
  title: 'Design System/React UI/Skeleton/User Followed Categories Widget',
  component: UserFollowedCategoriesWidgetSkeleton,
} as Meta<typeof UserFollowedCategoriesWidgetSkeleton>;


const template = (args) => (
  <div style={{width: 400}}>
    <UserFollowedCategoriesWidgetSkeleton {...args} />
  </div>
);

export const Base: StoryObj<UserFollowedCategoriesWidgetSkeleton> = {
  render: template
};