import type { Meta, StoryObj } from '@storybook/react-webpack5';
import CategoryTrendingFeedWidgetSkeleton from './Skeleton';

export default {
  title: 'Design System/React UI/Skeleton/CategoryTrendingFeedWidget',
  component: CategoryTrendingFeedWidgetSkeleton
} as Meta<typeof CategoryTrendingFeedWidgetSkeleton>;

const template = (args: any) => (
  <div style={{width: 400}}>
    <CategoryTrendingFeedWidgetSkeleton {...args} />
  </div>
);

export const Base: StoryObj<typeof CategoryTrendingFeedWidgetSkeleton> = {
  args: {
    contained: true,
  },
  render: template
}