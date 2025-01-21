import type { Meta, StoryObj } from '@storybook/react';
import Courses from './index';

export default {
  title: 'Design System/React TEMPLATES/Courses',
  component: Courses,
  args: {
    id: undefined,
    courseId: undefined,
    course: undefined,
    className: ''
  }
} as Meta<typeof Courses>;

const template = (args) => (
  <div style={{maxWidth: 1280}}>
    <Courses {...args} />
  </div>
);

export const Base: StoryObj<typeof Courses> = {
  render: template
};
