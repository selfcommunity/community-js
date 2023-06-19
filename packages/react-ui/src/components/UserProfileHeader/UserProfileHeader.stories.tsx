import type { Meta, StoryObj } from '@storybook/react';

import UserProfileHeader from './index';

export default {
  title: 'Design System/React UI/User Profile AppBar ',
  component: UserProfileHeader,
  argTypes: {
    userId: {
      control: {type: 'number'},
      description: 'User Id',
      table: {defaultValue: {summary: 167}}
    }
  },
  args: {
    userId: 167
  }
} as Meta<typeof UserProfileHeader>;

const template = (args) => (
  <div style={{width: '100%'}}>
    <UserProfileHeader {...args} />
  </div>
);

export const Base: StoryObj<typeof UserProfileHeader> = {
  args: {
    userId: 167
  },
  render: template
};
