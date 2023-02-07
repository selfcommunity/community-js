import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';

import SearchAutocomplete from './index';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/React UI/Search Autocomplete',
  component: SearchAutocomplete
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof SearchAutocomplete>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
// @ts-ignore
const Template: ComponentStory<typeof SearchAutocomplete> = (args) => (
  <div style={{width: 400}}>
    <SearchAutocomplete {...args}></SearchAutocomplete>
  </div>
);

export const Base = Template.bind({});

Base.args = {
  /* the args you need here will depend on your component */
};
