import type { Meta, StoryObj } from '@storybook/react-webpack5';
import {prefetchedCategories} from './prefetchedCategories';
import Categories, { CategoriesProps } from './index';

export default {
  title: 'Design System/React UI/Categories',
  component: Categories,
  argTypes: {
    showFilters: {
      control: {type: 'boolean'},
      description: 'Show/Hide filters.',
      table: {defaultValue: {summary: '1'}}
    }
  },
  args: {
    showFilters: true,
  }
} as Meta<typeof Categories>;

const template = (args: CategoriesProps) => (
  <div style={{maxWidth: 1280}}>
    <Categories {...args} />
  </div>
);

export const Base: StoryObj<typeof Categories> = {
  render: template
};

export const BasePrefetchedCategories: StoryObj<typeof Categories> = {
  args: {
    prefetchedCategories
  },
  render: template
};