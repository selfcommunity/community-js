import type { Meta, StoryObj } from '@storybook/react';
import CourseFormDialog from './index';

export default {
  title: 'Design System/React UI/Course Form Dialog',
  component: CourseFormDialog,
} as Meta<typeof CourseFormDialog>;

const template = (args) => (
  <div style={{width: 800}}>
    <CourseFormDialog {...args} />
  </div>
);


export const Base: StoryObj<typeof CourseFormDialog> = {
  args: {},
  render: template
};
