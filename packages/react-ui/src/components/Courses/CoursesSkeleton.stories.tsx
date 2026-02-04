import type { Meta, StoryObj } from '@storybook/react-webpack5';
import CoursesSkeleton from './Skeleton';
import { CourseSkeletonProps } from '../Course/Skeleton';

export default {
  title: 'Design System/React UI/Skeleton/Courses',
  component: CoursesSkeleton,
} as Meta<typeof CoursesSkeleton>;

const template = (args: CourseSkeletonProps) => (
  <div>
    <CoursesSkeleton {...args} />
  </div>
);

export const Base: StoryObj<typeof CoursesSkeleton> = {
  render: template
};