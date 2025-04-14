import type { Meta, StoryObj } from '@storybook/react';
import CreateCourseButton, { CreateCourseButtonProps } from './index';

export default {
  title: 'Design System/React UI/Create Course Button',
  component: CreateCourseButton,
} as Meta<typeof CreateCourseButton>;

const template = (args) => (
  <div style={{width: 800}}>
    <CreateCourseButton {...args} />
  </div>
);

export const Base: StoryObj<CreateCourseButtonProps> = {
  args: {},
  render: template
};