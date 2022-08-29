import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import {SCUserProfileFields, SCUserProfileSettings} from '../../types';
import UserProfileEdit from './index';

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
  fields: [
    SCUserProfileFields.USERNAME,
    SCUserProfileFields.REAL_NAME,
    SCUserProfileFields.DATE_JOINED,
    SCUserProfileFields.DATE_OF_BIRTH,
    SCUserProfileFields.DESCRIPTION,
    SCUserProfileFields.WEBSITE,
    SCUserProfileFields.BIO,
    SCUserProfileFields.LOCATION,
    SCUserProfileFields.GENDER
  ],
  settings: [
    SCUserProfileSettings.INTERACTION,
    SCUserProfileSettings.NOTIFICATION
  ]
};
