import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';

import CategoriesSuggestion from './index';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/SC UI/CategoriesSuggestion',
  component: CategoriesSuggestion,
  argTypes: {
    elevation: {
      control: {type: 'number'},
      description: 'Used only if variant="elevation". Shadow depth, corresponds to dp in the spec. It accepts values between 0 and 24 inclusive.',
      defaultValue: 1,
      table: {defaultValue: {summary: 1}}
    },
    variant: {
      options: ['elevation', 'outlined'],
      control: {type: 'select'},
      description: 'The variant to use. Types: "elevation", "outlined", etc.',
      defaultValue: 'elevation',
      table: {defaultValue: {summary: 'elevation'}}
    }
  }
} as ComponentMeta<typeof CategoriesSuggestion>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof CategoriesSuggestion> = (args) => (
  <div style={{width: 400}}>
    <CategoriesSuggestion {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {
  /* the args you need here will depend on your component */
};
