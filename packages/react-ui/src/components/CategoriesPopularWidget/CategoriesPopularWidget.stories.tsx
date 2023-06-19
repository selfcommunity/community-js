import type { Meta, StoryObj } from '@storybook/react';
import CategoriesPopularWidget from './index';

export default {
  title: 'Design System/React UI/Categories Popular Widget',
  component: CategoriesPopularWidget,
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
    elevation: 1,
    variant: 'elevation'
  }
} as Meta<typeof CategoriesPopularWidget>;


const template = (args) => (
  <div style={{width: 400}}>
    <CategoriesPopularWidget {...args} />
  </div>
);

export const Base: StoryObj<CategoriesPopularWidget> = {
  render: template
};