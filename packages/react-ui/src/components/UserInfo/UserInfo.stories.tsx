import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import UserInfo from './index';
import { DEFAULT_FIELDS } from '../../constants/UserProfile';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/React UI/User Info ',
  component: UserInfo,
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
} as ComponentMeta<typeof UserInfo>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof UserInfo> = (args) => (
  <div style={{width: '100%'}}>
    <UserInfo {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {
  /* the args you need here will depend on your component */
  fields: [...DEFAULT_FIELDS]
};
