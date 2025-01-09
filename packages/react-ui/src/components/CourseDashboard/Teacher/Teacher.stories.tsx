import type { Meta, StoryObj } from '@storybook/react';
import CourseDashboard from '../index';

export default {
  title: 'Design System/React UI/Teacher Course Dashboard',
  component: CourseDashboard.Teacher,
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
      <CourseDashboard.Teacher {...args} />
    </div>
  ) 
} as Meta<typeof CourseDashboard.Teacher>;

export const Base: StoryObj<typeof CourseDashboard.Teacher> = {};