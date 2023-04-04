import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';

import CategoryAutocomplete from './index';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/React UI/Category Autocomplete',
  component: CategoryAutocomplete
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof CategoryAutocomplete>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
// @ts-ignore
const Template: ComponentStory<typeof CategoryAutocomplete> = (args) => (
  <div style={{width: 400}}>
    <CategoryAutocomplete {...args}></CategoryAutocomplete>
  </div>
);

export const Base = Template.bind({});

Base.args = {
  /* the args you need here will depend on your component */
};
