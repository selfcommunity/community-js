import type { Meta, StoryObj } from '@storybook/react';
import CourseDashboard from '../index';

export default {
  title: 'Design System/React UI/Student Course Dashboard',
  component: CourseDashboard.Student,
  args: {
    className: ''
  },
  render: (args) => (
    <div style={{maxWidth: 1280, margin: 'auto'}}>
      <CourseDashboard.Student {...args} />
    </div>
  ) 
} as Meta<typeof CourseDashboard.Student>;

export const Base: StoryObj<typeof CourseDashboard.Student> = {};