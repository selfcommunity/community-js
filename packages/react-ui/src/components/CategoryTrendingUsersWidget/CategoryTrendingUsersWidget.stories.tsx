import type { Meta, StoryObj } from '@storybook/react-webpack5';
import CategoryTrendingUsersWidget, { CategoryTrendingUsersWidgetProps } from './index';

export default {
  title: 'Design System/React UI/Category Trending Users Widget',
  component: CategoryTrendingUsersWidget
} as Meta<typeof CategoryTrendingUsersWidget>;

const template = (args: CategoryTrendingUsersWidgetProps) => (
  <div style={{width: 400}}>
    <CategoryTrendingUsersWidget categoryId={1} {...args} />
  </div>
);

export const Base: StoryObj<typeof CategoryTrendingUsersWidget> = {
  render: template
};
