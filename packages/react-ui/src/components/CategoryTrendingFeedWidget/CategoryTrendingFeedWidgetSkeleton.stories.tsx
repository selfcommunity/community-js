import type { Meta, StoryObj } from '@storybook/react';
import CategoryTrendingFeedWidgetSkeleton from './Skeleton';

export default {
  title: 'Design System/React UI/Skeleton/CategoryTrendingFeedWidget',
  component: CategoryTrendingFeedWidgetSkeleton
} as Meta<typeof CategoryTrendingFeedWidgetSkeleton>;

const template = (args) => (
  <div style={{width: 400}}>
    <CategoryTrendingFeedWidgetSkeleton {...args} />
  </div>
);

export const Base: StoryObj<CategoryTrendingFeedWidgetSkeleton> = {
  args: {
    contained: true,
  },
  render: template
}