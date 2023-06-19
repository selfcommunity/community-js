import type { Meta, StoryObj } from '@storybook/react';
import CategoryFeedTemplate from './index';

export default {
  title: 'Design System/React TEMPLATES/Category Feed',
  component: CategoryFeedTemplate
} as Meta<typeof CategoryFeedTemplate>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
export const Base: StoryObj<typeof CategoryFeedTemplate> = {
  args: {
    categoryId: 1
  },
  render: (args) => (
    <div style={{maxWidth: '1200px', width: '100%', height: '500px'}}>
      <CategoryFeedTemplate {...args} />
    </div>)
};