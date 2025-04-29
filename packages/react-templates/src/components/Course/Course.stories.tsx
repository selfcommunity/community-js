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
    course: undefined,
    className: '',
  },
  render: (args) => (
    <div style={{maxWidth: 1280, margin: 'auto'}}>
      <Course {...args} />
    </div>
  )
} as Meta<typeof Course>;

export const StudentFree: StoryObj<typeof Course> = {
  args: {
		courseId: 9,
    viewDashboard: false
  }
};

export const StudentNotFree: StoryObj<typeof Course> = {
	args: {
		courseId: 9,
		viewDashboard: false
	}
};

export const Teacher: StoryObj<typeof Course> = {
  args: {
		courseId: 6,
    viewDashboard: true
  }
};
