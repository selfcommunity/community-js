import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';

import UsersFollowed from './index';

export default {
  title: 'Design System/SC UI/UsersFollowed',
  component: UsersFollowed,
  argTypes: {
    userId: {
      control: {type: 'number'},
      description: 'User Id',
      table: {defaultValue: {summary: 1}}
    }
  },
  args: {
    userId: 1
  }
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof UsersFollowed>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof UsersFollowed> = (args) => (
  <div style={{width: 400}}>
    <UsersFollowed {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {
  /* the args you need here will depend on your component */
};
