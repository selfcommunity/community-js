import type { Meta, StoryObj } from '@storybook/react';
import CategoryFollowersButton from './index';

export default {
  title: 'Design System/React UI/Category Followers Button ',
  component: CategoryFollowersButton,
  argTypes: {
    categoryId: {
      control: {type: 'number'},
      description: 'Category Id',
      table: {defaultValue: {summary: 1}}
    }
  }
} as Meta<typeof CategoryFollowersButton>;

const template = (args) => (
  <div style={{width: '100%'}}>
    <CategoryFollowersButton {...args} />
  </div>
);

export const Base: StoryObj<CategoryFollowersButton> = {
  args: {
    categoryId: 1
  },
  render: template
}