import type { Meta, StoryObj } from '@storybook/react-webpack5';
import CategoriesSkeleton, { CategoriesSkeletonProps } from './Skeleton';

export default {
  title: 'Design System/React UI/Skeleton/Categories',
  component: CategoriesSkeleton,
} as Meta<typeof CategoriesSkeleton>;

const template = (args: CategoriesSkeletonProps) => (
  <div>
    <CategoriesSkeleton {...args} />
  </div>
);

export const Base: StoryObj<typeof CategoriesSkeleton> = {
  render: template
};