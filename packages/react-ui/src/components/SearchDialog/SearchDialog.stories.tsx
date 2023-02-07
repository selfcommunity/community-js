import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';

import SearchDialog from './index';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/React UI/Search Autocomplete',
  component: SearchDialog
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof SearchDialog>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
// @ts-ignore
const Template: ComponentStory<typeof SearchDialog> = (args) => (
  <div style={{width: 400}}>
    <SearchDialog {...args}></SearchDialog>
  </div>
);

export const Base = Template.bind({});

Base.args = {
  /* the args you need here will depend on your component */
};
