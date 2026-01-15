import type { Meta, StoryObj } from '@storybook/react-webpack5';
import UserCounters, { UserCountersProps } from './index';

export default {
  title: 'Design System/React UI/User Counters ',
  component: UserCounters,
  argTypes: {
    userId: {
      control: {type: 'number'},
      description: 'User Id',
      table: {defaultValue: {summary: '1'}}
    }
  },
  args: {
    userId: 11
  }
} as Meta<typeof UserCounters>;

const template = (args: UserCountersProps) => (
  <div style={{width: '100%'}}>
    <UserCounters {...args} />
    {/*
    <UserFollowersWidget user={user} />
    <UserFollowedUsersWidget user={user} />
    */}
  </div>
);

export const Base: StoryObj<typeof UserCounters> = {
  args: {
    userId: 1
  },
  render: template
};

export const AuthenticatedUser: StoryObj<typeof UserCounters> = {
  args: {
    userId: 167
  },
  render: template
};
