import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import CategoryTrendingUsersWidget from './index';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/React UI/Category Trending Users Widget',
  component: CategoryTrendingUsersWidget
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof CategoryTrendingUsersWidget>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof CategoryTrendingUsersWidget> = (args) => (
  <div style={{width: 400}}>
    <CategoryTrendingUsersWidget categoryId={1} {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {
  /* the args you need here will depend on your component */
};
