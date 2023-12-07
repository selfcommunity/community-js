import type { Meta, StoryObj } from '@storybook/react';
import User from './index';

export default {
  title: 'Design System/React UI/User',
  component: User,
  argTypes: {
    userId: {
      control: {type: 'number'},
      description: 'User Id',
      table: {defaultValue: {summary: 1}}
    },
    elevation: {
      control: {type: 'number'},
      description: 'Used only if variant="elevation". Shadow depth, corresponds to dp in the spec. It accepts values between 0 and 24 inclusive.',
      table: {defaultValue: {summary: 1}}
    },
    variant: {
      options: ['elevation', 'outlined'],
      control: {type: 'select'},
      description: 'The variant to use. Types: "elevation", "outlined", etc.',
      table: {defaultValue: {summary: 'elevation'}}
    }
  }
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

