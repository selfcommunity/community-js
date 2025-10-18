import type { Meta, StoryObj } from '@storybook/react-webpack5';
import CourseSkeleton from './Skeleton';
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


export const Preview: StoryObj<typeof CourseSkeleton> = {
  args: {
    template: SCCourseTemplateType.PREVIEW
  },
  render: template
};

