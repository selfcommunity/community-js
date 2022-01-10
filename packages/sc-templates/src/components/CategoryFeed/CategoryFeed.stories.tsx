import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import CategoryFeedTemplate from './index';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/SC Templates/Category Feed',
  component: CategoryFeedTemplate,
} as ComponentMeta<typeof CategoryFeedTemplate>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof CategoryFeedTemplate> = (args) => (
  <div style={{ maxWidth: '1200px', width: '100%', height: '500px' }}>
    <CategoryFeedTemplate {...args} />
  </div>
);

export const Category = Template.bind({});

Category.args = {
  categoryId: 1,
};
