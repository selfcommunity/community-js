import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';

import UserFollowersWidget from './index';

export default {
  title: 'Design System/React UI/User Followers Widget',
  component: UserFollowersWidget,
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
} as ComponentMeta<typeof UserFollowersWidget>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof UserFollowersWidget> = (args) => (
  <div style={{width: 400}}>
    <UserFollowersWidget {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {
  /* the args you need here will depend on your component */
};
