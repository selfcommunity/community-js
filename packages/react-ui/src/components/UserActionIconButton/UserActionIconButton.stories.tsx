import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';

import UserActionIconButton from './index';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/React UI/User Actions',
  component: UserActionIconButton,
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
} as ComponentMeta<typeof UserActionIconButton>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof UserActionIconButton> = (args) => (
  <div style={{width: '100%'}}>
    <UserActionIconButton {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {
  /* the args you need here will depend on your component */
};
