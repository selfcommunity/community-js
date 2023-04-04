import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';

import LocationAutocomplete from './index';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/React UI/Location Autocomplete',
  component: LocationAutocomplete
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof LocationAutocomplete>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
// @ts-ignore
const Template: ComponentStory<typeof LocationAutocomplete> = (args) => (
  <div style={{width: 400}}>
    <LocationAutocomplete {...args}></LocationAutocomplete>
  </div>
);

export const Base = Template.bind({});

Base.args = {
  /* the args you need here will depend on your component */
};
