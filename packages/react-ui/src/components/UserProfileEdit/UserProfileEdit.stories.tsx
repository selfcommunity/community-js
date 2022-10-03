import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import UserProfileEdit from './index';
import { DEFAULT_FIELDS, DEFAULT_SETTINGS } from '../../constants/UserProfile';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/React UI/User Profile Edit',
  component: UserProfileEdit,
  argTypes: {
    userId: {
      control: {type: 'number'},
      description: 'User Id',
      table: {defaultValue: {summary: 1}}
    }
  },
  args: {
    userId: 796
  }
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof UserProfileEdit>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof UserProfileEdit> = (args) => (
  <div style={{width: 400}}>
    <UserProfileEdit {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {
  /* the args you need here will depend on your component */
  fields: [...DEFAULT_FIELDS],
  settings: [...DEFAULT_SETTINGS]
};
