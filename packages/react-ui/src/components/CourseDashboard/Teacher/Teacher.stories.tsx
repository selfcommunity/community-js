import type { Meta, StoryObj } from '@storybook/react-webpack5';
import CourseDashboard from '../index';

export default {
  title: 'Design System/React UI/Teacher Course Dashboard',
  component: CourseDashboard.Teacher,
  args: {
    courseId: 2,
    course: undefined,
    className: ''
  },
  render: (args) => (
    <div style={{maxWidth: 1280, margin: 'auto'}}>
      <CourseDashboard.Teacher {...args} />
    </div>
  ) 
} as Meta<typeof CourseDashboard.Teacher>;

export const Base: StoryObj<typeof CourseDashboard.Teacher> = {};