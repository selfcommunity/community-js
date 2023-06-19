import type { Meta, StoryObj } from '@storybook/react';
import CategoryHeader from './index';

export default {
  title: 'Design System/React UI/Category Header ',
  component: CategoryHeader,
  argTypes: {
    categoryId: {
      control: {type: 'number'},
      description: 'Category Id',
      table: {defaultValue: {summary: 1}}
    }
  },
  args: {
    categoryId: 1
  }
} as Meta<typeof CategoryHeader>;

const template = (args) => (
  <div style={{width: '100%'}}>
    <CategoryHeader {...args} />
  </div>
);

export const Base: StoryObj<CategoryHeader> = {
  render: template
}