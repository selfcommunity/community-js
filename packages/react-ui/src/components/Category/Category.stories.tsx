import type { Meta, StoryObj } from '@storybook/react';
import Category from './index';

export default {
  title: 'Design System/React UI/Category',
  component: Category,
  argTypes: {
    categoryId: {
      control: {type: 'number'},
      description: 'Category Id',
      table: {defaultValue: {summary: 1}}
    },
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
  }
} as Meta<typeof Category>;

const template = (args) => (
  <div style={{width: 400}}>
    <Category {...args} />
  </div>
);

export const Base: StoryObj<Category> = {
  args: {
    categoryId: 1,
    elevation: 1,
    variant: 'elevation'
  },
  render: template
};
