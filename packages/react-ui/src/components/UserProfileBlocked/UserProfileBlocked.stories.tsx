import type { Meta, StoryObj } from '@storybook/react';
import UserProfileBlocked from './index';

export default {
  title: 'Design System/React UI/User Profile Blocked ',
  component: UserProfileBlocked,
} as Meta<typeof UserProfileBlocked>;


const template = (args) => (
  <div style={{width: '100%'}}>
    <UserProfileBlocked {...args} />
  </div>
);

export const Base: StoryObj<UserProfileBlocked> = {
  args: {
    userId: 455
  },
  render: template
};

