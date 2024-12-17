import type { Meta, StoryObj } from '@storybook/react';
import EditCourse from './index';

export default {
  title: 'Design System/React UI/Edit Course',
  component: EditCourse,
  argTypes: {
    page: {
      options: ['lessons', 'customize', 'users', 'options'],
      control: 'inline-radio'
    }
  },
  args: {
    page: 'lessons',
    onChange() {},
    className: ''
  },
  render: (args) => (
    <div style={{maxWidth: 1280, margin: 'auto'}}>
      <EditCourse {...args} />
    </div>
  ) 
} as Meta<typeof EditCourse>;

export const Base: StoryObj<typeof EditCourse> = {};