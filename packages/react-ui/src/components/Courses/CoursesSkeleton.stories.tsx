import type { Meta, StoryObj } from '@storybook/react';
import CoursesSkeleton from './Skeleton';

export default {
  title: 'Design System/React UI/Skeleton/Courses',
  component: CoursesSkeleton,
} as Meta<typeof CoursesSkeleton>;

const template = (args) => (
  <div>
    <CoursesSkeleton {...args} />
  </div>
);

export const Base: StoryObj<CoursesSkeleton> = {
  render: template
};