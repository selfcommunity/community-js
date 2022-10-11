import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';

import UserProfileHeader from './index';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/React UI/User Profile Header ',
  component: UserProfileHeader,
  argTypes: {
    userId: {
      control: {type: 'number'},
      description: 'User Id',
      table: {defaultValue: {summary: 167}}
    }
  },
  args: {
    userId: 167
  }
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof UserProfileHeader>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof UserProfileHeader> = (args) => (
  <div style={{width: '100%'}}>
    <UserProfileHeader {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {
  /* the args you need here will depend on your component */
};
