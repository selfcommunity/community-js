import type { Meta, StoryObj } from '@storybook/react';
import CategoryTrendingUsersWidget from './index';

export default {
  title: 'Design System/React UI/Category Trending Users Widget',
  component: CategoryTrendingUsersWidget
} as Meta<typeof CategoryTrendingUsersWidget>;

const template = (args) => (
  <div style={{width: 400}}>
    <CategoryTrendingUsersWidget categoryId={1} {...args} />
  </div>
);

export const Base: StoryObj<CategoryTrendingUsersWidget> = {
  render: template
};
