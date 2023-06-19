import type { Meta, StoryObj } from '@storybook/react';
import UserFollowedCategoriesWidget from './UserFollowedCategoriesWidget';

export default {
  title: 'Design System/React UI/User Followed Categories Widget',
  component: UserFollowedCategoriesWidget
} as Meta<typeof UserFollowedCategoriesWidget>;


const template = (args) => (
  <div style={{width: 400}}>
    <UserFollowedCategoriesWidget {...args} />
  </div>
);

export const Base: StoryObj<UserFollowedCategoriesWidget> = {
  args: {
    userId: 1
  },
  render: template
};