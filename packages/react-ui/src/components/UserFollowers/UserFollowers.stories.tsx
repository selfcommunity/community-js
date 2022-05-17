import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';

import UserFollowers from './index';

export default {
  title: 'Design System/React UI/UserFollowers',
  component: UserFollowers,
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
} as ComponentMeta<typeof UserFollowers>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof UserFollowers> = (args) => (
  <div style={{width: 400}}>
    <UserFollowers {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {
  /* the args you need here will depend on your component */
};
