import type { Meta, StoryObj } from '@storybook/react';
import CourseDashboard from './index';

export default {
  title: 'Design System/React TEMPLATES/Course Dashboard',
  component: CourseDashboard,
  argTypes: {
    isTeacher: {
      control: 'string'
    }
  },
  args: {
    id: undefined,
    courseId: undefined,
    course: undefined,
    className: ''
  },
  render: (args) => (
    <div style={{maxWidth: 1280, margin: 'auto'}}>
      <CourseDashboard {...args} />
    </div>
  ) 
} as Meta<typeof CourseDashboard>;

export const Student: StoryObj<typeof CourseDashboard> = {
  args: {
    isTeacher: false
  }
};

export const Teacher: StoryObj<typeof CourseDashboard> = {
  argTypes: {
    page: {
      options: ['students', 'comments'],
      control: 'inline-radio'
    }
  },
  args: {
    isTeacher: true,
    page: 'students',
    onTabChange() {}
  }
};