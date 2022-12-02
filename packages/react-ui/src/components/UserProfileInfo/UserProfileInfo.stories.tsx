import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import UserProfileInfo from './index';
import { DEFAULT_FIELDS } from '../../constants/UserProfile';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/React UI/UserProfileInfo ',
  component: UserProfileInfo,
  argTypes: {
    userId: {
      control: {type: 'number'},
      description: 'User Id',
      table: {defaultValue: {summary: 7}}
    }
  },
  args: {
    userId: 11
  }
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof UserProfileInfo>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof UserProfileInfo> = (args) => (
  <div style={{width: '100%'}}>
    <UserProfileInfo {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {
  /* the args you need here will depend on your component */
  fields: [...DEFAULT_FIELDS]
};
