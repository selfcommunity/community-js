import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';

import UsersFollowedWidget from './index';

export default {
  title: 'Design System/React UI/UsersFollowedWidget',
  component: UsersFollowedWidget,
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
} as ComponentMeta<typeof UsersFollowedWidget>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof UsersFollowedWidget> = (args) => (
  <div style={{width: 400}}>
    <UsersFollowedWidget {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {
  /* the args you need here will depend on your component */
};
