import type { Meta, StoryObj } from '@storybook/react';
import CategoryTrendingFeedWidget from './index';
import {SCFeedObjectTemplateType} from '../../types/feedObject';

export default {
  title: 'Design System/React UI/Category Trending Feed Widget',
  component: CategoryTrendingFeedWidget,
  argTypes: {
    elevation: {
      control: {type: 'number'},
      description: 'Used only if variant="elevation". Shadow depth, corresponds to dp in the spec. It accepts values between 0 and 24 inclusive.',
      table: {defaultValue: {summary: 1}}
    },
    variant: {
      options: ['elevation', 'outlined'],
      control: {type: 'select'},
      description: 'The variant to use. Types: "elevation", "outlined", etc.',
      table: {defaultValue: {summary: 'elevation'}}
    }
  },
  args: {
    categoryId: 1,
    elevation: 1,
    variant: 'elevation',
    template: SCFeedObjectTemplateType.SNIPPET
  }
} as Meta<typeof CategoryTrendingFeedWidget>;


const template = (args) => (
  <div style={{width: 500}}>
    <CategoryTrendingFeedWidget {...args} />
  </div>
);

export const Base: StoryObj<CategoryTrendingFeedWidget> = {
  render: template
};

