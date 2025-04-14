import type { Meta, StoryObj } from '@storybook/react';
import UserCreatedCoursesWidget from './UserCreatedCoursesWidget';

export default {
  title: 'Design System/React UI/User Created Courses Widget',
  component: UserCreatedCoursesWidget,
  argTypes: {
    variant: {
      options: ['elevation', 'outlined'],
      control: {type: 'select'},
      description: 'The variant to use. Types: "elevation", "outlined", etc.',
      table: {defaultValue: {summary: 'elevation'}}
    },
    elevation: {
      control: {type: 'number'},
      description: 'Used only if variant="elevation". Shadow depth, corresponds to dp in the spec. It accepts values between 0 and 24 inclusive.',
      table: {defaultValue: {summary: 1}}
    }
  },
  args: {
    elevation: 1,
    variant: 'elevation'
  }
} as Meta<typeof UserCreatedCoursesWidget>;

const template = (args) => (
  <div style={{width: 400}}>
    <UserCreatedCoursesWidget {...args} />
  </div>
);

export const Base: StoryObj<typeof UserCreatedCoursesWidget> = {
  args: {
    userId: 9
  },
  render: template
};