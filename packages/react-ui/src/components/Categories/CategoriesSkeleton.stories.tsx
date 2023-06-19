import type { Meta, StoryObj } from '@storybook/react';
import CategoriesSkeleton from './Skeleton';

export default {
  title: 'Design System/React UI/Skeleton/Categories',
  component: CategoriesSkeleton,
} as Meta<typeof CategoriesSkeleton>;

const template = (args) => (
  <div>
    <CategoriesSkeleton {...args} />
  </div>
);

export const Base: StoryObj<CategoriesSkeleton> = {
  render: template
};