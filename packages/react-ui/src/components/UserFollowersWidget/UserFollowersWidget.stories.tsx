import type { Meta, StoryObj } from '@storybook/react';
import UserFollowersWidget from './index';

export default {
  title: 'Design System/React UI/User Followers Widget',
  component: UserFollowersWidget
} as Meta<typeof UserFollowersWidget>;


const template = (args) => (
  <div style={{width: 400}}>
    <UserFollowersWidget {...args} />
  </div>
);

export const Base: StoryObj<UserFollowersWidget> = {
  args: {
    userId: 1
  },
  render: template
};

