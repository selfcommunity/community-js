import type { Meta, StoryObj } from '@storybook/react';
import TeacherCourseDashboard from '../index';

export default {
  title: 'Design System/React UI/Teacher Course Dashboard',
  component: TeacherCourseDashboard,
  argTypes: {
    page: {
      options: ['students', 'comments'],
      control: 'inline-radio'
    }
  },
  args: {
    page: 'students',
    onTabChange() {},
    className: ''
  },
  render: (args) => (
    <div style={{maxWidth: 1280, margin: 'auto'}}>
      <TeacherCourseDashboard {...args} />
    </div>
  ) 
} as Meta<typeof TeacherCourseDashboard>;

export const Base: StoryObj<typeof TeacherCourseDashboard> = {};