import type { Meta, StoryObj } from '@storybook/react';
import CategoryTrendingPeopleWidgetSkeleton from './Skeleton';

export default {
  title: 'Design System/React UI/Skeleton/Category Trending Users Widget',
  component: CategoryTrendingPeopleWidgetSkeleton
} as Meta<typeof CategoryTrendingPeopleWidgetSkeleton>;

const template = (args) => (
  <div style={{width: 400}}>
    <CategoryTrendingPeopleWidgetSkeleton {...args} />
  </div>
);

export const Base: StoryObj<CategoryTrendingPeopleWidgetSkeleton> = {
  render: template
};
