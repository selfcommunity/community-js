import type { Meta, StoryObj } from '@storybook/react';
import UserCounters from './index';

export default {
  title: 'Design System/React UI/User Counters ',
  component: UserCounters
  
} as Meta<typeof UserCounters>;


const template = (args) => (
  <div style={{width: '100%'}}>
    <UserCounters {...args} />
    {/*
    <UserFollowersWidget user={user} />
    <UserFollowedUsersWidget user={user} />
    */}
  </div>
);


export const Base: StoryObj<UserCounters> = {
  args: {
    userId: 1
  },
  render: template
};

export const AuthenticatedUser: StoryObj<UserCounters> = {
  args: {
    userId: 167
  },
  render: template
};
