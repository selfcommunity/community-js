import type { Meta, StoryObj } from '@storybook/react';
import {prefetchedCategories} from './prefetchedCategories';
import Categories from './index';
import CategoriesSkeleton from './Skeleton';

export default {
  title: 'Design System/React UI/Categories',
  component: Categories,
  argTypes: {
    showFilters: {
      control: {type: 'boolean'},
      description: 'Show/Hide filters.',
      table: {defaultValue: {summary: 1}}
    }
  },
  args: {
    showFilters: 1,
  }
} as Meta<typeof Categories>;

const template = (args) => (
  <div style={{maxWidth: 1280}}>
    <Categories {...args} />
  </div>
);

export const Base: StoryObj<CategoriesSkeleton> = {
  render: template
};

export const BasePrefetchedCategories: StoryObj<Categories> = {
  args: {
    prefetchedCategories
  },
  render: template
};