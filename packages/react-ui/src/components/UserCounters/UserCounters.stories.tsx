import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import UserCounters from './index';
// import UserFollowersWidget from "../UserFollowersWidget";
// import UserFollowedUsersWidget from "../UserFollowedUsersWidget";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/React UI/User Counters ',
  component: UserCounters,
  argTypes: {
    userId: {
      control: {type: 'number'},
      description: 'User Id',
      table: {defaultValue: {summary: 1}}
    }
  },
  args: {
    userId: 11
  }
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof UserCounters>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof UserCounters> = (args) => (
  <div style={{width: '100%'}}>
    <UserCounters {...args} />
    {/*
    <UserFollowersWidget user={user} />
    <UserFollowedUsersWidget user={user} />
    */}
  </div>
);

export const Base = Template.bind({});

Base.args = {
  userId: 167
};

export const AuthenticatedUser = Template.bind({});

AuthenticatedUser.args = {
  userId: 167
};
