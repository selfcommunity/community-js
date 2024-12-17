import type { Meta, StoryObj } from '@storybook/react';
import CourseSkeleton from './Skeleton';
import Course from './index';
import { SCCourseTemplateType } from '../../types/course';

export default {
  title: 'Design System/React UI/Skeleton/Course',
  component: CourseSkeleton
} as Meta<typeof CourseSkeleton>;

const template = (args) => (
  <div style={{ width: '400px' }}>
    <CourseSkeleton {...args} />
  </div>
);

export const Snippet: StoryObj<typeof CourseSkeleton> = {
  render: template
};


export const Preview: StoryObj<typeof Course> = {
  args: {
    template: SCCourseTemplateType.PREVIEW
  },
  render: template
};

