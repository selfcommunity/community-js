import type { Meta, StoryObj } from '@storybook/react';
import EditCourse from './index';
import { SCCourseEditTabType } from '../../types/course';

export default {
  title: 'Design System/React UI/Edit Course',
  component: EditCourse,
  argTypes: {
    tab: {
      options: ['lessons', 'customize', 'users', 'requests', 'options'],
      control: 'inline-radio'
    }
  },
  args: {
    courseId: 3,
    course: undefined,
    tab: SCCourseEditTabType.LESSONS,
    onTabChange() {},
    onTabSelect: undefined,
    className: ''
  },
  render: (args) => (
    <div style={{maxWidth: 1280, margin: 'auto'}}>
      <EditCourse {...args} />
    </div>
  )
} as Meta<typeof EditCourse>;

export const Base: StoryObj<typeof EditCourse> = {};
