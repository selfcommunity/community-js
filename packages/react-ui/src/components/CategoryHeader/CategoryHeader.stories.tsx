import type { Meta, StoryObj } from '@storybook/react-webpack5';
import CategoryHeader, { CategoryHeaderProps } from './index';

export default {
  title: 'Design System/React UI/Category Header ',
  component: CategoryHeader,
  argTypes: {
    categoryId: {
      control: {type: 'number'},
      description: 'Category Id',
      table: {defaultValue: {summary: '1'}}
    }
  },
  args: {
    categoryId: 1
  }
} as Meta<typeof CategoryHeader>;

const template = (args: CategoryHeaderProps) => (
  <div style={{width: '100%'}}>
    <CategoryHeader {...args} />
  </div>
);

export const Base: StoryObj<typeof CategoryHeader> = {
  render: template
}