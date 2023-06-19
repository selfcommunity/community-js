import type { Meta, StoryObj } from '@storybook/react';
import CategoryTemplate from './index';

export default {
  title: 'Design System/React TEMPLATES/Category',
  component: CategoryTemplate
} as Meta<typeof CategoryTemplate>;

export const Base: StoryObj<typeof CategoryTemplate> = {
  args: {
    categoryId: 1
  },
  render: (args) => (
    <div style={{maxWidth: '1200px', width: '100%', height: '500px'}}>
      <CategoryTemplate {...args} />
    </div>)
};