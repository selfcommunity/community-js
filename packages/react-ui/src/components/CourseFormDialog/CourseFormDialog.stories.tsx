import type { Meta, StoryObj } from '@storybook/react-webpack5';
import CourseFormDialog, { CourseFormDialogProps } from './index';

export default {
  title: 'Design System/React UI/Course Form Dialog',
  component: CourseFormDialog,
} as Meta<typeof CourseFormDialog>;

const template = (args: CourseFormDialogProps) => (
  <div style={{width: 800}}>
    <CourseFormDialog {...args} />
  </div>
);


export const Base: StoryObj<typeof CourseFormDialog> = {
  args: {},
  render: template
};
