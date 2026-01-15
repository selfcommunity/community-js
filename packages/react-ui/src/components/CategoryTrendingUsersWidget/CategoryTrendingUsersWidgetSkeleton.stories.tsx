import type { Meta, StoryObj } from '@storybook/react-webpack5';
import CategoryTrendingPeopleWidgetSkeleton from './Skeleton';
import { WidgetProps } from '../Widget';

export default {
  title: 'Design System/React UI/Skeleton/Category Trending Users Widget',
  component: CategoryTrendingPeopleWidgetSkeleton
} as Meta<typeof CategoryTrendingPeopleWidgetSkeleton>;

const template = (args: WidgetProps) => (
  <div style={{width: 400}}>
    <CategoryTrendingPeopleWidgetSkeleton {...args} />
  </div>
);

export const Base: StoryObj<typeof CategoryTrendingPeopleWidgetSkeleton> = {
  render: template
};
