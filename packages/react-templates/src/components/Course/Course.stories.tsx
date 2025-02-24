import type { Meta, StoryObj } from '@storybook/react';
import Course from './index';

export default {
  title: 'Design System/React TEMPLATES/Course',
  component: Course,
  argTypes: {
    viewDashboard: {
      control: 'string'
    }
  },
  args: {
    id: undefined,
    courseId: 2,
    course: undefined,
    className: '',
  },
  render: (args) => (
    <div style={{maxWidth: 1280, margin: 'auto'}}>
      <Course {...args} />
    </div>
  ) 
} as Meta<typeof Course>;

export const Student: StoryObj<typeof Course> = {
  args: {
    viewDashboard: false
  }
};

export const Teacher: StoryObj<typeof Course> = {
  argTypes: {
    page: {
      options: ['students', 'comments'],
      control: 'inline-radio'
    }
  },
  args: {
    viewDashboard: true,
    page: 'students',
    onTabChange() {}
  }
};
