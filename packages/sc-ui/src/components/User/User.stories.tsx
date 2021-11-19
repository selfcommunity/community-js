import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';

import User from './index';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/SC UI/User',
  component: User,
  argTypes: {
    id: {
      control: {type: 'number'},
      description: 'User Id',
      defaultValue: 115,
      table: {defaultValue: {summary: 1}}
    },
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
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof User>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof User> = (args) => (
  <div style={{width: 400}}>
    <User id={115} {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {
  /* the args you need here will depend on your component */
};
