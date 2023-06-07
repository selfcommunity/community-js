import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import UserProfileBlocked from './index';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/React UI/User Profile Blocked ',
  component: UserProfileBlocked,
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
} as ComponentMeta<typeof UserProfileBlocked>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof UserProfileBlocked> = (args) => (
  <div style={{width: '100%'}}>
    <UserProfileBlocked {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {
  userId: 455
};
