import type { Meta, StoryObj } from '@storybook/react';
import CourseDashboard from './index';

export default {
  title: 'Design System/React TEMPLATES/Course Dashboard',
  component: CourseDashboard,
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
      <CourseDashboard {...args} />
    </div>
  ) 
} as Meta<typeof CourseDashboard>;

export const Student: StoryObj<typeof CourseDashboard> = {
  args: {
    viewDashboard: false
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
    viewDashboard: true,
    page: 'students',
    onTabChange() {}
  }
};
