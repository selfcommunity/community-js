import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';

import UserProfileFollowedUsersWidget from './index';

export default {
  title: 'Design System/React UI/User Followed Users Widget',
  component: UserProfileFollowedUsersWidget,
  argTypes: {
    userId: {
      control: {type: 'number'},
      description: 'User Id',
      table: {defaultValue: {summary: 1}}
    }
  }
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof UserProfileFollowedUsersWidget>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof UserProfileFollowedUsersWidget> = (args) => (
  <div style={{width: 400}}>
    <UserProfileFollowedUsersWidget {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {
  userId: 1
};
