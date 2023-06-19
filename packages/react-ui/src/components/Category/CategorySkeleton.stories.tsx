import type { Meta, StoryObj } from '@storybook/react';
import CategorySkeleton from './Skeleton';

export default {
  title: 'Design System/React UI/Skeleton/Category',
  component: CategorySkeleton
} as Meta<typeof CategorySkeleton>;

const template = (args) => (
  <div style={{width: 400}}>
    <CategorySkeleton {...args} />
  </div>
);

export const Base: StoryObj<CategorySkeleton> = {
  args: {
    contained: true,
  },
  render: template
};