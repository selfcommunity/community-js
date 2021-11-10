import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';

import CategoriesFollowed from './index';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/SC UI/Categories Followed',
  component: CategoriesFollowed
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof CategoriesFollowed>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof CategoriesFollowed> = (args) => (
  <div style={{width: 400}}>
    <CategoriesFollowed {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {
  /* the args you need here will depend on your component */
};
