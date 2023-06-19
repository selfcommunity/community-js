import type { Meta, StoryObj } from '@storybook/react';
import User from './index';

export default {
  title: 'Design System/React UI/User',
  component: User
} as Meta<typeof User>;

const template = (args) => (
  <div style={{width: 400}}>
    <User {...args} />
  </div>
);

export const Base: StoryObj<User> = {
  args: {
    userId: 32,
    elevation: 1,
    variant: 'elevation'
  },
  render: template
};

